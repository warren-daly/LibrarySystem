<script>
	import { enhance } from '$app/forms';

	let { book = null, onCancel } = $props();

	let isUpdateMode = $derived(book != null);
	let formTitle = $derived(isUpdateMode ? 'Update Book' : 'Add New Book');

	let errors = $state({});
	let successMessage = $state('');

	let bookForm = $state({
		title: '',
		author: '',
		description: '',
		genre: '',
		price: 0,
		image: '',
		stock: 0
	});

	$effect(() => {
		if (book) {
			bookForm.title = book.title ?? '';
			bookForm.author = book.author ?? '';
			bookForm.description = book.description ?? '';
			bookForm.genre = book.genre ?? '';
			bookForm.price = book.price ?? 0;
			bookForm.image = book.image ?? '';
			bookForm.stock = book.stock ?? 0;
		} else {
			bookForm.title = '';
			bookForm.author = '';
			bookForm.description = '';
			bookForm.genre = '';
			bookForm.price = 0;
			bookForm.image = '';
			bookForm.stock = 0;
		}
	});

	function enhanceBookForm() {
		return async ({ result, update }) => {
			if (!result) return;

			await update();

			if (result.type === 'success') {
				successMessage = isUpdateMode ? 'Book updated!' : 'Book created!';
				errors = {};
			} else if (result.type === 'failure') {
				errors = { ...result.data.errors };
			} else {
				errors = {};
			}
		};
	}

	function handleCancel() {
		errors = {};
		successMessage = '';
		onCancel?.();
	}
</script>

