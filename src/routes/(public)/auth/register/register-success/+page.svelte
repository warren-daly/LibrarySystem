<script>
	import { page } from '$app/stores';

	let membershipNumber = $derived(
		$page.url.searchParams.get('member') || 'M0000'
	);
</script>

<header>
<h1>Account Registered</h1>
</header>

<div class="card">
	<p>Your account has been created successfully.</p>

	<p>
		Your membership number is
		<strong>{membershipNumber}</strong>.
	</p>

	<p>Please check your email for confirmation.</p>

	<a href="/" class="btn btn-primary">Return to Home</a>
</div>

<style>
	.card {
		padding: 20px;
		margin: 20px auto;
		max-width: 400px;
		border-radius: 8px;
		background-color: #f9f9f9;
		border: 1px solid #ccc;
		text-align: center;
	}
</style>