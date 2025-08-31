# Movie Picture Stitching - Eagle Plugin

<div align="center">

![Eagle Plugin](https://img.shields.io/badge/Eagle-Plugin-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-GPL--3.0-red?style=for-the-badge)

**[English](./README.md)** | **中文**

一个现代化的Eagle图片管理软件插件，用于将多张电影台词图片垂直拼接成长图


[功能特性](#-功能特性) • [安装说明](#-安装说明) • [使用方法](#-使用方法) • [开发文档](#-开发文档)

</div>

## 📸 预览

![cover](./image/cover.png)
![feature](./image/feature.png)

## ✨ 功能特性

### 🎯 核心功能

- **智能拼接**: 将多张图片垂直拼接成一张长图
- **精确裁剪**: 支持顶部和底部精确百分比裁剪
- **多格式支持**: 输出JPG、WebP、PNG格式
- **质量控制**: 0.1-1.0精确质量调节
- **实时预览**: Canvas直接渲染，高性能预览

### 🎨 现代化界面
- **深色主题**: GitHub风格的现代深色界面
- **玻璃效果**: 毛玻璃背景和精致视觉效果
- **流畅动画**: 页面加载和交互的流畅动画
- **响应式设计**: 完美适配各种屏幕尺寸

### 🚀 高级特性
- **参数验证**: 智能参数调整，防止无效输入
- **错误处理**: 完善的错误捕获和用户友好提示
- **资源管理**: 自动清理临时文件和内存
- **性能优化**: 并行图片加载，防抖处理

### TO DO
- [ ] **国际化**: 多语言支持


## 🛠 安装说明

### 方式一：直接安装

1. 下载插件文件包
2. 在Eagle中打开 `设置` → `插件` → `插件中心`
3. 点击 `安装插件`
4. 启用插件

![Plugin install one](./image/install_eagle.png)


### 方式二：开发安装
1. 在Eagle中打开 `设置` → `插件` → `开发者选项`
3. 点击 `安装本地插件`
4. 启用插件

![Plugin install two](./image/install_dev.png)

## 📖 使用方法

### 基本操作
1. **选择图片**: 在Eagle中选择要拼接的图片
2. **打开插件**: 通过插件菜单启动"Movie Picture Stitching"
3. **调整参数**: 
   - 设置顶部裁剪百分比
   - 设置底部裁剪百分比
   - 选择导出格式和质量
4. **预览效果**: 点击"预览"按钮查看拼接效果
5. **保存图片**: 点击"保存"按钮导出到Eagle当前文件夹

### 参数说明
- **顶部裁剪**: 不对第一张图片生效，从顶部裁剪指定百分比
- **底部裁剪**: 对所有图片生效，从底部裁剪指定百分比
- **导出格式**: 
  - `JPG`: 适合照片，文件较小
  - `WebP`: 现代格式，质量与体积平衡
  - `PNG`: 无损格式，支持透明度
- **导出质量**: 0.1-1.0，值越高质量越好，文件越大

### 使用技巧
- 💡 **智能提示**: 系统会自动显示每个参数的最大可设置值
- 💡 **参数限制**: 顶部+底部裁剪总和不能超过99%
- 💡 **实时调整**: 修改裁剪参数后会自动更新预览
- 💡 **性能优化**: 建议单次处理图片数量不超过50张

## 🔧 开发文档

### 项目结构

```
Movie Picture Stitching/
├── index.html              # 主界面文件
├── manifest.json           # 插件配置文件
├── logo.png                # 插件图标
├── README.md               # 项目文档 (中文)
├── README_EN.md            # 项目文档 (English)
├── css/
│   ├── index.css           # 主样式文件
│   ├── README.md           # CSS模块说明
│   └── modules/            # CSS模块
│       ├── variables.css   # CSS变量定义
│       ├── base.css        # 基础样式
│       ├── layout.css      # 布局样式
│       ├── header.css      # 顶部导航
│       ├── forms.css       # 表单控件
│       ├── buttons.css     # 按钮样式
│       ├── components.css  # 组件样式
│       ├── scrollbar.css   # 滚动条美化
│       ├── animations.css  # 动画效果
│       └── responsive.css  # 响应式设计
├── js/
│   └── plugin.js           # 核心JavaScript逻辑
└── _locales/               # 国际化文件
    ├── en.json
    ├── zh_CN.json
    ├── zh_TW.json
    ├── ja_JP.json
    └── ko_KR.json
```

### 技术栈
- **前端**: HTML5, CSS3, Vanilla JavaScript
- **设计**: CSS Grid, Flexbox, CSS Variables
- **动画**: CSS Animations, Transitions
- **图片处理**: Canvas API
- **文件操作**: Node.js fs, path modules

### 核心API

```javascript
// 获取验证后的参数
const params = getParams(adjustingElement);

// 渲染预览
await renderPreview();

// 保存图片
await saveImage();

// 资源清理
cleanup();
```

### CSS架构

项目采用模块化CSS架构，使用CSS变量系统：
```css
/* 主要变量 */
:root {
  --color-bg-primary: #0d1117;
  --color-accent-primary: #238636;
  --border-radius-lg: 12px;
  --spacing-lg: 16px;
  --transition-normal: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 🐛 故障排除

### 常见问题

**Q: 插件无法启动**
- 检查Eagle版本是否支持插件功能
- 确认插件文件完整性
- 查看Eagle插件管理页面的错误信息

**Q: 图片拼接失败**
- 确认选中的文件都是有效图片格式
- 检查图片数量是否过多（建议<50张）
- 确认参数设置是否合理

**Q: 预览显示异常**
- 刷新插件页面重试
- 检查图片尺寸是否过大
- 确认浏览器支持Canvas功能

**Q: 界面显示异常**
- 清除浏览器缓存
- 检查CSS文件是否完整
- 确认浏览器支持现代CSS特性

### 性能优化建议
- 单次处理图片数量控制在50张以内
- 使用JPG格式以减少内存占用
- 避免处理超高分辨率图片
- 定期重启插件释放内存

## 📋 更新日志

### v1.0.0 (2025-08-31)
- 🎨 全新现代化UI设计
- 🚀 完全重写核心功能
- 📱 添加响应式设计支持
- ✨ 新增玻璃效果和动画
- 🔧 优化性能和错误处理
- 📖 模块化CSS架构

### v0.0.1 (Initial)
- 🎯 基础图片拼接功能
- ⚙️ 参数调节界面
- 💾 多格式导出支持

## 📄 许可证

本项目基于 [GPL License](LICENSE) 开源协议。

## 🙏 致谢

- [Eagle](https://eagle.cool/) - 优秀的图片管理软件
- 所有贡献者和用户的支持

## 📞 联系方式

- 项目主页: [GitHub Repository](https://github.com/liangshao07/eagle-movie-picture-stitching)
- 问题反馈: [Issues](https://github.com/langshao07/eagle-movie-picture-stitching/issues)
- 功能建议: [Discussions](https://github.com/liangshao07/eagle-movie-picture-stitching/discussions)

---

<div align="center">
**如果这个插件对你有帮助，请给个 ⭐ Star 支持一下！**

Made with ❤️ by Liang

</div>
