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

        if (password.length < 6) {
            errorMessage = 'Password must be at least 6 characters long.';
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
            window.location.href = '/Member';
        }
    }
</script>

<h1 class="heading1">Register As a Member</h1>

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
            <small class="password-hint">Passwords must be at least 6 characters long.</small><br><br>

            <label for="confirmPwd">Confirm password:</label><br>
            <input type="password" id="confirmPwd" name="confirmPwd"  bind:value={confirmPassword} required minlength="6"><br><br>
            
			{#if errorMessage}
            	<p style="color:red;">{errorMessage}</p>
        	{/if}

            <input type="submit" value="Submit" class="submit-btn">
            <input type="reset" value="Reset" class="reset-btn"><br><br><br>
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

	.submit-btn, .reset-btn {
		margin-top: 10px;
		padding: 8px;
	}
</style>

