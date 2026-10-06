;(function () {
  var form = document.getElementById('gate-form')
  var passwordInput = document.getElementById('gate-password')
  var errorEl = document.getElementById('gate-error')
  var submitButton = document.getElementById('gate-submit')

  function getRedirectTarget() {
    var params = new URLSearchParams(window.location.search)
    var redirect = params.get('redirect')
    if (!redirect || !redirect.startsWith('/') || redirect.startsWith('//')) {
      return '/'
    }
    return redirect
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault()
    errorEl.textContent = ''
    submitButton.disabled = true

    fetch('/api/gate/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ password: passwordInput.value }),
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Incorrect password.')
        }
        window.location.href = getRedirectTarget()
      })
      .catch(function () {
        errorEl.textContent = 'Incorrect password. Please try again.'
        submitButton.disabled = false
        passwordInput.value = ''
        passwordInput.focus()
      })
  })
})()
