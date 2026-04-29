<script>
	import { page } from '$app/stores';

	let { data } = $props();
	let rentals = $derived(data.rentals ?? []);
	let search = $state('');

	let filterStatus = $derived($page.url.searchParams.get('status'));

	let filteredRentals = $derived.by(() => {
		let results = rentals;

		if (filterStatus) {
			results = results.filter(r => r.status === filterStatus);
		}

		if (search.trim()) {
			const term = search.toLowerCase();
			results = results.filter(r =>
				r.book?.title.toLowerCase().includes(term) ||
				r.user?.name?.toLowerCase().includes(term) ||
				r.user?.email?.toLowerCase().includes(term) ||
				r.id.toString().includes(term)
			);
		}

		return results;
	});
</script>

<section id="rentals-page">
	<div class="container py-4">
		<h1 class="mb-4 text-center">All Member Rentals</h1>

		<div class="mb-4">
			<input
				type="text"
				class="form-control"
				bind:value={search}
				placeholder="Search by user, book, or ID..."
				aria-label="Search rentals"
			/>
		</div>

		<div class="filter-buttons mb-4 d-flex gap-2 justify-content-center">
			<a href="/admin/rentals" class="btn btn-sm btn-outline-secondary">All</a>
			<a href="/admin/rentals?status=rented" class="btn btn-sm btn-outline-success">Active</a>
			<a href="/admin/rentals?status=returned" class="btn btn-sm btn-outline-primary">Returned</a>
			<a href="/admin/rentals?status=late" class="btn btn-sm btn-outline-danger">Late</a>
		</div>

		<div class="card shadow-sm">
			<div class="card-body p-0">
				<div class="table-responsive">
					<table class="table table-hover align-middle mb-0">
						<thead class="table-light">
							<tr>
								<th class="ps-4">ID</th>
								<th>User</th>
								<th>Book</th>
								<th>Status</th>
								<th>Rental Date</th>
								<th>Return Date</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each filteredRentals as r (r.id)}
								<tr>
									<td class="ps-4">{r.id}</td>
									<td>{r.user?.name ?? r.user?.email}</td>
									<td>{r.book?.title}</td>
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
									<td>
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
									</td>
								</tr>
							{/each}

							{#if filteredRentals.length === 0}
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

	.filter-buttons a {
		text-decoration: none;
		border-radius: 6px;
		transition: all 0.2s;
	}

	.filter-buttons a:hover {
		transform: translateY(-1px);
	}
</style>