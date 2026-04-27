<script>
	let { data } = $props();

	function formatDate(value) {
		if (!value) return '-';
		return new Date(value).toLocaleDateString();
	}
</script>

<div class="container py-5" role="main" aria-labelledby="dashboard-title">
	<div class="page-header mb-4 text-center">
		<h1 id="dashboard-title" class="page-title">
			<i class="bi bi-person-circle me-2" aria-hidden="true"></i>
			Member Dashboard
		</h1>
		<p class="page-subtitle">
			Welcome back, {data.user?.name ?? 'Member'}
		</p>
	</div>

	<div class="row g-4 mb-4">
		<div class="col-md-3">
			<div class="card h-100 shadow-sm text-center" role="region" aria-label="Books overview">
				<div class="card-body d-flex flex-column">
					<i class="bi bi-book fs-1 text-primary mb-2" aria-hidden="true"></i>
					<h5 class="card-title">Books</h5>
					<p class="card-text">Browse all available books in the catalogue.</p>

					<h2 class="my-3">{data.totalBooks}</h2>

					<div class="mt-auto">
						<a href="/catalogue" class="btn btn-primary" aria-label="Browse books">
							<i class="bi bi-book me-1" aria-hidden="true"></i>
							Browse Books
						</a>
					</div>
				</div>
			</div>
		</div>

		<div class="col-md-3">
			<div class="card h-100 shadow-sm text-center" role="region" aria-label="My rentals overview">
				<div class="card-body d-flex flex-column">
					<i class="bi bi-receipt fs-1 text-success mb-2" aria-hidden="true"></i>
					<h5 class="card-title">My Rentals</h5>
					<p class="card-text">View and manage your current rental records.</p>

					<h2 class="my-3">{data.totalRentals}</h2>

					<div class="mt-auto">
						<a href="/member/rentals?status=rented" class="btn btn-primary" aria-label="View my rentals">
							<i class="bi bi-receipt me-1" aria-hidden="true"></i>
							My Rentals
						</a>
					</div>
				</div>
			</div>
		</div>

		<div class="col-md-3">
			<div
				class="card h-100 shadow-sm text-center"
				role="region"
				aria-label="Active rentals overview"
			>
				<div class="card-body d-flex flex-column">
					<i class="bi bi-journal-check fs-1 text-info mb-2" aria-hidden="true"></i>
					<h5 class="card-title">Active Rentals</h5>
					<p class="card-text">Books you currently have rented.</p>

					<h2 class="my-3">{data.activeRentals}</h2>

					<div class="mt-auto">
						<a href="/member/rentals?status=returned" class="btn btn-primary" aria-label="View active rentals">
							<i class="bi bi-journal-check me-1" aria-hidden="true"></i>
							View Active
						</a>
					</div>
				</div>
			</div>
		</div>

		<div class="col-md-3">
			<div
				class="card h-100 shadow-sm text-center"
				role="region"
				aria-label="Late rentals overview"
			>
				<div class="card-body d-flex flex-column">
					<i class="bi bi-exclamation-triangle fs-1 text-warning mb-2" aria-hidden="true"></i>
					<h5 class="card-title">Late Rentals</h5>
					<p class="card-text">Books that are overdue for return.</p>

					<h2 class="my-3">{data.lateRentals}</h2>

					<div class="mt-auto">
						<a href="/member/rentals?status=late" class="btn btn-primary" aria-label="View late rentals">
							<i class="bi bi-exclamation-triangle me-1" aria-hidden="true"></i>
							View Late
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="card shadow-sm" role="region" aria-labelledby="recent-rentals-title">
		<div class="card-body">
			<h5 id="recent-rentals-title" class="card-title text-center mb-3">
				<i class="bi bi-clock-history me-2" aria-hidden="true"></i>
				Recent Rentals
			</h5>

			<table class="table table-hover text-center" aria-describedby="recent-rentals-title">
				<thead class="table-light">
					<tr>
						<th>ID</th>
						<th>Book</th>
						<th>Status</th>
						<th>Rental Date</th>
						<th>Return Date</th>
					</tr>
				</thead>

				<tbody>
					{#if data.recentRentals?.length}
						{#each data.recentRentals as rental}
							<tr>
								<td>{rental.id}</td>
								<td>{rental.book?.title ?? `Book #${rental.bookId}`}</td>
								<td>
									<span
										class={`badge ${
											rental.status === 'late'
												? 'bg-danger'
												: rental.status === 'returned'
													? 'bg-primary'
													: rental.status === 'cancelled'
														? 'bg-secondary'
														: 'bg-success'
										}`}
										aria-label={`Rental status: ${rental.status}`}
									>
										{rental.status}
									</span>
								</td>
								<td>{formatDate(rental.rentalDate)}</td>
								<td>{formatDate(rental.returnDate)}</td>
							</tr>
						{/each}
					{:else}
						<tr>
							<td colspan="5" class="text-muted">No rentals found</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>
