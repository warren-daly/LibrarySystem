<script>
	import favicon from '$lib/assets/favicon.svg';

	import { onMount } from 'svelte';

	import { browser } from '$app/environment';
	import 'bootstrap/dist/css/bootstrap.min.css';
	import 'bootstrap-icons/font/bootstrap-icons.min.css';

	onMount(async () => {
		if (browser) {
			console.log('Loading Bootstrap');
			await import('bootstrap');
		}
	});

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
	<a href="/">Home</a>
	<a href="/Catalogue">Catalogue</a>
	<a href="/About">About</a>
	<a href="/Contact">Contact</a>
	<a href="/Admin/Books">Books</a>

	<div class="dropdown">
		<button class="dropdown-btn">Login</button>
		<div class="dropdown-content">
			<form>
				<label for="username">User Name:</label>
				<input type="text" id="username" name="username" />
				<label for="password">Password:</label>
				<input type="password" id="password" name="password" />
				<input type="submit" value="Submit" />
			</form>
		</div>
	</div>
</nav>

{@render children()}

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

	.dropdown:hover .dropdown-content {
		display: block;
	}
</style>
