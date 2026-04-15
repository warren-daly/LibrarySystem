<script>
	import { enhance } from '$app/forms';

	let { books = [], selectedBookId = null, currentUser = null, onCancel } = $props();

	let errors = $state({});
	let successMessage = $state('');

	function getSelectedBookTitle() {
		const found = books.find((b) => Number(b.id) === Number(selectedBookId));
		return found ? found.title : '';
	}

	let rentalForm = $state({
		bookId: '',
		rentalDays: '1'
	});

	$effect(() => {
		rentalForm.bookId = selectedBookId ?? '';
		rentalForm.rentalDays = '1';
	});

	function enhanceRentalForm() {
		return async ({ result, update }) => {
			if (!result) return;

			await update();

			if (result.type === 'success') {
				successMessage = 'Rental created!';
				errors = {};

				setTimeout(() => {
					onCancel?.();
				}, 500);
			} else if (result.type === 'failure') {
				errors = { ...(result.data?.errors ?? {}) };
				successMessage = '';
			} else if (result.type === 'error') {
				errors = {
					general: 'Something went wrong while saving the rental'
				};
				successMessage = '';
			} else {
				errors = {};
				successMessage = '';
			}
		};
	}

	function handleCancel() {
		errors = {};
		successMessage = '';
		onCancel?.();
	}
</script>

<div id="rental-form" class="card shadow-sm w-100">
	<div class="card-header bg-success text-white text-center">
		<h2 class="h4 mb-0">Add New Rental</h2>
	</div>

	<div class="card-body">
		<form method="POST" action="?/createRental" use:enhance={enhanceRentalForm}>
			<input type="hidden" name="bookId" value={rentalForm.bookId} />

			{#if currentUser}
				<div class="mb-3">
					<label for="user" class="form-label">
						User <span class="text-danger" aria-label="required">*</span>
					</label>
					<input
						type="text"
						class="form-control"
						id="user"
						value={currentUser.name ?? currentUser.email ?? `User #${currentUser.id}`}
						readonly
						aria-readonly="true"
					/>
				</div>
			{/if}

			<div class="mb-3">
				<label for="bookDisplay" class="form-label">
					Book <span class="text-danger" aria-label="required">*</span>
				</label>
				<input
					type="text"
					class="form-control"
					id="bookDisplay"
					value={getSelectedBookTitle()}
					readonly
					aria-readonly="true"
				/>
				{#if errors.bookId}
					<div class="form-text text-danger">{errors.bookId}</div>
				{/if}
			</div>

			<div class="mb-3">
				<label for="rentalDays" class="form-label">
					Rental Duration <span class="text-danger" aria-label="required">*</span>
				</label>
				<select
					class="form-select"
					class:is-invalid={errors.rentalDays}
					id="rentalDays"
					name="rentalDays"
					bind:value={rentalForm.rentalDays}
					required
					aria-required="true"
					aria-describedby={errors.rentalDays ? 'rentalDays-error' : undefined}
					aria-invalid={errors.rentalDays ? 'true' : 'false'}
				>
					<option value="">Select days</option>
					{#each Array(14) as _, i}
						<option value={String(i + 1)}>{i + 1} day{i === 0 ? '' : 's'}</option>
					{/each}
				</select>
				{#if errors.rentalDays}
					<div id="rentalDays-error" class="form-text text-danger">
						{errors.rentalDays}
					</div>
				{/if}
			</div>

			<div class="mb-3">
				<label for="statusDisplay" class="form-label">Status</label>
				<input
					type="text"
					class="form-control"
					id="statusDisplay"
					value="Rented"
					readonly
					aria-readonly="true"
				/>
			</div>

			<div class="d-flex justify-content-center gap-3 mt-4">
				<button type="button" class="btn btn-outline-secondary" onclick={handleCancel}>
					<i class="bi bi-x-circle me-1"></i>
					Cancel
				</button>
				<button type="submit" class="btn btn-success">
					<i class="bi bi-plus-circle me-1"></i>
					Create Rental
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
