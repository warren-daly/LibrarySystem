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

<div class="container d-flex justify-content-center align-items-start py-5">
	<div class="card shadow-sm w-100" style="max-width: 480px;">
		<div class="card-body p-4">
			<h1 class="h3 text-center mb-2">Forgot Password</h1>
			<p class="text-muted text-center mb-4">
				Enter your email address and we’ll send you a password reset link if an account exists.
			</p>

			<form onsubmit={handleForgotPassword}>
				<div class="mb-3">
					<label for="email" class="form-label fw-semibold">Email</label>
					<input
						type="email"
						id="email"
						class="form-control"
						bind:value={email}
						required
					/>
				</div>

				{#if errorMessage}
					<div class="alert alert-danger py-2">{errorMessage}</div>
				{/if}

				{#if successMessage}
					<div class="alert alert-success py-2">{successMessage}</div>
				{/if}

				<button type="submit" class="btn btn-primary w-100">
					Send Reset Link
				</button>
			</form>

			<p class="text-center text-muted mt-3 mb-0">
				Remembered your password?
				<a href="/auth/login">Back to login</a>
			</p>
		</div>
	</div>
</div>

