# HTML to Markdown Converter Extension

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful browser extension that converts HTML content to Markdown with a beautiful UI and advanced features.

## Description

HTML to Markdown Converter is a Chrome extension that allows you to easily convert HTML content from any webpage to Markdown format. With a modern UI powered by Monaco Editor, you can view, edit, and convert HTML to Markdown with precision and efficiency.

## Features

- **Convert HTML to Markdown**: Convert any HTML content to clean Markdown using Turndown
- **Monaco Editor Integration**: Rich text editing with syntax highlighting for both HTML and Markdown
- **Live Preview**: Real-time Markdown preview with GitHub styling
- **URL-based Selector Rules**: Configure custom CSS selectors for specific URL patterns
- **Content Sanitization**: Optional DOMPurify integration for security
- **Custom CSS Editor**: Add custom styles to the extension UI
- **Copy Functionality**: Copy content from any active tab with one click
- **Tab-based Interface**: Switch seamlessly between HTML, Markdown, and Preview
- **Responsive Design**: Beautiful UI with Tailwind-inspired styling

## Installation

### From Source

1. Clone the repository:
   ```bash
   git clone https://github.com/liudonghua123/html_to_markdown.git
   ```

2. Open Chrome and navigate to `chrome://extensions`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the extension directory

### From Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store once published.

## Usage

### Popup Interface

1. Click the extension icon in the toolbar to open the popup
2. Use the "Get Page Content" button to retrieve HTML from the current page
3. The HTML will appear in the HTML editor tab with proper formatting
4. Click "Convert to Markdown" to convert the HTML content
5. Use the tabs to switch between HTML, Markdown, and Preview views
6. Use the "Copy" button to copy the content of the current active tab

### Options Page

1. Right-click the extension icon and select "Options" or click the settings icon in the popup
2. Toggle DOMPurify on/off for security in General Settings
3. Add custom rules for specific URLs with CSS selectors in Rule Configuration
4. Add custom CSS to style the extension UI in the Custom CSS section
5. Click "Save Options" to persist your changes

## Screenshots


![](snapshots/options.png)

![](snapshots/popup-html.png)

![](snapshots/popup-markdown.png)

![](snapshots/popup-markdown-preview.png)

## Technologies Used

- **Turndown**: HTML to Markdown conversion
- **Turndown-plugin-gfm**: GitHub Flavored Markdown support
- **DOMPurify**: HTML sanitization for security
- **Marked**: Markdown parsing and rendering
- **Monaco Editor**: Rich text editing experience
- **GitHub Markdown CSS**: Styling for preview
- **Tailwind CSS**: Modern UI styling
- **Chrome Extension APIs**: Browser integration

## Development

### Project Structure

```
html_to_markdown/
├── manifest.json              # Extension manifest
├── popup.html                 # Popup interface
├── popup.js                   # Popup logic
├── popup-editor.css           # Popup editor styles
├── options.html               # Options page
├── options.js                 # Options logic
├── options-editor.css         # Options editor styles
├── background.js              # Background service worker
├── README.md                  # English documentation
├── README-zh_CN.md            # Chinese documentation
├── icon*.png                  # Extension icons
├── vendor/                    # Third-party libraries
│   ├── @tailwind-browser@4.js
│   ├── turndown.js
│   ├── turndown-plugin-gfm.js
│   ├── dompurify.js
│   ├── marked.js
│   ├── github-markdown-css.css
│   └── monaco-editor/
└── ...
```

### Adding New Features

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Contributing

We welcome contributions from the community! Here are some ways you can contribute:

### Bug Reports

When reporting bugs, please include:
- Extension version
- Chrome version
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable

### Feature Requests

We're always looking for ways to improve the extension. When suggesting features:
- Explain the use case
- Describe how it would benefit users
- Consider potential implementation challenges

### Pull Requests

1. Check the issue tracker for existing requests
2. Fork the repository and create your branch from `main`
3. Follow the existing code style
4. Add tests if applicable
5. Update documentation as needed
6. Open a pull request with a clear description of your changes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/liudonghua123/html_to_markdown/issues) page for existing discussions
2. Open a new issue if your problem is not addressed
3. Provide as much detail as possible to help us resolve your issue quickly

## Author

- **liudonghua123** - Initial work and ongoing maintenance

## Acknowledgments

- Monaco Editor team for the excellent code editor
- Turndown team for the HTML to Markdown conversion
- Marked team for Markdown parsing
- The open source community for continued support

---

Made with ❤️ for the developer community. 

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)