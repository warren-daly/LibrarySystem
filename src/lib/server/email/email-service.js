import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
	await resend.emails.send({
		from: 'Library System <onboarding@resend.dev>',
		to,
		subject,
		html
	});
}

export async function sendPasswordResetEmail({ to, url }) {
	await sendEmail({
		to,
		subject: 'Reset your password',
		html: `
			<h2>Password Reset</h2>
			<p>You requested a password reset.</p>
			<p><a href="${url}">Click here to reset your password</a></p>
		`
	});
}

export async function sendRegistrationConfirmationEmail({ to, name }) {
	await sendEmail({
		to,
		subject: 'Welcome to the Library System',
		html: `
			<h2>Welcome${name ? `, ${name}` : ''}</h2>
			<p>Your account has been created successfully.</p>
		`
	});
}

export async function sendPaymentConfirmationEmail({ to, amount }) {
	await sendEmail({
		to,
		subject: 'Payment Confirmation',
		html: `
			<h2>Payment Received</h2>
			<p>Your payment of €${amount} was successful.</p>
		`
	});
}

export async function sendReturnConfirmationEmail({ to, bookTitle }) {
	await sendEmail({
		to,
		subject: 'Book Return Confirmation',
		html: `
			<h2>Book Returned</h2>
			<p>Your return for <strong>${bookTitle}</strong> has been processed.</p>
		`
	});
}

