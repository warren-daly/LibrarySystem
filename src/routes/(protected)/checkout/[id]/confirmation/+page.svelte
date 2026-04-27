<script>
  let { data } = $props();
  const { order } = data;
</script>

<div class="container mt-5">
  <div class="alert alert-success" role="alert">
    <h4 class="alert-heading">✅ Order Confirmed!</h4>
    <p>Thank you for your order. Order #<strong>{order.id}</strong></p>
  </div>

  <div class="card mb-4">
    <div class="card-header">
      <h5>Order Details</h5>
    </div>
    <div class="card-body">
      <p><strong>Status:</strong> <span class="badge bg-success">{order.status}</span></p>
      <p><strong>Order Date:</strong> {order.date}</p>
      <p><strong>Total:</strong> {order.total}</p>
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
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {#each order.items as item}
            <tr>
              <td>{item.bookTitle}</td>
              <td>
                <span class="badge bg-{item.type === 'Rental' ? 'info' : 'primary'}">
                  {item.type}
                </span>
              </td>
              <td>{item.quantity}</td>
              <td>{item.price}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <a href="/member/orders" class="btn btn-primary">Go to My Orders</a>
  <a href="/catalogue" class="btn btn-secondary">Continue Shopping</a>
</div>