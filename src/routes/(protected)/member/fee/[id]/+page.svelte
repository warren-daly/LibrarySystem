<script>
	let { data } = $props();
</script>

<div class="container py-1">
	<div class="card shadow-sm mx-auto" style="max-width: 500px;">
		<div class="card-body text-center">
			{#if data.paid}
				<div class="success-icon mb-3">
					<i class="bi bi-check-circle text-success" style="font-size: 3rem;"></i>
				</div>
				<h2 class="mb-3">Payment Successful!</h2>
				<p>
					<strong>Book:</strong>
					{data.rental.book?.title ?? `Book #${data.rental.bookId}`}
				</p>
				<p class="fs-5">
					<strong>Amount paid:</strong> €{data.feeEuro}
				</p>
				<p class="text-muted mb-4">Your late fee has been paid and the rental is marked as returned.</p>
				<a href="/member/rentals" class="btn btn-primary">Back to Rentals</a>
			{:else}
				<h2 class="mb-3">Late Fee</h2>

				<p>
					<strong>Book:</strong>
					{data.rental.book?.title ?? `Book #${data.rental.bookId}`}
				</p>

				<p class="fs-4">
					<strong>Amount due:</strong> €{data.feeEuro}
				</p>

				<form method="POST" action="?/payLateFee">
					<button class="btn btn-danger px-4">
						<i class="bi bi-credit-card me-2"></i>
						Pay €5
					</button>
				</form>
			{/if}
		</div>
	</div>
</div>