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


// Stateful Components

function App() {
  const detectDefault = { id: null, name: 'Detect Language'};
  const maxLength = 10000;

  let [allSources, setAllSources] = useState([]);
  let [allTargets, setAllTargets] = useState([]);
  let [source, setSource] = useState(detectDefault);
  let [target, setTarget] = useState(null);
  let [translation, setTranslation] = useState('');
  let [detected, setDetected] = useState(null);
  let [characterCount, setCharacterCount] = useState(0);
  let inputRef = useRef();

  useEffect(() => {
    loadLanguages();
  }, []);

  async function loadLanguages() {
    let languages = await api.languages();
    setAllSources([detectDefault, ...languages.filter(l => l.supportedAsSource)]);
    setAllTargets(languages.filter(l => l.supportedAsTarget));
  }

  function handleInput(event) {
    setCharacterCount(event.target.value.length);
    translate(source?.id, target?.id);
  }

  function handleSourceChange(newSource) {
    setSource(newSource);
    translate(newSource?.id, target?.id);
  }

  function handleTargetChange(newTarget) {
    setTarget(newTarget);
    translate(source?.id, newTarget?.id);
  }

  async function translate(sourceId, targetId) {
    let result = await api.translate(inputRef.current.value, sourceId, targetId)
    setTranslation(result.translation);
    if (result.detectedLanguage && result.detectedConfidence) {        
      setDetected({
        language: getLanguageName(result.detectedLanguage),
        confidence: result.detectedConfidence
      });
    } else {
      setDetected(null);
    }
  }

  let getLanguageName = (languageId) => allSources
    .filter(l => l.id === languageId)
    .map(l => l.name)
    .at(0) || null;

  return (
    appContainer(
      inputContainer(
        dropdown({ 
          languages: allSources, 
          selected: source,
          select: handleSourceChange,
        }),
        translationInput({ onChange: handleInput, ref: inputRef, maxLength }),
        detectedLanguage({ detected }),
        characterLimit({ characterCount, maxLength })
      ),
      outputContainer(
        dropdown({ 
          languages: allTargets,
          selected: target,
          select: handleTargetChange,
        }),
        translationOutput({ value: translation || '' }),
        copy({ translation })
      )
    )
  );
}


function Dropdown(props) {
  let { languages, selected, select } = props;
  let [active, setActive] = useState(false);
  let [search, setSearch] = useState('');
  let selectRef = useRef();
  let inputRef = useRef();
  let searchRef = useRef();

  useEffect(() => {
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);

    function handler(event) {
      let [selectClicked, searchClicked] = [
        selectRef.current.contains(event.target), 
        searchRef.current.contains(event.target)
      ];

      if (selectClicked) setActive(prev => !prev);
      else if (searchClicked) return;
      else setActive(false);
    }
  }, []);

  useEffect(() => {
    if(active) setTimeout(() => inputRef?.current.focus(), 50);
  }, [active]);

  function setLanguage(language) {
    select(language);
    setSearch('');
  }

  let languageOptions = languages
    .filter(l => l.name.toUpperCase().includes(search.toUpperCase()))
    .map(l => (
      option({
        onClick: () => setLanguage(l),
        name: l.name,
        active: l.id === selected?.id
      })
    ));

  return (
    drowpdownWrapper(
      selectedItem({
        ref: selectRef,
        name: selected?.name,
        active
      }),
      dropdownContent({ active },
        searchBar({ 
          searchRef,
          inputRef,
          value: search,
          onChange: (e) => setSearch(e.target.value),
          clear: () => setSearch('')
        }),
        options({ items: languageOptions })
      )
    )
  );
}


function Copy({ translation }) {
  let [active, setActive] = useState(false);

  function onClick() {
    navigator.clipboard.writeText(translation);
    setActive(true);
    setTimeout(() => setActive(false), 1000);
  }

  return (
    div({ className: `copy-button ${active ? 'active' : ''}`, onClick }, 
      copyIcon(),
      div({ className: 'tooltip' }, 'Copied!')
    )
  );
}


// Pure Components

function Options({ items }) {
  let numRows = 15;
  let columns = [];

  for (let i = 0; i < items.length; i += numRows) {
    columns.push(items.slice(i, i + numRows));
  }

  let width = (100 / columns.length) + '%';
  
  return (
    div({ className: 'columns' },
      columns.map((row, index) => 
        div({ key: index, className: 'column', style: { width } },
        ...row
        )
      )
    )
  );
}


