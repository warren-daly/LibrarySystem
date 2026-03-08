<script>
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
</script>

<style>

.nav {
	display: flex;
	align-items: center;
	gap: 0.5em;
}

.auth {
	margin-left: auto;  
	display: flex;
	align-items: center;
	gap: 0.5em;
}

.dropdown {
	position: relative;
}

.dropdown-content {
	background-color: #C5D1EB;
	display: none;
	top: 100%;
	right: 0;
	position: absolute;
	padding: 1em;
	border-radius: 1em 0 1em 1em;
}

.dropdown:hover .dropdown-content {display: block;}
</style>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="nav">

	<a href="/">Home</a>
	<a href="/Catalogue">Catalogue</a>
    <a href="/About">About</a>
    <a href="/Contact">Contact</a>
	<div class="auth">
		<div class="dropdown">
			<a href="/register">Register</a>
		</div>
		
		<div class="dropdown">
			<button class="dropdown-btn">SignIn</button>
			<div class="dropdown-content">
				<form>
					<label for="username">User Name:</label>
					<input type="text" id="username" name="username">
					<label for="password">Password:</label>
					<input type="password" id="password" name="password">

					<input type="submit" value="Submit">
					<a style="right:0;" href="/password reset">Reset Password</a>
				</form>
			</div>
		</div>
	</div>
</nav>

{@render children()}

