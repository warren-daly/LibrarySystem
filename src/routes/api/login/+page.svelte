<script>
    let { form } = $props();
</script>

<!-- This page is just a fallback, the form is in the navbar -->
{#if form?.error}
    <p style="color:red">{form.error}</p>
{/if}