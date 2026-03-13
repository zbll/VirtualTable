# VirtualTable

High-performance Canvas virtual table component with support for rendering millions of rows.

## Features

- 🚀 **High Performance**: Canvas-based virtual scrolling, easily handles millions of rows
- 📱 **Fixed Columns**: Support left/right fixed columns, keeping key columns visible during scroll
- 🎨 **Custom Styles**: Rich style configuration options with custom colors, fonts, borders, and more
- 🖱️ **Interactive Events**: Support hover, click, scroll events
- 📜 **Custom Cells**: Support custom cell display values and types
- 🎯 **Row Style Resolver**: Dynamic row styling based on row data
- 📦 **Zero Dependencies**: Pure TypeScript implementation, no external dependencies

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
  length: 100000, // 1 million rows
  valueBuilder: (index) => ({
    id: index,
    name: `User ${index}`,
    email: `user${index}@example.com`,
  }),
  style,
});

// Resize
table.resize(800, 600);
```

## Using the list Method

For smaller datasets, use the `list` method to simplify table creation:

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

## API

### Types

#### TableColumn

Table column configuration

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `key` | `string` | Yes | Unique column identifier |
| `name` | `string` | Yes | Column display name |
| `type` | `'text' \| 'html'` | No | Column type, default `text` |
| `getValue` | `(row, index) => string` | No | Custom cell display value |
| `width` | `number` | No | Column width |
| `fixed` | `'left' \| 'right'` | No | Fix column to left or right |
| `wrap` | `boolean` | No | Whether to enable text wrapping for this column |

#### TableStyle

Table style configuration

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `rowHeight` | `number` | 40 | Row height (minimum row height when using dynamic row height) |
| `minRowHeight` | `number` | 40 | Minimum row height |
| `maxRowHeight` | `number` | 0 | Maximum row height (0 means no limit) |
| `headerHeight` | `number` | 50 | Header height |
| `font` | `string` | `14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | Font |
| `headerFont` | `string` | `bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | Header font |
| `headerBackgroundColor` | `string` | `#f5f5f5` | Header background color |
| `rowBackgroundColor` | `string` | `#ffffff` | Row background color |
| `rowAltBackgroundColor` | `string` | `#fafafa` | Alternate row background color |
| `textColor` | `string` | `#333333` | Text color |
| `textAlign` | `'left' \| 'right' \| 'center'` | `left` | Text alignment |
| `borderColor` | `string` | `#e0e0e0` | Border color |
| `verticalDividerColor` | `string` | `#f0f0f0` | Vertical divider color |
| `verticalDividerWidth` | `number` | 1 | Vertical divider width |
| `horizontalDividerColor` | `string` | `#f0f0f0` | Horizontal divider color |
| `horizontalDividerWidth` | `number` | 1 | Horizontal divider width |
| `rowHoverBackgroundColor` | `string` | `#f5f5f5` | Row hover background color |
| `scrollbarWidth` | `number` | 12 | Scrollbar width |
| `scrollbarTrackColor` | `string` | `#f1f1f1` | Scrollbar track color |
| `scrollbarThumbColor` | `string` | `#c1c1c1` | Scrollbar thumb color |
| `scrollbarThumbHoverColor` | `string` | `#a8a8a8` | Scrollbar thumb hover color |
| `scrollbarThumbPressedColor` | `string` | `#6b6b6b` | Scrollbar thumb pressed color |
| `tablePadding` | `PaddingValue` | 0 | Table padding |
| `cellPadding` | `PaddingValue` | `[5, 10]` | Cell padding |
| `headerCellPadding` | `PaddingValue` | `[5, 10]` | Header cell padding |
| `showVerticalDividers` | `boolean` | false | Show vertical dividers |
| `maxCellLines` | `number` | 0 | Maximum number of lines for cells (0 means no limit) |
| `rowStyleResolver` | `(row, index) => RowStyleResolverResult` | - | Row style resolver |

#### PaddingValue

Padding value type, supports the following formats:

- `number`: Same for all sides
- `[number, number]`: Vertical, horizontal
- `[number, number, number]`: Top, horizontal, bottom
- `[number, number, number, number]`: Top, right, bottom, left

### Methods

#### constructor(el: HTMLCanvasElement, options?: TableOptions)

Create a VirtualTable instance.

#### static list(el: HTMLCanvasElement, options: VirtualTableCreateOptions)

Static method, create table using array data.

#### setValues(length: number, valueBuilder: ValueBuilder)

Set table data.

#### setColumns(columns: TableColumn[])

Set table columns.

#### setStyle(style: TableStyle)

Set table style.

#### setDynamicRowHeight(enabled: boolean)

Enable or disable dynamic row height.

#### getRowHeightCache(): Map<number, number>

Get row height cache.

#### clearRowHeightCache()

Clear row height cache.

#### resize(width?: number, height?: number)

Resize table.

#### scrollTo(scrollTop?: number, scrollLeft?: number)

Scroll to specified position.

#### scrollToRow(rowIndex: number, align: "top" | "center" | "bottom" = "top")

Scroll to specified row with alignment.

#### addEventListener<T extends VirtualTableEventType>(type: T, listener: VirtualTableEventHandlerMap[T])

Add event listener.

#### removeEventListener<T extends VirtualTableEventType>(type: T, listener: VirtualTableEventHandlerMap[T])

Remove event listener.

### Events

#### onHover(listener: (row: Record<string, any>, index: number) => void)

Listen to hover events.

#### onClick(listener: (row: Record<string, any>, index: number) => void)

Listen to click events.

#### onScroll(listener: (scrollTop: number, scrollLeft: number) => void)

Listen to scroll events.

#### onTableCreated(listener: () => void)

Listen to table created event.

#### onRowCreated(listener: (row: Record<string, any>, index: number) => void)

Listen to row created event.

#### onRowHeightChanged(listener: (index: number, height: number) => void)

Listen to row height changed event.

#### offHover / offClick / offScroll / offTableCreated / offRowCreated / offRowHeightChanged

Remove event listeners.

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
    getValue: (row) => row.status ? '✅ Enabled' : '❌ Disabled',
  },
];
```

## Performance Optimization

### Data Caching

VirtualTable has a built-in data caching mechanism with a default threshold of 10,000 rows. When the cache is full, it automatically clears old cache.

### Virtual Scrolling

Only renders rows within the visible area, ensuring smooth scrolling even with millions of rows.

### Scrollbar Optimization

Scrollbars are drawn using Canvas with customizable styles including track color, thumb color, hover state, and more.

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+

## License

ISC
