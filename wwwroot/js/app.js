let { 
  createElement, 
  StrictMode,
  useState
} = React;
let e = createElement;
let { createRoot } = ReactDOM;


document.addEventListener('DOMContentLoaded', main);

function main() {
  createRoot(document.getElementById('root'))
    .render(withStrictMode(App));
}


// type Language = { language: string; name: string; }


function App() {
  let [allSources] = useState([
    { language: 'detect', name: 'Detect Language'},
    { language: 'en', name: 'English'},
    { language: 'es', name: 'Spanish' }
  ]);

  let [allTargets] = useState([
    { language: 'en', name: 'English'},
    { language: 'es', name: 'Spanish' }
  ]);

  let [source, setSource] = useState({ language: 'detect', name: 'Detect Language'});
  let [target, setTarget] = useState(null);
  let [translation, setTranslation] = useState('');

  return (
    e('div', { className: 'text-translation' },
      e(TranslationInput, { allSources, source, setSource, target, setTranslation }),
      e(TranslationOutput, { allTargets, target, setTarget, translation })
    )
  );
}


function TranslationInput({ allSources, source, setSource, target, setTranslation }) {
  let [characterCount, setCharacterCount] = useState(0);

  function handleInput(e) {
    setCharacterCount(e.target.value.length);
    translate(e.target.value);
  }

  async function translate(text) {
    setTranslation(await fetchTranslation(text, source?.language, target?.language));
  }
  
  return (
    e('div', { className: 'form' },
      createCharacterLimit(characterCount),
      e('div', { className: 'detected-language-container'}, 'English'),
      e(Dropdown, { 
        languages: allSources, 
        selected: source,
        select: setSource
      }),
      e(TextArea, { placeholder: 'Enter text', onChange: handleInput })
    )
  );
}


function TranslationOutput({ target, setTarget, allTargets, translation }) {
  return (
    e('div', { className: 'form translation-output' },
      e(Dropdown, { 
        languages: allTargets,
        selected: target,
        select: setTarget
      }),
      e(
        'div',
        { className: 'copy-container'}, 
        e(CopyIcon),
        e('div', { className: 'tooltiptext' }, 'Copied!')
      ),
      e(TextArea, { placeholder: 'Translation', value: translation, readOnly: true })
    )
  );
}


function Dropdown(props) {
  let { languages, selected, select } = props;
  let [active, setActive] = useState(false);
  let [search, setSearch] = useState('');


  let toggleOpen = () => setActive(state => !state);
  let handleSearch = (e) => setSearch(e.target.value);

  let createOption = ({ language, name }) => 
    createElement(
      'div',
      {
        className: 'option',
        onClick: () => select({ language, name })
      },
      name,
      createElement(CheckIcon, { isSelected: (language === selected?.language) })
    );

  let searchInput = e('div', { className: 'search-bar' },
    createTextInputWrapper(
      createElement(
        'input',
        {
          className: 'text-input',
          placeholder: 'Search...',
          type: 'text',
          onChange: handleSearch
        }
      )
    ),
    e(ClearSearchIcon)
  );

  let searchFilter = (l) => l.name.toUpperCase().includes(search.toUpperCase());
  let languageOptions = languages.filter(searchFilter).map(createOption);

  return (
    e('div', { className: 'dropdown language-dropdown', 'aria-label': 'Dropdown' }, 
      e('div', { className: 'selected-item option', onClick: toggleOpen }, 
        selected?.name || 'Select', 
        e(OpenCloseArrowIcon, { active })
      ),
      e('div', { className: `dropdown-content ${active ? 'active' : ''}` },
        searchInput,
        e('div', { className: 'columns' },
          e('div', { className: 'column', style: { width: '25%' } },
            ...languageOptions
          ),
          e('div', { className: 'column', style: { width: '25%' } }),
          e('div', { className: 'column', style: { width: '25%' } }),
          e('div', { className: 'column', style: { width: '25%' } })
        )
      )
    )
  );
}


let TextArea = (props) =>
  createTextAreaWrapper(
    createElement('textarea', { className: 'text-area', rows: '10', ...props }));


let withStrictMode = (app) =>
  createElement(StrictMode, null, createElement(app));


let createCharacterLimit = (c) =>
  createElement('div', { className: 'character-limit' }, `${c}/10000`);


let createTextInputWrapper = (children) =>
  createElement('div', { className: 'form-item' },
    createElement('div', { className: 'text-input-wrapper' }, children));


let createTextAreaWrapper = (children) =>
  createElement('div', { className: 'form-item'}, 
    createElement('div', { className: 'text-area-wrapper' }, children));


async function fetchTranslation(text, source, target) {
  if (!source || !target || !text)
    return '';

  if (source === target)
    return text;

  let request = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Text: text, SourceId: source, TargetId: target })
  };

  let response = await fetch('/translate', request);
  let body = await response.json();
  return body.translation;
}


/*
** Icons
*/

let svgAttributes = {
  focusable: 'false', 
  preserveAspectRatio: 'xMidYMid meet',
  fill: '#ffffff',
  xmlns: 'http://www.w3.org/2000/svg',
  width: '16',
  height: '16',
  'aria-hidden': 'true',
  style: { willChange: 'transform' }
};


let OpenCloseArrowIcon = ({ isOpen }) => (
  e('div', { className: `icon open-close-arrow ${isOpen ? 'active' : ''}` },
    e('svg', { ...svgAttributes, viewBox: '0 0 16 16' }, 
      e('path', { d: 'M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z'})
    )
  )
);


let ClearSearchIcon = () => (
  e('svg', { ...svgAttributes, className: 'icon clear-icon', viewBox: '0 0 16 16' },
    e('path', { d: 'M8,1C4.1,1,1,4.1,1,8s3.1,7,7,7s7-3.1,7-7S11.9,1,8,1z M10.7,11.5L8,8.8l-2.7,2.7l-0.8-0.8L7.2,8L4.5,5.3l0.8-0.8L8,7.2	l2.7-2.7l0.8,0.8L8.8,8l2.7,2.7L10.7,11.5z' })
  )
);


let CheckIcon = ({ isSelected }) => (
  e(
    'svg', 
    { 
      ...svgAttributes, 
      className: `icon check-icon ${isSelected ? 'active' : ''}`, 
      viewBox: '0 0 32 32' 
    },
    e('path', { d: 'M12 21.2L4.9 14.1 3.5 15.5 10.6 22.6 12 24 26.1 9.9 24.7 8.4z' })
  )
);


let CopyIcon = () => (
  e('svg', { ...svgAttributes, viewBox: '0 0 32 32' },
    e('path', { d: 'M28,10V28H10V10H28m0-2H10a2,2,0,0,0-2,2V28a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V10a2,2,0,0,0-2-2Z' }),
    e('path', { d: 'M4,18H2V4A2,2,0,0,1,4,2H18V4H4Z' })
  )
);