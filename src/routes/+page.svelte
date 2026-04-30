<div class="container py-1">
	<div class="page-header">
		<h1 class="page-title">Welcome to Online Library</h1>
		<p class="page-subtitle">Browse, rent, and manage your books online</p>
	</div>

	<div class="row g-3">
		<div class="col-md-4">
			<div class="card h-100 shadow-sm">
				<div class="card-body">
					<h5 class="card-title">Register</h5>
					<p class="card-text">Register for an account.</p>
					<a href="/auth/register" class="btn btn-primary">Register</a>
				</div>
			</div>
		</div>

		<div class="col-md-4">
			<div class="card h-100 shadow-sm">
				<div class="card-body">
					<h5 class="card-title">Browse Our Catalogue</h5>
					<p class="card-text">Explore our collection of books across different genres.</p>
					<a href="/catalogue" class="btn btn-primary">View Catalogue</a>
				</div>
			</div>
		</div>

		<div class="col-md-4">
			<div class="card h-100 shadow-sm">
				<div class="card-body">
					<h5 class="card-title">Manage Your Rentals</h5>
					<p class="card-text">View your rented books and manage your account.</p>
					<a href="/member/rentals" class="btn btn-primary">My Rentals</a>
				</div>
			</div>
		</div>
	</div>
</div>
<style>

  .card {
    border: none;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }

  .card:hover {
    transform: translateY(1px);
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  }
  

</style>
