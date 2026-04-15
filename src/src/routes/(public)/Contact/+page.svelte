<script>

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
                <form method="POST" action="/">
                <div class="form-grid">
                    <label for="name">Name:</label>
                    <input type="text" id="name" name="name"/>
                
                    <label for="email">Email:</label>
                    <input type="text" id="email" name="email"/>
                
                    <label for="text">Message:</label>
                    <textarea id="text" name="text" rows="5"></textarea>
                
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