# Movie Picture Stitching - Eagle Plugin

<div align="center">

![Eagle Plugin](https://img.shields.io/badge/Eagle-Plugin-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-GPL--3.0-red?style=for-the-badge)

**[中文](./README_CN.md)** | **English**

A modern Eagle image management plugin for vertically stitching multiple movie images into panoramic compositions

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Development](#-development)

</div>

## 📸 Preview

![cover](./image/cover.png)
![feature](./image/feature.png)


## ✨ Features

### 🎯 Core Functionality

- **Smart Stitching**: Vertically stitch multiple images into panoramic compositions
- **Precise Cropping**: Support top and bottom percentage-based cropping
- **Multi-format Export**: Output in JPG, WebP, PNG formats
- **Quality Control**: 0.1-1.0 precise quality adjustment
- **Real-time Preview**: High-performance Canvas rendering

### 🎨 Modern Interface
- **Dark Theme**: Eagle-style modern dark interface
- **Glass Effects**: Frosted glass backgrounds and refined visual effects
- **Smooth Animations**: Fluid page loading and interaction animations
- **Responsive Design**: Perfect adaptation to various screen sizes

### 🚀 Advanced Features
- **Parameter Validation**: Smart parameter adjustment preventing invalid inputs
- **Error Handling**: Comprehensive error catching with user-friendly messages
- **Resource Management**: Automatic cleanup of temporary files and memory
- **Performance Optimization**: Parallel image loading with debounced processing

### TO DO

- [ ] **Internationalization**: Multilingual support

## 🛠 Installation

### Method 1: Direct Installation

1. Download the plugin package
2. Open `Settings` → `Plugins` → `Plugins Center` in Eagle
3. Click `Install Plugin`
4. Enable the plugin

![Plugin install one](./image/install_eagle.png)

### Method 2: Development Installation
1. Download the plugin package
2. Open `Settings` → `Plugins` → `Developer` in Eagle
3. Click `Install Local Plugin`
4. Select the plugin folder
5. Enable the plugin

![Plugin install two](./image/install_dev.png)

## 📖 Usage

### Basic Operations
1. **Select Images**: Choose images to stitch in Eagle
2. **Launch Plugin**: Start "Movie Picture Stitching" from plugin menu
3. **Adjust Parameters**: 
   - Set top cropping percentage (first image)
   - Set bottom cropping percentage (other images)
   - Choose export format and quality
4. **Preview Result**: Click "Preview" button to see stitching result
5. **Save Image**: Click "Save" button to export to current Eagle folder

![](./screenshots/main_interface.png)
![](./screenshots/feature_demo.png)
![](./screenshots/result_showcase.png)

### Parameter Guide
- **Top Cropping**: No affects first image, crops specified percentage from top
- **Bottom Cropping**: Affects all images, crops specified percentage from bottom
- **Export Format**: 
  - `JPG`: Suitable for photos, smaller file size
  - `WebP`: Modern format, balanced quality and size
  - `PNG`: Lossless format, supports transparency
- **Export Quality**: 0.1-1.0, higher values mean better quality and larger files

### Usage Tips
- 💡 **Smart Hints**: System automatically displays maximum settable value for each parameter
- 💡 **Parameter Limits**: Top + bottom cropping total cannot exceed 99%
- 💡 **Real-time Updates**: Preview automatically updates when cropping parameters change
- 💡 **Performance**: Recommended to process no more than 50 images at once

## 🔧 Development

### Project Structure
```
Movie Picture Stitching/
├── index.html              # Main interface file
├── manifest.json           # Plugin configuration
├── logo.png                # Plugin icon
├── README.md               # Project documentation (Chinese)
├── README_EN.md            # Project documentation (English)
├── css/
│   ├── index.css           # Main stylesheet
│   ├── README.md           # CSS module documentation
│   └── modules/            # CSS modules
│       ├── variables.css   # CSS variable definitions
│       ├── base.css        # Base styles
│       ├── layout.css      # Layout styles
│       ├── header.css      # Header navigation
│       ├── forms.css       # Form controls
│       ├── buttons.css     # Button styles
│       ├── components.css  # Component styles
│       ├── scrollbar.css   # Scrollbar styling
│       ├── animations.css  # Animation effects
│       └── responsive.css  # Responsive design
├── js/
│   └── plugin.js           # Core JavaScript logic
└── _locales/               # Internationalization files
    ├── en.json
    ├── zh_CN.json
    ├── zh_TW.json
    ├── ja_JP.json
    └── ko_KR.json
```

### Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Design**: CSS Grid, Flexbox, CSS Variables
- **Animations**: CSS Animations, Transitions
- **Image Processing**: Canvas API
- **File Operations**: Node.js fs, path modules

### Core API
```javascript
// Get validated parameters
const params = getParams(adjustingElement);

// Render preview
await renderPreview();

// Save image
await saveImage();

// Resource cleanup
cleanup();
```

### CSS Architecture
The project uses a modular CSS architecture with CSS variable system:
```css
/* Main variables */
:root {
  --color-bg-primary: #0d1117;
  --color-accent-primary: #238636;
  --border-radius-lg: 12px;
  --spacing-lg: 16px;
  --transition-normal: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 🐛 Troubleshooting

### Common Issues

**Q: Plugin won't start**
- Check if Eagle version supports plugins
- Verify plugin file integrity
- Check error messages in Eagle plugin management page

**Q: Image stitching fails**
- Confirm selected files are valid image formats
- Check if image count is too high (recommend <50 images)
- Verify parameter settings are reasonable

**Q: Preview display issues**
- Refresh plugin page and retry
- Check if image dimensions are too large
- Confirm browser supports Canvas functionality

**Q: Interface display issues**
- Clear browser cache
- Check CSS file integrity
- Confirm browser supports modern CSS features

### Performance Optimization Tips
- Keep image count under 50 per batch
- Use JPG format to reduce memory usage
- Avoid processing ultra-high resolution images
- Restart plugin periodically to free memory

## 📋 Changelog

### v1.0.0 (2025-08-31)
- 🎨 Brand new modern UI design
- 🚀 Complete rewrite of core functionality
- 📱 Added responsive design support
- ✨ New glass effects and animations
- 🔧 Optimized performance and error handling
- 📖 Modular CSS architecture

### v0.0.1 (Initial)
- 🎯 Basic image stitching functionality
- ⚙️ Parameter adjustment interface
- 💾 Multi-format export support

## 📄 License

This project is licensed under the [GPL License](LICENSE).

## 🙏 Acknowledgments

- [Eagle](https://eagle.cool/) - Excellent image management software
- All contributors and users for their support

## 📞 Contact

- Project Homepage: [GitHub Repository](https://github.com/liangshao07/eagle-movie-picture-stitching)
- Issue Reports: [Issues](https://github.com/liangshao07/eagle-movie-picture-stitching/issues)
- Feature Requests: [Discussions](https://github.com/liangshao07/eagle-movie-picture-stitching/discussions)

---

<div align="center">

**If this plugin helps you, please give it a ⭐ Star!**

Made with ❤️ by Liang

</div>
