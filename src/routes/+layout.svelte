<script>
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
</script>

<style>
.dropdown {
	position: absolute;
	right: 1em;
	display: inline-block;
}

.dropdown-content {
	background-color: white;
	display: none;
	right: 15%;
	position: absolute;
}

.dropdown:hover .dropdown-content {display: block;}
</style>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>

	<a href="/">Home</a>
	<a href="/Catalogue">Catalogue</a>
    <a href="/About">About</a>
    <a href="/Contact">Contact</a>

	<div class="dropdown">
		<button class="dropdown-btn">Login</button>
		<div class="dropdown-content">
			<form>
				<label for="username">User Name:</label>
				<input type="text" id="username" name="username">
				<label for="password">Password:</label>
				<input type="password" id="password" name="password">
				<input type="submit" value="Submit">
			</form>
		</div>
	</div>
</nav>

{@render children()}
