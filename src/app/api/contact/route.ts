import { buildEmailTemplate } from "@/components/ui/email-template";
import { config } from "@/data/config";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

const Email = z.object({
  fullName: z.string().min(2, "Full name is invalid!").optional(),
  name: z.string().min(2, "Name is invalid!").optional(),
  email: z.string().email({ message: "Email is invalid!" }),
  message: z.string().min(10, "Message is too short!"),
});
export async function POST(req: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return Response.json({ error: "RESEND_API_KEY is missing" }, { status: 500 });
    }

    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (isRateLimited(ip)) {
      return Response.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const {
      success: zodSuccess,
      data: zodData,
      error: zodError,
    } = Email.safeParse(body);
    if (!zodSuccess) {
      const firstMessage = zodError.issues[0]?.message || "Invalid request data.";
      return Response.json({ error: firstMessage }, { status: 400 });
    }

    const senderName = zodData.fullName ?? zodData.name;
    if (!senderName) {
      return Response.json({ error: "Name is invalid!" }, { status: 400 });
    }

    const fromEmail = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
    const toEmail = process.env.CONTACT_TO_EMAIL || config.email;

    const { data: resendData, error: resendError } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `Portfolio Inquiry from ${senderName}`,
      replyTo: zodData.email,
      html: buildEmailTemplate({
        fullName: senderName,
        email: zodData.email,
        message: zodData.message,
      }),
    });

    if (resendError) {
      console.error("Resend send error:", resendError);
      return Response.json(
        { error: resendError.message || "Failed to send email" },
        { status: 500 },
      );
    }

    return Response.json(resendData);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error while sending email.";
    return Response.json({ error: message }, { status: 500 });
  }
}
