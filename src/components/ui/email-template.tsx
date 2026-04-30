interface EmailTemplateProps {
  fullName: string;
  email: string;
  message: string;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildEmailTemplate({
  fullName,
  email,
  message,
}: Readonly<EmailTemplateProps>) {
  const safeName = escapeHtml(fullName);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;">
      <h2 style="margin:0 0 12px;">New portfolio message</h2>
      <p style="margin:0 0 8px;"><strong>From:</strong> ${safeName}</p>
      <p style="margin:0 0 16px;"><strong>Email:</strong> ${safeEmail}</p>
      <p style="margin:0 0 6px;"><strong>Message:</strong></p>
      <blockquote style="margin:0;padding:12px 14px;border-left:4px solid #0ea5e9;background:#f8fafc;white-space:pre-wrap;">
        ${safeMessage}
      </blockquote>
    </div>
  `;
}
