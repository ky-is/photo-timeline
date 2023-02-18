/* globals netlifyIdentity */

if (window.netlifyIdentity != null) {
	window.netlifyIdentity.on('init', user => {
		if (user != null) {
			window.netlifyIdentity.on('login', () => {
				document.location.href = '/admin/private'
			})
		}
	})
}
