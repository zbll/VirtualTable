# VirtualTable

高性能 Canvas 虚拟表格组件，支持百万级数据渲染。

## 特性

- 🚀 **高性能**：基于 Canvas 的虚拟滚动，轻松处理百万级数据
- 📱 **固定列**：支持左右固定列，滚动时保持关键列可见
- 🎨 **自定义样式**：丰富的样式配置选项，支持自定义颜色、字体、边框等
- 🖱️ **交互事件**：支持 hover、click、scroll 等事件
- 📜 **自定义单元格**：支持自定义单元格显示值和类型
- 🎯 **行样式解析器**：支持根据行数据动态设置样式
- 📦 **零依赖**：纯 TypeScript 实现，无外部依赖

## 安装

```bash
pnpm add virtual-table-canvas
# 或
npm install virtual-table-canvas
# 或
yarn add virtual-table-canvas
```

## 快速开始

```typescript
import { VirtualTable, type TableColumn, type TableStyle } from 'virtual-table-canvas';

// 创建 canvas 元素
const canvas = document.getElementById('table') as HTMLCanvasElement;

// 定义列
const columns: TableColumn[] = [
  { key: 'id', name: 'ID', width: 80 },
  { key: 'name', name: '名称', width: 200 },
  { key: 'email', name: '邮箱', width: 300 },
];

// 定义样式（可选）
const style: TableStyle = {
  rowHeight: 40,
  headerHeight: 50,
  font: '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  rowBackgroundColor: '#ffffff',
  rowAltBackgroundColor: '#fafafa',
  headerBackgroundColor: '#f5f5f5',
  textColor: '#333333',
};

// 创建表格实例
const table = new VirtualTable(canvas, {
  columns,
  length: 100000, // 100万条数据
  valueBuilder: (index) => ({
    id: index,
    name: `用户 ${index}`,
    email: `user${index}@example.com`,
  }),
  style,
});

// 调整大小
table.resize(800, 600);
```

## 使用 list 方法创建表格

对于数据量较小的场景，可以使用 `list` 方法简化创建过程：

```typescript
const data = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
  { id: 3, name: '王五', email: 'wangwu@example.com' },
];

const table = VirtualTable.list(canvas, {
  columns: [
    { key: 'id', name: 'ID', width: 80 },
    { key: 'name', name: '名称', width: 200 },
    { key: 'email', name: '邮箱', width: 300 },
  ],
  values: data,
});
```

## API

### 类型

#### TableColumn

表格列配置

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `key` | `string` | 是 | 列的唯一标识符 |
| `name` | `string` | 是 | 列的显示名称 |
| `type` | `'text' \| 'html'` | 否 | 列类型，默认 `text` |
| `getValue` | `(row, index) => string` | 否 | 自定义单元格显示值 |
| `width` | `number` | 否 | 列宽 |
| `fixed` | `'left' \| 'right'` | 否 | 是否固定在左侧或右侧 |
| `wrap` | `boolean` | 否 | 该列是否启用自动换行 |

#### TableStyle

表格样式配置

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `rowHeight` | `number` | 40 | 行高（当使用动态行高时，此为最小行高） |
| `minRowHeight` | `number` | 40 | 最小行高 |
| `maxRowHeight` | `number` | 0 | 最大行高（0表示不限制） |
| `headerHeight` | `number` | 50 | 表头高度 |
| `font` | `string` | `14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | 字体 |
| `headerFont` | `string` | `bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | 表头字体 |
| `headerBackgroundColor` | `string` | `#f5f5f5` | 表头背景色 |
| `rowBackgroundColor` | `string` | `#ffffff` | 行背景色 |
| `rowAltBackgroundColor` | `string` | `#fafafa` | 交替行背景色 |
| `textColor` | `string` | `#333333` | 文本颜色 |
| `textAlign` | `'left' \| 'right' \| 'center'` | `left` | 文本对齐方式 |
| `borderColor` | `string` | `#e0e0e0` | 边框颜色 |
| `verticalDividerColor` | `string` | `#f0f0f0` | 垂直分隔线颜色 |
| `verticalDividerWidth` | `number` | 1 | 垂直分隔线宽度 |
| `horizontalDividerColor` | `string` | `#f0f0f0` | 水平分隔线颜色 |
| `horizontalDividerWidth` | `number` | 1 | 水平分隔线宽度 |
| `rowHoverBackgroundColor` | `string` | `#f5f5f5` | 行 hover 背景色 |
| `scrollbarWidth` | `number` | 12 | 滚动条宽度 |
| `scrollbarTrackColor` | `string` | `#f1f1f1` | 滚动条轨道颜色 |
| `scrollbarThumbColor` | `string` | `#c1c1c1` | 滚动条滑块颜色 |
| `scrollbarThumbHoverColor` | `string` | `#a8a8a8` | 滚动条滑块 hover 颜色 |
| `scrollbarThumbPressedColor` | `string` | `#6b6b6b` | 滚动条滑块按下颜色 |
| `tablePadding` | `PaddingValue` | 0 | 表格内边距 |
| `cellPadding` | `PaddingValue` | `[5, 10]` | 单元格内边距 |
| `headerCellPadding` | `PaddingValue` | `[5, 10]` | 表头单元格内边距 |
| `showVerticalDividers` | `boolean` | false | 是否显示垂直分隔线 |
| `maxCellLines` | `number` | 0 | 单元格最大行数（0表示不限制） |
| `rowStyleResolver` | `(row, index) => RowStyleResolverResult` | - | 行样式解析器 |

