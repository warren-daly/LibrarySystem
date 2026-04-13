<script>
    import { enhance } from '$app/forms';

    let { data } = $props();
    let added = $state({});

    const euro = new Intl.NumberFormat('en-IE', {
        style: 'currency',
        currency: 'EUR'
    });
</script>

<div class="container mt-5">
    <h1 class="mb-4 text-center">Book Catalogue</h1>
    <div class="row justify-content-center">
        {#each data.books as b}
            <div class="col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
                <div class="card" style="width: 16rem;">
                    {#if b.image}
                        <img
                            src={'/uploads/' + b.image}
                            class="card-img-top"
                            alt={b.title}
                        />
                    {/if}

                    <div class="card-body text-center">
                        <h5 class="card-title">{b.title}</h5>
                        <p class="card-text"><strong>Author:</strong> {b.author}</p>
                        <p class="card-text">
                            <strong>Price:</strong> {euro.format(b.price / 100)}
                        </p>

                        {#if b.stock === 0}
                            <span class="badge bg-danger mb-2">Out of Stock</span>
                        {:else}
                            <span class="badge bg-success mb-2">Available</span>
                        {/if}

                        <form method="post" action="?/addToCart" use:enhance={() => { added[b.id] = true; }}>
                            <input type="hidden" name="bookId" value={b.id} />
                            <button type="submit" class="btn btn-primary w-100 mt-2" disabled={added[b.id] || b.stock === 0}>
                                {#if added[b.id]}
                                    <i class="bi bi-check-circle me-2"></i> Added
                                {:else}
                                    <i class="bi bi-cart-plus me-2"></i> Rent Book
                                {/if}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>