<script>
	import { authClient } from '$lib/auth-client';

	let { user } = $props();

	let email = $state('');
	let password = $state('');
	let loginError = $state('');

	async function handleLogin(e) {
		e.preventDefault();
		loginError = '';

		const { error: authError } = await authClient.signIn.email({
			email,
			password
		});

		if (authError) {
			loginError = authError.message || 'Invalid email or password';
			return;
		}

		const params = new URLSearchParams(window.location.search);
		const redirectTo = params.get('redirectTo');
		window.location.href = redirectTo && redirectTo.startsWith('/') ? redirectTo : '/member';
	}

	function logout() {
		authClient.signOut().then(() => {
			window.location.href = '/';
		});
	}
</script>

{#if user}
	<li class="nav-item dropdown">
		<button class="btn btn-outline-light" type="button">
			Welcome, {user.name}
		</button>

		<div class="dropdown-content">
			<button class="logout" type="button" onclick={logout}>
				Logout
			</button>
		</div>
	</li>
{:else}
	<li class="nav-item dropdown">
		<button class="btn btn-outline-light" type="button">
			<a class="nav-link" href="/auth/login">Login</a>
		</button>

		<div class="dropdown-content p-3">
			<form onsubmit={handleLogin}>
				<div class="mb-3">
					<label for="email" class="form-label">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						class="form-control"
						bind:value={email}
						required
					/>
				</div>

				<div class="mb-3">
					<label for="password" class="form-label">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						class="form-control"
						bind:value={password}
						required
					/>
				</div>

				<button class="btn btn-primary w-100" type="submit">Login</button>

				{#if loginError}
					<p class="text-danger mt-2 mb-0">{loginError}</p>
				{/if}
			</form>
		</div>
	</li>
{/if}

<style>
.dropdown {
	position: relative;
	display: inline-block;
}

.dropdown > button {
	border-radius: 0.5rem 0 0 0.5rem;
	padding: 0.4rem 0.9rem;
	font-weight: 500;
}

.dropdown-content {
	position: absolute;
	top: 100%;
	right: 0;
	background-color: #ffffff;
	min-width: 180px;
	border-radius: 0 0 0.75rem 0;
	box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
	padding: 0.5rem 0;
	display: none;
	z-index: 1000;
	font-weight: bold;
}

/* show dropdown */
.dropdown:hover .dropdown-content,
.dropdown:focus-within .dropdown-content {
	display: block;
}

/* logout button */
.logout {
	width: 100%;
	background: none;
	border: none;
	text-align: left;
	padding: 0.6rem 1rem;
	font-size: 0.95rem;
	cursor: pointer;
	border-radius: 0.5rem;
	transition: background 0.2s ease;
	font-weight: bold;
}

/* hover effect */
.logout:hover {
	background-color: #ffffff;
	font-weight: 600;
}

.nav-link{
	color: white;
	padding: 0;
	margin: 0;
	text-decoration: none;
}
</style>