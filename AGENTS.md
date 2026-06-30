# Repository Guidelines

## Project Overview

`walkin-homepage` 是一个浏览器扩展，用于替换浏览器的 **New Tab（新标签页）** 为自定义主页。当前核心页面仅实现了一个搜索落地页，后台脚本保留了书签监听的占位逻辑。

- **技术栈**：WXT + SolidJS + TypeScript
- **样式方案**：UnoCSS（Tailwind 兼容语法）
- **目标产物**：Chrome MV3 / Firefox MV2 扩展
- **包管理器/运行时**：Bun

## Architecture & Data Flow

项目采用 **WXT 的文件约定式入口** + **Vite 打包** + **Panda CSS 生成样式系统**。

### 主要入口

| 入口 | 文件 | 说明 |
|------|------|------|
| New Tab 页面 | `entrypoints/newtab/index.html` → `main.tsx` → `App.tsx` | 渲染自定义主页 |
| Background / Service Worker | `entrypoints/background.ts` | 监听书签变化（当前为占位实现） |

### 数据流示例

1. **新标签页搜索**
   ```
   用户输入 → App.tsx searchKeydown → Enter(keyCode 13)
   → location.href = https://www.bing.com/search?q={search}
   ```
2. **书签监听（未完成）**
   ```
   browser.bookmarks.onChanged → console.info / debugger
   → syncBookmarks() 获取书签树 → flatteBookmarksTree(node) 返回 [{}]
   ```

### UI 组件分层

- `components/ui/<Component>.tsx`：业务层组件，处理 loading、disabled、可访问性等逻辑，直接使用 UnoCSS 原子类。

## Key Directories

- `entrypoints/` — WXT 扩展入口（`background.ts`、`newtab/`）
- `components/ui/` — 可复用 UI 组件
- `assets/` — 静态资源
- `public/` — 扩展图标等原样复制的公共资源
- `.wxt/` — WXT 自动生成的类型声明与 `tsconfig.json`
- `.output/` — 构建产物（按浏览器/版本分子目录）

## Development Commands

全部命令默认使用 **pnpm**：

```bash
# 安装依赖并生成 WXT 环境
pnpm install

# 开发模式（默认 Chrome MV3）
pnpm run dev

# 开发模式（Firefox MV2）
bun run dev:firefox

# 生产构建
bun run build
bun run build:firefox

# 打包为 zip
bun run zip
bun run zip:firefox

# 类型检查
bun run compile
```

> 当前没有 `test`、`lint`、`format` 脚本；Biome 需手动调用（见 Testing & QA）。

## Code Conventions & Common Patterns

### 语言与模块

- TypeScript ESM（`"type": "module"`）
- JSX：`"jsx": "preserve"`，`"jsxImportSource": "solid-js"`

### 代码风格

- **Biome** 统一格式化与 lint：
  - 缩进：Tab
  - 引号：双引号
  - 自动 `organizeImports`
- 文件/目录：`kebab-case`
- 组件：`PascalCase`
- 函数/变量：`camelCase`

### 样式写法

- 原子样式：
  ```tsx
  import { css } from "styled-system/css";
  <div class={css({ height: "screen", bgColor: "#f9f9fb" })} />
  ```
- Styled 工厂：
  ```tsx
  import { styled, Center } from "styled-system/jsx";
  ```
- Recipe 变体从 `styled-system/recipes` 引入，结合 `ark` 原语使用。

### 事件绑定

使用 SolidJS 原生委托语法：

```tsx
<input on:keydown={searchKeydown} />
<div on:click={searchFocus} />
```

### 路径别名

- WXT 自动生成：`@/*`、`~/*`、`@@/*`、`~~/*` 指向项目根


### 状态管理

- 当前无全局状态管理库
- 搜索、书签同步等状态均未接入 storage/context

## Important Files

| 文件 | 作用 |
|------|------|
| `wxt.config.ts` | WXT 主配置：Solid 模块、manifest 权限（`bookmarks`/`storage`/`webRequest`）、UnoCSS Vite 插件 |
| `web-ext.config.ts` | web-ext 运行配置，当前 `disabled: true` |
| `uno.config.ts` | UnoCSS 配置：使用 `preset-wind3`（Tailwind 兼容） |
| `biome.json` | Biome formatter/linter/assist 配置 |
| `tsconfig.json` | 继承 `.wxt/tsconfig.json`，覆盖 JSX 配置 |
| `entrypoints/background.ts` | 后台脚本，含未完成的 `syncBookmarks` 与 `debugger` 语句 |
| `entrypoints/newtab/App.tsx` | New Tab 主页面，搜索回车跳转 Bing |
| `entrypoints/newtab/main.tsx` | 渲染入口，引入 `virtual:uno.css` |

## Runtime/Tooling Preferences

- **包管理器/运行时**：pnpm
- **构建工具**：WXT（基于 Vite）
  - 默认 Chrome MV3
  - Firefox 需加 `-b firefox`，生成 MV2
- **CSS 引擎**：UnoCSS
- **UI 基座**：SolidJS 原生 JSX + UnoCSS 原子类
- **代码质量**：Biome（无 ESLint/Prettier）
- **类型检查**：TypeScript `tsc --noEmit`
- **浏览器扩展权限**：`bookmarks`、`storage`、`webRequest`

## Testing & QA

- **测试框架**：无
- **测试文件**：未发现 `*.test.*`、`*.spec.*`、`__tests__/` 或 Storybook
- **测试脚本**：`package.json` 中没有 `test` / `e2e` 等脚本
- **CI/CD**：无 `.github/workflows/` 等配置
- **当前可用 QA 入口**：
  ```bash
  # 类型检查
  pnpm run compile

  # Biome 检查
  pnpm dlx @biomejs/biome check .

  # Biome 格式化
  pnpm dlx @biomejs/biome format .
  ```
- **注意**：核心路径（搜索跳转、书签同步）暂无自动化测试覆盖；`background.ts` 含占位实现与 `debugger` 语句。
