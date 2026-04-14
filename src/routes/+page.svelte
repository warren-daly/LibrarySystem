<div class="container py-5">
  <div class="page-header mb-4 text-center">
    <h1 class="page-title">Welcome to Online Library</h1>
    <p class="page-subtitle">Browse, rent, and manage your books online</p>
  </div>


  <div class="row g-3">
  <div class="col-md-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Register</h5>
          <p class="card-text">Register for an account.</p>
          <a href="/register" class="btn btn-primary">Register</a>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Browse Our Catalogue</h5>
          <p class="card-text">Explore our extensive collection of books across various genres.</p>
          <a href="/catalogue" class="btn btn-primary">View Catalogue</a>
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Manage Your Rentals</h5>
          <p class="card-text">View your rented books and manage your account.</p>
          <a href="/auth/login" class="btn btn-primary">My Rentals</a>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .page-header {
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #dee2e6;
  }

  .page-title {
    color: #2c3e50;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .page-subtitle {
    color: #6c757d;
    font-size: 1.1rem;
  }

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
