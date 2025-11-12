// popup.js
// Libraries (DOMPurify, Marked, Turndown) are loaded as scripts in the HTML

document.addEventListener('DOMContentLoaded', async function() {
  // DOM elements
  const tabButtons = document.querySelectorAll('.tab-btn');
  const editors = document.querySelectorAll('.editor');
  const htmlEditorContainer = document.getElementById('html-editor');
  const markdownEditorContainer = document.getElementById('markdown-editor');
  const getContentBtn = document.getElementById('get-content');
  const convertBtn = document.getElementById('convert-btn');
  const copyBtn = document.getElementById('copy-btn');
  const optionsBtn = document.getElementById('options-btn');
  
  // Track the currently active tab
  let currentTab = 'html'; // Default to HTML tab
  
  // Editor instances
  let htmlEditor;
  let markdownEditor;
  
  // Initialize Monaco editors
  async function initMonacoEditors() {
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
            // Create HTML editor
            htmlEditor = monaco.editor.create(htmlEditorContainer, {
              value: '<!-- HTML content will appear here -->',
              language: 'html',
              theme: 'vs-light',
              automaticLayout: true,
              minimap: { enabled: false }
            });
            
            // Create Markdown editor
            markdownEditor = monaco.editor.create(markdownEditorContainer, {
              value: '# Markdown will appear here',
              language: 'markdown',
              theme: 'vs-light',
              automaticLayout: true,
              minimap: { enabled: false }
            });
            
            // Set up change listener to update preview
            markdownEditor.onDidChangeModelContent(() => {
              updatePreview();
            });
            
            // Trigger layout to ensure proper sizing
            setTimeout(() => {
              if (htmlEditor) htmlEditor.layout();
              if (markdownEditor) markdownEditor.layout();
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
  
  // Update markdown preview using shadow DOM for proper styling
  function updatePreview() {
    if (typeof marked !== 'undefined' && markdownEditor) {
      const markdownText = markdownEditor.getValue();
      const html = marked.parse(markdownText);
      
      const previewContainer = document.getElementById('markdown-preview-container');
      
      // Create or reuse shadow root
      let shadowRoot = previewContainer.shadowRoot;
      if (!shadowRoot) {
        shadowRoot = previewContainer.attachShadow({ mode: 'open' });
      }
      
      // Apply GitHub Markdown CSS
      shadowRoot.innerHTML = `
        <style>
          ${getGithubMarkdownCSS()}
        </style>
        <div class="markdown-body">
          ${html}
        </div>
      `;
    }
  }
  
  // Function to get GitHub Markdown CSS content
  function getGithubMarkdownCSS() {
    // We'll inject the CSS as a string
    // In a real implementation, you'd load this from the file
    return `
      .markdown-body {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        margin: 0;
        color: #24292f;
        background-color: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
        font-size: 16px;
        line-height: 1.5;
        word-wrap: break-word;
      }

      .markdown-body .octicon {
        display: inline-block;
        fill: currentColor;
        vertical-align: text-bottom;
      }

      .markdown-body h1:hover .anchor .octicon-link:before,
      .markdown-body h2:hover .anchor .octicon-link:before,
      .markdown-body h3:hover .anchor .octicon-link:before,
      .markdown-body h4:hover .anchor .octicon-link:before,
      .markdown-body h5:hover .anchor .octicon-link:before,
      .markdown-body h6:hover .anchor .octicon-link:before {
        width: 16px;
        height: 16px;
        content: ' ';
        display: inline-block;
        background-color: currentColor;
        -webkit-mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' aria-hidden='true'><path fill-rule='evenodd' d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 012.83 0 .75.75 0 001.06-1.06l-1.25-1.25a2 2 0 010-2.83.75.75 0 00-1.06 1.06l1.25 1.25a.5.5 0 010 .71l-1.25 1.25a.75.75 0 000 1.06Zm-4.4 4.4a.75.75 0 00-1.06 1.06l1.25 1.25a2 2 0 010 2.83.75.75 0 001.06-1.06l-1.25-1.25a.5.5 0 010-.71l1.25-1.25a.75.75 0 00-1.06-1.06L3.375 8.675a.5.5 0 010-.71Zm1.65 8.65a2 2 0 002.83 0l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a.5.5 0 01-.71 0l-1.25-1.25a.75.75 0 00-1.06 1.06l1.25 1.25Zm8.65-4.4a2 2 0 000-2.83l-1.25-1.25a.75.75 0 00-1.06 1.06l1.25 1.25a.5.5 0 010 .71l-1.25 1.25a.75.75 0 001.06 1.06l1.25-1.25a.5.5 0 01.71 0Z'></path></svg>");
        mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' aria-hidden='true'><path fill-rule='evenodd' d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 012.83 0 .75.75 0 001.06-1.06l-1.25-1.25a2 2 0 010-2.83.75.75 0 00-1.06 1.06l1.25 1.25a.5.5 0 010 .71l-1.25 1.25a.75.75 0 000 1.06Zm-4.4 4.4a.75.75 0 00-1.06 1.06l1.25 1.25a2 2 0 010 2.83.75.75 0 001.06-1.06l-1.25-1.25a.5.5 0 010-.71l1.25-1.25a.75.75 0 00-1.06-1.06L3.375 8.675a.5.5 0 010-.71Zm1.65 8.65a2 2 0 002.83 0l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a.5.5 0 01-.71 0l-1.25-1.25a.75.75 0 00-1.06 1.06l1.25 1.25Zm8.65-4.4a2 2 0 000-2.83l-1.25-1.25a.75.75 0 00-1.06 1.06l1.25 1.25a.5.5 0 010 .71l-1.25 1.25a.75.75 0 001.06 1.06l1.25-1.25a.5.5 0 01.71 0Z'></path></svg>");
      }

      .markdown-body details,
      .markdown-body figcaption,
      .markdown-body figure {
        display: block;
      }

      .markdown-body summary {
        display: list-item;
      }

      .markdown-body [hidden] {
        display: none !important;
      }

      .markdown-body a {
        background-color: transparent;
        color: #0969da;
        text-decoration: none;
      }

      .markdown-body abbr[title] {
        border-bottom: none;
        text-decoration: underline dotted;
      }

      .markdown-body b,
      .markdown-body strong {
        font-weight: 600;
      }

      .markdown-body dfn {
        font-style: italic;
      }

      .markdown-body h1 {
        margin: .67em 0;
        font-weight: 600;
        padding-bottom: .3em;
        font-size: 2em;
        border-bottom: 1px solid hsla(210,18%,87%,1);
      }

      .markdown-body h2 {
        margin: .75em 0;
        font-weight: 600;
        padding-bottom: .3em;
        font-size: 1.5em;
        border-bottom: 1px solid hsla(210,18%,87%,1);
      }

      .markdown-body h3 {
        margin: .8em 0;
        font-weight: 600;
        font-size: 1.25em;
      }

      .markdown-body h4 {
        margin: 1em 0;
        font-weight: 600;
        font-size: 1em;
      }

      .markdown-body h5 {
        margin: 1em 0;
        font-weight: 600;
        font-size: .875em;
      }

      .markdown-body h6 {
        margin: 1em 0;
        font-weight: 600;
        font-size: .85em;
        color: #57606a;
      }

      .markdown-body h1 .octicon-link,
      .markdown-body h2 .octicon-link,
      .markdown-body h3 .octicon-link,
      .markdown-body h4 .octicon-link,
      .markdown-body h5 .octicon-link,
      .markdown-body h6 .octicon-link {
        color: #24292f;
        vertical-align: middle;
        visibility: hidden;
      }

      .markdown-body h1:hover .anchor,
      .markdown-body h2:hover .anchor,
      .markdown-body h3:hover .anchor,
      .markdown-body h4:hover .anchor,
      .markdown-body h5:hover .anchor,
      .markdown-body h6:hover .anchor {
        text-decoration: none;
      }

      .markdown-body h1:hover .anchor .octicon-link,
      .markdown-body h2:hover .anchor .octicon-link,
      .markdown-body h3:hover .anchor .octicon-link,
      .markdown-body h4:hover .anchor .octicon-link,
      .markdown-body h5:hover .anchor .octicon-link,
      .markdown-body h6:hover .anchor .octicon-link {
        visibility: visible;
      }

      .markdown-body h1 tt,
      .markdown-body h1 code,
      .markdown-body h2 tt,
      .markdown-body h2 code,
      .markdown-body h3 tt,
      .markdown-body h3 code,
      .markdown-body h4 tt,
      .markdown-body h4 code,
      .markdown-body h5 tt,
      .markdown-body h5 code,
      .markdown-body h6 tt,
      .markdown-body h6 code {
        padding: 0 .2em;
        font-size: inherit;
      }

      .markdown-body details summary {
        cursor: pointer;
      }

      .markdown-body details:not([open]) > *:not(summary) {
        display: none !important;
      }

      .markdown-body kbd {
        display: inline-block;
        padding: 3px 5px;
        font: 11px ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
        line-height: 10px;
        color: #24292f;
        vertical-align: middle;
        background-color: #f6f8fa;
        border: solid 1px rgba(175,184,193,0.2);
        border-bottom-color: rgba(175,184,193,0.2);
        border-radius: 6px;
        box-shadow: inset 0 -1px 0 rgba(175,184,193,0.2);
      }

      .markdown-body h1,
      .markdown-body h2,
      .markdown-body h3,
      .markdown-body h4,
      .markdown-body h5,
      .markdown-body h6,
      .markdown-body ol,
      .markdown-body ul,
      .markdown-body details {
        margin-top: 0;
        margin-bottom: 0;
      }

      .markdown-body ol,
      .markdown-body ul {
        list-style: none;
        padding: 0;
      }

      .markdown-body ol ol,
      .markdown-body ul ol {
        list-style-type: lower-roman;
      }

      .markdown-body ol ol ol,
      .markdown-body ol ul ol,
      .markdown-body ul ol ol,
      .markdown-body ul ul ol {
        list-style-type: lower-alpha;
      }

      .markdown-body dd {
        margin-left: 0;
      }

      .markdown-body code,
      .markdown-body tt {
        padding: .2em .4em;
        margin: 0;
        font-size: 85%;
        background-color: rgba(175,184,193,0.2);
        border-radius: 6px;
      }

      .markdown-body pre code {
        font-size: 100%;
        padding: 0;
      }

      .markdown-body .octicon {
        display: inline-block;
        overflow: visible !important;
        vertical-align: text-bottom;
        fill: currentColor;
      }

      .markdown-body ::placeholder {
        color: #6e7781;
        opacity: 1;
      }

      .markdown-body input::-webkit-outer-spin-button,
      .markdown-body input::-webkit-inner-spin-button {
        margin: 0;
        -webkit-appearance: none;
        appearance: none;
      }

      .markdown-body .pl-c {
        color: #6e7781;
      }

      .markdown-body .pl-c1,
      .markdown-body .pl-s .pl-v {
        color: #0550ae;
      }

      .markdown-body .pl-e,
      .markdown-body .pl-en {
        color: #8250df;
      }

      .markdown-body .pl-smi,
      .markdown-body .pl-s .pl-s1 {
        color: #24292f;
      }

      .markdown-body .pl-ent {
        color: #116329;
      }

      .markdown-body .pl-k {
        color: #cf222e;
      }

      .markdown-body .pl-s,
      .markdown-body .pl-pds,
      .markdown-body .pl-s .pl-pse .pl-s1,
      .markdown-body .pl-sr,
      .markdown-body .pl-sr .pl-cce,
      .markdown-body .pl-sr .pl-sre,
      .markdown-body .pl-sr .pl-sra {
        color: #0a3069;
      }

      .markdown-body .pl-v,
      .markdown-body .pl-smw {
        color: #953800;
      }

      .markdown-body .pl-bu {
        color: #82071e;
      }

      .markdown-body .pl-ii {
        color: #f6f8fa;
        background-color: #82071e;
      }

      .markdown-body .pl-c2 {
        color: #f6f8fa;
        background-color: #cf222e;
      }

      .markdown-body .pl-sr .pl-cce {
        font-weight: bold;
        color: #116329;
      }

      .markdown-body .pl-ml {
        color: #3b2300;
      }

      .markdown-body .pl-mh,
      .markdown-body .pl-mh .pl-en,
      .markdown-body .pl-ms {
        font-weight: bold;
        color: #0550ae;
      }

      .markdown-body .pl-mi {
        font-style: italic;
        color: #24292f;
      }

      .markdown-body .pl-mb {
        font-weight: bold;
        color: #24292f;
      }

      .markdown-body .pl-md {
        color: #82071e;
        background-color: #ffebe9;
      }

      .markdown-body .pl-mi1 {
        color: #116329;
        background-color: #dafbe1;
      }

      .markdown-body .pl-mc {
        color: #953800;
        background-color: #ffd8b5;
      }

      .markdown-body .pl-mi2 {
        color: #eaeef2;
        background-color: #0550ae;
      }

      .markdown-body .pl-mdr {
        font-weight: bold;
        color: #8250df;
      }

      .markdown-body .pl-ba {
        color: #57606a;
      }

      .markdown-body .pl-sg {
        color: #8c959f;
      }

      .markdown-body .pl-corl {
        text-decoration: underline;
        color: #0a3069;
      }

      .markdown-body [data-catalyst] {
        display: block;
      }

      .markdown-body g-emoji {
        font-family: "Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
        font-size: 1em;
        font-style: normal !important;
        font-weight: 400;
        line-height: 1;
        vertical-align: -0.075em;
      }

      .markdown-body g-emoji img {
        width: 1em;
        height: 1em;
      }

      .markdown-body::before {
        display: table;
        content: "";
      }

      .markdown-body::after {
        display: table;
        clear: both;
        content: "";
      }

      .markdown-body > *:first-child {
        margin-top: 0 !important;
      }

      .markdown-body > *:last-child {
        margin-bottom: 0 !important;
      }

      .markdown-body a:not([href]) {
        color: inherit;
        text-decoration: none;
      }

      .markdown-body .absent {
        color: #cf222e;
      }

      .markdown-body .anchor {
        float: left;
        padding-right: 4px;
        margin-left: -20px;
        line-height: 1;
      }

      .markdown-body .anchor:focus {
        outline: none;
      }

      .markdown-body p,
      .markdown-body blockquote,
      .markdown-body ul,
      .markdown-body ol,
      .markdown-body dl,
      .markdown-body table,
      .markdown-body pre,
      .markdown-body details {
        margin-top: 0;
        margin-bottom: 16px;
      }

      .markdown-body blockquote > :first-child {
        margin-top: 0;
      }

      .markdown-body blockquote > :last-child {
        margin-bottom: 0;
      }

      .markdown-body h1 .octicon-link,
      .markdown-body h2 .octicon-link,
      .markdown-body h3 .octicon-link,
      .markdown-body h4 .octicon-link,
      .markdown-body h5 .octicon-link,
      .markdown-body h6 .octicon-link {
        color: #24292f;
        vertical-align: middle;
        visibility: hidden;
      }

      .markdown-body h1:hover .anchor,
      .markdown-body h2:hover .anchor,
      .markdown-body h3:hover .anchor,
      .markdown-body h4:hover .anchor,
      .markdown-body h5:hover .anchor,
      .markdown-body h6:hover .anchor {
        text-decoration: none;
      }

      .markdown-body h1:hover .anchor .octicon-link,
      .markdown-body h2:hover .anchor .octicon-link,
      .markdown-body h3:hover .anchor .octicon-link,
      .markdown-body h4:hover .anchor .octicon-link,
      .markdown-body h5:hover .anchor .octicon-link,
      .markdown-body h6:hover .anchor .octicon-link {
        visibility: visible;
      }

      .markdown-body h1 code,
      .markdown-body h1 tt,
      .markdown-body h2 code,
      .markdown-body h2 tt,
      .markdown-body h3 code,
      .markdown-body h3 tt,
      .markdown-body h4 code,
      .markdown-body h4 tt,
      .markdown-body h5 code,
      .markdown-body h5 tt,
      .markdown-body h6 code,
      .markdown-body h6 tt {
        padding: 0 .2em;
        font-size: inherit;
      }

      .markdown-body summary h1,
      .markdown-body summary h2,
      .markdown-body summary h3,
      .markdown-body summary h4,
      .markdown-body summary h5,
      .markdown-body summary h6 {
        display: inline-block;
      }

      .markdown-body summary h1 .anchor,
      .markdown-body summary h2 .anchor,
      .markdown-body summary h3 .anchor,
      .markdown-body summary h4 .anchor,
      .markdown-body summary h5 .anchor,
      .markdown-body summary h6 .anchor {
        margin-left: -40px;
      }

      .markdown-body summary h1,
      .markdown-body summary h2 {
        padding-bottom: 0;
        border-bottom: none;
      }

      .markdown-body ul,
      .markdown-body ol {
        padding-left: 2em;
      }

      .markdown-body ul.no-list,
      .markdown-body ol.no-list {
        padding: 0;
        list-style-type: none;
      }

      .markdown-body ol[type="1"] {
        list-style-type: decimal;
      }

      .markdown-body ol[type="a"] {
        list-style-type: lower-alpha;
      }

      .markdown-body ol[type="i"] {
        list-style-type: lower-roman;
      }

      .markdown-body div > ol:not([type]) {
        list-style-type: decimal;
      }

      .markdown-body ul ul,
      .markdown-body ul ol,
      .markdown-body ol ol,
      .markdown-body ol ul {
        margin-top: 0;
        margin-bottom: 0;
      }

      .markdown-body li > p {
        margin-top: 16px;
      }

      .markdown-body li + li {
        margin-top: .25em;
      }

      .markdown-body dl {
        padding: 0;
      }

      .markdown-body dl dt {
        padding: 0;
        margin-top: 16px;
        font-size: 1em;
        font-style: italic;
        font-weight: 600;
      }

      .markdown-body dl dd {
        padding: 0 16px;
        margin-bottom: 16px;
      }

      .markdown-body table th {
        font-weight: 600;
      }

      .markdown-body table th,
      .markdown-body table td {
        padding: 6px 13px;
        border: 1px solid #d0d7de;
      }

      .markdown-body table tr {
        background-color: #ffffff;
        border-top: 1px solid hsla(210,18%,87%,1);
      }

      .markdown-body table tr:nth-child(2n) {
        background-color: #f6f8fa;
      }

      .markdown-body table img {
        background-color: transparent;
      }

      .markdown-body img {
        max-width: 100%;
        box-sizing: content-box;
        background-color: #ffffff;
      }

      .markdown-body img[align=right] {
        padding-left: 20px;
      }

      .markdown-body img[align=left] {
        padding-right: 20px;
      }

      .markdown-body .emoji {
        max-width: none;
        vertical-align: text-top;
        background-color: transparent;
      }

      .markdown-body span.frame {
        display: block;
        overflow: hidden;
      }

      .markdown-body span.frame > span {
        display: block;
        float: left;
        width: auto;
        padding: 7px;
        margin: 13px 0 0;
        overflow: hidden;
        border: 1px solid #d0d7de;
      }

      .markdown-body span.frame span img {
        display: block;
        float: left;
      }

      .markdown-body span.frame span span {
        display: block;
        padding: 5px 0 0;
        clear: both;
        color: #24292f;
      }

      .markdown-body span.align-center {
        display: block;
        overflow: hidden;
        clear: both;
      }

      .markdown-body span.align-center > span {
        display: block;
        margin: 13px auto 0;
        overflow: hidden;
        text-align: center;
      }

      .markdown-body span.align-center span img {
        margin: 0 auto;
        text-align: center;
      }

      .markdown-body span.align-right {
        display: block;
        overflow: hidden;
        clear: both;
      }

      .markdown-body span.align-right > span {
        display: block;
        margin: 13px 0 0;
        overflow: hidden;
        text-align: right;
      }

      .markdown-body span.align-right span img {
        margin: 0;
        text-align: right;
      }

      .markdown-body span.float-left {
        display: block;
        float: left;
        margin-right: 13px;
        overflow: hidden;
      }

      .markdown-body span.float-left span {
        margin: 13px 0;
      }

      .markdown-body span.float-right {
        display: block;
        float: right;
        margin-left: 13px;
        overflow: hidden;
      }

      .markdown-body span.float-right > span {
        display: block;
        margin: 13px auto 0;
        overflow: hidden;
        text-align: right;
      }

      .markdown-body code,
      .markdown-body tt {
        padding: .2em .4em;
        margin: 0;
        font-size: 85%;
        background-color: rgba(175,184,193,0.2);
        border-radius: 6px;
      }

      .markdown-body code br,
      .markdown-body tt br {
        display: none;
      }

      .markdown-body del code {
        text-decoration: inherit;
      }

      .markdown-body samp {
        font-size: 85%;
      }

      .markdown-body pre code {
        font-size: 100%;
        padding: 0;
        background: transparent;
        border: 0;
      }

      .markdown-body pre > code {
        padding: 0;
        margin: 0;
        word-break: normal;
        white-space: pre;
        background: transparent;
        border: 0;
      }

      .markdown-body .highlight {
        margin-bottom: 16px;
      }

      .markdown-body .highlight pre {
        margin-bottom: 0;
        word-break: normal;
      }

      .markdown-body .highlight pre,
      .markdown-body pre {
        padding: 16px;
        overflow: auto;
        font-size: 85%;
        line-height: 1.45;
        background-color: #f6f8fa;
        border-radius: 6px;
      }

      .markdown-body pre code,
      .markdown-body pre tt {
        display: inline;
        max-width: auto;
        padding: 0;
        margin: 0;
        overflow: visible;
        line-height: inherit;
        word-wrap: normal;
        background-color: transparent;
        border: 0;
      }

      .markdown-body .csv-data td,
      .markdown-body .csv-data th {
        padding: 5px;
        overflow: hidden;
        font-size: 12px;
        line-height: 1;
        text-align: left;
        white-space: nowrap;
      }

      .markdown-body .csv-data .blob-num {
        padding: 10px 8px 9px;
        text-align: right;
        background: #ffffff;
        border: 0;
        vertical-align: top;
      }

      .markdown-body .footnotes {
        font-size: 12px;
        color: #57606a;
        border-top: 1px solid #d0d7de;
      }

      .markdown-body .footnotes ol {
        padding-left: 16px;
      }

      .markdown-body .footnotes li {
        position: relative;
      }

      .markdown-body .footnotes li:target::before {
        position: absolute;
        top: -8px;
        right: -8px;
        bottom: -8px;
        left: -24px;
        pointer-events: none;
        content: "";
        border: 2px solid #0969da;
        border-radius: 6px;
      }

      .markdown-body .footnotes li:target {
        color: #24292f;
      }

      .markdown-body .pl-c {
        color: #6e7781;
      }

      .markdown-body .pl-a {
        color: #0969da;
      }

      .markdown-body .pl-s,
      .markdown-body .pl-p {
        color: #0a3069;
      }

      .markdown-body .pl-sm {
        color: #7d4e2d;
      }

      .markdown-body .pl-sv {
        color: #0a3069;
      }

      .markdown-body .pl-smi {
        color: #24292f;
      }

      .markdown-body .pl-e {
        color: #8250df;
      }

      .markdown-body .pl-ef {
        color: #8250df;
      }

      .markdown-body .pl-en {
        color: #8250df;
      }

      .markdown-body .pl-ent {
        color: #116329;
      }

      .markdown-body .pl-k {
        color: #cf222e;
      }

      .markdown-body .pl-ko {
        color: #82071e;
      }

      .markdown-body .pl-m {
        color: #0550ae;
      }

      .markdown-body .pl-md {
        color: #82071e;
        background-color: #ffebe9;
      }

      .markdown-body .pl-mi {
        color: #24292f;
        font-style: italic;
      }

      .markdown-body .pl-mb {
        color: #0a3069;
        font-weight: bold;
      }

      .markdown-body .pl-mdh {
        color: #0550ae;
        font-weight: bold;
      }

      .markdown-body .pl-mdi {
        color: #0969da;
        font-weight: bold;
      }

      .markdown-body .pl-ms1 {
        background-color: #ddf4ff;
      }

      .markdown-body .pl-mp {
        color: #0550ae;
        font-weight: bold;
      }

      .markdown-body .pl-mc {
        color: #953800;
      }

      .markdown-body .pl-mq {
        color: #0a3069;
      }

      .markdown-body .pl-mr {
        color: #0550ae;
      }

      .markdown-body .pl-mp1 {
        color: #116329;
      }

      .markdown-body .pl-mi1 {
        color: #116329;
        background-color: #dafbe1;
      }

      .markdown-body .pl-mc {
        color: #953800;
      }

      .markdown-body .pl-mc {
        background-color: #ffd8b5;
      }

      .markdown-body .pl-mo {
        color: #0550ae;
      }

      .markdown-body .pl-mri {
        color: #0550ae;
      }

      .markdown-body .pl-v {
        color: #953800;
      }

      .markdown-body .pl-eo {
        color: #0550ae;
      }

      .markdown-body .pl-id {
        color: #82071e;
      }

      .markdown-body .pl-ib {
        background-color: #ffebe9;
      }

      .markdown-body .pl-iu {
        background-color: #ffebe9;
      }

      .markdown-body .pl-mo {
        color: #0550ae;
      }

      .markdown-body kbd {
        display: inline-block;
        padding: 3px 5px;
        font: 11px ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
        line-height: 10px;
        color: #24292f;
        vertical-align: middle;
        background-color: #f6f8fa;
        border: solid 1px rgba(175, 184, 193, 0.2);
        border-bottom-color: rgba(175, 184, 193, 0.2);
        border-radius: 6px;
        box-shadow: inset 0 -1px 0 rgba(175, 184, 193, 0.2);
      }
    `;
  }
  
  // Tab switching functionality
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tab = this.getAttribute('data-tab');
      
      // Update active tab button
      tabButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Track current tab
      currentTab = tab;
      
      // Show appropriate editor
      editors.forEach(editor => {
        editor.classList.remove('active');
        if (editor.id === `${tab}-editor` || 
            (tab === 'preview' && editor.id === 'preview-container')) {
          editor.classList.add('active');
        }
      });
    });
  });
  
  // Open options page
  optionsBtn.addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      // Fallback for older versions
      window.open(chrome.runtime.getURL('options.html'));
    }
  });
  
  // Copy content of the active tab
  copyBtn.addEventListener('click', async function() {
    // Determine which content to copy based on the current active tab
    let contentToCopy = '';
    
    if (currentTab === 'html' && htmlEditor) {
      contentToCopy = htmlEditor.getValue();
    } else if (currentTab === 'markdown' && markdownEditor) {
      contentToCopy = markdownEditor.getValue();
    } else if (currentTab === 'preview') {
      // For preview, get the innerHTML of the shadow root
      const previewContainer = document.getElementById('markdown-preview-container');
      const shadowRoot = previewContainer.shadowRoot;
      if (shadowRoot) {
        const markdownBody = shadowRoot.querySelector('.markdown-body');
        if (markdownBody) {
          // Get the plain text content while preserving structure
          contentToCopy = markdownBody.innerText || markdownBody.textContent || '';
        }
      }
    }
    
    if (contentToCopy) {
      try {
        await navigator.clipboard.writeText(contentToCopy);
        
        // Visual feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          Copied!`;
        
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy content to clipboard');
      }
    } else {
      alert('No content to copy in the currently active tab');
    }
  });
  
  // Get HTML content from current page
  getContentBtn.addEventListener('click', async function() {
    try {
      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Get the URL of the active tab
      const url = tab.url;
      
      // Retrieve options to get rules
      const options = await chrome.storage.sync.get({
        rules: [
          { urlPattern: 'http(s)?://.*', selector: 'body' }
        ]
      });
      
      // Find matching rule
      let selector = 'body'; // default selector
      for (const rule of options.rules) {
        const regex = new RegExp(rule.urlPattern);
        if (regex.test(url)) {
          selector = rule.selector;
          break;
        }
      }
      
      // Execute content script to get HTML
      const result = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (selector) => {
          const element = document.querySelector(selector);
          return element ? element.outerHTML : null;
        },
        args: [selector]
      });
      
      if (result && result[0] && result[0].result) {
        const htmlContent = result[0].result;
        
        if (htmlEditor) {
          htmlEditor.setValue(htmlContent);
          
          // Format the HTML using Monaco's built-in formatter
          // Wait a moment for the value to be set, then trigger formatting
          setTimeout(() => {
            // Trigger the format action in Monaco editor
            if (htmlEditor) {
              htmlEditor.getAction('editor.action.formatDocument').run().catch(() => {
                // If format action is not available, just continue
                console.log('Format action not available for HTML editor');
              });
            }
          }, 100);
        }
      } else {
        alert('Could not retrieve content from the page. The selector might not match any elements.');
      }
    } catch (error) {
      console.error('Error getting content:', error);
      alert('Error getting content from the page: ' + error.message);
    }
  });
  

  
  // Convert HTML to Markdown
  convertBtn.addEventListener('click', async function() {
    if (!htmlEditor || !markdownEditor) {
      alert('Editors are not ready yet. Please wait and try again.');
      return;
    }
    
    try {
      // Get current HTML content
      const htmlContent = htmlEditor.getValue();
      
      // Get options to check if DOMPurify should be used
      const options = await chrome.storage.sync.get({
        enableDOMPurify: true
      });
      
      // Process HTML with DOMPurify if enabled
      let processedHtml = htmlContent;
      if (options.enableDOMPurify) {
        // DOMPurify is loaded globally, so we'll need access to it
        processedHtml = DOMPurify.sanitize(htmlContent);
      }
      
      // Perform conversion using Turndown
      if (window.TurndownService) {
        const turndownService = new TurndownService({
          headingStyle: 'atx',
          hr: '---',
          bulletListMarker: '-',
          codeBlockStyle: 'fenced',
          emDelimiter: '*',
          strongDelimiter: '**',
          linkStyle: 'inlined',
          linkReferenceStyle: 'full'
        });
        
        // Add GFM (GitHub Flavored Markdown) plugins if available
        if (window.turndownPluginGfm) {
          turndownService.use(turndownPluginGfm.gfm);
        }
        
        const markdown = turndownService.turndown(processedHtml);
        markdownEditor.setValue(markdown);
        
        // Update preview
        updatePreview();
      } else {
        alert('Turndown service is not available. Please make sure it is loaded correctly.');
      }
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Error during conversion: ' + error.message);
    }
  });
  
  // Initialize editors and load options
  await initMonacoEditors();
  
  // Load any previously saved content
  chrome.storage.local.get(['lastHtml', 'lastMarkdown'], function(result) {
    if (result.lastHtml && htmlEditor) {
      htmlEditor.setValue(result.lastHtml);
    }
    if (result.lastMarkdown && markdownEditor) {
      markdownEditor.setValue(result.lastMarkdown);
      updatePreview();
    }
  });
  
  // Set initial currentTab based on the active button
  const initialActiveButton = document.querySelector('.tab-btn.active');
  if (initialActiveButton) {
    currentTab = initialActiveButton.getAttribute('data-tab');
  }
});