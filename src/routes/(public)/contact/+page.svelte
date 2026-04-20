<script>
    let name = $state('');
    let message = $state('');
    let email = $state('');
    let errorMessage = $state('');

    async function handleSubmit(e) {
        e.preventDefault();
        errorMessage = '';

        if (!name || !email || !message) {
            errorMessage = 'Please fill in all fields.';
            return;
        }

        try {
            await fetch('/api/send-contact-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    name,
                    message
                })
            });

            window.location.href = '/';
        } catch (err) {
            console.error('Contact email failed:', err);
            errorMessage = 'Failed to send message.';
        }
    }    
</script>

<div class="container py-5">
    <div class="page-header mb-4 text-center">
        <h1 class="page-title">Contact Us</h1>
        <p class="page-subtitle">By Phone, email or chatbox</p>
    </div>

    <div class="row g-3 py-5">
        <div class="col-md-4">
            <div class="h-25 py-3">
                    <h1 class="fw-normal fst-italic">Get in <br>Touch</h1>
            </div>

            <div class="col-md-8">
                <div class="h-100 py-5">
                    <p class="fw-lighter">Have any inquires or <br>just wanna say hi, Send us a message!</p>
                </div>
            </div>
        </div>

        <div class="col-md-8">
            <div class="h-100 py-3 text-center">
                {#if errorMessage}
                    <div class="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                {/if}
                
                <form on:submit={handleSubmit}>
                <div class="form-grid">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name" bind:value={name}/>
                
                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" bind:value={email}/>
                
                    <label for="message">Message:</label>
                    <textarea id="message" name="message" rows="5" bind:value={message}></textarea>
                
                    <div></div>
                    <input type="submit" value="Submit"/>
                </div>
                </form>
            </div>
        </div>
    </div>
</div>

<style>
    form {
        margin-left: 5em;
    }

    .form-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.5em 1em;
        align-items: start;
        max-width: 400px;
    }
</style>