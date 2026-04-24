import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const name = data.get('name') as string;
    const email = data.get('email') as string;
    const phone = data.get('phone') as string;
    const message = data.get('message') as string;
    const turnstileResponse = data.get('cf-turnstile-response') as string;

    if (!name || !email || !phone) {
      return new Response(
        JSON.stringify({ error: 'Bitte füllen Sie alle Pflichtfelder aus.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!turnstileResponse) {
      return new Response(
        JSON.stringify({ error: 'Bitte bestätigen Sie, dass Sie kein Roboter sind.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verify Turnstile Token
    const secretKey = import.meta.env.TURNSTILE_SECRET_KEY || '0x4AAAAAADB_4BrRvxvYJ5UuHxfXWtBkeIk';
    
    const verifyData = new URLSearchParams();
    verifyData.append('secret', secretKey);
    verifyData.append('response', turnstileResponse);

    const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: verifyData,
    });

    const verifyResult = await verifyResponse.json();

    if (!verifyResult.success) {
      return new Response(
        JSON.stringify({ error: 'Captcha-Überprüfung fehlgeschlagen. Bitte versuchen Sie es erneut.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send email via Resend
    const { data: resendData, error } = await resend.emails.send({
      from: 'Website Kontakt <onboarding@resend.dev>', // Using Resend test email. Replace with verified domain email for production.
      to: ['ursin.saluz@gmail.com'], // Fallback email to send notifications to. Should be replaced by actual recipient.
      replyTo: email,
      subject: `Neue Kontaktanfrage von ${name}`,
      html: `
        <h2>Neue Kontaktanfrage (titz.cooking)</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <h3>Nachricht:</h3>
        <p>${message ? message.replace(/\\n/g, '<br/>') : 'Keine Nachricht angegeben.'}</p>
      `
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(
        JSON.stringify({ error: 'Fehler beim Senden der E-Mail. Bitte versuchen Sie es später erneut.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Anfrage erfolgreich gesendet.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return new Response(
      JSON.stringify({ error: 'Ein interner Fehler ist aufgetreten.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
