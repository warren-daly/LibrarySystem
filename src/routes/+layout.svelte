<script>
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>

	<a href="/">Home</a>
	<a href="/catalogue">Catalogue</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
    <a href="/login">Login</a>
	<a href="/register">Register</a>
	
</nav>

{@render children()}
