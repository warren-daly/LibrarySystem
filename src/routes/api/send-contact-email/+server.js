import { json } from '@sveltejs/kit';
import { sendContactEmail, resend_email} from '$lib/server/email/email-service.js';

export async function POST({ request }) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return json({ error: 'Missing required fields' }, { status: 400 });
    }

    await sendContactEmail({ 
      name, 
      email, 
      message,
      to: resend_email  // Choose where to send it
    });

    return json({ success: true });
  } catch (error) {
    console.error('Error sending contact email:', error);
    return json({ error: 'Failed to send email' }, { status: 500 });
  }
}