<script>
	let { cartCount = 0 } = $props();
</script>

<li class="nav-item">
	<a class="nav-link" href="/member">Dashboard</a>
</li>

<li class="nav-item">
	<a class="nav-link" href="/cart">
		Cart
		{#if cartCount > 0}
			<span class="badge bg-danger ms-1">{cartCount}</span>
		{/if}
	</a>
</li>