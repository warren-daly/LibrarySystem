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
<div class="page-header">
	<h1 class="page-title">Register</h1>
	<p class="page-subtitle">Create an account to start renting books</p>
</div>

<div>
    <h4 class="heading2">Please enter your details below to register.</h4>
</div>
    <div class="forms-container">
        <form class="form1" onsubmit={handleRegister}>
            <label for="fname">First name:</label><br>
            <input type="text" id="fname" name="fname" bind:value={firstName} required><br><br>

            <label for="lname">Last name:</label><br>
            <input type="text" id="lname" name="lname" bind:value={lastName} required><br><br>

            <label for="email">Email:</label><br>
            <input type="email" id="email" name="email" bind:value={email} required><br><br>

            <label for="pwd">Create a password:</label><br>
            <input type="password" id="pwd" name="pwd" bind:value={password} required minlength="6">
            <small class="password-hint">Passwords must be at least 8 characters long.</small><br><br>

            <label for="confirmPwd">Confirm password:</label><br>
            <input type="password" id="confirmPwd" name="confirmPwd"  bind:value={confirmPassword} required minlength="6"><br><br>
            
			{#if errorMessage}
            	<p style="color:red;">{errorMessage}</p>
        	{/if}

            <button type="submit" class="btn btn-primary w-100">
                <i class="submit"></i> Submit
            </button><br>
            <button type="reset" class="btn btn-danger w-100">
                <i class="reset"></i> Reset
            </button><br><br><br>
        </form>
    </div>

<style>

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
		width: 600px;
		background-color: #f9f9f9;
	}

	input {
		width: 100%;
		padding: 6px;
	}
    
</style>

