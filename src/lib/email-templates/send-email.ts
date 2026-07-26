export interface SendTemplateEmailOptions {
  templateData: Record<string, string>;
  idempotencyKey?: string;
}

export async function sendTemplateEmail(
  _templateName: string,
  _to: string,
  _options: SendTemplateEmailOptions
): Promise<void> {
  // Email delivery is not configured yet. This is a safe no-op placeholder
  // that keeps the build valid. Once transactional email is set up,
  // replace this body with the actual provider call (e.g. Resend, SendGrid,
  // AWS SES) and remove the leading underscore from parameters.
  console.info("[sendTemplateEmail] skipped: email provider not configured");
}
