# CSS架构说明

本项目采用模块化CSS架构，提供清晰的代码组织和良好的可维护性。

**中文** | **[English](./README.md)**

## 📁 文件结构

```
css/
├── index.css              # 主样式文件，导入所有模块
├── README.md              # CSS模块说明 (中文)
├── README_EN.md           # CSS模块说明 (English)
└── modules/               # CSS模块目录
    ├── variables.css      # CSS变量和设计系统
    ├── base.css          # 基础重置样式
    ├── layout.css        # 布局和容器样式
    ├── header.css        # 顶部导航栏样式
    ├── forms.css         # 表单控件样式
    ├── buttons.css       # 按钮样式
    ├── components.css    # 组件样式
    ├── scrollbar.css     # 滚动条美化
    ├── animations.css    # 动画和过渡效果
    └── responsive.css    # 响应式设计
```

## 🎯 模块功能

### variables.css
**设计系统核心**
- 🎨 颜色变量：主题色、背景色、文本色
- 📏 尺寸变量：间距、圆角、字体大小
- 🎭 效果变量：阴影、渐变、过渡动画
- 🌓 深色主题：GitHub风格的深色设计

### base.css
**基础样式重置**
- 📱 现代CSS重置
- 🔤 字体系统设置
- 🎯 选择状态美化
- ♿ 可访问性基础

### layout.css
**布局结构**
- 🏗️ 主容器布局
- 🪟 玻璃效果背景
- 📦 内容区域布局
- 🔄 Flexbox布局系统

### header.css
**顶部导航**
- 🧭 导航栏样式
- 🎨 渐变文字效果
- 🏷️ 品牌标识设计
- 📱 响应式导航

### forms.css
**表单控件**
- 📝 输入框样式
- 🎯 焦点状态动画
- ⚠️ 错误状态提示
- 📊 滑块和选择器

### buttons.css
**按钮系统**
- 🎨 渐变按钮设计
- 🖱️ 悬停和激活状态
- 🔄 加载状态动画
- 📏 多种尺寸变体

### components.css
**独立组件**
- 📋 文件列表样式
- 🖼️ 预览区域设计
- 📄 卡片组件样式
- 🎯 状态指示器

### scrollbar.css
**滚动条美化**
- 🎨 自定义滚动条设计
- 🌗 主题匹配样式
- 📱 跨浏览器兼容
- 🎯 交互状态效果

### animations.css
**动画系统**
- 🔄 页面加载动画
- 📱 交互反馈动画
- 🎭 过渡效果库
- ⚡ 性能优化动画

### responsive.css
**响应式设计**
- 📱 移动端适配
- 💻 桌面端优化
- 📐 断点系统
- 🔄 弹性布局

## 🎨 设计系统

### 颜色体系
```css
/* 主要颜色 */
--color-bg-primary: #0d1117      /* 主背景 */
--color-bg-secondary: #161b22    /* 次要背景 */
--color-accent-primary: #238636  /* 主题色 */
--color-accent-secondary: #1f6feb /* 次要主题色 */

/* 功能颜色 */
--color-success: #28a745         /* 成功状态 */
--color-error: #dc3545           /* 错误状态 */
--color-warning: #ffc107         /* 警告状态 */
--color-info: #17a2b8            /* 信息状态 */
```

### 间距系统
```css
/* 间距尺寸 */
--spacing-xs: 4px    /* 极小间距 */
--spacing-sm: 8px    /* 小间距 */
--spacing-md: 12px   /* 中等间距 */
--spacing-lg: 16px   /* 大间距 */
--spacing-xl: 24px   /* 超大间距 */
--spacing-2xl: 32px  /* 巨大间距 */
```

### 动画系统
```css
/* 过渡动画 */
--transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1)
--transition-normal: 0.25s cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 0.4s cubic-bezier(0.4, 0, 0.2, 1)
```

## 🔧 自定义指南

### 修改主题色
```css
/* 在 variables.css 中修改 */
:root {
  --color-accent-primary: #your-color;
  --color-accent-secondary: #your-secondary-color;
}
```

### 调整间距
```css
/* 在 variables.css 中修改 */
:root {
  --spacing-lg: 20px; /* 调整主要间距 */
}
```

### 添加新组件
1. 在相应模块文件中添加样式
2. 遵循BEM命名规范
3. 使用CSS变量确保一致性
4. 添加必要的响应式适配

### 自定义动画
```css
/* 在 animations.css 中添加 */
@keyframes your-animation {
  from { /* 开始状态 */ }
  to { /* 结束状态 */ }
}

.your-element {
  animation: your-animation var(--transition-normal) ease-out;
}
```

## 📱 响应式断点

```css
/* 移动端 */
@media (max-width: 768px) { }

/* 平板端 */
@media (min-width: 769px) and (max-width: 1024px) { }

/* 桌面端 */
@media (min-width: 1025px) { }
```

## 🎯 最佳实践

### 1. 使用CSS变量
```css
/* ✅ 好的做法 */
.button {
  background: var(--color-accent-primary);
  padding: var(--spacing-md);
}

/* ❌ 避免硬编码 */
.button {
  background: #238636;
  padding: 12px;
}
```

### 2. 遵循BEM命名
```css
/* ✅ 好的做法 */
.form-control { }
.form-control__input { }
.form-control--error { }

/* ❌ 避免嵌套过深 */
.form .control .input.error { }
```

### 3. 模块化组织
```css
/* ✅ 功能相关的样式放在一起 */
/* forms.css */
.form-control { }
.form-input { }
.form-button { }

/* ❌ 避免混合不同功能 */
```

### 4. 性能优化
```css
/* ✅ 使用transform代替改变layout */
.animate {
  transform: translateY(10px);
  transition: transform var(--transition-normal);
}

/* ❌ 避免动画layout属性 */
.animate {
  top: 10px;
  transition: top var(--transition-normal);
}
```

## 🔄 维护指南

### 添加新功能
1. 确定功能归属的模块
2. 在对应模块文件中添加样式
3. 更新相关文档
4. 测试响应式效果

### 重构现有样式
1. 备份原有样式
2. 逐步重构，保持功能不变
3. 测试所有状态和断点
4. 更新文档说明

### 性能监控
1. 定期检查CSS文件大小
2. 移除未使用的样式
3. 优化选择器性能
4. 监控动画性能

---

**注意**: 修改CSS时请保持模块化原则，确保样式的可维护性和一致性。
