<script>
    import { authClient } from '$lib/auth-client';

    let firstName = $state('');
    let lastName = $state('');
    let email = $state('');
    let password = $state('');
    let confirmPassword = $state('');
    let errorMessage = $state('');

    async function handleRegister(e) {
        e.preventDefault();
        errorMessage = '';

        if (password.length < 8) {
            errorMessage = 'Password must be at least 8 characters long.';
            return;
        }

        if (password !== confirmPassword) {
            errorMessage = 'Passwords do not match.';
            return;
        }

        const { error } = await authClient.signUp.email({
            name: `${firstName} ${lastName}`,
            email,
            password
        });

        if (error) {
            errorMessage = error.message || 'Registration failed.';
        } else {
            try {
                await fetch('/api/send-registration-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email,
                        name: `${firstName} ${lastName}`
                    })
                });
            } catch (err) {
                console.error('Registration email failed:', err);
            }

            const membershipNumber = `M${Math.floor(1000 + Math.random() * 9000)}`;
            window.location.href = `/auth/register/register-success?member=${membershipNumber}`;
        }
    }    
</script>

<div class="container d-flex justify-content-center align-items-start py-5">
	<div class="card shadow-sm w-100" style="max-width: 620px;">
		<div class="card-body p-4">
			<h1 class="h3 text-center mb-2">Register as a Member</h1>
			<p class="text-muted text-center mb-4">
				Create your Online Library account below.
			</p>

			<form onsubmit={handleRegister}>
				<div class="row">
					<div class="col-md-6 mb-3">
						<label for="fname" class="form-label fw-semibold">First name</label>
						<input
							type="text"
							id="fname"
							class="form-control"
							bind:value={firstName}
							required
						/>
					</div>

					<div class="col-md-6 mb-3">
						<label for="lname" class="form-label fw-semibold">Last name</label>
						<input
							type="text"
							id="lname"
							class="form-control"
							bind:value={lastName}
							required
						/>
					</div>
				</div>

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

				<div class="mb-3">
					<label for="pwd" class="form-label fw-semibold">Password</label>
					<input
						type="password"
						id="pwd"
						class="form-control"
						bind:value={password}
						required
						minlength="8"
					/>
					<div class="form-text">Password must be at least 8 characters long.</div>
				</div>

				<div class="mb-3">
					<label for="confirmPwd" class="form-label fw-semibold">Confirm password</label>
					<input
						type="password"
						id="confirmPwd"
						class="form-control"
						bind:value={confirmPassword}
						required
						minlength="8"
					/>
				</div>

				{#if errorMessage}
					<div class="alert alert-danger py-2">{errorMessage}</div>
				{/if}

				<div class="d-flex gap-2 mt-4">
					<button type="submit" class="btn btn-primary flex-fill">Register</button>
					<button type="reset" class="btn btn-outline-secondary flex-fill">Reset</button>
				</div>
			</form>
		</div>
	</div>
</div>