function DetectLanguage({ detected }) {
  if (!detected) return null;

  let values = ['low', 'medium', 'high'];
  let index = Math.floor((detected.confidence / (1 / values.length)));
  let value = values[index];

  return (
    div({ className: 'detected'},
      span({ className: 'language' }, detected.language),
      span({ className: 'confidence' },
        "-- ",
        span({ className: `value ${value}`}, `${value} Confidence`)))
  );
}


// Component Elements

let withStrictMode = (element) => createElement(StrictMode, null, createElement(element));
let dropdown = (props) => createElement(Dropdown, props);
let options = (props) => createElement(Options, props);
let copy = (props) => createElement(Copy, props);
let detectedLanguage = (props) => createElement(DetectLanguage, props);


// HTML Elements

let div = (props, ...children) => createElement('div', props, ...children);
let span = (props, ...children) => createElement('span', props, ...children);
let input = (props, ...children) => createElement('input', props, ...children);
let textarea = (props, ...children) => createElement('textarea', props, ...children);
let svg = (props, ...children) => createElement('svg', props, ...children);
let path = (props, ...children) => createElement('path', props, ...children);


// Composed Elements

let appContainer = (...children) =>
  div({ className: 'app' }, ...children);

let inputContainer = (...children) =>
  div({ className: 'form-section' }, ...children);

let outputContainer = (...children) =>
  div({ className: 'form-section' }, ...children);

let characterLimit = ({ characterCount, maxLength }) =>
  div({ className: 'character-limit' }, `${characterCount}/${maxLength}`);

let drowpdownWrapper = (...children) =>
  div({ className: 'dropdown', 'aria-label': 'Dropdown' }, ...children)

let translationInput = (props) =>
  text({ placeholder: 'Enter text', ...props });

let translationOutput = (props) =>
  text({ placeholder: 'Translation', className: 'output', readOnly: true, ...props });

let text = (props) =>
  div({ className: 'textarea-wrapper' }, 
    textarea({ rows: '10', ...props }));

let dropdownContent = ({ active }, ...children) =>
  div({ className: `dropdown-content ${active ? 'active' : ''}` }, ...children);

let selectedItem = ({ ref, name, active}) =>
  div({ className: 'selected-item', ref }, 
    name || 'Select', 
    arrowIcon({ active }));

let searchInput = (props) =>
  div({ className: 'input-wrapper' },
    input({
      className: 'input',
      placeholder: 'Search...',
      type: 'text',
      ...props
    }));

let searchBar = ({ searchRef, inputRef, value, onChange, clear }) =>
  div({ className: 'search-bar', ref: searchRef },
    searchInput({ value, onChange, ref: inputRef }),
    clearIcon({ onClick: clear }));

let option = ({ onClick, active, name }) =>
  div({ className: 'option', onClick },
    name,
    checkIcon({ active }));

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
  div({ className: `icon open-close-arrow ${active ? 'active' : ''}` },
    svg({ ...svgAttributes, viewBox: '0 0 16 16' }, 
      path({ d: 'M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z'})));

let clearIcon = (props) =>
  svg({ ...svgAttributes, className: 'icon clear-icon', viewBox: '0 0 16 16', ...props },
    path({ d: 'M8,1C4.1,1,1,4.1,1,8s3.1,7,7,7s7-3.1,7-7S11.9,1,8,1z M10.7,11.5L8,8.8l-2.7,2.7l-0.8-0.8L7.2,8L4.5,5.3l0.8-0.8L8,7.2	l2.7-2.7l0.8,0.8L8.8,8l2.7,2.7L10.7,11.5z' }));

let checkIcon = ({ active }) => 
  svg({ ...svgAttributes, className: `icon check-icon ${active ? 'active' : ''}`, viewBox: '0 0 32 32' },
    path({ d: 'M12 21.2L4.9 14.1 3.5 15.5 10.6 22.6 12 24 26.1 9.9 24.7 8.4z' }));

let copyIcon = () =>
  svg({ ...svgAttributes, viewBox: '0 0 32 32' },
    path({ d: 'M28,10V28H10V10H28m0-2H10a2,2,0,0,0-2,2V28a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V10a2,2,0,0,0-2-2Z' }),
    path({ d: 'M4,18H2V4A2,2,0,0,1,4,2H18V4H4Z' }));


// Api

let api = {
  languages: async () => {
    let response = await fetch('/api/languages');
    return await response.json();
  },
  
  translate: async (text, sourceId, targetId) => {
    let defaultResponse = {
      translation: null,
      detectedLanguage: null,
      detectedConfidence: null
    };
  
    if (!targetId || !text) return defaultResponse;
    if (sourceId === targetId) return { ...defaultResponse, translation: text };
  
    let response = await fetch('/api/translate', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, sourceId, targetId })
    });
    
    return await response.json();
  }
};