<div id="book-form" class="card shadow-sm w-100">
	<div class="card-header bg-success text-white text-center">
		<h2 class="h4 mb-0">{formTitle}</h2>
	</div>

	<div class="card-body">
		<form
			method="POST"
			action={isUpdateMode ? '?/updateBook' : '?/createBook'}
			use:enhance={enhanceBookForm}
			enctype="multipart/form-data"
		>
			{#if isUpdateMode}
				<input type="hidden" name="id" value={book.id} />
			{/if}

			{#if isUpdateMode && book.image}
				<div class="mb-3 text-center">
					<p class="form-label mb-1">Current Book Cover</p>
				</div>
				<div class="d-flex justify-content-center mb-3">
					<img
						src={`/uploads/${book.image}`}
						alt="Current book cover"
						class="img-thumbnail mb-2"
						style="max-width: 200px;"
					/>
				</div>
				<div class="form-text text-center">Choose a new image</div>
			{/if}

			<div class="row mb-3">
				<div class="col-md-6">
					<label for="title" class="form-label">
						Title <span class="text-danger" aria-label="required">*</span>
					</label>
					<input
						type="text"
						class="form-control"
						class:is-invalid={errors.title}
						id="title"
						name="title"
						bind:value={bookForm.title}
						required
						aria-required="true"
						aria-describedby={errors.title ? 'title-error' : undefined}
						aria-invalid={errors.title ? 'true' : 'false'}
						placeholder="Enter book title"
					/>
					{#if errors.title}
						<div id="title-error" class="form-text text-danger">
							{errors.title}
						</div>
					{/if}
				</div>

				<div class="col-md-6">
					<label for="author" class="form-label">
						Author <span class="text-danger" aria-label="required">*</span>
					</label>
					<input
						type="text"
						class="form-control"
						class:is-invalid={errors.author}
						id="author"
						name="author"
						bind:value={bookForm.author}
						required
						aria-required="true"
						aria-describedby={errors.author ? 'author-error' : undefined}
						aria-invalid={errors.author ? 'true' : 'false'}
						placeholder="Enter author name"
					/>
					{#if errors.author}
						<div id="author-error" class="form-text text-danger">
							{errors.author}
						</div>
					{/if}
				</div>
			</div>

			<div class="mb-3">
				<label for="description" class="form-label">
					Description <span class="text-danger" aria-label="required">*</span>
				</label>
				<textarea
					class="form-control"
					class:is-invalid={errors.description}
					id="description"
					name="description"
					bind:value={bookForm.description}
					required
					rows="3"
					aria-required="true"
					aria-describedby={errors.description ? 'description-error' : undefined}
					aria-invalid={errors.description ? 'true' : 'false'}
					placeholder="Enter book description"
				></textarea>
				{#if errors.description}
					<div id="description-error" class="form-text text-danger">
						{errors.description}
					</div>
				{/if}
			</div>

			<div class="row mb-3">
				<div class="col-md-6">
					<label for="genre" class="form-label">
						Genre <span class="text-danger" aria-label="required">*</span>
					</label>
					<input
						type="text"
						class="form-control"
						class:is-invalid={errors.genre}
						id="genre"
						name="genre"
						bind:value={bookForm.genre}
						required
						aria-required="true"
						aria-describedby={errors.genre ? 'genre-error' : undefined}
						aria-invalid={errors.genre ? 'true' : 'false'}
						placeholder="Enter book genre"
					/>
					{#if errors.genre}
						<div id="genre-error" class="form-text text-danger">
							{errors.genre}
						</div>
					{/if}
				</div>

				<div class="col-md-6">
					<label for="price" class="form-label">
						Price <span class="text-danger" aria-label="required">*</span>
					</label>
					<div class="input-group">
						<span class="input-group-text">€</span>
						<input
							type="number"
							class="form-control"
							class:is-invalid={errors.price}
							id="price"
							name="price"
							bind:value={bookForm.price}
							required
							step="0.01"
							min="0"
							aria-required="true"
							aria-describedby={errors.price ? 'price-error' : undefined}
							aria-invalid={errors.price ? 'true' : 'false'}
							placeholder="Enter price"
						/>
					</div>
					{#if errors.price}
						<div id="price-error" class="form-text text-danger">
							{errors.price}
						</div>
					{/if}
				</div>
			</div>

			<div class="row mb-3">
				<div class="col-md-6">
					<label for="stock" class="form-label">
						Stock <span class="text-danger" aria-label="required">*</span>
					</label>
					<input
						type="number"
						class="form-control"
						class:is-invalid={errors.stock}
						id="stock"
						name="stock"
						bind:value={bookForm.stock}
						required
						min="0"
						aria-required="true"
						aria-describedby={errors.stock ? 'stock-error' : undefined}
						aria-invalid={errors.stock ? 'true' : 'false'}
						placeholder="Enter stock quantity"
					/>
					{#if errors.stock}
						<div id="stock-error" class="form-text text-danger">
							{errors.stock}
						</div>
					{/if}
				</div>

				<div class="col-md-6">
					<label for="image" class="form-label">
						Image <span class="text-danger" aria-label="required">*</span>
					</label>
					<input
						type="file"
						accept="image/*"
						class="form-control"
						class:is-invalid={errors.image}
						id="image"
						name="image"
						required={!isUpdateMode}
						aria-required="true"
						aria-describedby={errors.image ? 'image-error' : undefined}
						aria-invalid={errors.image ? 'true' : 'false'}
					/>
					{#if errors.image}
						<div id="image-error" class="form-text text-danger">
							{errors.image}
						</div>
					{/if}
				</div>
			</div>

			<div class="d-flex justify-content-center gap-3 mt-4">
				<button type="button" class="btn btn-outline-secondary" onclick={handleCancel}>
					<i class="bi bi-x-circle me-1"></i>
					Cancel
				</button>
				<button type="submit" class="btn btn-success">
					<i class="bi bi-{isUpdateMode ? 'check' : 'plus'}-circle me-1"></i>
					{isUpdateMode ? 'Update Book' : 'Create Book'}
				</button>
			</div>
		</form>

		{#if successMessage}
			<div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
				<i class="bi bi-check-circle-fill me-2"></i>
				{successMessage}
				<button type="button" class="btn-close" aria-label="Close" onclick={handleCancel}></button>
			</div>
		{/if}

		{#if errors.general}
			<div class="alert alert-danger mt-3" role="alert">
				<i class="bi bi-exclamation-triangle-fill me-2"></i>
				{errors.general}
			</div>
		{/if}
	</div>
</div>