#### PaddingValue

内边距值类型，支持以下形式：

- `number`: 四个方向相同
- `[number, number]`: 上下，左右
- `[number, number, number]`: 上，左右，下
- `[number, number, number, number]`: 上，右，下，左

### 方法

#### constructor(el: HTMLCanvasElement, options?: TableOptions)

创建 VirtualTable 实例。

**参数：**
- `el`: HTMLCanvasElement - 用于渲染表格的 canvas 元素
- `options`: TableOptions - 表格配置选项
  - `columns`: TableColumn[] - 列配置
  - `length`: number - 行数
  - `valueBuilder`: (index: number) => Record<string, any> - 生成行数据的函数
  - `style`: TableStyle - 表格样式配置（可选）
  - `dynamicRowHeight`: boolean - 是否启用动态行高（默认：true）

#### static list(el: HTMLCanvasElement, options: VirtualTableCreateOptions)

静态方法，使用数组数据创建表格。

**参数：**
- `el`: HTMLCanvasElement - 用于渲染表格的 canvas 元素
- `options`: VirtualTableCreateOptions - 表格创建选项
  - `columns`: TableColumn[] - 列配置
  - `values`: Record<string, any>[] - 行数据数组
  - `style`: TableStyle - 表格样式配置（可选）
  - `dynamicRowHeight`: boolean - 是否启用动态行高（默认：true）

**返回值：** VirtualTable 实例

#### setValues(length: number, valueBuilder: ValueBuilder)

设置表格数据。

**参数：**
- `length`: number - 行数
- `valueBuilder`: (index: number) => Record<string, any> - 生成行数据的函数

#### setColumns(columns: TableColumn[])

设置表格列。

**参数：**
- `columns`: TableColumn[] - 列配置数组

#### setStyle(style: TableStyle)

设置表格样式。

**参数：**
- `style`: TableStyle - 表格样式配置

#### setDynamicRowHeight(enabled: boolean)

启用或禁用动态行高。

**参数：**
- `enabled`: boolean - 是否启用动态行高

#### getRowHeightCache(): Map<number, number>

获取行高缓存。

**返回值：** Map<number, number> - 行索引到高度的映射

#### clearRowHeightCache()

清除行高缓存。

#### resize(width?: number, height?: number)

调整表格大小。

**参数：**
- `width`: number - 表格宽度（可选）
- `height`: number - 表格高度（可选）

#### scrollTo(scrollTop?: number, scrollLeft?: number)

滚动到指定位置。

**参数：**
- `scrollTop`: number - 垂直滚动位置（可选）
- `scrollLeft`: number - 水平滚动位置（可选）

#### scrollToRow(rowIndex: number, align: "top" | "center" | "bottom" = "top")

滚动到指定行并对齐。

**参数：**
- `rowIndex`: number - 要滚动到的行索引
- `align`: "top" | "center" | "bottom" - 在视口中的对齐方式（默认："top"）

#### addEventListener<T extends VirtualTableEventType>(type: T, listener: VirtualTableEventHandlerMap[T])

添加事件监听器。

**参数：**
- `type`: VirtualTableEventType - 事件类型
- `listener`: 事件监听器函数

