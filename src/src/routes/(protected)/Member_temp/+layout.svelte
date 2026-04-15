<script>
	let { children } = $props();
</script>

<main class="content">
	{@render children()}
</main>

<style>
	.content {
		padding: 2rem;
		min-height: calc(100vh - 56px);
		background: #f8f9fa;
	}
</style>