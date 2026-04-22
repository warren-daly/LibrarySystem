import { resend_email } from '$lib/server/email/email-service.js';

export async function load() {
    return {
        resendEmail: resend_email
    };
}