#### removeEventListener<T extends VirtualTableEventType>(type: T, listener: VirtualTableEventHandlerMap[T])

移除事件监听器。

**参数：**
- `type`: VirtualTableEventType - 事件类型
- `listener`: 要移除的事件监听器函数

### 事件

#### onHover(listener: (row: Record<string, any>, index: number) => void)

监听 hover 事件。

**参数：**
- `row`: Record<string, any> - 悬停的行数据
- `index`: number - 悬停的行索引

#### onClick(listener: (row: Record<string, any>, index: number) => void)

监听 click 事件。

**参数：**
- `row`: Record<string, any> - 点击的行数据
- `index`: number - 点击的行索引

#### onScroll(listener: (scrollTop: number, scrollLeft: number) => void)

监听 scroll 事件。

**参数：**
- `scrollTop`: number - 当前垂直滚动位置
- `scrollLeft`: number - 当前水平滚动位置

#### onTableCreated(listener: () => void)

监听表格创建完成事件。

#### onRowCreated(listener: (row: Record<string, any>, index: number) => void)

监听行创建事件。

**参数：**
- `row`: Record<string, any> - 创建的行数据
- `index`: number - 创建的行索引

#### onRowHeightChanged(listener: (index: number, height: number) => void)

监听行高度变化事件。

**参数：**
- `index`: number - 高度变化的行索引
- `height`: number - 新的行高度

#### offHover(listener: (row: Record<string, any>, index: number) => void)

移除 hover 事件监听器。

**参数：**
- `listener`: 要移除的 hover 事件监听器

#### offClick(listener: (row: Record<string, any>, index: number) => void)

移除 click 事件监听器。

**参数：**
- `listener`: 要移除的 click 事件监听器

#### offScroll(listener: (scrollTop: number, scrollLeft: number) => void)

移除 scroll 事件监听器。

**参数：**
- `listener`: 要移除的 scroll 事件监听器

#### offTableCreated(listener: () => void)

移除表格创建完成事件监听器。

**参数：**
- `listener`: 要移除的表格创建完成事件监听器

#### offRowCreated(listener: (row: Record<string, any>, index: number) => void)

移除行创建事件监听器。

**参数：**
- `listener`: 要移除的行创建事件监听器

#### offRowHeightChanged(listener: (index: number, height: number) => void)

移除行高度变化事件监听器。

**参数：**
- `listener`: 要移除的行高度变化事件监听器

## 示例

### 固定列示例

```typescript
const columns: TableColumn[] = [
  { key: 'id', name: 'ID', width: 80, fixed: 'left' }, // 固定在左侧
  { key: 'name', name: '名称', width: 200 },
  { key: 'email', name: '邮箱', width: 300 },
  { key: 'status', name: '状态', width: 100, fixed: 'right' }, // 固定在右侧
];

const table = new VirtualTable(canvas, {
  columns,
  length: 10000,
  valueBuilder: (i) => ({
    id: i,
    name: `用户 ${i}`,
    email: `user${i}@example.com`,
    status: i % 2 === 0 ? '活跃' : '离线',
  }),
});
```

### 自定义行样式示例

```typescript
const table = new VirtualTable(canvas, {
  columns: [{ key: 'id', name: 'ID' }],
  length: 1000,
  valueBuilder: (i) => ({ id: i, value: i }),
  style: {
    rowStyleResolver: (row, index) => {
      if (row.value > 500) {
        return {
          backgroundColor: '#fff3cd',
          textColor: '#856404',
        };
      }
      return {};
    },
  },
});
```

### 自定义单元格值示例

```typescript
const columns: TableColumn[] = [
  { 
    key: 'price', 
    name: '价格',
    getValue: (row) => `¥${row.price.toFixed(2)}`,
  },
  {
    key: 'status',
    name: '状态',
    getValue: (row) => row.status ? '✅ 启用' : '❌ 禁用',
  },
];
```

## 性能优化

### 数据缓存

VirtualTable 内置数据缓存机制，默认缓存阈值为 10000 条。当缓存满时，会自动清理旧缓存。

### 虚拟滚动

只渲染可视区域内的行，确保即使百万级数据也能保持流畅滚动。

### 滚动条优化

滚动条使用 Canvas 绘制，支持自定义样式，包括轨道颜色、滑块颜色、hover 状态等。

## 浏览器支持

- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

## 许可证

ISC
