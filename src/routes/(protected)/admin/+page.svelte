<script>
	let { data } = $props();
</script>

<div class="container py-5" role="main" aria-labelledby="dashboard-title">
	<div class="page-header mb-4 text-center">
		<h1 id="dashboard-title" class="page-title">
			<i class="bi bi-speedometer2 me-2" aria-hidden="true"></i>
			Admin Dashboard
		</h1>
		<p class="page-subtitle">Manage books, users, and rentals in your library system</p>
	</div>

	<div class="row g-4 mb-4">
		<div class="col-md-3">
			<div class="card h-100 shadow-sm text-center" role="region" aria-label="Books overview">
				<div class="card-body d-flex flex-column">
					<i class="bi bi-book fs-1 text-primary mb-2" aria-hidden="true"></i>
					<h5 class="card-title">Books</h5>
					<p class="card-text">Add, edit, and delete books in the system.</p>

					<h2 class="my-3">{data.totalBooks}</h2>

					<div class="mt-auto">
						<a href="/admin/books" class="btn btn-primary" aria-label="Manage books">
							<i class="bi bi-book me-1" aria-hidden="true"></i>
							Manage Books
						</a>
					</div>
				</div>
			</div>
		</div>

		<div class="col-md-3">
			<div class="card h-100 shadow-sm text-center" role="region" aria-label="Members overview">
				<div class="card-body d-flex flex-column">
					<i class="bi bi-people fs-1 text-success mb-2" aria-hidden="true"></i>
					<h5 class="card-title">Members</h5>
					<p class="card-text">View and manage registered members.</p>

					<h2 class="my-3">{data.totalUsers}</h2>

					<div class="mt-auto">
						<a href="/admin/members" class="btn btn-primary" aria-label="Manage Members">
							<i class="bi bi-people me-1" aria-hidden="true"></i>
							Manage Members
						</a>
					</div>
				</div>
			</div>
		</div>

		<div class="col-md-3">
			<div class="card h-100 shadow-sm text-center" role="region" aria-label="Rentals overview">
				<div class="card-body d-flex flex-column">
					<i class="bi bi-receipt fs-1 text-warning mb-2" aria-hidden="true"></i>
					<h5 class="card-title">Rentals</h5>
					<p class="card-text">Check and manage current rental records.</p>

					<h2 class="my-3">{data.rentedCount ?? 0}</h2>

					<div class="mt-auto">
						<a href="/admin/rentals" class="btn btn-primary" aria-label="Manage rentals">
							<i class="bi bi-receipt me-1" aria-hidden="true"></i>
							Manage Rentals
						</a>
					</div>
				</div>
			</div>
		</div>

		<div class="col-md-3">
				<div class="card h-100 shadow-sm text-center" role="region" aria-label="Members overview">
					<div class="card-body d-flex flex-column">
						<i class="bi bi-file-earmark-text fs-1 text-success mb-2" aria-hidden="true"></i>
						<h5 class="card-title">Reports</h5>
						<p class="card-text">View and manage reports and statistics.</p>

						<h2 class="my-3"></h2>

						<div class="mt-auto">
							<a href="/admin/reports" class="btn btn-primary" aria-label="View reports">
								<i class="bi bi-people me-1" aria-hidden="true"></i>
								View Reports
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>

	<div class="card shadow-sm" role="region" aria-labelledby="recent-users-title">
		<div class="card-body">
			<h5 id="recent-users-title" class="card-title text-center mb-3">
				<i class="bi bi-people me-2" aria-hidden="true"></i>
				Recent Members
			</h5>

			<table class="table table-hover text-center" aria-describedby="recent-users-title">
				<thead class="table-light">
					<tr>
						<th>Name</th>
						<th>Email</th>
						<th>Role</th>
					</tr>
				</thead>

				<tbody>
					{#if data.recentUsers?.length}
						{#each data.recentUsers as user}
							<tr>
								<td>{user.name}</td>
								<td>{user.email}</td>
								<td>
									<span class={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-secondary'}`}>
										{user.role}
									</span>
								</td>
							</tr>
						{/each}
					{:else}
						<tr>
							<td colspan="3" class="text-muted">No users found</td>
						</tr>
					{/if}
				</tbody>
			</table>
		</div>
	</div>
</div>