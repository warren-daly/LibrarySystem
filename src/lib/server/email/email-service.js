import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

const resend = new Resend(env.RESEND_API_KEY);
export const resend_email = (env.RESEND_EMAIL)

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

export async function sendRentalConfirmationEmail({ to, bookTitle, returnDate }) {
	await sendEmail({
		to,
		subject: 'Rental Confirmation',
		html: `
			<h2>Book Rental Confirmed</h2>
			<p>You have successfully rented <strong>${bookTitle}</strong>.</p>
			<p>Return date: ${new Date(returnDate).toLocaleDateString()}</p>
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

export async function sendLateReturnEmail({ to, bookTitle, returnDate }) {
	await sendEmail({
		to,
		subject: 'Late Return Notice',
		html: `
			<h2>Late Return Notice</h2>
			<p>Your rental for <strong>${bookTitle}</strong> is overdue.</p>
			<p>The due date was: ${new Date(returnDate).toLocaleDateString()}</p>
			<p>A late fee will now apply before the return can be completed.</p>
		`
	});
}

export async function sendContactEmail({ name, email, message, to }) {
	await sendEmail({
		to,
		subject: `New contact from ${name}`,
		html: `
			<h2>New Contact Message</h2>
			<p><strong>Name:</strong> ${name}</p>
			<p><strong>Email:</strong> ${email}</p>
			<p><strong>Message:</strong></p>
			<p>${message.replace(/\n/g, '<br>')}</p>
		`
	});
}