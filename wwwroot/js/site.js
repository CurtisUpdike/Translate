const sourceText = document.getElementById('SourceText');
const sourceControls = document.getElementById('sourceControls');

const characterLimit = document.createElement('span');
characterLimit.id = 'characterLimit';
characterLimit.textContent = `${sourceText.value.length}/10000`;
sourceControls.append(characterLimit);

sourceText.addEventListener('input', handleTextChange);

function handleTextChange() {
    characterLimit.textContent = `${sourceText.value.length}/10000`;
}