export interface ContactFormConfig {
  idPrefix: string;
  namePlaceholder: string;
  taskLabel: string;
  taskOptions: string[];
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
}

/** Состояние отправки формы. */
export type ContactFormState = 'idle' | 'sending' | 'success' | 'error';

/** Тело запроса к /api/send.php (см. public/api/send.php). */
export interface ContactFormPayload {
  name: string;
  contact: string;
  task: string;
  message: string;
  consent: boolean;
  page: string;
  website: string;
}

/** Ответ /api/send.php. */
export interface ContactFormResponse {
  ok: boolean;
  error?: string;
}
