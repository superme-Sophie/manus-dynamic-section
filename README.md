# 动态配置section与图片上传HTML界面使用说明

## 项目概述

这是一个支持动态配置section和上传图片的HTML界面，并支持将主页面导出为图片。项目基于React开发，具有以下主要功能：

1. 动态添加、编辑、删除和排序章节
2. 支持多种章节类型：文本、图片、图表和卡片组
3. 图片上传与预览功能
4. 将整个页面导出为图片

## 如何使用

### 运行项目

1. 解压项目文件到本地目录
2. 有两种方式运行项目：
   - **开发模式**：在项目根目录执行 `pnpm run dev`
   - **生产模式**：直接在浏览器中打开 `dist/index.html` 文件

### 功能操作指南

#### 章节管理

1. **添加章节**：点击右侧章节管理面板中的"添加章节"按钮
2. **编辑章节**：点击章节项右侧的编辑图标
3. **删除章节**：点击章节项右侧的删除图标
4. **调整顺序**：使用上下箭头按钮调整章节顺序

#### 章节编辑

1. **设置标题**：在编辑弹窗中输入章节标题
2. **选择类型**：从下拉菜单中选择章节类型（文本、图片、图表、卡片组）
3. **编辑内容**：根据选择的类型，填写相应的内容
   - 文本：直接输入文本内容
   - 图片：上传并预览图片
   - 图表：选择图表类型并输入JSON格式的数据
   - 卡片组：设置卡片数量并编辑每个卡片的标题和内容

#### 图片上传

1. 在编辑图片类型章节时，可以通过以下方式上传图片：
   - 点击上传区域选择文件
   - 将图片文件拖放到上传区域
2. 上传后可以预览图片效果
3. 可以点击删除按钮移除已上传的图片

#### 导出页面为图片

1. 点击页面右上角的"导出页面"按钮
2. 等待导出过程完成
3. 图片将自动下载到本地

## 技术说明

- 项目使用React和TypeScript开发
- 使用html2canvas库实现页面导出为图片功能
- 支持响应式设计，适配不同设备屏幕

## 自定义开发

如需进一步开发和定制，可以：

1. 修改 `src/styles` 目录下的CSS文件自定义样式
2. 在 `src/components` 目录下修改或扩展组件功能
3. 通过 `pnpm run build` 重新构建项目

## 注意事项

- 图片上传仅支持本地预览，不包含实际的服务器上传功能
- 导出图片功能依赖于浏览器的canvas能力，不同浏览器可能有细微差异
- 图表功能目前仅支持数据输入，实际渲染需要集成图表库（如ECharts）
