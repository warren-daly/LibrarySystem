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

<h1 class="heading1">Reset Password</h1>

<div>
	<h4 class="heading2">Please enter your new password below.</h4>
</div>

<div class="forms-container">
	<form class="form1" onsubmit={handleResetPassword}>
		<label for="pwd">New password:</label><br>
		<input
			type="password"
			id="pwd"
			name="pwd"
			bind:value={newPassword}
			required
			minlength="8"
		>
		<small class="password-hint">Password must be at least 8 characters long.</small><br><br>

		<label for="confirmPwd">Confirm new password:</label><br>
		<input
			type="password"
			id="confirmPwd"
			name="confirmPwd"
			bind:value={confirmNewPassword}
			required
			minlength="8"
		><br><br>

		{#if errorMessage}
			<p style="color:red;">{errorMessage}</p>
		{/if}

		{#if successMessage}
			<p style="color:green;">{successMessage}</p>
		{/if}

		<button type="submit" class="btn btn-primary w-100">
			<i class="bi bi-box-arrow-in-right me-1"></i> Submit
		</button><br><br><br>
	</form>
</div>

<style>
	.heading1 {
		text-align: center;
		margin-top: 30px;
	}

	.heading2 {
		text-align: center;
		margin-bottom: 20px;
		color: #555;
	}

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