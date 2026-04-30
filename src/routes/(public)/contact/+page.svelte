<script>
    let { data } = $props();
    let resendEmail = $derived(data.resendEmail);

    let name = $state('');
    let message = $state('');
    let email = $state('');
    let errorMessage = $state('');
    let successMessage = $state('');
    let isSubmitting = $state(false);

    async function handleSubmit(e) {
        e.preventDefault();
        errorMessage = '';
        successMessage = '';

        if (!name || !email || !message) {
            errorMessage = 'Please fill in all fields.';
            return;
        }

        isSubmitting = true;

        try {
            const response = await fetch('/api/send-contact-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    name,
                    message
                })
            });

            if (!response.ok) throw new Error('Failed to send');

            successMessage = 'Thank you! Your message has been sent.';
            name = '';
            email = '';
            message = '';

            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } catch (err) {
            console.error('Contact email failed:', err);
            errorMessage = 'Failed to send message. Please try again.';
        } finally {
            isSubmitting = false;
        }
    }    
</script>

<div class="container py-1">
    <div class="page-header mb-1 text-center">
        <h1 class="page-title display-4 fw-bold">Contact Us</h1>
        <p class="page-subtitle lead text-muted">Have any inquiries? We'd love to hear from you</p>
    </div>

    <div class="row g-5 py-5 justify-content-center">
        <div class="col-md-4 d-flex flex-column justify-content-top">
            <div class="contact-info">
                <h2 class="fw-normal fst-italic mb-4">Get in <br>Touch</h2>
                <p class="fw-light text-muted mb-4">Have any inquires or just wanna say hi, Send us a message!</p>

                <div class="contact-item">
                    <i class="bi bi-envelope me-2"></i>
                    <a href="mailto:{resendEmail}">{resendEmail}</a>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            {#if errorMessage}
                <div class="alert alert-danger mb-3" role="alert">
                    <i class="bi bi-exclamation-circle me-2"></i>
                    {errorMessage}
                </div>
            {/if}

            {#if successMessage}
                <div class="alert alert-success mb-3" role="alert">
                    <i class="bi bi-check-circle me-2"></i>
                    {successMessage}
                </div>
            {/if}
            
            <form onsubmit={handleSubmit} class="contact-form">
                <div class="mb-3">
                    <label for="name" class="form-label">Name</label>
                    <input 
                        type="text" 
                        class="form-control" 
                        id="name"
                        bind:value={name}
                        required
                    />
                </div>

                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input 
                        type="email" 
                        class="form-control" 
                        id="email"
                        bind:value={email}
                        required
                    />
                </div>

                <div class="mb-4">
                    <label for="message" class="form-label">Message</label>
                    <textarea 
                        class="form-control" 
                        id="message" 
                        rows="5"
                        bind:value={message}
                        required
                    ></textarea>
                </div>

                <button 
                    type="submit" 
                    class="btn btn-primary w-100"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Sending...' : 'Submit'}
                </button>
            </form>
        </div>
    </div>
</div>

<style>
    .page-header {
        border-bottom: 2px solid #dee2e6;
        padding-bottom: 2rem;
    }

    .page-title {
        color: #2c3e50;
        margin-bottom: 0.5rem;
    }

    .page-subtitle {
        color: #6c757d;
    }

    .contact-form {
        background: #f8f9fa;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .form-control {
        border: 1px solid #ddd;
        border-radius: 6px;
        padding: 0.65rem 0.75rem;
        transition: all 0.3s ease;
    }

    .form-control:focus {
        border-color: #007bff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.15);
    }

    .form-label {
        font-weight: 500;
        color: #2c3e50;
        margin-bottom: 0.5rem;
    }

    .btn-primary {
        border-radius: 6px;
        font-weight: 500;
        transition: all 0.3s ease;
    }

    .btn-primary:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
    }

    .btn-primary:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .contact-info {
        background: #f8f9fa;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .contact-item {
        display: flex;
        align-items: center;
        color: #2c3e50;
        font-weight: 500;
    }

    .contact-item a {
        color: #007bff;
        text-decoration: none;
        transition: color 0.3s ease;
    }

    .contact-item a:hover {
        color: #0056b3;
        text-decoration: underline;
    }

    .contact-item i {
        color: #007bff;
        font-size: 1.2rem;
    }

</style>