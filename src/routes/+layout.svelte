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
	let { data, children } = $props();
    let user = $derived(data.user);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
	<a href="/">Home</a>
	<a href="/Catalogue">Catalogue</a>
	<a href="/About">About</a>
	<a href="/Contact">Contact</a>
	<a href="/Member">Member</a>
	<a href="/Admin">Admin</a>

	{#if user}
	<div class="dropdown">
    	<span>Welcome, {user.firstName}!</span>
		<div class="logout">
    	<form method="POST" action="/api/logout">
    	    <button type="submit">Logout</button>
    	</form>
		</div>
	</div>
	{:else}
	<div class="dropdown">
		<button class="dropdown-btn">Login</button>
		<div class="dropdown-content">
			<form method="POST" action="/api/login">
				<label for="email">email:</label>
				<input type="text" id="email" name="email" />
				<label for="password">Password:</label>
				<input type="password" id="password" name="password" />
				<input type="submit" value="Submit" />
			</form>
		</div>
	</div>
	{/if}
</nav>

{@render children()}

<style>
	.logout {
		display: inline-block;
	} 

	.dropdown {
		position: absolute;
		top: 0.25em;
		right: 0.5em;
		display: inline-block;
		flex-wrap: nowrap;
	}

	.dropdown-content {
		background-color: white;
		display: none;
		right: 15%;
		position: absolute;
	}

	.dropdown:hover .dropdown-content,
	.dropdown:focus-within .dropdown-content {
		display: block;
	}
</style>
