<script>
	import { browser } from '$app/environment';
	import 'bootstrap/dist/css/bootstrap.min.css';
	import 'bootstrap-icons/font/bootstrap-icons.min.css';
	
	if (browser) {
		import('bootstrap');
	}
	
	import GuestMenu from '$lib/components/nav/GuestMenu.svelte';
	import MemberMenu from '$lib/components/nav/MemberMenu.svelte';
	import AdminMenu from '$lib/components/nav/AdminMenu.svelte';
	import UserDropdown from '$lib/components/nav/UserDropdown.svelte';

	let { data, children } = $props();
	let user = $derived(data?.user);
	let cartCount = $derived(data?.cartCount ?? 0);
</script>


<header>
	<nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top">
		<div class="container">
			<a class="navbar-brand fw-semibold" href="/">
				<i class="bi bi-book me-2" aria-hidden="true"></i>
				Online Library
			</a>

			<button
				class="navbar-toggler"
				type="button"
				data-bs-toggle="collapse"
				data-bs-target="#mainNavbar"
				aria-controls="mainNavbar"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="mainNavbar">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<GuestMenu />

					{#if user?.role === 'MEMBER'}
						<MemberMenu {cartCount} />
					{:else if user?.role === 'ADMIN'}
						<AdminMenu />
					{/if}
				</ul>

				<ul class="navbar-nav ms-auto">
					<UserDropdown {user} />
				</ul>
			</div>
		</div>
	</nav>
</header>

<main class="app-main">
	{@render children()}
</main>

<style>
  .app-main {
    padding-top: 50px; 
  }
</style>