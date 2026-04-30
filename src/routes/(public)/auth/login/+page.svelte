<script>
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';
    let { form } = $props();
</script>

<div class="page-header">
	<h1 class="page-title">Login</h1>
	<p class="page-subtitle">Access your account to manage rentals</p>
</div>

<div class="container d-flex justify-content-center align-items-center" style="min-height: 70vh;">
    <div class="card shadow-sm" style="max-width: 480px; width: 100%;">
        <div class="card-body p-4">
            <h3 class="card-title text-center mb-4">
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Login
            </h3>

            <form method="post" action="?/signInEmail" use:enhance>
                <input type="hidden" name="redirectTo" value={$page.url.searchParams.get('redirectTo') || '/member'} />
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input id="email" type="email" name="email" class="form-control" required />
                </div>

                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input id="password" type="password" name="password" class="form-control" required />
                </div>

                <a href="/auth/forgot-password" class="small text-decoration-none">Forgot password?</a>

                <button type="submit" class="btn btn-primary w-100">
                    <i class="bi bi-box-arrow-in-right me-1"></i> Login
                </button>
            </form>

            {#if form?.message}
                <div class="alert alert-danger mt-3">{form.message}</div>
            {/if}

            <hr class="my-4" />

            <p class="text-center mb-0">
                No account?
                <a href="/auth/register">Register</a>
            </p>
        </div>
    </div>
</div>