<script>
    import { enhance } from '$app/forms';

    let { data } = $props();

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

    function handleQuantityChange(e, cartItemId) {
        const quantity = parseInt(e.target.value);
        if (quantity > 0) {
            const form = e.target.closest('form');
            form?.submit();
        }
    }
</script>

<div class="container py-5">
    <h1 class="h3 fw-bold mb-4">Your Cart</h1>

    {#if data.items.length === 0}
        <div class="alert alert-info text-center py-5">
            <i class="bi bi-bag me-2"></i>
            <p class="mb-0">Your cart is empty.</p>
        </div>
    {:else}
        <div class="cart-wrapper">
            <!-- Rentals Section -->
            {#if rentedItems.length > 0}
                <div class="card mb-4">
                    <div class="card-header bg-light">
                        <h5 class="mb-0">📚 Rentals</h5>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>Book</th>
                                    <th class="text-end">Price</th>
                                    <th class="text-center">Qty</th>
                                    <th class="text-end">Total</th>
                                    <th class="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each rentedItems as item}
                                    <tr>
                                        <td class="fw-medium">{item.title}</td>
                                        <td class="text-end">{euro.format(item.unitPrice / 100)}</td>
                                        <td class="text-center">
                                            <form method="post" action="?/updateQuantity" use:enhance>
                                                <input type="hidden" name="cartItemId" value={item.id} />
                                                <input 
                                                    type="number" 
                                                    name="quantity" 
                                                    min="1" 
                                                    value={item.quantity}
                                                    class="qty-input"
                                                    onchange={(e) => handleQuantityChange(e, item.id)}
                                                />
                                            </form>
                                        </td>
                                        <td class="text-end fw-semibold">{euro.format(item.unitPrice * item.quantity / 100)}</td>
                                        <td class="text-center">
                                            <form method="post" action="?/removeItem" use:enhance>
                                                <input type="hidden" name="cartItemId" value={item.id} />
                                                <button class="btn btn-sm btn-outline-danger" title="Remove">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                    <div class="card-footer bg-light">
                        <div class="d-flex justify-content-end">
                            <span>Rental Subtotal: <strong>{euro.format(rentedTotal / 100)}</strong></span>
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Purchases Section -->
            {#if boughtItems.length > 0}
                <div class="card mb-4">
                    <div class="card-header bg-light">
                        <h5 class="mb-0">🛒 Purchases</h5>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>Book</th>
                                    <th class="text-end">Price</th>
                                    <th class="text-center">Qty</th>
                                    <th class="text-end">Total</th>
                                    <th class="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each boughtItems as item}
                                    <tr>
                                        <td class="fw-medium">{item.title}</td>
                                        <td class="text-end">{euro.format(item.unitPrice / 100)}</td>
                                        <td class="text-center">
                                            <form method="post" action="?/updateQuantity" use:enhance>
                                                <input type="hidden" name="cartItemId" value={item.id} />
                                                <input 
                                                    type="number" 
                                                    name="quantity" 
                                                    min="1" 
                                                    value={item.quantity}
                                                    class="qty-input"
                                                    onchange={(e) => handleQuantityChange(e, item.id)}
                                                />
                                            </form>
                                        </td>
                                        <td class="text-end fw-semibold">{euro.format(item.unitPrice * item.quantity / 100)}</td>
                                        <td class="text-center">
                                            <form method="post" action="?/removeItem" use:enhance>
                                                <input type="hidden" name="cartItemId" value={item.id} />
                                                <button class="btn btn-sm btn-outline-danger" title="Remove">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                    <div class="card-footer bg-light">
                        <div class="d-flex justify-content-end">
                            <span>Purchase Subtotal: <strong>{euro.format(boughtTotal / 100)}</strong></span>
                        </div>
                    </div>
                </div>
            {/if}

            <!-- Totals & Checkout -->
            <div class="card border-primary">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <h5 class="mb-0 fw-bold">Grand Total</h5>
                        <h4 class="mb-0 text-primary">{euro.format(grandTotal / 100)}</h4>
                    </div>
                    <form method="post" action="?/checkout" use:enhance class="d-flex gap-2">
                        <button class="btn btn-primary flex-grow-1">
                            <i class="bi bi-credit-card me-2"></i>
                            Proceed to Checkout
                        </button>
                        <a href="/catalogue" class="btn btn-outline-secondary">
                            <i class="bi bi-arrow-left me-2"></i>
                            Continue Shopping
                        </a>
                    </form>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    .cart-wrapper {
        max-width: 900px;
        margin: 0 auto;
    }

    .table-hover tbody tr:hover {
        background-color: #f8f9fa;
    }

    .card {
        border-radius: 8px;
        border: 1px solid #e0e0e0;
    }

    .card-header {
        border-bottom: 1px solid #e0e0e0;
    }

    .card-footer {
        border-top: 1px solid #e0e0e0;
    }

    .qty-input {
        width: 60px;
        padding: 0.4rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        text-align: center;
    }

    .qty-input:focus {
        border-color: #007bff;
        outline: none;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.15);
    }

    .btn {
        border-radius: 6px;
        transition: all 0.3s ease;
    }

    .btn-primary {
        font-weight: 500;
    }

    .btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    }
</style>