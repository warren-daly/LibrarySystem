<script>
function validateForm() {

    let password = document.getElementById("pwd").value;
    let confirmPassword = document.getElementById("confirmPwd").value;
    let error = document.getElementById("errorMessage");

    error.textContent = ""; // clear previous error

    if (password.length < 6) {
        error.textContent = "Password must be at least 6 characters long.";
        return false;
    }

    if (password !== confirmPassword) {
        error.textContent = "Passwords do not match.";
        return false;
    }

    return true;
}
</script>

<h1 class="heading1">Register As Member</h1>

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
            <input type="password" id="pwd" name="pwd" required>
            <small class="password-hint">Passwords must be at least 6 characters long.</small><br><br>

            <label for="pwd">Confirm password:</label><br>
            <input type="password" id="pwd" name="pwd" required><br><br>

            <p id="errorMessage" style="color:red;"></p>

            <input type="submit" value="Submit" class="submit-btn">
            <input type="reset" value="Reset" class="reset-btn">
        </form>
    </div>

