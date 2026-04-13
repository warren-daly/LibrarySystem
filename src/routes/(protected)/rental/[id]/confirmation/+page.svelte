<script>
  let { data } = $props();
  const { order } = data;

  const euro = new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR'
  });
</script>

<h2>Rental Confirmed</h2>
<p>
  Thank you for your rental.<br />
  Your rental ID is <strong>#{order.id}</strong>.
</p>

<p>
  <strong>Total:</strong> { euro.format(order.total / 100) }<br />
  <strong>Date:</strong> {new Date(order.rentalDate).toLocaleString()}<br />
  <strong>Return By:</strong> {new Date(order.returnDate).toLocaleString()}
</p>
<hr />
<h4>Books</h4>
<ul class="list-group mb-4">
  {#each order.items as item}
    <li class="list-group-item d-flex justify-content-between">
      <div>
        <strong>{item.bookId}</strong><br />
        Qty: {item.quantity}
      </div>
      <div>
        { euro.format(item.unitPrice * item.quantity / 100) }
      </div>
    </li>
  {/each}
</ul>
<a href="/rentals" class="btn btn-primary">View all rentals</a>