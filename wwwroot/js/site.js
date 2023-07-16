const text = document.getElementById('Text');
const sourceId = document.getElementById('SourceId');
const targetId = document.getElementById('TargetId');
const translation = document.getElementById('translation');
const sourceControls = document.getElementById('sourceControls');
const characterLimit = document.createElement('span');

characterLimit.id = 'characterLimit';
updateCharacterLimit();
sourceControls.append(characterLimit);
document.querySelector('button').remove();


text.addEventListener('input', updateCharacterLimit);
text.addEventListener('input', debounce(translate));
sourceId.addEventListener('change', translate);
targetId.addEventListener('change', translate);


function updateCharacterLimit() {
    characterLimit.textContent = `${text.value.length}/10000`;
}

async function translate() {
    if (sourceId.value === "" || targetId.value === "") {
        return;
    } else if (sourceId.value === targetId.value) {
        translation.value = text.value;
    } else if (text === "") {
        translation.value = "";
    } else {
        translation.value = await fetchTranslation();
    }
}

async function fetchTranslation() {
    const request = {
        method: 'post',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Text: text.value, SourceId: sourceId.value, TargetId: targetId.value })
    };

    const response = await fetch('/translate', request);
    const body = await response.json();
    return body.translation;
}

function debounce(callback, delay = 500) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback.apply(this, args), delay);
    };
}