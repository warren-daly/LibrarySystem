import { Resend } from 'resend';
import { env } from '$env/dynamic/private';

const resend = new Resend(env.RESEND_API_KEY);
export const resend_email = (env.RESEND_EMAIL)

export async function sendEmail({ to, subject, html }) {
	const result = await resend.emails.send({
		from: 'Online Library <onboarding@resend.dev>',
		to,
		subject,
		html
	});

	if (result.error) {
		throw new Error(result.error.message);
	}

	console.log('Resend email accepted:', result.data?.id);

	return result;
}

export async function sendPasswordResetEmail({ to, url }) {
	await sendEmail({
		to,
		subject: 'Password Reset Request',
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h2>Password Reset Request</h2>
				<p>We received a request to reset your password for your Online Library account.</p>
				<p>
					Click the button below to reset your password:
				</p>
				<p style="text-align: center; margin: 20px 0;">
					<a 
						href="${url}" 
						style="
							background-color: #0d6efd;
							color: white;
							padding: 10px 16px;
							text-decoration: none;
							border-radius: 6px;
							display: inline-block;
						"
					>
						Reset Password
					</a>
				</p>
				<p>If you did not request a password reset, you can safely ignore this email.</p>
				<hr />
				<p style="font-size: 12px; color: #666;">
					This is an automated email from the Online Library.
				</p>
			</div>
		`
	});
	console.log('Password reset email sent to', to);
}

export async function sendRegistrationConfirmationEmail({ to, name }) {
	await sendEmail({
		to,
		subject: 'Welcome to the Online Library',
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h2>Welcome to the Online Library${name ? `, ${name}` : ''}</h2>
				<p>Your account has been created successfully.</p>
				<p>You can now log in, browse available books, rent books, and manage your account.</p>
				<p>If you did not create this account, you can ignore this email.</p>
				<hr />
				<p style="font-size: 12px; color: #666;">
					This is an automated email from the Online Library.
				</p>
			</div>
		`
	});
}

export async function sendPaymentConfirmationEmail({ to, amount, paymentType = 'Payment' }) {
	await sendEmail({
		to,
		subject: `${paymentType} Confirmation`,
		html: `
			<h2>${paymentType} Successful</h2>
			<p>Your payment has been received successfully.</p>
			<p><strong>Amount paid:</strong> €${(amount / 100).toFixed(2)}</p>
			<p>Thank you for using the Online Library.</p>
			<hr>
			<p style="font-size: 12px; color: #666;">This is an automated email from the Online Library.</p>
		`
	});
	console.log('Payment confirmation email sent to', to);
}

export async function sendRentalConfirmationEmail({ to, bookTitle, returnDate }) {
	await sendEmail({
		to,
		subject: 'Book Rental Confirmation',
		html: `
			<h2>Rental Confirmed</h2>
			<p>Your rental has been successfully created.</p>
			<p><strong>Book:</strong> ${bookTitle}</p>
			<p><strong>Return date:</strong> ${new Date(returnDate).toLocaleDateString()}</p>
			<p>Please return the book by the date above to avoid late fees.</p>
			<hr>
			<p style="font-size: 12px; color: #666;">This is an automated email from the Online Library.</p>
		`
	});
	console.log('Rental confirmation email sent to', to);
}

export async function sendReturnConfirmationEmail({ to, bookTitle }) {
	await sendEmail({
		to,
		subject: 'Book Return Confirmation',
		html: `
			<h2>Return Confirmed</h2>
			<p>Your book return has been processed successfully.</p>
			<p><strong>Book:</strong> ${bookTitle}</p>
			<p>Thank you for using the Online Library.</p>
			<hr>
			<p style="font-size: 12px; color: #666;">This is an automated email from the Online Library.</p>
		`
	});
	console.log('Return confirmation email sent to', to);
}

export async function sendLateReturnEmail({ to, bookTitle, returnDate }) {
	await sendEmail({
		to,
		subject: 'Late Return Notice',
		html: `
			<h2>Late Return Notice</h2>
			<p>Your rental is overdue.</p>
			<p><strong>Book:</strong> ${bookTitle}</p>
			<p><strong>Due date:</strong> ${new Date(returnDate).toLocaleDateString()}</p>
			<p>A late fee now applies. Please complete the late fee payment to finalise the return.</p>
			<hr>
			<p style="font-size: 12px; color: #666;">This is an automated email from the Online Library.</p>
		`
	});
	console.log('Late return email sent to', to);
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