<script>
  let { data } = $props();
  const { user, rentals, purchases } = data;

  const euro = new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR'
  });

  function getDaysUntilDue(returnDate) {
    if (!returnDate) return null;
    const today = new Date();
    const due = new Date(returnDate);
    const daysLeft = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return daysLeft;
  }

  function getStatusColor(daysLeft) {
    if (daysLeft === null) return 'secondary';
    if (daysLeft < 0) return 'danger';
    if (daysLeft < 3) return 'warning';
    return 'success';
  }

  function isOverdue(returnDate) {
    if (!returnDate) return false;
    const today = new Date();
    const due = new Date(returnDate);
    return due < today;
  }
</script>

<div class="container mt-5">
  <h1 class="mb-4">Welcome, {user.name}!</h1>

  <!-- Rentals Section -->
  <div class="mb-5">
    <h2>My Rentals</h2>
    {#if rentals.length === 0}
      <p class="text-muted">No active rentals.</p>
    {:else}
      <div class="row">
        {#each rentals as rental}
          <div class="col-md-6 col-lg-4 mb-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Order #{rental.id}</h5>
                <p class="card-text">
                  <strong>Status:</strong> <span class="badge bg-info">Rented</span>
                </p>
                <p class="card-text">
                  <strong>Rental Date:</strong> {new Date(rental.rentalDate).toLocaleDateString()}
                </p>
                <p class="card-text">
                  <strong>Due Date:</strong> {new Date(rental.returnDate).toLocaleDateString()}
                </p>
                <p class="card-text">
                  <strong>Days Left:</strong>
                  <span class="badge bg-{getStatusColor(getDaysUntilDue(rental.returnDate))}">
                    {getDaysUntilDue(rental.returnDate)} days
                  </span>
                </p>
                {#if isOverdue(rental.returnDate)}
                  <div class="alert alert-danger" role="alert">
                    ⚠️ This rental is overdue! Please return immediately.
                  </div>
                {/if}
                <hr />
                <h6>Books:</h6>
                <ul class="list-unstyled">
                  {#each rental.items as item}
                    <li class="d-flex justify-content-between align-items-center mb-2">
                      <span>{item.title} (Qty: {item.quantity})</span>
                      <form method="post" action="?/returnBook" style="display: inline;">
                        <input type="hidden" name="orderId" value={rental.id} />
                        <input type="hidden" name="orderItemId" value={item.id} />
                        <button type="submit" class="btn btn-sm btn-outline-warning">
                          <i class="bi bi-arrow-counterclockwise"></i> Return
                        </button>
                      </form>
                    </li>
                  {/each}
                </ul>
                <p class="card-text mt-3">
                  <strong>Total:</strong> €0.00 (Free Rental)
                </p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Purchases Section -->
  <div class="mb-5">
    <h2>My Purchases</h2>
    {#if purchases.length === 0}
      <p class="text-muted">No purchases yet.</p>
    {:else}
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Books</th>
            <th>Total</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {#each purchases as purchase}
            <tr>
              <td>#{purchase.id}</td>
              <td>
                {#each purchase.items as item}
                  <div>{item.title} (Qty: {item.quantity}) - {euro.format(item.unitPrice * item.quantity / 100)}</div>
                {/each}
              </td>
              <td><strong>{euro.format(purchase.total / 100)}</strong></td>
              <td>{new Date(purchase.createdAt).toLocaleDateString()}</td>
              <td>
                <span class="badge bg-success">Purchased</span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>

  <hr />
  <a href="/catalogue" class="btn btn-primary">Continue Shopping</a>
</div>