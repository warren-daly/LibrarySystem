<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	let cartItems = $state({});
	let search = $state('');
	let selectedGenre = $state('all');
	let sortBy = $state('title');

	const euro = new Intl.NumberFormat('en-IE', {
		style: 'currency',
		currency: 'EUR'
	});

	function getItemKey(bookId, type) {
		return `${bookId}-${type}`;
	}

	const genres = $derived.by(() => {
		const set = new Set(data.books.map((b) => b.genre).filter(Boolean));
		return ['all', ...set];
	});

	const visibleBooks = $derived.by(() => {
		let books = [...data.books];

		if (search.trim()) {
			const term = search.toLowerCase();
			books = books.filter(
				(b) =>
					b.title.toLowerCase().includes(term) ||
					b.author.toLowerCase().includes(term) ||
					b.genre.toLowerCase().includes(term)
			);
		}

		if (selectedGenre !== 'all') {
			books = books.filter((b) => b.genre === selectedGenre);
		}

		books.sort((a, b) => {
			if (sortBy === 'price-low') return a.price - b.price;
			if (sortBy === 'price-high') return b.price - a.price;
			if (sortBy === 'rating') return Number(b.averageRating ?? 0) - Number(a.averageRating ?? 0);
			return a.title.localeCompare(b.title);
		});

		return books;
	});
</script>

<div class="container mt-5">
	<h1 class="mb-4 text-center">Book Catalogue</h1>

	<div class="row mb-4 justify-content-center">
		<div class="col-md-4 mb-2">
			<input
				class="form-control"
				bind:value={search}
				placeholder="Search books..."
				aria-label="Search books"
			/>
		</div>

		<div class="col-md-3 mb-2">
			<select class="form-select" bind:value={selectedGenre} aria-label="Filter by genre">
				{#each genres as genre (genre)}
					<option value={genre}>{genre === 'all' ? 'All Genres' : genre}</option>
				{/each}
			</select>
		</div>

		<div class="col-md-3 mb-2">
			<select class="form-select" bind:value={sortBy} aria-label="Sort books">
				<option value="title">Title A-Z</option>
				<option value="price-low">Price Low → High</option>
				<option value="price-high">Price High → Low</option>
				<option value="rating">Highest Rated</option>
			</select>
		</div>
	</div>

	<div class="row justify-content-center">
		{#each visibleBooks as b (b.id)}
			<div class="col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
				<div class="card" style="width: 16rem;">
					{#if b.image}
						<img src={'/uploads/' + b.image} class="card-img-top" alt={b.title} />
					{/if}

					<div class="card-body text-center">
						<h5 class="card-title">{b.title}</h5>

						<p class="card-text">
							<strong>Author:</strong> {b.author}
						</p>
						<p class="card-text"><strong>Genre:</strong> {b.genre}</p>

						<p class="card-text">
							<strong>Price:</strong>
							{euro.format(b.price / 100)}
						</p>

						{#if b.averageRating}
							<p class="card-text">
								<strong>Rating:</strong>
								<span class="rating-stars">
									{#each Array(5) as _, i (i)}
										<i class="bi bi-star{i < Math.round(b.averageRating) ? '-fill' : ''} rating-star"></i>
									{/each}
								</span>
								<span class="badge bg-warning text-dark ms-2">
									{b.averageRating} / 5
								</span>
								<small>({b.reviewCount} reviews)</small>
							</p>
						{:else}
							<p class="card-text text-muted">No reviews yet</p>
						{/if}

						{#if b.stock === 0}
							<span class="badge bg-danger mb-2">Out of Stock</span>
							<span class="badge bg-warning mb-2">Available {new Date(b.nextAvailableDate).toLocaleDateString('en-IE')}</span>
						{:else}
							<span class="badge bg-success mb-2">
								Available ({b.stock})
							</span>

							<form method="post" action="?/startRental" use:enhance>
								<input type="hidden" name="bookId" value={b.id} />
								<button type="submit" class="btn btn-primary w-100 mt-2">
									<i class="bi bi-book me-2"></i> Rent Book
								</button>
							</form>
						{/if}

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
								class="btn btn-success w-100 mt-2"
								disabled={cartItems[getItemKey(b.id, 'buy')] || b.stock === 0}
								aria-label={`Buy ${b.title}`}
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

<style>
	.card {
		width: 14rem; /* ↓ smaller than 16rem */
		border-radius: 10px;
		overflow: hidden;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	}

	.card-img-top {
		height: 200px; /* ↓ smaller image */
		object-fit: contain;
		padding: 8px;
		background: #fff;
	}

	.card-body {
		padding: 0.75rem;
		text-align: center;
	}

	.card-title {
		font-size: 1rem;
		min-height: 45px;
		margin-bottom: 0.5rem;
	}

	.card-text {
		font-size: 0.9rem;
		margin-bottom: 0.4rem;
	}

	.rating-stars {
		color: #ffc107;
		font-size: 0.8rem;
		letter-spacing: 0.15rem;
	}

	.badge {
		font-size: 0.75rem;
		padding: 0.3rem 0.6rem;
	}

	.btn {
		font-size: 0.85rem;
		padding: 0.45rem;
		margin-top: 0.4rem;
	}
</style>