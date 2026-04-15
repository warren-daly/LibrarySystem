<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();
	let cartItems = $state({}); // Track each book + type combination

	const euro = new Intl.NumberFormat('en-IE', {
		style: 'currency',
		currency: 'EUR'
	});

	function getItemKey(bookId, type) {
		return `${bookId}-${type}`;
	}
</script>

<div class="container mt-5">
	<h1 class="mb-4 text-center">Book Catalogue</h1>
	<div class="row justify-content-center">
		{#each data.books as b}
			<div class="col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
				<div class="card" style="width: 16rem;">
					{#if b.image}
						<img src={'/uploads/' + b.image} class="card-img-top" alt={b.title} />
					{/if}

					<div class="card-body text-center">
						<h5 class="card-title">{b.title}</h5>
						<p class="card-text"><strong>Author:</strong> {b.author}</p>
						<p class="card-text">
							<strong>Price:</strong>
							{euro.format(b.price / 100)}
						</p>

						{#if b.stock === 0}
							<span class="badge bg-danger mb-2">Out of Stock</span>
						{:else}
							<span class="badge bg-success mb-2">Available</span>
							<a
								href={`/member/rentals?bookId=${b.id}`}
								class="btn btn-primary w-100 mt-2"
								role="button"
								aria-label={`Rent ${b.title}`}
							>
								Rent Book
							</a>
						{/if}

						<!-- Buy Button -->
						<form
							method="post"
							action="?/addToCart"
							use:enhance={({ formData }) => {
								console.log('Buy form submitted:', {
									bookId: formData.get('bookId'),
									type: formData.get('type')
								});
								return async ({ result }) => {
									if (result.type === 'success') {
										cartItems[getItemKey(b.id, 'buy')] = true;
										await invalidateAll();
									}
								};
							}}
						>
							<input type="hidden" name="bookId" value={b.id} />
							<input type="hidden" name="type" value="buy" />
							<button
								type="submit"
								class="btn btn-success w-100"
								disabled={cartItems[getItemKey(b.id, 'buy')] || b.stock === 0}
							>
								{#if cartItems[getItemKey(b.id, 'buy')]}
									<i class="bi bi-check-circle me-2"></i> Bought
								{:else}
									<i class="bi bi-bag me-2"></i> Buy Book
								{/if}
							</button>
						</form>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
