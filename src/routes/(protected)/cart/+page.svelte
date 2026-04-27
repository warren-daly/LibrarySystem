<script>
	import { enhance } from '$app/forms';

	let { data } = $props();

	const euro = new Intl.NumberFormat('en-IE', {
		style: 'currency',
		currency: 'EUR'
	});

	const rentedItems = $derived(data.items.filter(item => item.type === 'rent'));
	const boughtItems = $derived(data.items.filter(item => item.type === 'buy'));

	const rentedTotal = $derived(rentedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0));
	const boughtTotal = $derived(boughtItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0));
	const grandTotal = $derived(rentedTotal + boughtTotal);

	function handleQuantityChange(e, cartItemId) {
		const quantity = parseInt(e.target.value);
		if (quantity > 0) {
			const form = e.target.closest('form');
			form?.submit();
		}
	}
</script>

<div class="page-wrapper">
	<div class="container py-5">
		<div class="page-header mb-5">
			<h1 class="h2 fw-bold mb-1">Your Cart</h1>
			<p class="text-muted">Review your items before checkout</p>
		</div>

		{#if data.items.length === 0}
			<div class="empty-state card border-0 shadow-sm">
				<div class="card-body text-center py-5">
					<i class="bi bi-bag fs-1 text-muted d-block mb-3"></i>
					<h5>Your cart is empty</h5>
					<p class="text-muted mb-4">Add some books to get started</p>
					<a href="/catalogue" class="btn btn-primary">
						<i class="bi bi-shop me-2"></i>
						Continue Shopping
					</a>
				</div>
			</div>
		{:else}
			<div class="cart-wrapper">
				{#if rentedItems.length > 0}
					<div class="cart-section">
						<div class="section-header">
							<h5 class="mb-0"><i class="bi bi-book me-2 text-info"></i>Rentals</h5>
						</div>
						<div class="table-responsive">
							<table class="table table-hover align-middle mb-0">
								<thead class="table-light">
									<tr>
										<th class="ps-4">Book</th>
										<th class="text-end">Price</th>
										<th class="text-center">Qty</th>
										<th class="text-end">Total</th>
										<th class="text-center pe-4">Action</th>
									</tr>
								</thead>
								<tbody>
									{#each rentedItems as item}
										<tr>
											<td class="ps-4 fw-500">{item.title}</td>
											<td class="text-end">{euro.format(item.unitPrice / 100)}</td>
											<td class="text-center">
												<form method="post" action="?/updateQuantity" use:enhance>
													<input type="hidden" name="cartItemId" value={item.id} />
													<input 
														type="number" 
														name="quantity" 
														min="1" 
														value={item.quantity}
														class="qty-input"
														onchange={(e) => handleQuantityChange(e, item.id)}
													/>
												</form>
											</td>
											<td class="text-end fw-bold">{euro.format(item.unitPrice * item.quantity / 100)}</td>
											<td class="text-center pe-4">
												<form method="post" action="?/removeItem" use:enhance>
													<input type="hidden" name="cartItemId" value={item.id} />
													<button class="btn btn-sm btn-outline-danger">
														<i class="bi bi-trash"></i>
													</button>
												</form>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
						<div class="section-footer">
							<div class="d-flex justify-content-end gap-3">
								<span class="text-muted">Rental Subtotal:</span>
								<strong>{euro.format(rentedTotal / 100)}</strong>
							</div>
						</div>
					</div>
				{/if}

				{#if boughtItems.length > 0}
					<div class="cart-section">
						<div class="section-header">
							<h5 class="mb-0"><i class="bi bi-bag-check me-2 text-success"></i>Purchases</h5>
						</div>
						<div class="table-responsive">
							<table class="table table-hover align-middle mb-0">
								<thead class="table-light">
									<tr>
										<th class="ps-4">Book</th>
										<th class="text-end">Price</th>
										<th class="text-center">Qty</th>
										<th class="text-end">Total</th>
										<th class="text-center pe-4">Action</th>
									</tr>
								</thead>
								<tbody>
									{#each boughtItems as item}
										<tr>
											<td class="ps-4 fw-500">{item.title}</td>
											<td class="text-end">{euro.format(item.unitPrice / 100)}</td>
											<td class="text-center">
												<form method="post" action="?/updateQuantity" use:enhance>
													<input type="hidden" name="cartItemId" value={item.id} />
													<input 
														type="number" 
														name="quantity" 
														min="1" 
														value={item.quantity}
														class="qty-input"
														onchange={(e) => handleQuantityChange(e, item.id)}
													/>
												</form>
											</td>
											<td class="text-end fw-bold">{euro.format(item.unitPrice * item.quantity / 100)}</td>
											<td class="text-center pe-4">
												<form method="post" action="?/removeItem" use:enhance>
													<input type="hidden" name="cartItemId" value={item.id} />
													<button class="btn btn-sm btn-outline-danger">
														<i class="bi bi-trash"></i>
													</button>
												</form>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
						<div class="section-footer">
							<div class="d-flex justify-content-end gap-3">
								<span class="text-muted">Purchase Subtotal:</span>
								<strong>{euro.format(boughtTotal / 100)}</strong>
							</div>
						</div>
					</div>
				{/if}

				<div class="checkout-card">
					<div class="d-flex justify-content-between align-items-center mb-4">
						<span class="fw-semibold fs-5">Grand Total</span>
						<span class="fs-3 fw-bold text-primary">{euro.format(grandTotal / 100)}</span>
					</div>
					<form method="post" action="?/checkout" use:enhance class="d-flex gap-2">
						<button class="btn btn-primary flex-grow-1 fw-500">
							<i class="bi bi-credit-card me-2"></i>
							Proceed to Checkout
						</button>
						<a href="/catalogue" class="btn btn-outline-secondary">
							<i class="bi bi-arrow-left me-2"></i>
							Continue Shopping
						</a>
					</form>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.page-wrapper {
		min-height: calc(100vh - 80px);
		padding: 2rem 0;
    }

	.page-header {
		text-align: center;
	}

	.cart-wrapper {
		max-width: 900px;
		margin: 0 auto;
	}

	.cart-section {
		background: white;
		border-radius: 10px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		margin-bottom: 1.5rem;
		overflow: hidden;
	}

	.section-header {
		background-color: #f8f9fa;
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid #e9ecef;
		font-weight: 600;
	}

	.section-footer {
		background-color: #f8f9fa;
		padding: 1rem 1.5rem;
		border-top: 1px solid #e9ecef;
	}

	.table {
		margin: 0;
	}

	.table tbody tr:hover {
		background-color: #f9fafb !important;
	}

	.qty-input {
		width: 70px;
		padding: 0.45rem 0.5rem;
		border: 1px solid #ddd;
		border-radius: 6px;
		text-align: center;
		font-weight: 500;
		transition: border-color 0.2s;
	}

	.qty-input:focus {
		border-color: #0d6efd;
		outline: none;
		box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.1);
	}

	.checkout-card {
		background: white;
		border-radius: 10px;
		padding: 2rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		border: 2px solid #e9ecef;
	}

	.btn {
		border-radius: 8px;
		padding: 0.6rem 1.5rem;
		font-weight: 500;
		transition: all 0.3s ease;
	}

	.btn-primary {
		box-shadow: 0 2px 6px rgba(13, 110, 253, 0.2);
	}

	.btn-primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
	}

	.btn-outline-secondary:hover {
		transform: translateY(-2px);
	}

	.empty-state {
		max-width: 500px;
		margin: 3rem auto;
	}
</style>