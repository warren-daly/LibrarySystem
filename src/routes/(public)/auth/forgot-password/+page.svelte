<script>
	import { authClient } from '$lib/auth-client';

	let email = $state('');
	let errorMessage = $state('');
	let successMessage = $state('');

	async function handleForgotPassword(e) {
		e.preventDefault();
		errorMessage = '';
		successMessage = '';

		if (!email.trim()) {
			errorMessage = 'Please enter a valid email address.';
			return;
		}

		const { error } = await authClient.requestPasswordReset({
			email: email.trim(),
			redirectTo: '/auth/reset-password'
		});

		if (error) {
			errorMessage = error.message || 'Could not send reset email.';
		} else {
			successMessage =
                'If an account exists for this email, a password reset link has been sent.';
		}
	}
</script>

<div class="page-header">
	<h1 class="page-title">Forgot Password</h1>
	<p class="page-subtitle">Reset your password using your email</p>
</div>
<div class="forms-container">
	<form class="form1" onsubmit={handleForgotPassword}>
            <label for="email">Enter Your Email:</label><br>
            <input type="email" id="email" name="email" bind:value={email} required><br><br>

		{#if successMessage}
			<p style="color:green;">{successMessage}</p>
		{/if}

		<button type="submit" class="btn btn-primary w-100">
			<i class="bi bi-box-arrow-in-right me-1"></i> Submit
		</button>
	</form>
</div>

<style>

	.forms-container {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}

	.form1 {
		padding: 20px;
		border: 1px solid #ccc;
		border-radius: 8px;
		width: 300px;
		background-color: #f9f9f9;
	}

	input {
		width: 100%;
		padding: 6px;
	}
</style>
