<script>
	import { onMount } from "svelte";

	function validateForm(event) {
		event.preventDefault();

		let password = document.getElementById("pwd").value;
		let confirmPassword = document.getElementById("confirmPwd").value;
		let errorMessage = document.getElementById("errorMessage");

		errorMessage.textContent = "";

		if (password.length < 6) {
			errorMessage.textContent = "Password must be at least 6 characters long.";
			return;
		}

		if (password !== confirmPassword) {
			errorMessage.textContent = "Passwords do not match.";
			return;
		}

		errorMessage.textContent = "Registration successful!";
	}

	onMount(() => {
		const form = document.querySelector(".form1");
		if (form) {
			form.addEventListener("submit", validateForm);
		}
	});
</script>

<h1 class="heading1">Register As a Member</h1>

<div>
    <h4 class="heading2">Please enter your details below to register.</h4>
</div>
    <div class="forms-container">
        <form class="form1">
            <label for="fname">First name:</label><br>
            <input type="text" id="fname" name="fname" required><br><br>

            <label for="lname">Last name:</label><br>
            <input type="text" id="lname" name="lname" required><br><br>

            <label for="email">Email:</label><br>
            <input type="email" id="email" name="email" required><br><br>

            <label for="pwd">Create a password:</label><br>
            <input type="password" id="pwd" name="pwd" required minlength="6">
            <small class="password-hint">Passwords must be at least 6 characters long.</small><br><br>

            <label for="confirmPwd">Confirm password:</label><br>
            <input type="password" id="confirmPwd" name="confirmPwd" required minlength="6"><br><br>
            <p id="errorMessage" style="color:red;"></p>

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

