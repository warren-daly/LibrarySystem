<script>
    import { enhance } from '$app/forms';

    let { data } = $props();
    const product = $derived(data.product);
    const catName = $derived(data.categoryName);
    let added = $state(false);

    const euro = new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: 'EUR'
    });

    // Separate items by type
    const rentedItems = $derived(data.items.filter(item => item.type === 'rent'));
    const boughtItems = $derived(data.items.filter(item => item.type === 'buy'));

    // Calculate totals
    const rentedTotal = $derived(rentedItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0));
    const boughtTotal = $derived(boughtItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0));
    const grandTotal = $derived(rentedTotal + boughtTotal);
</script>

<h2>Your Cart</h2>

{#if data.items.length === 0}
    <p>Your cart is empty.</p>
{:else}
    <!-- Rentals Table -->
    {#if rentedItems.length > 0}
        <div class="mb-5">
            <h3>Rentals</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Book</th>
                        <th>Rental Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {#each rentedItems as item}
                        <tr>
                            <td>{item.title}</td>
                            <td>{euro.format(item.unitPrice / 100)}</td>
                            <td>
                                <form method="post" action="?/updateQuantity" use:enhance>
                                    <input type="hidden" name="cartItemId" value={item.id} />
                                    <input type="number" name="quantity" min="1" value={item.quantity} />
                                    <button class="btn btn-sm btn-secondary">Update</button>
                                </form>
                            </td>
                            <td>{euro.format(item.unitPrice * item.quantity / 100)}</td>
                            <td>
                                <form method="post" action="?/removeItem" use:enhance>
                                    <input type="hidden" name="cartItemId" value={item.id} />
                                    <button class="btn btn-sm btn-danger">Remove</button>
                                </form>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            <h5>Rental Total: {euro.format(rentedTotal / 100)}</h5>
        </div>
    {/if}

    <!-- Purchases Table -->
    {#if boughtItems.length > 0}
        <div class="mb-5">
            <h3>Purchases</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>Book</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {#each boughtItems as item}
                        <tr>
                            <td>{item.title}</td>
                            <td>{euro.format(item.unitPrice / 100)}</td>
                            <td>
                                <form method="post" action="?/updateQuantity" use:enhance>
                                    <input type="hidden" name="cartItemId" value={item.id} />
                                    <input type="number" name="quantity" min="1" value={item.quantity} />
                                    <button class="btn btn-sm btn-secondary">Update</button>
                                </form>
                            </td>
                            <td>{euro.format(item.unitPrice * item.quantity / 100)}</td>
                            <td>
                                <form method="post" action="?/removeItem" use:enhance>
                                    <input type="hidden" name="cartItemId" value={item.id} />
                                    <button class="btn btn-sm btn-danger">Remove</button>
                                </form>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            <h5>Purchase Total: {euro.format(boughtTotal / 100)}</h5>
        </div>
    {/if}

    <hr />
    <h4>Grand Total: {euro.format(grandTotal / 100)}</h4>

    <form method="post" action="?/checkout" use:enhance>
        <button class="btn btn-primary">Checkout</button>
    </form>
{/if}