<script>
import favicon from '$lib/assets/favicon.svg';
import { onMount } from 'svelte';
import { browser } from '$app/environment';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.min.css';
import { page } from '$app/stores';
import { authClient } from '$lib/auth-client';

let error = $derived($page.url.searchParams.get('error'));

onMount(async () => {
    if (browser) {
        console.log('Loading Bootstrap');
        await import('bootstrap');
    }
});

let { data, children } = $props();
let user = $derived(data.user);


let email = $state('');
let password = $state('');
let loginError = $state('');

async function handleLogin(e) {
    e.preventDefault();
    loginError = '';

    const { error: authError } = await authClient.signIn.email({ email, password });

    if (authError) {
        loginError = authError.message || 'Invalid email or password';
    } else {
        const params = new URLSearchParams(window.location.search);
        const redirectTo = params.get('redirectTo');
        window.location.href = redirectTo || '/member';
    }
}

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
    <a href="/">Home</a>
    <a href="/catalogue">Catalogue</a>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
    <a href="/Member">Member</a>
    {#if user}
        {#if user.role === 'ADMIN'}
            <a href="/Admin">Admin</a>
    {/if}

	{#if data.user && data.cartCount > 0}
        <a href="/cart"><i class="bi bi-cart me-1"></i>Cart</a>
    {/if}
	<div class="dropdown">
    	<span>Welcome, {user.name}!</span>
		<div class="logout">
    		<button onclick={() => authClient.signOut().then(() => window.location.href = '/')}>
    			Logout
			</button>
		</div>
	</div>
	{:else}
	<div class="dropdown">
    	<button class="dropdown-btn">Login</button>
    	<div class="dropdown-content">
    	    <form onsubmit={handleLogin}>
    	        <label for="email">Email:</label>
    	        <input type="text" id="email" name="email" bind:value={email} />
    	        <label for="password">Password:</label>
    	        <input type="password" id="password" name="password" bind:value={password} />
    	        <input type="submit" value="Submit" />
    	        {#if loginError}
			    	<p style="color:red">{loginError}</p>
				{/if}
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
