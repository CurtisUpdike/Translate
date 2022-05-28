const form = document.querySelector('form');
const output = document.querySelector('#translation');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    var formData = new FormData(this);
    fetch('/translate', { method: 'POST', body: formData })
});