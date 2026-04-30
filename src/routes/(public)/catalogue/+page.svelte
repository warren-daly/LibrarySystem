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

<div class="container mt-1 catalogue-page">
	<div class="page-header">
		<h1 class="page-title">Book Catalogue</h1>
		<p class="page-subtitle">Browse, rent, and buy books from the library</p>
	</div>

	<div class="row">
		<aside class="col-md-3 mb-4">
			<div class="filter-card">
				<h5>Find Books</h5>

				<input
					class="form-control mb-3"
					bind:value={search}
					placeholder="Search books..."
					aria-label="Search books by title, author, or genre"
				/>

				<select
					class="form-select mb-3"
					bind:value={selectedGenre}
					aria-label="Filter books by genre"
				>
					{#each genres as genre (genre)}
						<option value={genre}>{genre === 'all' ? 'All Genres' : genre}</option>
					{/each}
				</select>

				<select
					class="form-select mb-3"
					bind:value={sortBy}
					aria-label="Sort books by title, price, or rating"
				>
					<option value="title">Title A-Z</option>
					<option value="price-low">Price Low → High</option>
					<option value="price-high">Price High → Low</option>
					<option value="rating">Highest Rated</option>
				</select>

				<p class="books-found" aria-live="polite">{visibleBooks.length} books found</p>

				<button
					type="button"
					class="btn btn-outline-secondary w-100"
					onclick={() => {
						search = '';
						selectedGenre = 'all';
						sortBy = 'title';
					}}
					aria-label="Clear search, genre filter, and sorting"
				>
					Clear
				</button>
			</div>
		</aside>

		<main class="col-md-9">
			<div class="row catalogue-grid">
				{#each visibleBooks as b (b.id)}
					<div class="col-sm-6 col-lg-4 mb-4 d-flex">
						<div class="card catalogue-card w-100">
							{#if b.image}
								<img src={'/uploads/' + b.image} class="card-img-top" alt={`Cover of ${b.title}`} />
							{/if}

							<div class="card-body">
								<div>
									<h5 class="card-title">{b.title}</h5>

									<p class="card-text" aria-label={`Author ${b.author}`}>
										<strong>Author:</strong>
										{b.author}
									</p>

									<p class="card-text" aria-label={`Genre ${b.genre}`}>
										<strong>Genre:</strong>
										{b.genre}
									</p>

									<p class="card-text" aria-label={`Genre ${b.description}`}>
										<strong>Description:</strong>
										{b.description}
									</p>

									<p class="card-text" aria-label={`Price ${euro.format(b.price / 100)}`}>
										<strong>Price:</strong>
										{euro.format(b.price / 100)}
									</p>

									{#if b.averageRating}
										<p
											class="card-text"
											aria-label={`Rating ${b.averageRating} out of 5 from ${b.reviewCount} reviews`}
										>
											<strong>Rating:</strong>
											<span class="rating-stars">
												{#each Array(5) as _, i (i)}
													<i
														class="bi bi-star{i < Math.round(b.averageRating)
															? '-fill'
															: ''} rating-star"
														aria-hidden="true"
													></i>
												{/each}
											</span>
											<span class="badge bg-warning text-dark ms-2">{b.averageRating} / 5</span>
											<small>({b.reviewCount} reviews)</small>
										</p>
									{:else}
										<p class="card-text text-muted" aria-label="No reviews available">
											No reviews yet
										</p>
									{/if}

									{#if b.stock === 0}
										<span
											class="badge bg-danger mb-2"
											aria-label="This book is currently out of stock"
										>
											Out of Stock
										</span>
									{:else}
										<span class="badge bg-success mb-2" aria-label={`${b.stock} copies available`}>
											Available ({b.stock})
										</span>
									{/if}
								</div>

								<div class="catalogue-actions">
									{#if b.stock !== 0}
										<form method="post" action="?/startRental" use:enhance>
											<input type="hidden" name="bookId" value={b.id} />
											<button
												type="submit"
												class="btn btn-primary w-100"
												aria-label={`Rent ${b.title} by ${b.author}`}
											>
												<i class="bi bi-book me-2" aria-hidden="true"></i>
												Rent Book
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
												if (result.type === 'redirect') {
													window.location.href = result.location;
													return;
												}

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
					</div>
				{/each}
			</div>
		</main>
	</div>
</div>

<style>
	.filter-card {
		background: #fff;
		border: 1px solid #ddd;
		padding: 1rem;
		border-radius: 10px;
		position: sticky;
		top: 100px;
	}

	.books-found {
		font-size: 0.85rem;
		color: #666;
		margin-bottom: 1rem;
	}

	.catalogue-card {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 620px;
		border-radius: 10px;
		overflow: hidden;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	}

	.catalogue-card .card-img-top {
		height: 220px;
		object-fit: contain;
		padding: 10px;
		background: #fff;
		flex-shrink: 0;
	}

	.catalogue-card .card-body {
		padding: 0.9rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex: 1;
	}

	.catalogue-card .card-title {
		font-size: 1rem;
		min-height: 48px;
		margin-bottom: 0.5rem;
		font-weight: 700;
	}

	.catalogue-card .card-text {
		font-size: 0.9rem;
		margin-bottom: 0.4rem;
	}

	.rating-stars {
		color: #ffc107;
		font-size: 0.8rem;
		letter-spacing: 0.15rem;
	}

	.catalogue-card .badge {
		font-size: 0.75rem;
		padding: 0.3rem 0.6rem;
	}

	.catalogue-actions {
		margin-top: auto;
		display: flex;
		flex-direction: column;
		gap: 0.45rem;
	}

	.catalogue-actions .btn {
		font-size: 0.85rem;
		padding: 0.45rem;
		border-radius: 8px;
	}

	@media (max-width: 767px) {
		.filter-card {
			position: static;
		}

		.catalogue-card {
			min-height: auto;
		}
	}
</style>
