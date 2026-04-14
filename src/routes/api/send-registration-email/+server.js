import { json } from '@sveltejs/kit';
import { sendRegistrationConfirmationEmail } from '$lib/server/email/email-service.js';

export async function POST({ request }) {
	try {
		const { email, name } = await request.json();

		await sendRegistrationConfirmationEmail({
			to: email,
			name
		});

		console.log('Registration email sent to', email);

		return json({ success: true });
			} catch (err) {
				console.error('Registration email failed:', err);
				return json({ error: 'Email failed' }, { status: 500 });
			}
}