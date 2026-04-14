<script>
  let { data } = $props();
  let { rentals, purchases } = data;

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
</script>

<div class="container mt-5">
  <h2>Rentals & Purchases</h2>

  <!-- Rentals Section -->
  <h3 class="mt-5">Rentals</h3>
  {#if rentals.length === 0}
    <p>No active rentals.</p>
  {:else}
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>User</th>
          <th>Books</th>
          <th>Rental Date</th>
          <th>Due Date</th>
          <th>Days Left</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {#each rentals as rental}
          <tr>
            <td>#{rental.id}</td>
            <td>{rental.userName}</td>
            <td>
              {#each rental.items.filter(i => i.type === 'rent') as item}
                <div>{item.title} (Qty: {item.quantity})</div>
              {/each}
            </td>
            <td>{rental.rentalDate ? new Date(rental.rentalDate).toLocaleDateString() : 'N/A'}</td>
            <td>{rental.returnDate ? new Date(rental.returnDate).toLocaleDateString() : 'N/A'}</td>
            <td>
              <span class="badge bg-{getStatusColor(getDaysUntilDue(rental.returnDate))}">
                {getDaysUntilDue(rental.returnDate) ?? 'N/A'} days
              </span>
            </td>
            <td>{euro.format((rental.items.filter(i => i.type === 'rent').reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0)) / 100)}</td>
            <td>
              <span class="badge bg-info">{rental.status}</span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}

  <!-- Purchases Section -->
  <h3 class="mt-5">Purchases</h3>
  {#if purchases.length === 0}
    <p>No purchases.</p>
  {:else}
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>User</th>
          <th>Books</th>
          <th>Total</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {#each purchases as purchase}
          <tr>
            <td>#{purchase.id}</td>
            <td>{purchase.userName}</td>
            <td>
              {#each purchase.items.filter(i => i.type === 'buy') as item}
                <div>{item.title} (Qty: {item.quantity}) - {euro.format(item.unitPrice * item.quantity / 100)}</div>
              {/each}
            </td>
            <td>{euro.format((purchase.items.filter(i => i.type === 'buy').reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0)) / 100)}</td>
            <td>
              <span class="badge bg-success">{purchase.status}</span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>