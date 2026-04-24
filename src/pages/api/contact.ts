import type { APIRoute } from 'astro';

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

    // Send email via Cloudflare Email Workers (SEND_EMAIL binding)
    // The binding is only available in the deployed Cloudflare Worker runtime.
    // @ts-ignore – runtime binding not visible to TypeScript
    const sendEmail = (globalThis as any).SEND_EMAIL ?? (import.meta as any).env?.SEND_EMAIL;

    if (!sendEmail) {
      // Running locally – log and return success so the form still works in dev
      console.warn('[contact] SEND_EMAIL binding not available (local dev). Would have sent:', { name, email, phone, message });
      return new Response(
        JSON.stringify({ success: true, message: 'Anfrage erfolgreich gesendet.' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const htmlBody = `
      <h2>Neue Kontaktanfrage (titz.cooking)</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefon:</strong> ${phone}</p>
      <h3>Nachricht:</h3>
      <p>${message ? message.replace(/\n/g, '<br/>') : 'Keine Nachricht angegeben.'}</p>
    `;

    await sendEmail.send({
      from: 'kontakt@titz.cooking',
      to: 'ursin.saluz@gmail.com',
      subject: `Neue Kontaktanfrage von ${name}`,
      headers: {
        'Reply-To': email,
      },
      html: htmlBody,
    });

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
