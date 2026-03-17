# VirtualTable

High-performance Canvas virtual scrolling table component with support for massive datasets (~3 trillion rows).

## Features

- 🚀 **High Performance**: Canvas-based rendering with virtual scrolling, easily handles massive datasets
- 📱 **Fixed Columns**: Support for left/right fixed columns, keeping key columns visible during horizontal scroll
- 📏 **Dynamic Row Height**: Automatically calculates row height based on content
- 🎨 **Custom Styles**: Rich style configuration options with custom colors, fonts, borders, and more
- 🖱️ **Interactive Events**: Support for hover, click, scroll, and other events
- 📜 **Custom Cell Values**: Support custom cell display values via `getValue` callback
- 🎯 **Row Style Resolver**: Dynamic row styling based on row data
- 📦 **Zero Dependencies**: Pure TypeScript implementation, no external dependencies
- 🔄 **Auto Resize**: Automatic layout recalculation when container size changes

## Installation

```bash
pnpm add virtual-table-canvas
# or
npm install virtual-table-canvas
# or
yarn add virtual-table-canvas
```

## Quick Start

```typescript
import { VirtualTable, type TableColumn, type TableStyle } from 'virtual-table-canvas';

// Create canvas element
const canvas = document.getElementById('table') as HTMLCanvasElement;

// Define columns
const columns: TableColumn[] = [
  { key: 'id', name: 'ID', width: 80 },
  { key: 'name', name: 'Name', width: 200 },
  { key: 'email', name: 'Email', width: 300 },
];

// Define style (optional)
const style: TableStyle = {
  rowHeight: 40,
  headerHeight: 50,
  font: '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  rowBackgroundColor: '#ffffff',
  rowAltBackgroundColor: '#fafafa',
  headerBackgroundColor: '#f5f5f5',
  textColor: '#333333',
};

// Create table instance
const table = new VirtualTable(canvas, {
  columns,
  length: 100000, // Support for massive datasets
  valueBuilder: (index) => ({
    id: index,
    name: `User ${index}`,
    email: `user${index}@example.com`,
  }),
  style,
});

// Resize table
table.resize(800, 600);
```

## Using the `list` Method

For smaller datasets, use the `list` static method to simplify table creation:

```typescript
const data = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' },
  { id: 3, name: 'Bob', email: 'bob@example.com' },
];

const table = VirtualTable.list(canvas, {
  columns: [
    { key: 'id', name: 'ID', width: 80 },
    { key: 'name', name: 'Name', width: 200 },
    { key: 'email', name: 'Email', width: 300 },
  ],
  values: data,
});
```

## API Reference

### Types

#### TableColumn

Table column configuration.

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `key` | `string` | Yes | Unique column identifier |
| `name` | `string` | Yes | Column display name |
| `getValue` | `(row, index) => string` | No | Custom cell display value function |
| `width` | `number` | No | Column width in pixels |
| `fixed` | `'left' \| 'right'` | No | Fix column to left or right side |
| `wrap` | `boolean` | No | Whether to enable text wrapping for this column |

#### TableStyle

Table style configuration.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `rowHeight` | `number` | 40 | Row height (minimum when using dynamic row height) |
| `minRowHeight` | `number` | 35 | Minimum row height |
| `maxRowHeight` | `number` | 0 | Maximum row height (0 = no limit) |
| `headerHeight` | `number` | 50 | Header height |
| `font` | `string` | `14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | Cell font |
| `headerFont` | `string` | `bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | Header font |
| `headerBackgroundColor` | `string` | `#f5f5f5` | Header background color |
| `rowBackgroundColor` | `string` | `#ffffff` | Row background color |
| `rowAltBackgroundColor` | `string` | `#fafafa` | Alternate row background color (odd rows) |
| `textColor` | `string` | `#333333` | Text color |
| `textAlign` | `'left' \| 'right' \| 'center'` | `left` | Text alignment |
| `borderColor` | `string` | `#e0e0e0` | Border color |
| `verticalDividerColor` | `string` | `#f0f0f0` | Vertical divider color |
| `verticalDividerWidth` | `number` | 1 | Vertical divider width |
| `horizontalDividerColor` | `string` | `#f0f0f0` | Horizontal divider color |
| `horizontalDividerWidth` | `number` | 1 | Horizontal divider width |
| `rowHoverBackgroundColor` | `string` | `#f5f5f5` | Row hover background color |
| `scrollbarWidth` | `number` | 12 | Scrollbar width in pixels |
| `scrollbarTrackColor` | `string` | `#f1f1f1` | Scrollbar track color |
| `scrollbarThumbColor` | `string` | `#c1c1c1` | Scrollbar thumb color |
| `scrollbarThumbHoverColor` | `string` | `#a8a8a8` | Scrollbar thumb hover color |
| `scrollbarThumbPressedColor` | `string` | `#6b6b6b` | Scrollbar thumb pressed color |
| `tablePadding` | `PaddingValue` | 0 | Table padding |
| `cellPadding` | `PaddingValue` | `[5, 10]` | Cell padding |
| `headerCellPadding` | `PaddingValue` | `[5, 10]` | Header cell padding |
| `showVerticalDividers` | `boolean` | false | Show vertical dividers between columns |
| `maxCellLines` | `number` | 0 | Maximum number of lines for cells (0 = no limit) |
| `rowStyleResolver` | `(row, index) => RowStyleResolverResult` | - | Row style resolver function |

