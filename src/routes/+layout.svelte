<script>
	import favicon from '$lib/assets/favicon.svg';

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
    <a href="/Login">Login</a>
	
</nav>

{@render children()}
