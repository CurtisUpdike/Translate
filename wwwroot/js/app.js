let { createElement: e, StrictMode } = React;
let { createRoot } = ReactDOM;


createRoot(document.getElementById('root'))
  .render(withStrictMode(App));


function App() {
  return (
    e('div', { className: 'text-translation' },
      e(TranslationInput),
      e(TranslationOutput)
    )
  );
}


function TranslationInput() {
  return (
    e('div', { className: 'text-input' },
      e('div', { className: 'character-limit' }, '0/10000'),
      e('div', { className: 'detected-language-container'}, 'English'),
      e(LanguageDropdown),
      e(TextArea)
    )
  );
}


function TranslationOutput() {
  return (
    e('div', { className: 'text-input' },
      e(LanguageDropdown),
      e(
        'div', 
        { className: 'copy-container'}, 
        null, 
        e(CopyIcon),
        e('div', { className: 'tooltiptext' }, "Copied!")
      ),
      e(TextArea)
    )
  );
}


function LanguageDropdown() {
  return (
    e('div', { className: 'dropdown language-dropdown', 'aria-label': 'Dropdown' }, 
      e('div', { className: 'selected-item option'}, "Language", e(OpenCloseArrowIcon)),
      e('div', { className: 'dropdown-content' },
        e('div', { className: 'search-bar' },
          e('div', { className: 'bx--form-item bx--text-input-wrapper' },
            e('div', { className: 'bx--text-input__field-wrapper' }, 
              e('input', { className: 'bx--text-input bx--text__input', placeholder: 'Search...', type: 'text' })
            )
          ),
          e(SearchIcon)
        ),
        e('div', { className: 'columns' },
          e('div', { className: 'column', style: { width: '25%' } },
            e('div', { className: 'option' }, 'Language', e(CheckIcon))
          ),
          e('div', { className: 'column', style: { width: '25%' } }),
          e('div', { className: 'column', style: { width: '25%' } }),
          e('div', { className: 'column', style: { width: '25%' } })
        )
      )
    )
  );
}


function TextArea() {
  return (
    e('div', { className: 'bx--form-item'}, 
      e('div', { className: 'bx--text-area__wrapper' }, 
        e('textarea', { className: 'bx--text-area text-area', rows: '10' })
      )
    )
  );
}


function OpenCloseArrowIcon() {
  return e('div', { className: 'icon open-close-arrow' },
    e('svg', { ...sharedSvgAttributes, viewBox: "0 0 16 16" }, 
      e('path', { d: 'M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z'})
    )
  );
}


function SearchIcon() {
  return e('svg', { ...sharedSvgAttributes, viewBox: "0 0 16 16" },
    e('path', { d: 'M8,1C4.1,1,1,4.1,1,8s3.1,7,7,7s7-3.1,7-7S11.9,1,8,1z M10.7,11.5L8,8.8l-2.7,2.7l-0.8-0.8L7.2,8L4.5,5.3l0.8-0.8L8,7.2	l2.7-2.7l0.8,0.8L8.8,8l2.7,2.7L10.7,11.5z' })
  );
}


function CheckIcon() {
  return e('svg', { ...sharedSvgAttributes, viewBox: "0 0 32 32" },
    e('path', { d: 'M12 21.2L4.9 14.1 3.5 15.5 10.6 22.6 12 24 26.1 9.9 24.7 8.4z' })
  );
}


function CopyIcon() {
  return e('svg', { ...sharedSvgAttributes, viewBox: "0 0 32 32" },
    e('path', { d: 'M28,10V28H10V10H28m0-2H10a2,2,0,0,0-2,2V28a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V10a2,2,0,0,0-2-2Z' }),
    e('path', { d: 'M4,18H2V4A2,2,0,0,1,4,2H18V4H4Z' })
  );
}


const sharedSvgAttributes = {
  focusable: "false", 
  preserveAspectRatio: "xMidYMid meet",
  fill: "#ffffff",
  xmlns: "http://www.w3.org/2000/svg",
  width: "16",
  height: "16",
  'aria-hidden': "true",
  style: { willChange: 'transform' }
}


function withStrictMode(app) {
  return e(StrictMode, null, e(app));
}