#### RowStyleResolverResult

Result type for row style resolver.

| Property | Type | Description |
|----------|------|-------------|
| `backgroundColor` | `string` | Row background color |
| `hoverBackgroundColor` | `string` | Row hover background color |
| `textColor` | `string` | Text color |
| `textAlign` | `CanvasTextAlign` | Text alignment |
| `borderColor` | `string` | Border color |
| `font` | `string` | Font |

#### PaddingValue

Padding value type supports the following formats:

- `number`: Same padding for all sides
- `[number, number]`: Vertical, horizontal
- `[number, number, number]`: Top, horizontal, bottom
- `[number, number, number, number]`: Top, right, bottom, left

### Methods

#### constructor(el: HTMLCanvasElement, options?: TableOptions)

Creates a VirtualTable instance.

**Parameters:**
- `el`: HTMLCanvasElement - The canvas element to render the table
- `options`: TableOptions - Table configuration options
  - `columns`: TableColumn[] - Column configuration array
  - `length`: number - Number of rows (max: ~3 trillion)
  - `valueBuilder`: (index: number) => Record<string, any> - Function to generate row data
  - `style`: TableStyle - Table style configuration (optional)
  - `dynamicRowHeight`: boolean - Enable dynamic row height (default: true)

#### static list(el: HTMLCanvasElement, options: VirtualTableCreateOptions)

Static method to create table using array data.

**Parameters:**
- `el`: HTMLCanvasElement - The canvas element to render the table
- `options`: VirtualTableCreateOptions - Table creation options
  - `columns`: TableColumn[] - Column configuration array
  - `values`: Record<string, any>[] - Array of row data
  - `style`: TableStyle - Table style configuration (optional)
  - `dynamicRowHeight`: boolean - Enable dynamic row height (default: true)

**Returns:** VirtualTable instance

#### setValues(length: number, valueBuilder: ValueBuilder)

Updates table data.

**Parameters:**
- `length`: number - Number of rows
- `valueBuilder`: (index: number) => Record<string, any> - Function to generate row data

#### setColumns(columns: TableColumn[])

Updates table columns.

**Parameters:**
- `columns`: TableColumn[] - Column configuration array

#### setStyle(style: TableStyle)

Updates table style.

**Parameters:**
- `style`: TableStyle - Table style configuration

#### setDynamicRowHeight(enabled: boolean)

Enables or disables dynamic row height.

**Parameters:**
- `enabled`: boolean - Whether to enable dynamic row height

#### getRowHeightCache(): Map<number, number>

Gets the row height cache.

**Returns:** Map<number, number> - Mapping of row index to height

#### clearRowHeightCache()

Clears the row height cache and triggers re-render.

#### resize(width?: number, height?: number)

Resizes the table.

**Parameters:**
- `width`: number - Table width in pixels (optional)
- `height`: number - Table height in pixels (optional)

#### scrollTo(scrollTop?: number, scrollLeft?: number)

Scrolls to specified position.

**Parameters:**
- `scrollTop`: number - Vertical scroll position (optional)
- `scrollLeft`: number - Horizontal scroll position (optional)

#### scrollToRow(rowIndex: number, align: "top" | "center" | "bottom" = "top")

Scrolls to specified row with alignment.

**Parameters:**
- `rowIndex`: number - Row index to scroll to
- `align`: "top" | "center" | "bottom" - Alignment within viewport (default: "top")

#### addEventListener<T extends VirtualTableEventType>(type: T, listener: VirtualTableEventHandlerMap[T])

Adds an event listener.

**Parameters:**
- `type`: VirtualTableEventType - Event type
- `listener`: VirtualTableEventHandlerMap[T] - Event listener function

#### removeEventListener<T extends VirtualTableEventType>(type: T, listener: VirtualTableEventHandlerMap[T])

