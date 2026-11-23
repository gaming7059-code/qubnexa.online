/**
 * Cloudflare Pages Function: /api/contact
 * Secure server-side email delivery handler for QUBNEXA
 * Official Destination: qubnexa.official@gmail.com
 */

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_EMAIL_TO?: string;
  CONTACT_EMAIL_FROM?: string;
}

interface ContactPayload {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  website?: string; // honeypot
  timestamp?: number;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const OFFICIAL_RECIPIENT = 'qubnexa.official@gmail.com';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getAllowedOrigin(request: Request): string {
  const origin = request.headers.get('origin') || '';
  if (
    origin === 'https://qubnexa.online' ||
    origin === 'https://www.qubnexa.online' ||
    /^http:\/\/localhost(:\d+)?$/.test(origin) ||
    /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)
  ) {
    return origin;
  }
  return 'https://qubnexa.online';
}

function createJsonResponse(data: Record<string, unknown>, status: number, request: Request): Response {
  const allowOrigin = getAllowedOrigin(request);
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': allowOrigin,
      'X-Content-Type-Options': 'nosniff',
      Vary: 'Origin',
    },
  });
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  // 1. Content-Type check
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return createJsonResponse(
      {
        success: false,
        code: 'INVALID_CONTENT_TYPE',
        message: 'Content-Type must be application/json.',
      },
      415,
      request
    );
  }

  // 2. Parse body safely with size limit
  let body: ContactPayload;
  try {
    const rawText = await request.text();
    if (rawText.length > 50000) {
      return createJsonResponse(
        {
          success: false,
          code: 'PAYLOAD_TOO_LARGE',
          message: 'Payload size exceeds 50 KB limit.',
        },
        413,
        request
      );
    }
    body = JSON.parse(rawText);
  } catch {
    return createJsonResponse(
      {
        success: false,
        code: 'INVALID_JSON',
        message: 'Malformed JSON payload.',
      },
      400,
      request
    );
  }

  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const subject = (body.subject || '').trim();
  const message = (body.message || '').trim();
  const honeypot = (body.website || '').trim();
  const timestamp = Number(body.timestamp) || 0;

  // 3. Spam Protection: Honeypot trap
  if (honeypot) {
    // Silently drop bot submission with clean response
    return createJsonResponse(
      {
        success: true,
        message: 'Inquiry received successfully.',
      },
      200,
      request
    );
  }

  // 4. Spam Protection: Time-to-submit verification (minimum 1.5 seconds)
  if (timestamp > 0) {
    const elapsed = Date.now() - timestamp;
    if (elapsed < 1500) {
      return createJsonResponse(
        {
          success: false,
          code: 'SUBMISSION_TOO_FAST',
          message: 'Form submitted too quickly. Please take your time.',
        },
        400,
        request
      );
    }
  }

  // 5. Input Validation
  if (!name || name.length < 2 || name.length > 100) {
    return createJsonResponse(
      {
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Name must be between 2 and 100 characters.',
      },
      400,
      request
    );
  }

  if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
    return createJsonResponse(
      {
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Please provide a valid email address.',
      },
      400,
      request
    );
  }

  if (!subject || subject.length < 3 || subject.length > 150) {
    return createJsonResponse(
      {
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Subject must be between 3 and 150 characters.',
      },
      400,
      request
    );
  }

  if (!message || message.length < 10 || message.length > 5000) {
    return createJsonResponse(
      {
        success: false,
        code: 'VALIDATION_ERROR',
        message: 'Message must be between 10 and 5,000 characters.',
      },
      400,
      request
    );
  }

  // 6. Security: Email Header Injection Protection (strip or reject CRLF)
  if (/[\r\n]/.test(name) || /[\r\n]/.test(email) || /[\r\n]/.test(subject)) {
    return createJsonResponse(
      {
        success: false,
        code: 'MALICIOUS_INPUT',
        message: 'Carriage return or newline characters are not permitted in header fields.',
      },
      400,
      request
    );
  }

  // 7. Destination Configuration
  const targetRecipient = env.CONTACT_EMAIL_TO || OFFICIAL_RECIPIENT;
  const apiKey = env.RESEND_API_KEY;

  if (!apiKey) {
    // Honest status reporting when Cloudflare environment secret is not yet configured
    return createJsonResponse(
      {
        success: false,
        code: 'BACKEND_NOT_CONFIGURED',
        message: `Direct server-side email delivery is pending API key configuration in Cloudflare Pages. Please email us directly at ${OFFICIAL_RECIPIENT}.`,
        recipient: OFFICIAL_RECIPIENT,
      },
      503,
      request
    );
  }

  // 8. Resend API Delivery
  try {
    const fromSender = env.CONTACT_EMAIL_FROM || 'QUBNEXA Contact Form <onboarding@resend.dev>';
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromSender,
        to: [targetRecipient],
        reply_to: email,
        subject: `[QUBNEXA Contact] ${subject}`,
        text: `New message from QUBNEXA Contact Form:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\nSubmitted at: ${new Date().toISOString()}`,
        html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0891b2; margin-top: 0;">New Contact Form Submission — QUBNEXA</h2>
          <p><strong>From:</strong> ${escapeHtml(name)} (&lt;<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>&gt;)</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <h3 style="color: #334155; margin-bottom: 8px;">Message Content:</h3>
          <div style="background-color: #f8fafc; padding: 14px; border-radius: 6px; white-space: pre-wrap; font-size: 14px; color: #1e293b; line-height: 1.6;">${escapeHtml(message)}</div>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p style="font-size: 12px; color: #64748b;">Delivered securely to ${escapeHtml(targetRecipient)} via Cloudflare Pages Function on ${new Date().toUTCString()}.</p>
        </div>`,
      }),
    });

    if (!resendResponse.ok) {
      const errorData = await resendResponse.text();
      console.error('Resend API delivery error:', resendResponse.status, errorData);
      return createJsonResponse(
        {
          success: false,
          code: 'DELIVERY_PROVIDER_ERROR',
          message: `Email provider encountered an error. Please contact us directly at ${OFFICIAL_RECIPIENT}.`,
        },
        502,
        request
      );
    }

    return createJsonResponse(
      {
        success: true,
        message: `Thank you! Your message has been sent successfully to ${targetRecipient}.`,
      },
      200,
      request
    );
  } catch (err) {
    console.error('Contact handler internal error:', err);
    return createJsonResponse(
      {
        success: false,
        code: 'INTERNAL_ERROR',
        message: `An unexpected transmission error occurred. Please contact us directly at ${OFFICIAL_RECIPIENT}.`,
      },
      500,
      request
    );
  }
}

export async function onRequestOptions(context: { request: Request }): Promise<Response> {
  const allowOrigin = getAllowedOrigin(context.request);
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
      Vary: 'Origin',
    },
  });
}
