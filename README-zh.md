# VirtualTable

高性能 Canvas 虚拟滚动表格组件，支持海量数据渲染（约 百万行）。

## Language

[English](README.md)
中文

## 特性

- 🚀 **高性能**: 基于 Canvas 渲染的虚拟滚动，轻松处理海量数据
- 📱 **固定列**: 支持左/右侧固定列，确保关键列在横向滚动时始终可见
- 📏 **动态行高**: 根据内容自动计算行高
- 🎨 **自定义样式**: 丰富的样式配置选项，支持自定义颜色、字体、边框等
- 🖱️ **交互事件**: 支持悬停、点击、滚动等各种事件
- 📜 **自定义单元格值**: 通过 `getValue` 回调函数自定义单元格显示值
- 🎯 **行样式解析器**: 根据行数据动态设置行样式
- 📦 **零依赖**: 纯 TypeScript 实现，无外部依赖
- 🔄 **自动调整**: 容器大小变化时自动重新计算布局

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
  { key: 'name', name: '姓名', width: 200 },
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
  length: 100000, // 支持海量数据
  valueBuilder: (index) => ({
    id: index,
    name: `用户 ${index}`,
    email: `user${index}@example.com`,
  }),
  style,
});

// 调整表格大小
table.resize(800, 600);
```

## 使用 `list` 方法

对于较小的数据集，可以使用 `list` 静态方法简化表格创建：

```typescript
const data = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
  { id: 3, name: '王五', email: 'wangwu@example.com' },
];

const table = VirtualTable.list(canvas, {
  columns: [
    { key: 'id', name: 'ID', width: 80 },
    { key: 'name', name: '姓名', width: 200 },
    { key: 'email', name: '邮箱', width: 300 },
  ],
  values: data,
});
```

## API 参考

### 类型

#### TableColumn

表格列配置。

| 属性         | 类型                       | 必填 | 描述          |
| ---------- | ------------------------ | -- | ----------- |
| `key`      | `string`                 | 是  | 列的唯一标识符     |
| `name`     | `string`                 | 是  | 列的显示名称      |
| `getValue` | `(row, index) => string` | 否  | 自定义单元格显示值函数 |
| `width`    | `number`                 | 否  | 列宽（像素）      |
| `fixed`    | `'left' \| 'right'`      | 否  | 将列固定在左侧或右侧  |
| `wrap`     | `boolean`                | 否  | 是否启用该列的文本换行 |

#### TableStyle

表格样式配置。

| 属性                           | 类型                                       | 默认值                                                                           | 描述               |
| ---------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------- | ---------------- |
| `rowHeight`                  | `number`                                 | 40                                                                            | 行高（使用动态行高时为最小行高） |
| `minRowHeight`               | `number`                                 | 35                                                                            | 最小行高             |
| `maxRowHeight`               | `number`                                 | 0                                                                             | 最大行高（0 表示无限制）    |
| `headerHeight`               | `number`                                 | 50                                                                            | 表头高度             |
| `font`                       | `string`                                 | `14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`      | 单元格字体            |
| `headerFont`                 | `string`                                 | `bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | 表头字体             |
| `headerBackgroundColor`      | `string`                                 | `#f5f5f5`                                                                     | 表头背景色            |
| `rowBackgroundColor`         | `string`                                 | `#ffffff`                                                                     | 行背景色             |
| `rowAltBackgroundColor`      | `string`                                 | `#fafafa`                                                                     | 交替行背景色（奇数行）      |
| `textColor`                  | `string`                                 | `#333333`                                                                     | 文本颜色             |
| `textAlign`                  | `'left' \| 'right' \| 'center'`          | `left`                                                                        | 文本对齐方式           |
| `borderColor`                | `string`                                 | `#e0e0e0`                                                                     | 边框颜色             |
| `verticalDividerColor`       | `string`                                 | `#f0f0f0`                                                                     | 垂直分隔线颜色          |
| `verticalDividerWidth`       | `number`                                 | 1                                                                             | 垂直分隔线宽度          |
| `horizontalDividerColor`     | `string`                                 | `#f0f0f0`                                                                     | 水平分隔线颜色          |
| `horizontalDividerWidth`     | `number`                                 | 1                                                                             | 水平分隔线宽度          |
| `rowHoverBackgroundColor`    | `string`                                 | `#f5f5f5`                                                                     | 行悬停背景色           |
| `scrollbarWidth`             | `number`                                 | 12                                                                            | 滚动条宽度（像素）        |
| `scrollbarTrackColor`        | `string`                                 | `#f1f1f1`                                                                     | 滚动条轨道颜色          |
| `scrollbarThumbColor`        | `string`                                 | `#c1c1c1`                                                                     | 滚动条滑块颜色          |
| `scrollbarThumbHoverColor`   | `string`                                 | `#a8a8a8`                                                                     | 滚动条滑块悬停颜色        |
| `scrollbarThumbPressedColor` | `string`                                 | `#6b6b6b`                                                                     | 滚动条滑块按下颜色        |
| `tablePadding`               | `PaddingValue`                           | 0                                                                             | 表格内边距            |
| `cellPadding`                | `PaddingValue`                           | `[5, 10]`                                                                     | 单元格内边距           |
| `headerCellPadding`          | `PaddingValue`                           | `[5, 10]`                                                                     | 表头单元格内边距         |
| `showVerticalDividers`       | `boolean`                                | false                                                                         | 显示列之间的垂直分隔线      |
| `maxCellLines`               | `number`                                 | 0                                                                             | 单元格最大行数（0 表示无限制） |
| `rowStyleResolver`           | `(row, index) => RowStyleResolverResult` | -                                                                             | 行样式解析器函数         |

