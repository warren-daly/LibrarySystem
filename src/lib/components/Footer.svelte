<footer class="footer">
	<div class="footer-content">
		<p>© {new Date().getFullYear()} Online Library</p>

		<div class="links">
			<a href="/about">About</a>
			<a href="/contact">Contact</a>
		</div>
	</div>
</footer>

<style>
	.footer {
		margin-top: 40px;
		padding: 18px 20px;
		background-color: #212529; /* matches navbar */
		color: #ddd;
		border-top: 1px solid #444;
	}

	.footer-content {
		max-width: 900px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 14px;
	}

	.footer-links a {
		margin-left: 15px;
		text-decoration: none;
		color: #9ec5fe;
		transition: color 0.2s ease;
	}

	.footer-links a:hover {
		color: #ffffff;
	}
</style>