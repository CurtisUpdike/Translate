const form = document.querySelector('form');
const output = document.querySelector('#translation');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    var formData = new FormData(this);
    fetch('/translate', { method: 'POST', body: formData })
        .then(response => response.json())
        .then(data => {
            const { 'translations': [ { translation } ] } = data;
            output.textContent = translation
        })
});