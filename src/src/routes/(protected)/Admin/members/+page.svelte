<script>
    import { enhance } from '$app/forms';
    let { data, form } = $props();

    let changingPasswordFor = $state(null);
    let newPassword = $state('');
    let successMessage = $state('');

    function handlePasswordSuccess(userId) {
        successMessage = `Password changed successfully for user ${userId}`;
        changingPasswordFor = null;
        newPassword = '';
        setTimeout(() => successMessage = '', 3000);
    }
</script>

<div class="container py-5">
    <h1 class="mb-4">
        <i class="bi bi-people me-2"></i>
        Manage Members
    </h1>

    {#if successMessage}
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="bi bi-check-circle me-2"></i>
            {successMessage}
            <button type="button" class="btn-close" onclick={() => successMessage = ''}></button>
        </div>
    {/if}

    <table class="table table-hover">
        <thead class="table-light">
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th class="text-end">Actions</th>
            </tr>
        </thead>
        <tbody>
            {#each data.users as user}
                <tr>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                        <span class={`badge ${user.role === 'ADMIN' ? 'bg-danger' : 'bg-secondary'}`}>
                            {user.role}
                        </span>
                    </td>
                    <td class="text-end">
                        <div class="d-flex gap-2 justify-content-end">
                            <button
                                class="btn btn-sm btn-warning"
                                onclick={() => changingPasswordFor = changingPasswordFor === user.id ? null : user.id}>
                                <i class="bi bi-key me-1"></i>Change Password
                            </button>

                            <form method="post" action="?/deleteAccount" use:enhance>
                                <input type="hidden" name="userId" value={user.id} />
                                <button
                                    type="submit"
                                    class="btn btn-sm btn-danger"
                                    onclick={(e) => { if (!confirm('Are you sure you want to delete this account?')) e.preventDefault(); }}>
                                    <i class="bi bi-trash me-1"></i>Delete
                                </button>
                            </form>
                        </div>

                        {#if changingPasswordFor === user.id}
                            <form
                                method="post"
                                action="?/changePassword"
                                use:enhance={() => {
                                    return ({ result }) => {
                                        if (result.type === 'success') {
                                            handlePasswordSuccess(user.id);
                                        }
                                    };
                                }}
                                class="mt-2 d-flex gap-2">
                                <input type="hidden" name="userId" value={user.id} />
                                <input
                                    type="password"
                                    name="newPassword"
                                    class="form-control form-control-sm"
                                    placeholder="New password"
                                    bind:value={newPassword}
                                />
                                <button type="submit" class="btn btn-sm btn-success">
                                    <i class="bi bi-check me-1"></i>Save
                                </button>
                            </form>
                        {/if}
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>