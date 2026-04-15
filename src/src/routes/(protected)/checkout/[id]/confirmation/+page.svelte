<script>
  let { data } = $props();
  const { order } = data;

  const euro = new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR'
  });

  console.log('Order:', order);
  console.log('Items:', order.items);

  // Separate rented and bought items
  const rentedItems = $derived(order.items.filter(i => i.type === 'rent'));
  const boughtItems = $derived(order.items.filter(i => i.type === 'buy'));
  
  console.log('Bought items:', boughtItems);
  
  // Calculate totals
  const purchaseTotal = $derived(boughtItems.reduce((sum, i) => {
    console.log(`Item: ${i.title}, unitPrice: ${i.unitPrice}, quantity: ${i.quantity}`);
    return sum + (i.quantity * i.unitPrice);
  }, 0));
</script>

<div class="container mt-5">
  <h2>Order Confirmed</h2>
  <p>Thank you for your order!</p>
  <p><strong>Order ID:</strong> #{order.id}</p>

  {#if rentedItems.length > 0}
    <div class="mb-5">
      <h4>Rentals (Free)</h4>
      <ul class="list-group mb-3">
        {#each rentedItems as item}
          <li class="list-group-item d-flex justify-content-between">
            <div>
              <strong>{item.title}</strong><br />
              Qty: {item.quantity}
            </div>
            <div>€0.00</div>
          </li>
        {/each}
      </ul>
      <p>
        <strong>Rental Date:</strong> {new Date(order.rentalDate).toLocaleString()}<br />
        <strong>Return By:</strong> {new Date(order.returnDate).toLocaleString()}
      </p>
    </div>
  {/if}

  {#if boughtItems.length > 0}
    <div class="mb-5">
      <h4>Purchases</h4>
      <ul class="list-group mb-3">
        {#each boughtItems as item}
          <li class="list-group-item d-flex justify-content-between">
            <div>
              <strong>{item.title}</strong><br />
              Qty: {item.quantity}
            </div>
            <div>{euro.format(item.unitPrice * item.quantity / 100)}</div>
          </li>
        {/each}
      </ul>
    </div>
  {/if}

  <hr />
  <h4>Total: {euro.format(purchaseTotal / 100)}</h4>

  <a href="/member" class="btn btn-primary">Go to My Account</a>
  <a href="/catalogue" class="btn btn-secondary">Continue Shopping</a>
</div>