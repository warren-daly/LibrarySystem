<script>
	import RentalForm from '$lib/components/RentalForm.svelte';

	let { data } = $props();

	let rentals = $derived(data.rentals ?? []);
	let books = $derived(data.books ?? []);
	let selectedBookId = $derived(data.selectedBookId ?? null);
	let currentUser = $derived(data.currentUser ?? null);

	let showForm = $state(data.selectedBookId ? true : false);

	function hideForm() {
		showForm = false;
	}
</script>

<section id="rentals-page">
	<div class="container py-4">
		<h1 class="mb-4 text-center">My Rentals</h1>

		{#if selectedBookId && showForm}
			<div class="card shadow-sm mb-4">
				<div class="card-header bg-success text-white border-0">
					<h5 class="mb-0">Create New Rental</h5>
				</div>
				<div class="card-body p-4">
					<RentalForm
						{books}
						{selectedBookId}
						{currentUser}
						onCancel={hideForm}
					/>
				</div>
			</div>
		{/if}

		<div class="card shadow-sm">
			<div class="card-body p-0">
				<div class="table-responsive">
					<table class="table table-hover align-middle mb-0">
						<thead class="table-light">
							<tr>
								<th class="ps-4">ID</th>
								<th>Book</th>
								<th>Status</th>
								<th>Rental Date</th>
								<th>Return Date</th>
								<th class="pe-4 text-center">Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each rentals as r (r.id)}
								<tr>
									<td class="ps-4">{r.id}</td>
									<td>{r.book?.title ?? `Book #${r.bookId}`}</td>
									<td>
										<span class={`badge ${
											r.status === 'late'
												? 'bg-danger'
												: r.status === 'returned'
													? 'bg-primary'
													: r.status === 'cancelled'
														? 'bg-secondary'
														: 'bg-success'
										}`}>
											{r.status.charAt(0).toUpperCase() + r.status.slice(1)}
										</span>
									</td>
									<td>{new Date(r.rentalDate).toLocaleDateString('en-IE')}</td>
									<td>{new Date(r.returnDate).toLocaleDateString('en-IE')}</td>
									<td class="pe-4 text-center">
										<div class="d-flex gap-2 justify-content-center">
											{#if r.status === 'rented'}
												<form method="POST" action="?/returnRental">
													<input type="hidden" name="rentalId" value={r.id} />
													<button
														type="submit"
														class="btn btn-sm btn-outline-success"
													>
														<i class="bi bi-box-arrow-in-left"></i> Return
													</button>
												</form>
											{/if}
											
											{#if r.status === 'returned' && !r.hasReview}
												<form method="POST" action="?/LeaveReview">
													<input type="hidden" name="bookId" value={r.bookId} />
													<div class="mb-2">
														<label for="rating-{r.id}" class="form-label">Rating (1-5):</label>
														<select id="rating-{r.id}" name="rating" class="form-select form-select-sm" required>
															<option value="">Select rating</option>
															<option value="1">1 - Poor</option>
															<option value="2">2 - Fair</option>
															<option value="3">3 - Good</option>
															<option value="4">4 - Very Good</option>
															<option value="5">5 - Excellent</option>
														</select>
													</div>
													<div class="mb-2">
														<textarea name="reviewText" class="form-control form-control-sm" placeholder="Write a review (optional)" rows="3"></textarea>
													</div>
													<button type="submit" class="btn btn-sm btn-success">Submit Review</button>
												</form>
											{/if}
											
											{#if r.rating}
												<div class="rating-stars">
													{#each Array(5) as _, i}
														<i class="bi bi-star{i < Math.round(r.rating) ? '-fill' : ''} rating-star"></i>
													{/each}
													<span class="ms-2">{r.rating} / 5</span>
												</div>
											{/if}
											
											{#if r.status === 'late'}
												<a
													href={`/member/fee/${r.id}`}
													class="btn btn-sm btn-outline-danger"
												>
													<i class="bi bi-credit-card"></i> Pay
												</a>
											{/if}
										</div>
									</td>
								</tr>
							{/each}

							{#if rentals.length === 0}
								<tr>
									<td colspan="6" class="text-center py-5 text-muted">
										<i class="bi bi-inbox fs-1 d-block mb-2"></i>
										<p>No rentals found.</p>
									</td>
								</tr>
							{/if}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	#rentals-page {
		padding: 1rem;
	}

	.card {
		border: none;
		border-radius: 10px;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	}

	.card-header {
		background-color: #f8f9fa;
		border-bottom: 1px solid #dee2e6;
		border-radius: 10px 10px 0 0;
	}

	.table tr:hover {
		background-color: #f8f9fa;
	}

	.badge {
		font-size: 0.75rem;
		padding: 0.35rem 0.6rem;
	}

	.btn-sm {
		padding: 0.4rem 0.75rem;
		font-size: 0.875rem;
	}

	.rating-stars {
		color: #ffc107;
		font-size: 0.85rem;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}
</style>