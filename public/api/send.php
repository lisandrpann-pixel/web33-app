<?php
/**
 * Приём заявок с формы обратной связи и отправка письма на email.
 *
 * Размещение: /api/send.php (файл лежит в public/api/send.php и попадает
 * в сборку вместе со статикой). Требует настроенной на хостинге функции
 * mail() (локальный sendmail/MTA). При необходимости настройки SMTP
 * замените блок отправки ниже.
 *
 * Формат запроса: POST, application/json либо обычная форма.
 * Поля: name, contact, task, message, consent, page, website (honeypot).
 * Ответ: JSON { "ok": true } либо { "ok": false, "error": "..." }.
 */
declare(strict_types=1);

/* ==== Настройки ==== */
const RECIPIENT      = 'web33.dev@yandex.ru';
const SUBJECT_PREFIX = '[web33] Заявка с сайта';
const RATE_LIMIT_SEC = 20;    // не чаще одной заявки с одного IP
const MAX_NAME       = 100;
const MAX_CONTACT    = 200;
const MAX_TASK       = 120;
const MAX_MESSAGE    = 3000;

/* ==== Утилиты ==== */

/** Отправляет JSON-ответ и завершает работу. */
function respond(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Обрезает строку и убирает переводы строк (защита от инъекции в заголовки). */
function clean(string $value, int $max): string
{
    $value = trim($value);
    $value = str_replace(["\r", "\n", '%0a', '%0d'], ' ', $value);

    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $max);
    }

    return substr($value, 0, $max);
}

/** Длина строки в символах (с откатом на байты, если нет mbstring). */
function length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
}

function clientIp(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

/** Простейший лимит: одна заявка с IP раз в RATE_LIMIT_SEC секунд. */
function rateLimited(): bool
{
    $dir = sys_get_temp_dir() . '/web33-rate';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        return false; // некуда писать — не блокируем отправку
    }

    $file = $dir . '/' . sha1(clientIp()) . '.txt';
    $now = time();

    if (is_file($file)) {
        $last = (int) @file_get_contents($file);
        if ($last > 0 && ($now - $last) < RATE_LIMIT_SEC) {
            return true;
        }
    }

    @file_put_contents($file, (string) $now, LOCK_EX);
    return false;
}

/* ==== Только POST ==== */
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(405, ['ok' => false, 'error' => 'Method not allowed']);
}

/* ==== Разбор входных данных (JSON или form-data) ==== */
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';

if (stripos($contentType, 'application/json') !== false) {
    $decoded = json_decode((string) file_get_contents('php://input'), true);
    $data = is_array($decoded) ? $decoded : [];
} else {
    $data = $_POST;
}

/* ==== Honeypot: скрытое поле бот обычно заполняет ==== */
if (!empty($data['website'])) {
    respond(200, ['ok' => true]); // боту отвечаем «успехом», письмо не шлём
}

$name    = clean((string) ($data['name'] ?? ''), MAX_NAME);
$contact = clean((string) ($data['contact'] ?? ''), MAX_CONTACT);
$task    = clean((string) ($data['task'] ?? ''), MAX_TASK);
$message = trim((string) ($data['message'] ?? ''));
$page    = clean((string) ($data['page'] ?? ''), 200);
$consentRaw = $data['consent'] ?? false;
$consent = in_array($consentRaw, [true, 1, '1', 'true', 'on'], true);

/* ==== Валидация ==== */
if (length($name) < 2) {
    respond(422, ['ok' => false, 'error' => 'Укажите имя']);
}
if (length($contact) < 3) {
    respond(422, ['ok' => false, 'error' => 'Оставьте контакт для связи']);
}
if (!$consent) {
    respond(422, ['ok' => false, 'error' => 'Нужно согласие на обработку данных']);
}
if (length($message) > MAX_MESSAGE) {
    $message = function_exists('mb_substr')
        ? mb_substr($message, 0, MAX_MESSAGE)
        : substr($message, 0, MAX_MESSAGE);
}

if (rateLimited()) {
    respond(429, ['ok' => false, 'error' => 'Слишком часто. Попробуйте через минуту.']);
}

/* ==== Сборка письма ==== */
$host   = $_SERVER['HTTP_HOST'] ?? 'web33.local';
$domain = preg_replace('/^www\./', '', explode(':', $host)[0]);
$domain = preg_replace('/[^a-z0-9.\-]/i', '', (string) $domain);
$from   = 'no-reply@' . ($domain !== '' ? $domain : 'web33.local');

$lines = [
    'Новая заявка с сайта web33',
    '',
    'Имя: ' . $name,
    'Контакт: ' . $contact,
];
if ($task !== '') {
    $lines[] = 'Направление / тип задачи: ' . $task;
}
if ($message !== '') {
    $lines[] = 'Сообщение: ' . $message;
}
$lines[] = '';
$lines[] = '---';
$lines[] = 'Страница: ' . ($page !== '' ? $page : '—');
$lines[] = 'IP: ' . clientIp();
$lines[] = 'User-Agent: ' . clean((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 300);
$lines[] = 'Дата: ' . date('d.m.Y H:i:s');

$body = implode("\r\n", $lines);
$body = chunk_split(base64_encode($body), 76, "\r\n");

$subject  = '=?UTF-8?B?' . base64_encode(SUBJECT_PREFIX) . '?=';
$fromName = '=?UTF-8?B?' . base64_encode('Заявка с сайта') . '?=';

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    'From: ' . $fromName . ' <' . $from . '>',
    'X-Mailer: PHP/' . phpversion(),
];

if (filter_var($contact, FILTER_VALIDATE_EMAIL)) {
    $headers[] = 'Reply-To: ' . $contact;
}

$sent = @mail(RECIPIENT, $subject, $body, implode("\r\n", $headers), '-f' . $from);

if (!$sent) {
    respond(500, ['ok' => false, 'error' => 'Не удалось отправить письмо. Напишите напрямую на почту или в Telegram.']);
}

respond(200, ['ok' => true]);
