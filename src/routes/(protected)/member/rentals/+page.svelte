<script>
	import RentalForm from '$lib/components/RentalForm.svelte';

	let { data } = $props();

	let rentals = $derived(data.rentals ?? []);
	let books = $derived(data.books ?? []);
	let selectedBookId = $derived(data.selectedBookId ?? null);
	let currentUser = $derived(data.currentUser ?? null);

	let showForm = $state(false);
	let openedFromQuery = $state(false);

	$effect(() => {
		if (selectedBookId && !openedFromQuery) {
			showForm = true;
			openedFromQuery = true;
		}
	});

	function hideForm() {
		showForm = false;
	}
</script>

<section id="rentals-page">
	<div class="row">
		<div class="d-flex flex-column justify-content-between align-items-center">
			<h1 class="h3 mb-4">My Rentals</h1>

			{#if showForm}
				<div class="card shadow-sm mb-4">
					<div class="card-body">
						<RentalForm
							{books}
							{selectedBookId}
							{currentUser}
							onCancel={hideForm}
						/>
					</div>
				</div>
			{/if}

			<div class="row">
				<div class="col-12">
					<div class="card shadow-sm">
						<div class="card-body p-0">
							<table class="table table-bordered table-hover mb-0">
								<thead class="table-light">
									<tr>
										<th class="ps-3">ID</th>
										<th>Book</th>
										<th>Status</th>
										<th>Rental Date</th>
										<th>Return Date</th>
										<th class="pe-3 text-center">Actions</th>
									</tr>
								</thead>
								<tbody>
									{#each rentals as r (r.id)}
										<tr>
											<td class="ps-3">{r.id}</td>
											<td>{r.book?.title ?? `Book #${r.bookId}`}</td>
											<td>
												<span
													class={`badge ${
														r.status === 'late'
															? 'bg-danger'
															: r.status === 'returned'
																? 'bg-primary'
																: r.status === 'cancelled'
																	? 'bg-secondary'
																	: 'bg-success'
													}`}
												>
													{r.status}
												</span>
											</td>
											<td>{new Date(r.rentalDate).toLocaleDateString()}</td>
											<td>{new Date(r.returnDate).toLocaleDateString()}</td>
											<td class="pe-3 text-center">
												<div class="d-flex gap-2 justify-content-center">
													{#if r.status === 'rented'}
														<form method="POST" action="?/returnRental">
															<input type="hidden" name="rentalId" value={r.id} />
															<button
																type="submit"
																class="btn btn-sm btn-outline-success"
																aria-label="Return book"
															> Return Book
																<i class="bi bi-box-arrow-in-left"></i>
															</button>
														</form>
													{/if}
													
													{#if r.status === 'returned' && !r.hasReview}
														<form method="POST" action="?/LeaveReview">
															<input type="hidden" name="bookId" value={r.bookId} />
															<div class="mb-2">
																<label>Rating (1-5):</label>
																<select name="rating" class="form-select form-select-sm" required>
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
															aria-label="Pay late fee"
														>Pay Late
															<i class="bi bi-credit-card"></i>
														</a>
													{/if}
												</div>
											</td>
										</tr>
									{/each}

									{#if rentals.length === 0}
										<tr>
											<td colspan="6" class="text-center py-4">No rentals found.</td>
										</tr>
									{/if}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.card.shadow-sm {
		margin-bottom: 2rem;
		background-color: rgb(183, 182, 182);
	}

	.card-body {
		padding: 1.5rem;
	}

	#rentals-page {
		padding: 1rem;
	}
</style>