<?php
declare(strict_types=1);

/**
 * Мини SMTP-клиент без зависимостей (на хостинге нет composer и npm).
 * Возможности: SSL-соединение (порт 465), AUTH LOGIN, UTF-8 письмо (base64).
 * Используется только для отправки одной транзакционной почты — без фич вроде
 * вложений, HTML и очередей; при ошибке возвращает текст для лога и ответа.
 *
 * Пароль для Яндекса — «пароль приложения» (не основной пароль аккаунта):
 * https://passport.yandex.ru/profile/security/app-passwords
 */
final class SmtpMailer
{
    /** @var resource|null */
    private $socket = null;

    public function __construct(
        private readonly string $host,
        private readonly int $port,
        private readonly string $user,
        private readonly string $password,
        private readonly int $timeout = 15,
    ) {
    }

    /**
     * Отправляет письмо. Возвращает null при успехе либо текст ошибки.
     *
     * @param string $from         адрес отправителя (обычно совпадает с логином SMTP)
     * @param string $to           адрес получателя
     * @param string $subject      тема (в кодировке передаётся как есть, кодирует клиент)
     * @param string $body         текст письма в UTF-8
     * @param array  $extraHeaders дополнительные заголовки (например, Reply-To)
     */
    public function send(
        string $from,
        string $to,
        string $subject,
        string $body,
        array $extraHeaders = [],
    ): ?string {
        try {
            $this->connect();

            $at = strrpos($from, '@');
            $ehlo = $at !== false ? substr($from, $at + 1) : 'localhost';

            $this->command('EHLO ' . $ehlo, [250]);
            $this->command('AUTH LOGIN', [334]);
            $this->command(base64_encode($this->user), [334]);
            $this->command(base64_encode($this->password), [235]);
            $this->command('MAIL FROM:<' . $from . '>', [250]);
            $this->command('RCPT TO:<' . $to . '>', [250, 251]);
            $this->command('DATA', [354]);

            $headers = array_merge(
                [
                    'From: ' . self::encodeHeader('Заявка с сайта web33') . ' <' . $from . '>',
                    'To: <' . $to . '>',
                    'Subject: ' . self::encodeHeader($subject),
                    'Date: ' . date('r'),
                    'MIME-Version: 1.0',
                    'Content-Type: text/plain; charset=UTF-8',
                    'Content-Transfer-Encoding: base64',
                ],
                $extraHeaders,
            );

            $message = implode("\r\n", $headers) . "\r\n\r\n" . chunk_split(base64_encode($body), 76, "\r\n") . '.';
            $this->command($message, [250]);
            $this->command('QUIT', [221]);
            $this->close();

            return null;
        } catch (Throwable $e) {
            $this->close();
            return $e->getMessage();
        }
    }

    private function connect(): void
    {
        $errno = 0;
        $errstr = '';
        $socket = @fsockopen('ssl://' . $this->host, $this->port, $errno, $errstr, $this->timeout);

        if ($socket === false) {
            throw new RuntimeException(
                "SMTP: не удалось подключиться к {$this->host}:{$this->port} (код {$errno}) {$errstr}",
            );
        }

        stream_set_timeout($socket, $this->timeout);
        $this->socket = $socket;

        [$code, $text] = $this->readReply();
        if ($code !== 220) {
            throw new RuntimeException('SMTP ' . $code . ': ' . $text);
        }
    }

    /** Отправляет команду и проверяет код ответа (250-xxx / 250 xxx — многострочный ответ). */
    private function command(string $command, array $expected): void
    {
        if ($this->socket === null) {
            throw new RuntimeException('SMTP: соединение не установлено');
        }

        fwrite($this->socket, $command . "\r\n");
        [$code, $text] = $this->readReply();

        if (!in_array($code, $expected, true)) {
            throw new RuntimeException('SMTP ' . $code . ': ' . $text);
        }
    }

    /** Читает один SMTP-ответ (возможно, многострочный: разделитель «-» после кода). */
    private function readReply(): array
    {
        if ($this->socket === null) {
            throw new RuntimeException('SMTP: соединение не установлено');
        }

        $lines = [];
        $code = 0;

        do {
            $line = fgets($this->socket, 1024);
            if ($line === false) {
                throw new RuntimeException('SMTP: нет ответа от сервера (таймаут)');
            }
            $lines[] = trim($line);
            $code = (int) substr($line, 0, 3);
        } while (isset($line[3]) && $line[3] === '-');

        return [$code, implode(' | ', $lines)];
    }

    /** RFC 2047: закодировать тему/имя отправителя в UTF-8 base64. */
    private static function encodeHeader(string $value): string
    {
        return '=?UTF-8?B?' . base64_encode($value) . '?=';
    }

    private function close(): void
    {
        if ($this->socket !== null) {
            fclose($this->socket);
            $this->socket = null;
        }
    }
}
