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
															>
																<i class="bi bi-box-arrow-in-left"></i>
															</button>
														</form>
													{/if}

													{#if r.status === 'late'}
														<a
															href={`/member/late-fee/${r.id}`}
															class="btn btn-sm btn-outline-danger"
															aria-label="Pay late fee"
														>
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