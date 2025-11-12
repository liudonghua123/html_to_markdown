// options.js
document.addEventListener('DOMContentLoaded', async function() {
  // DOM elements
  const dompurifyToggle = document.getElementById('dompurify-toggle');
  const ruleList = document.getElementById('rule-list');
  const addRuleBtn = document.getElementById('add-rule');
  const saveOptionsBtn = document.getElementById('save-options');
  const resetOptionsBtn = document.getElementById('reset-options');
  
  let cssEditor;
  
  // Initialize Monaco editor for CSS
  async function initCSSEditor() {
    // Load Monaco Editor
    return new Promise((resolve, reject) => {
      if (window.monaco) {
        resolve();
        return;
      }
      
      self.MonacoEnvironment = {
        getWorkerUrl: function (moduleId, label) {
          return chrome.runtime.getURL('vendor/monaco-editor/0.52.2/min/vs/base/worker/workerMain.js');
        }
      };

      const script = document.createElement('script');
      script.src = 'vendor/monaco-editor/0.52.2/min/vs/loader.min.js';
      script.onload = () => {
        if (typeof require !== 'undefined') {
          require.config({
            paths: {
              'vs': 'vendor/monaco-editor/0.52.2/min/vs'
            }
          });

          require(['vs/editor/editor.main'], () => {
            cssEditor = monaco.editor.create(document.getElementById('css-editor'), {
              value: '',
              language: 'css',
              theme: 'vs-light',
              automaticLayout: true,
              minimap: { enabled: false }
            });
            
            // Trigger layout to ensure proper sizing
            setTimeout(() => {
              if (cssEditor) cssEditor.layout();
            }, 100);
            
            resolve();
          }, (err) => {
            console.error('Monaco editor failed to load:', err);
            reject(new Error('Monaco editor failed to load'));
          });
        } else {
          reject(new Error('RequireJS not available'));
        }
      };
      script.onerror = (err) => {
        console.error('Failed to load Monaco loader:', err);
        reject(new Error('Failed to load Monaco editor'));
      };

      document.head.appendChild(script);
    });
  }
  
  // Load saved options
  function loadOptions() {
    chrome.storage.sync.get({
      enableDOMPurify: true,
      rules: [
        { urlPattern: 'http(s)?://.*', selector: 'body' }
      ],
      customCSS: ''
    }, function(items) {
      dompurifyToggle.checked = items.enableDOMPurify;
      
      // Clear existing rules
      ruleList.innerHTML = '';
      
      // Add rules to the UI
      items.rules.forEach((rule, index) => {
        addRuleToUI(rule.urlPattern, rule.selector, index);
      });
      
      // Set CSS in editor
      if (cssEditor) {
        cssEditor.setValue(items.customCSS);
      } else {
        // If editor isn't loaded yet, set timeout to try again
        setTimeout(() => {
          if (cssEditor) {
            cssEditor.setValue(items.customCSS);
          }
        }, 500);
      }
    });
  }
  
  // Add a rule to the UI
  function addRuleToUI(urlPattern, selector, index) {
    const ruleItem = document.createElement('div');
    ruleItem.className = 'flex items-center gap-2 p-2 mb-2 border border-gray-300 rounded-md bg-white';
    ruleItem.innerHTML = `
      <input type="text" class="flex-2 px-3 py-2 border border-gray-300 rounded-md text-sm" value="${urlPattern}" placeholder="URL Pattern (regex)">
      <input type="text" class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm" value="${selector}" placeholder="CSS Selector">
      <button class="remove-rule bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm">Remove</button>
    `;
    ruleList.appendChild(ruleItem);
  }
  
  // Event listeners
  addRuleBtn.addEventListener('click', function() {
    addRuleToUI('', '', ruleList.children.length);
  });
  
  // Use event delegation for remove rule buttons
  ruleList.addEventListener('click', function(e) {
    if (e.target.classList.contains('remove-rule')) {
      e.target.parentElement.remove();
    }
  });
  
  saveOptionsBtn.addEventListener('click', function() {
    // Collect rules from UI
    const rules = [];
    document.querySelectorAll('.flex.items-center.gap-2.p-2').forEach(item => {
      const urlPattern = item.querySelector('input:first-child').value;
      const selector = item.querySelector('input:nth-child(2)').value;
      
      if (urlPattern && selector) {
        rules.push({
          urlPattern: urlPattern,
          selector: selector
        });
      }
    });
    
    const options = {
      enableDOMPurify: dompurifyToggle.checked,
      rules: rules,
      customCSS: cssEditor ? cssEditor.getValue() : ''
    };
    
    chrome.storage.sync.set(options, function() {
      // Show confirmation
      const originalText = saveOptionsBtn.textContent;
      saveOptionsBtn.textContent = 'Saved!';
      setTimeout(() => {
        saveOptionsBtn.textContent = originalText;
      }, 2000);
    });
  });
  
  resetOptionsBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to reset all options to defaults?')) {
      chrome.storage.sync.clear(function() {
        location.reload();
      });
    }
  });
  
  // Initialize the editor and load options
  await initCSSEditor();
  loadOptions();
});