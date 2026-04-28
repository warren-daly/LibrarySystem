<script>
	import 'bootstrap/dist/css/bootstrap.min.css';
	import 'bootstrap-icons/font/bootstrap-icons.min.css';
	import Footer from '$lib/components/Footer.svelte';
	import GuestMenu from '$lib/components/nav/GuestMenu.svelte';
	import MemberMenu from '$lib/components/nav/MemberMenu.svelte';
	import AdminMenu from '$lib/components/nav/AdminMenu.svelte';
	import UserDropdown from '$lib/components/nav/UserDropdown.svelte';
	
	let { data, children } = $props();
	let user = $derived(data?.user);
	let cartCount = $derived(data?.cartCount ?? 0);
</script>

<header>
	<nav 
		class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm fixed-top"
		onmouseleave={() => {
			const navbarCollapse = document.getElementById('mainNavbar');
			const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
				toggle: false
			});
			bsCollapse.hide();
		}}
	>
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
				onmouseenter={() => {
					const navbarCollapse = document.getElementById('mainNavbar');
					const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
						toggle: false
					});
					bsCollapse.show();
				}}
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

<div class="page-wrapper">
	<main class="main-content app-main">
		{@render children()}
	</main>

	<Footer />
</div>

<style>
	.page-wrapper {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.main-content {
		flex: 1;
	}

	.app-main {
		padding-top: 80px;
		padding-bottom: 30px;
	}

  :global(.navbar-toggler) {
    opacity: 0.8;
    transition: opacity 0.2s ease;
  }

  :global(.navbar-toggler:focus),
  :global(.navbar-toggler:hover) {
    opacity: 1;
  }

  :global(.navbar-nav.ms-auto) {
    align-items: center;
  }

  :global(.navbar-collapse.show) {
    background-color: #212529;
  }

  /* Fix dropdown to stay within navbar on lg screens */
  :global(.navbar-expand-lg .navbar-nav .dropdown-menu) {
    position: absolute;
    top: 100%;
    right: 0;
    left: auto;
  }

  /* On mobile, keep dropdown inline */
  @media (max-width: 991px) {
    :global(.navbar-nav .dropdown-menu) {
      position: static;
      background-color: transparent;
      border: none;
      box-shadow: none;
    }
  }
</style>