#### RowStyleResolverResult

行样式解析器返回结果类型。

| 属性                     | 类型                | 描述     |
| ---------------------- | ----------------- | ------ |
| `backgroundColor`      | `string`          | 行背景色   |
| `hoverBackgroundColor` | `string`          | 行悬停背景色 |
| `textColor`            | `string`          | 文本颜色   |
| `textAlign`            | `CanvasTextAlign` | 文本对齐方式 |
| `borderColor`          | `string`          | 边框颜色   |
| `font`                 | `string`          | 字体     |

#### PaddingValue

内边距值类型，支持以下格式：

- `number`: 四周相同内边距
- `[number, number]`: 垂直、水平
- `[number, number, number]`: 上、水平、下
- `[number, number, number, number]`: 上、右、下、左

### 方法

#### constructor(el: HTMLCanvasElement, options?: TableOptions)

创建 VirtualTable 实例。

**参数：**

- `el`: HTMLCanvasElement - 用于渲染表格的 canvas 元素
- `options`: TableOptions - 表格配置选项
  - `columns`: TableColumn\[] - 列配置数组
  - `length`: number - 行数（最大约 3 万亿）
  - `valueBuilder`: (index: number) => Record\<string, any> - 生成行数据的函数
  - `style`: TableStyle - 表格样式配置（可选）
  - `dynamicRowHeight`: boolean - 启用动态行高（默认 true）

#### static list(el: HTMLCanvasElement, options: VirtualTableCreateOptions)

静态方法，使用数组数据创建表格。

**参数：**

- `el`: HTMLCanvasElement - 用于渲染表格的 canvas 元素
- `options`: VirtualTableCreateOptions - 表格创建选项
  - `columns`: TableColumn\[] - 列配置数组
  - `values`: Record\<string, any>\[] - 行数据数组
  - `style`: TableStyle - 表格样式配置（可选）
  - `dynamicRowHeight`: boolean - 启用动态行高（默认 true）

**返回：** VirtualTable 实例

#### setValues(length: number, valueBuilder: ValueBuilder)

更新表格数据。

**参数：**

- `length`: number - 行数
- `valueBuilder`: (index: number) => Record\<string, any> - 生成行数据的函数

#### setColumns(columns: TableColumn\[])

更新表格列。

**参数：**

- `columns`: TableColumn\[] - 列配置数组

#### setStyle(style: TableStyle)

更新表格样式。

**参数：**

- `style`: TableStyle - 表格样式配置

#### setDynamicRowHeight(enabled: boolean)

启用或禁用动态行高。

**参数：**

- `enabled`: boolean - 是否启用动态行高

#### getRowHeightCache(): Map\<number, number>

获取行高缓存。

**返回：** Map\<number, number> - 行索引到高度的映射

#### clearRowHeightCache()

清除行高缓存并触发重新渲染。

#### resize(width?: number, height?: number)

调整表格大小。

**参数：**

- `width`: number - 表格宽度（像素，可选）
- `height`: number - 表格高度（像素，可选）

#### scrollTo(scrollTop?: number, scrollLeft?: number)

滚动到指定位置。

**参数：**

- `scrollTop`: number - 垂直滚动位置（可选）
- `scrollLeft`: number - 水平滚动位置（可选）

#### scrollToRow(rowIndex: number, align: "top" | "center" | "bottom" = "top")

滚动到指定行并对齐。

**参数：**

