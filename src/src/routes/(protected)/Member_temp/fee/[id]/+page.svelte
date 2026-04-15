<script>
	let { data } = $props();
</script>

<div class="container py-5">
	<div class="card shadow-sm mx-auto" style="max-width: 500px;">
		<div class="card-body text-center">
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
		</div>
	</div>
</div>