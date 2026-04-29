<script>
	let { data } = $props();

	const stats = [
		{
			label: 'Total Users',
			value: data.totalUsers,
			icon: 'bi-people',
			color: 'primary'
		},
		{
			label: 'Total Books',
			value: data.totalBooks,
			icon: 'bi-book',
			color: 'success'
		},
		{
			label: 'Active Rentals',
			value: data.rentedCount,
			icon: 'bi-hourglass-split',
			color: 'info'
		},
		{
			label: 'Late Rentals',
			value: data.lateCount,
			icon: 'bi-exclamation-circle',
			color: 'danger'
		},
		{
			label: 'Total Revenue',
			value: '€' + (data.totalRevenue / 100).toFixed(2),
			icon: 'bi-cash-coin',
			color: 'warning'
		},
		{
			label: 'This Month',
			value: '€' + (data.currentMonthRevenue / 100).toFixed(2),
			icon: 'bi-calendar-event',
			color: 'secondary'
		}
	];
</script>

<section id="reports-section">
	<div class="container-fluid py-4">
		<div class="header-section mb-5">
			<div>
				<h1 class="h2 fw-bold mb-1">
					<i class="bi bi-bar-chart me-3"></i>
					Reports & Analytics
				</h1>
				<p class="text-muted">Overview of your library performance</p>
			</div>
		</div>

		<div class="stats-grid">
			{#each stats as stat}
				<div class="stat-card stat-{stat.color}">
					<div class="stat-icon">
						<i class="bi {stat.icon}"></i>
					</div>
					<div class="stat-body">
						<p class="stat-label">{stat.label}</p>
						<h3 class="stat-value">{stat.value}</h3>
					</div>
					<div class="stat-accent"></div>
				</div>
			{/each}
		</div>

		<div class="row mt-5 g-4">
			<div class="col-lg-8">
				<div class="card detailed-card">
					<div class="card-header-custom">
						<div>
							<h5 class="mb-0">
								<i class="bi bi-graph-up me-2"></i>
								Rental Distribution
							</h5>
							<small class="text-muted">Breakdown by status</small>
						</div>
					</div>
					<div class="card-body">
						<div class="distribution-grid">
							<div class="dist-item">
								<div class="dist-icon active">
									<i class="bi bi-hourglass-split"></i>
								</div>
								<div class="dist-info">
									<p class="dist-label">Active</p>
									<h4 class="dist-value">{data.rentedCount}</h4>
									<small class="text-muted">{data.totalRentals > 0 ? ((data.rentedCount / data.totalRentals) * 100).toFixed(1) : 0}%</small>
								</div>
							</div>

							<div class="dist-item">
								<div class="dist-icon returned">
									<i class="bi bi-check-circle"></i>
								</div>
								<div class="dist-info">
									<p class="dist-label">Returned</p>
									<h4 class="dist-value">{data.returnedCount}</h4>
									<small class="text-muted">{data.totalRentals > 0 ? ((data.returnedCount / data.totalRentals) * 100).toFixed(1) : 0}%</small>
								</div>
							</div>

							<div class="dist-item">
								<div class="dist-icon late">
									<i class="bi bi-exclamation-triangle"></i>
								</div>
								<div class="dist-info">
									<p class="dist-label">Late</p>
									<h4 class="dist-value">{data.lateCount}</h4>
									<small class="text-muted">{data.totalRentals > 0 ? ((data.lateCount / data.totalRentals) * 100).toFixed(1) : 0}%</small>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="col-lg-4">
				<div class="card detailed-card">
					<div class="card-header-custom">
						<h5 class="mb-0">
							<i class="bi bi-lightning me-2"></i>
							Key Metrics
						</h5>
					</div>
					<div class="card-body">
						<div class="metric-item">
							<span class="metric-label">Books Per User</span>
							<span class="metric-value">{data.totalBooks > 0 && data.totalUsers > 0 ? (data.totalBooks / data.totalUsers).toFixed(1) : 0}</span>
						</div>
						<div class="metric-item">
							<span class="metric-label">Rentals Per User</span>
							<span class="metric-value">{data.totalUsers > 0 ? (data.totalRentals / data.totalUsers).toFixed(1) : 0}</span>
						</div>
						<div class="metric-item">
							<span class="metric-label">Late Return Rate</span>
							<span class="metric-value">{data.totalRentals > 0 ? ((data.lateCount / data.totalRentals) * 100).toFixed(1) : 0}%</span>
						</div>
						<div class="metric-item">
							<span class="metric-label">Total Orders</span>
							<span class="metric-value">{data.totalOrders}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="row mt-4 g-4">
			<div class="col-lg-6">
				<div class="card detailed-card">
					<div class="card-header-custom">
						<h5 class="mb-0">
							<i class="bi bi-people-fill me-2"></i>
							Recent Members
						</h5>
					</div>
					<div class="card-body">
						{#if data.recentMembers.length > 0}
							<div class="members-list">
								{#each data.recentMembers as member}
									<div class="member-item">
										<div class="member-avatar">{member.name?.charAt(0) || member.email?.charAt(0)}</div>
										<div class="member-info">
											<p class="member-name">{member.name || 'No name'}</p>
											<small class="text-muted">{member.email}</small>
										</div>
									</div>
								{/each}
							</div>
						{:else}
							<p class="text-muted text-center py-4">No members yet</p>
						{/if}
					</div>
				</div>
			</div>

			<div class="col-lg-6">
				<div class="card detailed-card">
					<div class="card-header-custom">
						<h5 class="mb-0">
							<i class="bi bi-wallet2 me-2"></i>
							Revenue Summary
						</h5>
					</div>
					<div class="card-body">
						<div class="revenue-item">
							<div class="revenue-label">
								<span>Total Revenue</span>
								<small class="text-muted">All time</small>
							</div>
							<div class="revenue-value">€{(data.totalRevenue / 100).toFixed(2)}</div>
						</div>
						<div class="revenue-item">
							<div class="revenue-label">
								<span>This Month</span>
								<small class="text-muted">Current period</small>
							</div>
							<div class="revenue-value">€{(data.currentMonthRevenue / 100).toFixed(2)}</div>
						</div>
						<div class="revenue-item">
							<div class="revenue-label">
								<span>Average Order</span>
								<small class="text-muted">Per transaction</small>
							</div>
							<div class="revenue-value">€{data.totalOrders > 0 ? (data.totalRevenue / data.totalOrders / 100).toFixed(2) : '0.00'}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	#reports-section {
		background-color: #f8f9fa;
		min-height: calc(100vh - 80px);
		padding-top: 2rem;
	}

	.header-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1.5rem;
		margin-bottom: 3rem;
	}

	.stat-card {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		display: flex;
		align-items: center;
		gap: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		border-left: 4px solid;
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.stat-card:hover {
		transform: translateY(-6px);
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
	}

	.stat-primary { border-left-color: #0d6efd; }
	.stat-success { border-left-color: #198754; }
	.stat-info { border-left-color: #0dcaf0; }
	.stat-danger { border-left-color: #dc3545; }
	.stat-warning { border-left-color: #ffc107; }
	.stat-secondary { border-left-color: #6c757d; }

	.stat-icon {
		width: 64px;
		height: 64px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.75rem;
		flex-shrink: 0;
		background: linear-gradient(135deg, rgba(13, 110, 253, 0.1), rgba(13, 110, 253, 0.05));
	}

	.stat-primary .stat-icon { background: linear-gradient(135deg, rgba(13, 110, 253, 0.15), rgba(13, 110, 253, 0.05)); color: #0d6efd; }
	.stat-success .stat-icon { background: linear-gradient(135deg, rgba(25, 135, 84, 0.15), rgba(25, 135, 84, 0.05)); color: #198754; }
	.stat-info .stat-icon { background: linear-gradient(135deg, rgba(13, 202, 240, 0.15), rgba(13, 202, 240, 0.05)); color: #0dcaf0; }
	.stat-danger .stat-icon { background: linear-gradient(135deg, rgba(220, 53, 69, 0.15), rgba(220, 53, 69, 0.05)); color: #dc3545; }
	.stat-warning .stat-icon { background: linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 193, 7, 0.05)); color: #ffc107; }
	.stat-secondary .stat-icon { background: linear-gradient(135deg, rgba(108, 117, 125, 0.15), rgba(108, 117, 125, 0.05)); color: #6c757d; }

	.stat-body {
		flex: 1;
	}

	.stat-label {
		font-size: 0.85rem;
		color: #6c757d;
		margin-bottom: 0.5rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.stat-value {
		font-size: 1.75rem;
		font-weight: 700;
		margin: 0;
		color: #212529;
	}

	.detailed-card {
		background: white;
		border: none;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
		transition: box-shadow 0.3s ease;
	}

	.detailed-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
	}

	.card-header-custom {
		padding: 1.5rem;
		border-bottom: 1px solid #e9ecef;
		background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
		border-radius: 12px 12px 0 0;
	}

	.card-header-custom h5 {
		color: #212529;
		margin: 0;
	}

	.distribution-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1.5rem;
	}

	.dist-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: #f8f9fa;
		border-radius: 10px;
		transition: all 0.2s;
	}

	.dist-item:hover {
		background: #f0f1f3;
	}

	.dist-icon {
		width: 50px;
		height: 50px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 1.25rem;
		flex-shrink: 0;
	}

	.dist-icon.active { background: #0dcaf0; }
	.dist-icon.returned { background: #198754; }
	.dist-icon.late { background: #dc3545; }

	.dist-info {
		flex: 1;
	}

	.dist-label {
		font-size: 0.85rem;
		color: #6c757d;
		margin-bottom: 0.25rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.dist-value {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0;
	}

	.metric-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 0;
		border-bottom: 1px solid #e9ecef;
		gap: 1rem;
	}

	.metric-item:last-child {
		border-bottom: none;
	}

	.metric-label {
		color: #6c757d;
		font-size: 0.95rem;
	}

	.metric-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: #0d6efd;
	}

	.members-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.member-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: #f8f9fa;
		border-radius: 10px;
		transition: all 0.2s;
	}

	.member-item:hover {
		background: #e9ecef;
	}

	.member-avatar {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: linear-gradient(135deg, #0d6efd, #0dcaf0);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		flex-shrink: 0;
	}

	.member-info {
		flex: 1;
	}

	.member-name {
		font-weight: 600;
		margin-bottom: 0.25rem;
	}

	.revenue-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
		border-radius: 10px;
		margin-bottom: 1rem;
		border-left: 4px solid #198754;
	}

	.revenue-item:last-child {
		margin-bottom: 0;
	}

	.revenue-label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.revenue-label span {
		font-weight: 600;
		color: #212529;
	}

	.revenue-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: #198754;
	}
</style>