- `rowIndex`: number - 要滚动到的行索引
- `align`: "top" | "center" | "bottom" - 在视口中的对齐方式（默认 "top"）

#### addEventListener<T extends VirtualTableEventType>(type: T, listener: VirtualTableEventHandlerMap\[T])

添加事件监听器。

**参数：**

- `type`: VirtualTableEventType - 事件类型
- `listener`: VirtualTableEventHandlerMap\[T] - 事件监听器函数

#### removeEventListener<T extends VirtualTableEventType>(type: T, listener: VirtualTableEventHandlerMap\[T])

移除事件监听器。

**参数：**

- `type`: VirtualTableEventType - 事件类型
- `listener`: VirtualTableEventHandlerMap\[T] - 要移除的事件监听器函数

### 事件方法

#### onHover(listener: (row: Record\<string, any>, index: number) => void)

注册悬停事件监听器。

**参数：**

- `listener`: (row, index) => void - 回调函数
  - `row`: Record\<string, any> - 悬停的行数据
  - `index`: number - 悬停的行索引

#### onClick(listener: (row: Record\<string, any>, index: number) => void)

注册点击事件监听器。

**参数：**

- `listener`: (row, index) => void - 回调函数
  - `row`: Record\<string, any> - 点击的行数据
  - `index`: number - 点击的行索引

#### onScroll(listener: (scrollTop: number, scrollLeft: number) => void)

注册滚动事件监听器。

**参数：**

- `listener`: (scrollTop, scrollLeft) => void - 回调函数
  - `scrollTop`: number - 当前垂直滚动位置
  - `scrollLeft`: number - 当前水平滚动位置

#### onTableCreated(listener: () => void)

注册表格创建完成事件监听器。

#### onRowCreated(listener: (row: Record\<string, any>, index: number) => void)

注册行创建事件监听器。

**参数：**

- `listener`: (row, index) => void - 回调函数
  - `row`: Record\<string, any> - 创建的行数据
  - `index`: number - 创建的行索引

#### onRowHeightChanged(listener: (index: number, height: number) => void)

注册行高变化事件监听器。

**参数：**

- `listener`: (index, height) => void - 回调函数
  - `index`: number - 高度变化的行索引
  - `height`: number - 新的行高

#### offHover(listener: (row: Record\<string, any>, index: number) => void)

移除悬停事件监听器。

#### offClick(listener: (row: Record\<string, any>, index: number) => void)

移除点击事件监听器。

#### offScroll(listener: (scrollTop: number, scrollLeft: number) => void)

移除滚动事件监听器。

#### offTableCreated(listener: () => void)

移除表格创建完成事件监听器。

#### offRowCreated(listener: (row: Record\<string, any>, index: number) => void)

移除行创建事件监听器。

#### offRowHeightChanged(listener: (index: number, height: number) => void)

移除行高变化事件监听器。

## 示例

### 固定列示例

```typescript
const columns: TableColumn[] = [
  { key: 'id', name: 'ID', width: 80, fixed: 'left' }, // 固定在左侧
  { key: 'name', name: '姓名', width: 200 },
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
    status: i % 2 === 0 ? '在线' : '离线',
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
    getValue: (row) => row.status ? '启用' : '禁用',
  },
];
```

### 文本换行示例

```typescript
const columns: TableColumn[] = [
  { key: 'id', name: 'ID', width: 80 },
  { key: 'description', name: '描述', width: 300, wrap: true },
];

const style: TableStyle = {
  maxCellLines: 3, // 限制为 3 行
};

const table = new VirtualTable(canvas, {
  columns,
  length: 1000,
  valueBuilder: (i) => ({
    id: i,
    description: `这是项目 ${i} 的长描述，可能会换行到多行显示。`,
  }),
  style,
});
```

## 性能优化

### 数据缓存

VirtualTable 内置数据缓存机制，自动管理缓存。当缓存达到最大容量（默认 10000 行）时，会自动清除旧条目。

### 虚拟滚动

仅渲染可见区域及少量缓冲区域，确保即使海量数据也能平滑滚动。组件使用高效算法计算可见行范围。

### 动态行高

启用时，根据内容（文本换行）计算行高。高度会被缓存以提高性能，当样式变化时自动失效缓存。

### 滚动条优化

使用 Canvas 绘制滚动条，支持自定义样式，包括轨道颜色、滑块颜色、悬停状态、按下状态等。

### 二分查找

使用二分查找算法，在使用动态行高时根据滚动位置快速找到起始行索引。

## 浏览器支持

- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

## 许可证

ISC
