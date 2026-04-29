<script>
	let { data } = $props();
</script>

<section id="reports-section">
	<div class="container-fluid py-4">
		<div class="header-section mb-5">
			<h1 class="h2 fw-bold mb-1">
				<i class="bi bi-bar-chart me-3"></i>
				Reports & Analytics
			</h1>
			<p class="text-muted">Overview of your library performance</p>
		</div>

		<div class="row g-4 mb-4">
			<div class="col-md-8">
				<div class="card detailed-card">
					<div class="card-header-custom">
						<h5 class="mb-0">
							<i class="bi bi-graph-up me-2"></i>
							Quick Stats
						</h5>
					</div>
					<div class="card-body">
						<div class="distribution-grid">
							<div class="dist-item">
								<div class="dist-icon active">
									<i class="bi bi-people"></i>
								</div>
								<div class="dist-info">
									<p class="dist-label">Total Users</p>
									<h4 class="dist-value">{data.totalUsers}</h4>
								</div>
							</div>
							<div class="dist-item">
								<div class="dist-icon" style="background: #198754;">
									<i class="bi bi-currency-euro"></i>
								</div>
								<div class="dist-info">
									<p class="dist-label">This Month</p>
									<h4 class="dist-value">€{(data.currentMonthRevenue / 100).toFixed(2)}</h4>
								</div>
							</div>
							<div class="dist-item">
								<div class="dist-icon" style="background: #0dcaf0;">
									<i class="bi bi-wallet2"></i>
								</div>
								<div class="dist-info">
									<p class="dist-label">Total Revenue</p>
									<h4 class="dist-value">€{(data.totalRevenue / 100).toFixed(2)}</h4>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="card detailed-card">
					<div class="card-header-custom">
						<h5 class="mb-0">
							<i class="bi bi-hourglass-split me-2"></i>
							Rental Distribution
						</h5>
					</div>
					<div class="card-body">
						<div class="distribution-grid">
							<div class="dist-item">
								<div class="dist-icon active">
									<i class="bi bi-stack"></i>
								</div>
								<div class="dist-info">
									<p class="dist-label">Total</p>
									<h4 class="dist-value">{data.totalRentals}</h4>
								</div>
							</div>
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
									<p class="dist-label">Returned Late</p>
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
        <div class="row g-4 mb-4">
    	<div class="col-lg-12">
    		<div class="card detailed-card">
    			<div class="card-header-custom">
    				<h5 class="mb-0">
    					<i class="bi bi-star me-2"></i>
    					Top Books
    				</h5>
    			</div>
    			<div class="card-body">
    				<div class="top-books-grid">
    					{#each data.topBooks as book, index}
    						<div class="book-item">
    							<div class="book-rank">{index + 1}</div>
    							<div class="book-info">
    								<p class="book-title">{book.title}</p>
    								<small class="text-muted">{book.author}</small>
    							</div>
    							<div class="book-stats">
    								<div class="stat">
    									<span class="stat-label">Rentals</span>
    									<span class="stat-value">{book.rentalCount}</span>
    								</div>
    								<div class="stat">
    									<span class="stat-label">Rating</span>
    									<span class="stat-value">{book.averageRating?.toFixed(1) || 'N/A'}</span>
    								</div>
    							</div>
    						</div>
    					{/each}
    				</div>
    				{#if !data.topBooks || data.topBooks.length === 0}
    					<p class="text-muted text-center py-4">No book data yet</p>
    				{/if}
    			</div>
    		</div>
    	</div>
    </div>
		<div class="row g-4 mb-4">
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
							<i class="bi bi-receipt me-2"></i>
							Recent Purchases
						</h5>
					</div>
					<div class="card-body overflow-auto" style="max-height: 400px;">
						<div class="transactions-list">
							{#each data.recentOrders as order}
								<div class="transaction-item">
									<div class="transaction-left">
										<span class="transaction-user">{order.user?.name ?? 'Unknown'}</span>
										<small class="text-muted">{new Date(order.createdAt).toLocaleDateString('en-IE')}</small>
									</div>
									<span class="transaction-amount">€{(order.total / 100).toFixed(2)}</span>
								</div>
							{/each}
							{#if data.recentOrders.length === 0}
								<p class="text-muted text-center py-4">No purchases yet</p>
							{/if}
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
	}

	.header-section {
		padding: 0 1rem;
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
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 1rem;
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
		font-size: 0.8rem;
		color: #6c757d;
		margin-bottom: 0.25rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.dist-value {
		font-size: 1.25rem;
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
		gap: 0.75rem;
	}

	.member-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
		background: #f8f9fa;
		border-radius: 8px;
		transition: all 0.2s;
	}

	.member-item:hover {
		background: #e9ecef;
	}

	.member-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: linear-gradient(135deg, #0d6efd, #0dcaf0);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		flex-shrink: 0;
		font-size: 0.9rem;
	}

	.member-info {
		flex: 1;
	}

	.member-name {
		font-weight: 600;
		margin-bottom: 0.25rem;
		font-size: 0.95rem;
	}

	.transactions-list {
		display: flex;
		flex-direction: column;
	}

	.transaction-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
		border-bottom: 1px solid #f0f1f3;
		transition: background-color 0.2s;
	}

	.transaction-item:hover {
		background-color: #f8f9fa;
	}

	.transaction-item:last-child {
		border-bottom: none;
	}

	.transaction-left {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.transaction-user {
		font-weight: 600;
		color: #212529;
		font-size: 0.95rem;
	}

	.transaction-amount {
		font-weight: 700;
		color: #198754;
		font-size: 1rem;
	}

    .top-books-grid {
    	display: grid;
    	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    	gap: 1.5rem;
    }

    .book-item {
    	display: flex;
    	align-items: center;
    	gap: 1rem;
    	padding: 1.25rem;
    	background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    	border-radius: 10px;
    	border-left: 4px solid #0d6efd;
    	transition: all 0.2s;
    }

    .book-item:hover {
    	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    	transform: translateY(-2px);
    }

    .book-rank {
    	width: 40px;
    	height: 40px;
    	border-radius: 50%;
    	background: #0d6efd;
    	color: white;
    	display: flex;
    	align-items: center;
    	justify-content: center;
    	font-weight: 700;
    	flex-shrink: 0;
    	font-size: 1.1rem;
    }

    .book-info {
    	flex: 1;
    }

    .book-title {
    	font-weight: 600;
    	margin-bottom: 0.25rem;
    	color: #212529;
    	font-size: 0.95rem;
    }

    .book-stats {
    	display: flex;
    	gap: 1.5rem;
    }

    .stat {
    	display: flex;
    	flex-direction: column;
    	align-items: center;
    	text-align: center;
    }

    .stat-label {
    	font-size: 0.75rem;
    	color: #6c757d;
    	text-transform: uppercase;
    	letter-spacing: 0.5px;
    	margin-bottom: 0.25rem;
    }

    .stat-value {
    	font-size: 1.25rem;
    	font-weight: 700;
    	color: #0d6efd;
    }
</style>