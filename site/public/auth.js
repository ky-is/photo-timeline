const netlifyIdentity = window.netlifyIdentity

if (netlifyIdentity != null) {
	netlifyIdentity.on('init', user => {
		if (user != null) {
			netlifyIdentity.on('login', () => {
				document.location.href = '/admin/private'
			})
		}
	})
}
