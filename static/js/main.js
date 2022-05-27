const button = document.querySelector('button');
button.addEventListener('click', event => {
    event.preventDefault();
    fetch('/', { method: 'POST' })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
});