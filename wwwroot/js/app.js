let { 
  createElement, 
  StrictMode,
  useState,
  useEffect,
  useRef
} = React;
let { createRoot } = ReactDOM;


document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById('root'))
    .render(withStrictMode(App));
});


function App() {
  let [allSources, setAllSources] = useState([]);
  let [allTargets, setAllTargets] = useState([]);
  let detect = { id: 'detect', name: 'Detect Language'};
  let [source, setSource] = useState(detect);
  let [target, setTarget] = useState(null);
  let [translation, setTranslation] = useState('');
  let [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    fetch('/languages')
      .then(response => response.json())
      .then(languages => {
        setAllSources([detect, ...languages.filter(l => l.supportedAsSource)]);
        setAllTargets(languages.filter(l => l.supportedAsTarget));
      });
  }, []);

  function handleInput(event) {
    setCharacterCount(event.target.value.length);
    translate(event.target.value);
  }

  async function translate(text) {
    setTranslation(await fetchTranslation(text, source?.id, target?.id));
  }

  return (
    appContainer(
      inputContainer(
        dropdown({ 
          languages: allSources, 
          selected: source,
          select: setSource
        }),
        translationInput({ onChange: handleInput }),
        detectedLanguage('English'),
        characterLimit(characterCount)
      ),
      outputContainer(
        dropdown({ 
          languages: allTargets,
          selected: target,
          select: setTarget
        }),
        translationOutput({ value: translation }),
        copy()
      )
    )
  );
}


function Dropdown(props) {
  let { languages, selected, select } = props;
  let [active, setActive] = useState(false);
  let [search, setSearch] = useState('');
  let selectRef = useRef();
  let searcRef = useRef();

  useEffect(() => {
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);

    function handler(event) {
      if (selectRef.current.contains(event.target))
        setActive(state => !state);
      else if (searcRef.current.contains(event.target))
        return;
      else
        setActive(false);
    }
  });

  let createOption = ({ id, name }) => 
    option({
      onClick: () => select({ id, name }),
      name,
      active: id === selected?.id
    });

  let searchFilter = (l) => l.name.toUpperCase().includes(search.toUpperCase());

  let languageOptions = languages.filter(searchFilter).map(createOption);

  return (
    drowpdownWrapper(
      selectedItem({
        ref: selectRef,
        name: selected?.name,
        active
      }),
      dropdownContent({ active },
        searchBar({ 
          ref: searcRef, 
          onChange: (e) => setSearch(e.target.value) 
        }),
        div({ className: 'columns' },
          div({ className: 'column', style: { width: '25%' } },
            ...languageOptions
          ),
          div({ className: 'column', style: { width: '25%' } }),
          div({ className: 'column', style: { width: '25%' } }),
          div({ className: 'column', style: { width: '25%' } })
        )
      )
    )
  );
}


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


let withStrictMode = (element) =>
  createElement(StrictMode, null, createElement(element));

let div = (props, ...children) =>
  createElement('div', props, ...children);

let input = (props, ...children) =>
  createElement('input', props, ...children);

let appContainer = (...children) =>
  div({ className: 'text-translation' }, ...children);

let inputContainer = (...children) =>
  div({ className: 'form' }, ...children);

let outputContainer = (...children) =>
  div({ className: 'form translation-output' }, ...children);

let characterLimit = (count) =>
  div({ className: 'character-limit' }, `${count}/10000`);

let drowpdownWrapper = (...children) =>
  div({ className: 'dropdown language-dropdown', 'aria-label': 'Dropdown' }, ...children)

let inputWrapper = (...children) =>
  div({ className: 'form-item' },
    div({ className: 'text-input-wrapper' }, ...children));

let textAreaWrapper = (...children) =>
  div({ className: 'form-item'}, 
    div({ className: 'text-area-wrapper' }, ...children));

let translationInput = (props) =>
  textarea({ placeholder: 'Enter text', ...props });

let translationOutput = (props) =>
  textarea({ placeholder: 'Translation', readOnly: true, ...props });

let textarea = (props) =>
  textAreaWrapper(
    createElement('textarea', { className: 'text-area', rows: '10', ...props }));

let dropdown = ({ languages, selected, select }) => 
  createElement(Dropdown, { languages, selected, select });

let dropdownContent = ({ active }, ...children) =>
  div({ className: `dropdown-content ${active ? 'active' : ''}` }, ...children);

let selectedItem = ({ ref, name, active}) =>
  div({ className: 'selected-item option', ref }, 
    name || 'Select', 
    arrowIcon({ active })
  );

let searchInput = (props) =>
  inputWrapper(input({
    className: 'text-input',
    placeholder: 'Search...',
    type: 'text',
    ...props
  }));

let searchBar = ({ ref, onChange }) =>
  div({ className: 'search-bar', ref },
    searchInput({ onChange }),
    clearIcon()
  );

let option = ({ onClick, active, name }) =>
  div({ className: 'option', onClick },
    name,
    checkIcon({ active })
  );

let copy = () => 
  div({ className: 'copy-container'}, 
    copyIcon(),
    div({ className: 'tooltiptext' }, 'Copied!')
  );

let detectedLanguage = (text) =>
  div({ className: 'detected-language-container'}, text);


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


let arrowIcon = ({ active }) => 
  createElement('div', { className: `icon open-close-arrow ${active ? 'active' : ''}` },
    createElement('svg', { ...svgAttributes, viewBox: '0 0 16 16' }, 
      createElement('path', { d: 'M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z'})
    )
  );


let clearIcon = () =>
  createElement('svg', { ...svgAttributes, className: 'icon clear-icon', viewBox: '0 0 16 16'},
    createElement('path', { d: 'M8,1C4.1,1,1,4.1,1,8s3.1,7,7,7s7-3.1,7-7S11.9,1,8,1z M10.7,11.5L8,8.8l-2.7,2.7l-0.8-0.8L7.2,8L4.5,5.3l0.8-0.8L8,7.2	l2.7-2.7l0.8,0.8L8.8,8l2.7,2.7L10.7,11.5z' })
  );


let checkIcon = ({ active }) => 
  createElement('svg', { 
      ...svgAttributes, 
      className: `icon check-icon ${active ? 'active' : ''}`, 
      viewBox: '0 0 32 32' 
    },
    createElement('path', { d: 'M12 21.2L4.9 14.1 3.5 15.5 10.6 22.6 12 24 26.1 9.9 24.7 8.4z' })
  );


let copyIcon = () =>
  createElement('svg', { ...svgAttributes, viewBox: '0 0 32 32' },
    createElement('path', { d: 'M28,10V28H10V10H28m0-2H10a2,2,0,0,0-2,2V28a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V10a2,2,0,0,0-2-2Z' }),
    createElement('path', { d: 'M4,18H2V4A2,2,0,0,1,4,2H18V4H4Z' })
  );