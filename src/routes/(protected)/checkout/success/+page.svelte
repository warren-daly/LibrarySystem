<script>
  import { page } from '$app/stores';
  let { data } = $props();
  const { order } = data;

  const euro = new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR'
  });

    setTimeout(() => {
    window.location.href = '/member';
  }, 3000);
</script>

<div class="container mt-5">
  <div class="alert alert-success" role="alert">
    <h4 class="alert-heading">✅ Payment Successful!</h4>
    <p>Your order #<strong>{order.id}</strong> has been created.</p>
  </div>

  <div class="card mb-4">
    <div class="card-header">
      <h5>Order Summary</h5>
    </div>
    <div class="card-body">
      <p><strong>Order ID:</strong> #{order.id}</p>
      <p><strong>Status:</strong> <span class="badge bg-success">{order.status}</span></p>
      <p><strong>Total:</strong> {euro.format(order.total / 100)}</p>
    </div>
  </div>

  <div class="card mb-4">
    <div class="card-header">
      <h5>Items</h5>
    </div>
    <div class="card-body">
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Book</th>
            <th>Type</th>
            <th>Qty</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {#each order.items as item}
            <tr>
              <td>{item.title}</td>
              <td>
                <span class="badge bg-{item.type === 'rent' ? 'info' : 'primary'}">
                  {item.type === 'rent' ? 'Rental' : 'Purchase'}
                </span>
              </td>
              <td>{item.quantity}</td>
              <td>{euro.format(item.unitPrice * item.quantity / 100)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <p class="text-muted">Redirecting to your orders in 3 seconds...</p>

  <a href="/member" class="btn btn-primary">Go to My Orders</a>
  <a href="/catalogue" class="btn btn-secondary">Continue Shopping</a>
</div>
