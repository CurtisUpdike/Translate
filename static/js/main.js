const button = document.querySelector('button');
button.addEventListener('click', event => {
    event.preventDefault();
    fetch('/translate', { method: 'POST' })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error(error));
});