Removes an event listener.

**Parameters:**
- `type`: VirtualTableEventType - Event type
- `listener`: VirtualTableEventHandlerMap[T] - Event listener function to remove

### Event Methods

#### onHover(listener: (row: Record<string, any>, index: number) => void)

Registers hover event listener.

**Parameters:**
- `listener`: (row, index) => void - Callback function
  - `row`: Record<string, any> - Hovered row data
  - `index`: number - Hovered row index

#### onClick(listener: (row: Record<string, any>, index: number) => void)

Registers click event listener.

**Parameters:**
- `listener`: (row, index) => void - Callback function
  - `row`: Record<string, any> - Clicked row data
  - `index`: number - Clicked row index

#### onScroll(listener: (scrollTop: number, scrollLeft: number) => void)

Registers scroll event listener.

**Parameters:**
- `listener`: (scrollTop, scrollLeft) => void - Callback function
  - `scrollTop`: number - Current vertical scroll position
  - `scrollLeft`: number - Current horizontal scroll position

#### onTableCreated(listener: () => void)

Registers table created event listener.

#### onRowCreated(listener: (row: Record<string, any>, index: number) => void)

Registers row created event listener.

**Parameters:**
- `listener`: (row, index) => void - Callback function
  - `row`: Record<string, any> - Created row data
  - `index`: number - Created row index

#### onRowHeightChanged(listener: (index: number, height: number) => void)

Registers row height changed event listener.

**Parameters:**
- `listener`: (index, height) => void - Callback function
  - `index`: number - Row index whose height changed
  - `height`: number - New row height

#### offHover(listener: (row: Record<string, any>, index: number) => void)

Removes hover event listener.

#### offClick(listener: (row: Record<string, any>, index: number) => void)

Removes click event listener.

#### offScroll(listener: (scrollTop: number, scrollLeft: number) => void)

Removes scroll event listener.

#### offTableCreated(listener: () => void)

Removes table created event listener.

#### offRowCreated(listener: (row: Record<string, any>, index: number) => void)

Removes row created event listener.

#### offRowHeightChanged(listener: (index: number, height: number) => void)

Removes row height changed event listener.

## Examples

### Fixed Columns Example

```typescript
const columns: TableColumn[] = [
  { key: 'id', name: 'ID', width: 80, fixed: 'left' }, // Fixed to left
  { key: 'name', name: 'Name', width: 200 },
  { key: 'email', name: 'Email', width: 300 },
  { key: 'status', name: 'Status', width: 100, fixed: 'right' }, // Fixed to right
];

const table = new VirtualTable(canvas, {
  columns,
  length: 10000,
  valueBuilder: (i) => ({
    id: i,
    name: `User ${i}`,
    email: `user${i}@example.com`,
    status: i % 2 === 0 ? 'Active' : 'Offline',
  }),
});
```

### Custom Row Style Example

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

### Custom Cell Value Example

```typescript
const columns: TableColumn[] = [
  { 
    key: 'price', 
    name: 'Price',
    getValue: (row) => `$${row.price.toFixed(2)}`,
  },
  {
    key: 'status',
    name: 'Status',
    getValue: (row) => row.status ? 'Enabled' : 'Disabled',
  },
];
```

### Text Wrapping Example

```typescript
const columns: TableColumn[] = [
  { key: 'id', name: 'ID', width: 80 },
  { key: 'description', name: 'Description', width: 300, wrap: true },
];

const style: TableStyle = {
  maxCellLines: 3, // Limit to 3 lines
};

const table = new VirtualTable(canvas, {
  columns,
  length: 1000,
  valueBuilder: (i) => ({
    id: i,
    description: `This is a long description for item ${i} that might wrap to multiple lines.`,
  }),
  style,
});
```

## Performance Optimization

### Data Caching

VirtualTable has a built-in data caching mechanism with automatic cache management. The cache automatically clears old entries when it reaches the maximum size (10,000 rows by default).

### Virtual Scrolling

Only renders rows within the visible area plus a small buffer, ensuring smooth scrolling even with massive datasets. The component uses efficient algorithms to calculate visible row ranges.

### Dynamic Row Height

When enabled, row heights are calculated based on content (text wrapping). Heights are cached for performance, with automatic cache invalidation when styles change.

### Scrollbar Optimization

Scrollbars are drawn using Canvas with customizable styles including track color, thumb color, hover state, pressed state, and more. Smooth drag interactions are supported.

### Binary Search

Uses binary search algorithm to quickly find the starting row index based on scroll position when using dynamic row heights.

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

## License

ISC
