<script>
	import { enhance } from '$app/forms';
	import BookForm from '$lib/components/BookForm.svelte';
	import { slide, fade } from 'svelte/transition';

	let { data } = $props();
	let books = $derived(data.books);

	const euro = new Intl.NumberFormat('en-IE', {
		style: 'currency',
		currency: 'EUR'
	});

	let showForm = $state(false);
	let book = $state(null);

	function handleAddNew() {
		book = null;
		showForm = true;
	}

	function hideForm() {
		book = null;
		showForm = false;
	}

	function handleUpdate(b) {
		book = b;
		showForm = true;
	}

	let bookToDelete = $state(null);
	let showDeleteModal = $state(false);
	let modalDeleteError = $state('');

	function openDeleteModal(b) {
		bookToDelete = b;
		showDeleteModal = true;
		modalDeleteError = '';
	}

	function closeDeleteModal() {
		showDeleteModal = false;
		bookToDelete = null;
		modalDeleteError = '';
	}

	function enhanceDeleteModal() {
		return async ({ result, update }) => {
			if (!result) return;

			if (result.type === 'success') {
				closeDeleteModal();

				await update();
			}

			if (result.type === 'failure') {
				// Keep modal open and show error inside it
				modalDeleteError =
					result.data?.errors?.general ||
					result.data?.message ||
					result.data?.error ||
					'Delete failed';
			}
		};
	}
</script>

<section id="books-page">
	<div class="row">
		<div class="d-flex flex-column justify-content-between align-items-center">
			<h1 class="h3 mb-0 ">Books Management</h1>
			<div class="row">
				<div class="col-md-2 w-100">
					<button
						type="button"
						class="btn btn-success"
						onclick={() => (showForm ? hideForm() : handleAddNew())}
					>
						{showForm ? 'Cancel' : 'Add New Book'}
					</button>
				</div>
			</div>

			{#if showForm}
				<div class="card shadow-sm mb-4">
					<div class="card-body">
						<BookForm
							{book}
							onCancel={() => {
								showForm = false;
								book = null;
							}}
						/>
					</div>
				</div>
			{/if}

			<div class="row">
				<div class="col-12">
					<div class="card shadow-sm">
						<div class="card-body p-0">
							<table class="table table-bordered table-hover mb-0">
								<thead class="table-light">
									<tr>
										<th class="ps-3">ID</th>
										<th>Title</th>
										<th>Author</th>
										<th>Description</th>
										<th>Genre</th>
										<th class="text-center">Image</th>
										<th>Price</th>
										<th>Stock</th>
										<th class="pe-3 text-center">Actions</th>
									</tr>
								</thead>
								<tbody>
									{#each books as b (b.id)}
										<tr>
											<td class="ps-3">{b.id}</td>
											<td>{b.title}</td>
											<td>{b.author}</td>
											<td>
												<div style="max-width: 300px; white-space: normal;">
													{b.description}
												</div>
											</td>
											<td>{b.genre}</td>
											<td class="text-center">
												<img
													src={`/uploads/${b.image}`}
													alt={b.title}
													class="img-fluid rounded"
													style="max-width: 80px;max-height: 100px;"
												/>
											</td>
											<td>{euro.format(b.price / 100)}</td>
											<td>{b.stock}</td>
											<td class="pe-3">
												<div class="d-flex gap-2">
													<button
														class="btn btn-sm btn-outline-primary"
														type="button"
														aria-label="Update"
														onclick={() => handleUpdate(b)}
													>
														<i class="bi bi-pencil"></i>
													</button>
													<button
														class="btn btn-sm btn-outline-danger"
														type="button"
														aria-label="Delete"
														onclick={() => openDeleteModal(b)}
													>
														<i class="bi bi-trash"></i>
													</button>
												</div>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

{#if showDeleteModal}
	<div
		class="modal fade show d-block"
		style="background: rgba(0,0,0,0.5); z-index:1050;"
		transition:fade|slide
	>
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header bg-danger text-white">
					<h5 class="modal-title text-center w-100">Confirm Delete</h5>
					<button
						type="button"
						class="btn-close btn-close-white"
						aria-label="Close"
						onclick={closeDeleteModal}
					></button>
				</div>
				<div class="modal-body text-center">
					<p>Are you sure you want to delete <strong>{bookToDelete?.title}</strong>?</p>
					{#if modalDeleteError}
						<div class="alert alert-danger mt-3">{modalDeleteError}</div>
					{/if}
				</div>
				<div class="modal-footer justify-content-center">
					<form method="POST" action="?/deleteBook" use:enhance={enhanceDeleteModal}>
						<input type="hidden" name="bookId" value={bookToDelete?.id} />
						<button type="submit" class="btn btn-danger">Yes, Delete</button>
						<button type="button" class="btn btn-secondary" onclick={closeDeleteModal}
							>Cancel</button
						>
					</form>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>

.card.shadow-sm {
  margin-bottom: 2rem;
  background-color: rgb(183, 182, 182);
}

.card-body {
  padding: 1.5rem;
}

#books-page {
  padding: 1rem;
}


</style>
