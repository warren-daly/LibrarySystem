<script>
	import { authClient } from '$lib/auth-client';
	import { onMount } from 'svelte';

	let newPassword = $state('');
	let confirmNewPassword = $state('');
	let token = $state('');
	let errorMessage = $state('');
	let successMessage = $state('');

	onMount(() => {
		token = new URLSearchParams(window.location.search).get('token') || '';
	});

	async function handleResetPassword(e) {
		e.preventDefault();
		errorMessage = '';
		successMessage = '';

		if (!token) {
			errorMessage = 'Invalid or missing reset token.';
			return;
		}

		if (newPassword.length < 6) {
			errorMessage = 'Password must be at least 8 characters long.';
			return;
		}

		if (newPassword !== confirmNewPassword) {
			errorMessage = 'Passwords do not match.';
			return;
		}

		const { error } = await authClient.resetPassword({
			newPassword,
			token
		});

		if (error) {
			errorMessage = error.message || 'Password could not be reset.';
		} else {
			successMessage = 'Password reset successfully. You can now log in.';
		}
	}
</script>

<div class="container d-flex justify-content-center align-items-start py-5">
	<div class="card shadow-sm w-100" style="max-width: 480px;">
		<div class="card-body p-4">
			<h1 class="h3 text-center mb-2">Reset Password</h1>
			<p class="text-muted text-center mb-4">
				Enter and confirm your new password below.
			</p>

			<form onsubmit={handleResetPassword}>
				<div class="mb-3">
					<label for="pwd" class="form-label fw-semibold">New password</label>
					<input
						type="password"
						id="pwd"
						class="form-control"
						bind:value={newPassword}
						required
						minlength="8"
					/>
					<div class="form-text">Password must be at least 8 characters long.</div>
				</div>

				<div class="mb-3">
					<label for="confirmPwd" class="form-label fw-semibold">Confirm new password</label>
					<input
						type="password"
						id="confirmPwd"
						class="form-control"
						bind:value={confirmNewPassword}
						required
						minlength="8"
					/>
				</div>

				{#if errorMessage}
					<div class="alert alert-danger py-2">{errorMessage}</div>
				{/if}

				{#if successMessage}
					<div class="alert alert-success py-2">{successMessage}</div>
				{/if}

				<button type="submit" class="btn btn-primary w-100">
					Reset Password
				</button>
			</form>

			<p class="text-center mt-3 mb-0">
				<a href="/auth/login">Back to login</a>
			</p>
		</div>
	</div>
</div>