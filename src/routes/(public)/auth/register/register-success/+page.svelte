<script>
	import { page } from '$app/stores';

	let membershipNumber = $derived($page.url.searchParams.get('member') || 'M0000');
</script>

<div class="container d-flex justify-content-center align-items-start py-5">
	<div class="card shadow-sm w-100 text-center" style="max-width: 480px;">
		<div class="card-body p-4">
			<div class="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle bg-success-subtle text-success" style="width: 60px; height: 60px;">
				<i class="bi bi-check-lg fs-2"></i>
			</div>

			<h1 class="h3 mb-2">Account Registered</h1>

			<p class="text-muted">
				Your Online Library account has been created successfully.
			</p>

			<div class="border rounded bg-light p-3 my-4">
				<div class="text-muted small">Your membership number</div>
				<div class="fs-3 fw-bold">{membershipNumber}</div>
			</div>

			<p class="text-muted">
				Please check your email for your registration confirmation.
			</p>

			<a href="/" class="btn btn-primary w-100">Return to Home</a>
		</div>
	</div>
</div>