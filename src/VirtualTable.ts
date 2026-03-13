/**
 * VirtualTable - 高性能虚拟滚动表格组件
 * 使用 Canvas 渲染，支持海量数据（~3万亿行）
 *
 * 核心特性：
 * 1. 虚拟滚动 - 只渲染可见区域
 * 2. 动态行高 - 根据内容自动计算
 * 3. 固定列 - 支持左右固定
 * 4. 高性能滚动 - 滚动条拖拽不卡顿
 */

type TableFixed = "left" | "right";
type TableColumnType = "text" | "html";

/**
 * 表格列接口
 */
type TableColumn = {
  /** 列的唯一标识符 */
  key: string;
  /** 列的显示名称 */
  name: string;
  /** 列类型，默认text */
  type?: TableColumnType;
  /** 自定义单元格显示值 */
  getValue?: (row: Record<string, any>, index: number) => string;
  /** 列宽（可选） */
  width?: number;
  /** 是否固定在左侧或右侧 */
  fixed?: TableFixed;
  /** 该列是否启用自动换行 */
  wrap?: boolean;
};

type RowStyleResolverResult = {
  /** 行背景色 */
  backgroundColor?: string;
  /** 行hover背景色 */
  hoverBackgroundColor?: string;
  /** 文本颜色 */
  textColor?: string;
  /** 文本对齐方式 */
  textAlign?: CanvasTextAlign;
  /** 边框颜色 */
  borderColor?: string;
  /** 字体 */
  font?: string;
};

/**
 * 行样式解析器接口
 */
type RowStyleResolver = (
  row: Record<string, any>,
  rowIndex: number,
) => RowStyleResolverResult;

/**
 * Padding 值类型
 */
type PaddingValue =
  | number
  | [number, number]
  | [number, number, number]
  | [number, number, number, number];

/**
 * 解析 PaddingValue 为四个方向值
 */
function parsePadding(padding: PaddingValue | undefined): {
  top: number;
  right: number;
  bottom: number;
  left: number;
} {
  const defaultValue = 0;
  if (padding === undefined) {
    return {
      top: defaultValue,
      right: defaultValue,
      bottom: defaultValue,
      left: defaultValue,
    };
  }
  if (typeof padding === "number") {
    return { top: padding, right: padding, bottom: padding, left: padding };
  }
  if (padding.length === 2) {
    return {
      top: padding[0],
      right: padding[1],
      bottom: padding[0],
      left: padding[1],
    };
  }
  if (padding.length === 3) {
    return {
      top: padding[0],
      right: padding[1],
      bottom: padding[2],
      left: padding[1],
    };
  }
  if (padding.length === 4) {
    return {
      top: padding[0],
      right: padding[1],
      bottom: padding[2],
      left: padding[3],
    };
  }
  return {
    top: defaultValue,
    right: defaultValue,
    bottom: defaultValue,
    left: defaultValue,
  };
}

/**
 * 表格样式接口
 */
type TableStyle = {
  /** 行高（当使用动态行高时，此为最小行高） */
  rowHeight?: number;
  /** 最小行高 */
  minRowHeight?: number;
  /** 最大行高（0表示不限制） */
  maxRowHeight?: number;
  /** 表头高度 */
  headerHeight?: number;
  /** 字体 */
  font?: string;
  /** 表头字体 */
  headerFont?: string;
  /** 表头背景色 */
  headerBackgroundColor?: string;
  /** 行背景色 */
  rowBackgroundColor?: string;
  /** 交替行背景色 */
  rowAltBackgroundColor?: string;
  /** 文本颜色 */
  textColor?: string;
  /** 文本对齐方式 */
  textAlign?: "left" | "right" | "center";
  borderColor?: string;
  verticalDividerColor?: string;
  verticalDividerWidth?: number;
  horizontalDividerColor?: string;
  horizontalDividerWidth?: number;
  rowHoverBackgroundColor?: string;
  /** 滚动条宽度 */
  scrollbarWidth?: number;
  /** 滚动条轨道颜色 */
  scrollbarTrackColor?: string;
  /** 滚动条滑块颜色 */
  scrollbarThumbColor?: string;
  /** 滚动条滑块hover颜色 */
  scrollbarThumbHoverColor?: string;
  /** 滚动条滑块按下颜色 */
  scrollbarThumbPressedColor?: string;
  /** 表格内边距 */
  tablePadding?: PaddingValue;
  /** 单元格内边距 */
  cellPadding?: PaddingValue;
  /** 表头单元格内边距 */
  headerCellPadding?: PaddingValue;
  /** 是否显示垂直分隔线 */
  showVerticalDividers?: boolean;
  /** 行样式解析器 */
  rowStyleResolver?: RowStyleResolver;
  /** 单元格最大行数 */
  maxCellLines?: number;
};

/**
 * 数据构建函数类型
 */
type ValueBuilder = (index: number) => Record<string, any>;

/**
 * 表格选项接口
 */
type TableOptions = {
  columns: TableColumn[];
  length: number;
  valueBuilder: ValueBuilder;
  style?: TableStyle;
  dynamicRowHeight?: boolean;
};

/**
 * 渲染布局接口
 */
type RenderLayout = {
  rowHeight: number;
  minRowHeight: number;
  maxRowHeight: number;
  headerHeight: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  scrollbarWidth: number;
  canvasWidth: number;
  canvasHeight: number;
  columnWidths: number[];
  totalContentWidth: number;
  leftFixedWidth: number;
  rightFixedWidth: number;
  hasHorizontalScrollbar: boolean;
  viewWidth: number;
  horizontalScrollbarHeight: number;
  contentWidth: number;
  contentHeight: number;
  maxScroll: number;
  maxScrollLeft: number;
  useDynamicRowHeight: boolean;
};

type VirtualTableEventHandlerMap = {
  hover: (row: Record<string, any>, index: number) => void;
  click: (row: Record<string, any>, index: number) => void;
  tableCreated: () => void;
  rowCreated: (row: Record<string, any>, index: number) => void;
  scroll: (scrollTop: number, scrollLeft: number) => void;
  rowHeightChanged: (index: number, height: number) => void;
};
type VirtualTableEventType = keyof VirtualTableEventHandlerMap;

type VirtualTableCreateOptions = {
  columns: TableColumn[];
  values: Record<string, any>[];
  style?: TableStyle;
  dynamicRowHeight?: boolean;
};

/**
 * 滚动条信息缓存
 */
interface ScrollbarInfo {
  maxScroll: number;
  scrollbarHeight: number;
  scrollbarY: number;
  maxScrollLeft: number;
  hScrollbarWidth: number;
  scrollbarX: number;
  hasHScrollbar: boolean;
  hasVScrollbar: boolean;
  vScrollbarTrackHeight: number;
  viewWidth: number;
}

class VirtualTable {
  static get MAX_LENGTH() {
    return 2998683910349035;
  }

  private el: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null = null;
  private scrollTop = 0;
  private scrollLeft = 0;
  private isDraggingVScrollbar = false;
  private isDraggingHScrollbar = false;
  private dragStartY = 0;
  private dragStartX = 0;
  private dragStartScrollTop = 0;
  private dragStartScrollLeft = 0;
  private hoverRow: number = -1;
  private isHoveringVScrollbar = false;
  private isHoveringHScrollbar = false;
  private isPressedVScrollbar = false;
  private isPressedHScrollbar = false;
  private _columns: TableColumn[] = [];
  private _length = 0;
  private _valueBuilder: ValueBuilder = () => ({});
  private _style: TableStyle = {};
  private _cache: Map<number, Record<string, any>> = new Map();
  private _rowHeightCache: Map<number, number> = new Map();
  private _rowHeightCacheMaxSize = 1000;
  private _estimatedRowHeight = 40;
  private _cumulativeHeightCache: Map<number, number> = new Map();
  private _layout: RenderLayout | null = null;
  private _scrollbarInfo: ScrollbarInfo | null = null;
  private _totalContentHeight = 0;
  private _useDynamicRowHeight = true;
  private isTableCreated = false;
  private _renderScheduled = false;
  private _suppressRender = false;
  private eventListeners: {
    [K in VirtualTableEventType]: Set<VirtualTableEventHandlerMap[K]>;
  } = {
    hover: new Set(),
    click: new Set(),
    tableCreated: new Set(),
    rowCreated: new Set(),
    scroll: new Set(),
    rowHeightChanged: new Set(),
  };
  private _stats = {
    renderCount: 0,
    cacheHitCount: 0,
    cacheMissCount: 0,
  };
  private _dragRenderRafId: number | null = null;

  private _startDragRenderLoop() {
    if (this._dragRenderRafId !== null) return;
    const loop = () => {
      if (!this.isDraggingVScrollbar && !this.isDraggingHScrollbar) {
        this._dragRenderRafId = null;
        return;
      }
      this._render();
      this._dragRenderRafId = requestAnimationFrame(loop);
    };
    this._dragRenderRafId = requestAnimationFrame(loop);
  }

  private _stopDragRenderLoop() {
    if (this._dragRenderRafId !== null) {
      cancelAnimationFrame(this._dragRenderRafId);
      this._dragRenderRafId = null;
    }
    this.isDraggingVScrollbar = false;
    this.isDraggingHScrollbar = false;
  }

  static list(el: HTMLCanvasElement, options: VirtualTableCreateOptions) {
    const { columns, values, style, dynamicRowHeight } = options;
    return new VirtualTable(el, {
      columns,
      length: values.length,
      valueBuilder: (index) => values[index],
      style,
      dynamicRowHeight,
    });
  }

  constructor(el: HTMLCanvasElement, options?: TableOptions) {
    this.el = el;
    this._initEvents();
    this._initResizeObserver();
    if (options) {
      this._initTable(options);
    }
  }

  private _initResizeObserver() {
    const observer = new ResizeObserver(() => {
      this._invalidateLayout();
      this._scheduleRender();
    });
    observer.observe(this.el.parentElement || this.el);
  }

  private _initTable(options: TableOptions) {
    this._columns = options.columns;
    this._length = Math.min(options.length, VirtualTable.MAX_LENGTH);
    this._valueBuilder = options.valueBuilder;
    this._useDynamicRowHeight = options.dynamicRowHeight ?? true;

    this._cache.clear();
    this._clearRowHeightCache();

    if (options.style) {
      this._style = { ...this._style, ...options.style };
    }

    this._estimateBaseRowHeight();
    this._recalcTotalContentHeight();
    this._invalidateLayout();
    this._scheduleRender();

    this.isTableCreated = true;
    this._emitEvent("tableCreated");
  }

  private _estimateBaseRowHeight() {
    const cellPadding = parsePadding(this._style.cellPadding ?? [5, 10]);
    const verticalPadding = cellPadding.top + cellPadding.bottom;
    const fontSize = 14;
    const baseRowHeight = fontSize + verticalPadding + 10;

    if (this._useDynamicRowHeight) {
      this._estimatedRowHeight = Math.max(200, baseRowHeight);
    } else {
      this._estimatedRowHeight = this._style.minRowHeight ?? baseRowHeight;
    }
  }

  setValues(length: number, valueBuilder: ValueBuilder) {
    this._length = Math.min(length, VirtualTable.MAX_LENGTH);
    this._valueBuilder = valueBuilder;
    this._cache.clear();
    this._clearRowHeightCache();
    this.scrollTop = 0;
    this._invalidateLayout();
    this._recalcTotalContentHeight();
    this._scheduleRender();
  }

  resize(width?: number, height?: number) {
    if (width) {
      this.el.width = width;
      this.el.style.width = `${width}px`;
    }
    if (height) {
      this.el.height = height;
      this.el.style.height = `${height}px`;
    }
    this._invalidateLayout();
    this._recalcTotalContentHeight();
    this._scheduleRender();
  }

  setColumns(columns: TableColumn[]) {
    this._columns = columns;
    this._invalidateLayout();
    this._scheduleRender();
  }

  setStyle(style: TableStyle) {
    this._style = { ...this._style, ...style };
    this._estimateBaseRowHeight();
    this._invalidateLayout();
    this._recalcTotalContentHeight();
    this._scheduleRender();
  }

  setDynamicRowHeight(enabled: boolean) {
    if (this._useDynamicRowHeight !== enabled) {
      this._useDynamicRowHeight = enabled;
      if (!enabled) {
        this._clearRowHeightCache();
      }
      this._invalidateLayout();
      this._recalcTotalContentHeight();
      this._scheduleRender();
    }
  }

  getRowHeightCache(): Map<number, number> {
    return this._rowHeightCache;
  }

  clearRowHeightCache() {
    this._clearRowHeightCache();
    this._invalidateLayout();
    this._recalcTotalContentHeight();
    this._scheduleRender();
  }

  scrollTo(scrollTop?: number, scrollLeft?: number) {
    const info = this._getScrollbarInfo();

    if (scrollTop !== undefined) {
      this.scrollTop = Math.max(0, Math.min(info.maxScroll, scrollTop));
    }

    if (scrollLeft !== undefined) {
      this.scrollLeft = Math.max(0, Math.min(info.maxScrollLeft, scrollLeft));
    }

    this._scheduleRender();
    this._emitEvent("scroll", this.scrollTop, this.scrollLeft);
  }

  scrollToRow(rowIndex: number, align: "top" | "center" | "bottom" = "top") {
    const rowTop = this._getRowTop(rowIndex);
    const rowHeight = this._getCachedRowHeight(rowIndex);
    const visibleHeight =
      this.el.clientHeight - (this._layout?.horizontalScrollbarHeight ?? 0);

    let targetScrollTop: number;
    switch (align) {
      case "center":
        targetScrollTop = rowTop - (visibleHeight - rowHeight) / 2;
        break;
      case "bottom":
        targetScrollTop = rowTop - visibleHeight + rowHeight;
        break;
      default:
        targetScrollTop = rowTop;
    }

    this.scrollTo(targetScrollTop, undefined);
  }

  addEventListener<T extends VirtualTableEventType>(
    type: T,
    listener: VirtualTableEventHandlerMap[T],
  ) {
    this.eventListeners[type].add(listener);
    if (type === "tableCreated" && this.isTableCreated) {
      (listener as VirtualTableEventHandlerMap["tableCreated"])();
    }
    if (type === "rowCreated" && this.isTableCreated) {
      this._replayCreatedRows(
        listener as VirtualTableEventHandlerMap["rowCreated"],
      );
    }
  }

  onHover(listener: VirtualTableEventHandlerMap["hover"]) {
    this.addEventListener("hover", listener);
  }

  onClick(listener: VirtualTableEventHandlerMap["click"]) {
    this.addEventListener("click", listener);
  }

  onTableCreated(listener: VirtualTableEventHandlerMap["tableCreated"]) {
    this.addEventListener("tableCreated", listener);
  }

  onRowCreated(listener: VirtualTableEventHandlerMap["rowCreated"]) {
    this.addEventListener("rowCreated", listener);
  }

  onScroll(listener: VirtualTableEventHandlerMap["scroll"]) {
    this.addEventListener("scroll", listener);
  }

  onRowHeightChanged(
    listener: VirtualTableEventHandlerMap["rowHeightChanged"],
  ) {
    this.addEventListener("rowHeightChanged", listener);
  }

  removeEventListener<T extends VirtualTableEventType>(
    type: T,
    listener: VirtualTableEventHandlerMap[T],
  ) {
    this.eventListeners[type].delete(listener);
  }

  offHover(listener: VirtualTableEventHandlerMap["hover"]) {
    this.removeEventListener("hover", listener);
  }

  offClick(listener: VirtualTableEventHandlerMap["click"]) {
    this.removeEventListener("click", listener);
  }

  offTableCreated(listener: VirtualTableEventHandlerMap["tableCreated"]) {
    this.removeEventListener("tableCreated", listener);
  }

  offRowCreated(listener: VirtualTableEventHandlerMap["rowCreated"]) {
    this.removeEventListener("rowCreated", listener);
  }

  offScroll(listener: VirtualTableEventHandlerMap["scroll"]) {
    this.removeEventListener("scroll", listener);
  }

  offRowHeightChanged(
    listener: VirtualTableEventHandlerMap["rowHeightChanged"],
  ) {
    this.removeEventListener("rowHeightChanged", listener);
  }

  private _replayCreatedRows(
    listener: VirtualTableEventHandlerMap["rowCreated"],
  ) {
    Array.from(this._cache.entries())
      .sort((a, b) => a[0] - b[0])
      .forEach(([index, row]) => {
        listener(row, index);
      });
  }

  private _getValue(index: number): Record<string, any> {
    if (this._cache.has(index)) {
      return this._cache.get(index)!;
    }
    const value = this._valueBuilder(index);
    this._cache.set(index, value);
    return value;
  }

  private _getCellDisplayValue(
    col: TableColumn,
    row: Record<string, any>,
    rowIndex: number,
  ): string {
    const rawValue = col.getValue ? col.getValue(row, rowIndex) : row[col.key];
    if (rawValue === undefined || rawValue === null) return "";
    return String(rawValue);
  }

  private _getCachedRowHeight(rowIndex: number): number {
    if (this._rowHeightCache.has(rowIndex)) {
      this._stats.cacheHitCount++;
      return this._rowHeightCache.get(rowIndex)!;
    }
    this._stats.cacheMissCount++;
    return this._estimatedRowHeight;
  }

  private _clearRowHeightCache() {
    this._rowHeightCache.clear();
    this._cumulativeHeightCache.clear();
  }

  /**
   * 计算单行高度
   */
  private _calculateRowHeight(
    row: Record<string, any>,
    rowIndex: number,
    colWidths: number[],
  ): number {
    const cellPadding = parsePadding(this._style.cellPadding ?? [5, 10]);
    const verticalPadding = cellPadding.top + cellPadding.bottom;
    const maxCellLines = this._style.maxCellLines ?? 0;

    let maxLines = 1;
    const wrapColumns = this._columns.filter((c) => c.wrap);

    if (wrapColumns.length > 0 && this.ctx) {
      const horizontalPadding = cellPadding.left + cellPadding.right;
      const baseFont =
        this._style.font ??
        "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      this.ctx.font = baseFont;

      for (const col of wrapColumns) {
        const colIndex = this._columns.indexOf(col);
        const text = this._getCellDisplayValue(col, row, rowIndex);
        const colWidth =
          (colWidths[colIndex] ?? col.width ?? 100) - horizontalPadding;
        if (colWidth <= 0) continue;

        const lines = this._wrapText(this.ctx, text, colWidth);
        if (lines.length > maxLines) {
          maxLines = lines.length;
        }
      }
    }

    if (maxCellLines > 0 && maxLines > maxCellLines) {
      maxLines = maxCellLines;
    }

    const fontSize = 14;
    const lineHeight = fontSize * 1.5;
    const minHeightForLines =
      fontSize + (maxLines - 1) * lineHeight + verticalPadding;

    const minHeight = this._style.minRowHeight ?? this._estimatedRowHeight;
    const maxHeight = this._style.maxRowHeight ?? 0;

    let finalHeight = Math.max(minHeight, minHeightForLines);
    if (maxHeight > 0) {
      finalHeight = Math.min(maxHeight, finalHeight);
    }

    return finalHeight;
  }

  /**
   * 获取行高（带缓存和 LRU）
   */
  private _getRowHeight(rowIndex: number, row: Record<string, any>): number {
    if (this._rowHeightCache.has(rowIndex)) {
      return this._rowHeightCache.get(rowIndex)!;
    }

    const colWidths = this._layout?.columnWidths ?? [];
    const height = this._calculateRowHeight(row, rowIndex, colWidths);

    if (this._rowHeightCache.size >= this._rowHeightCacheMaxSize) {
      this._rowHeightCache.clear();
    }

    this._rowHeightCache.set(rowIndex, height);
    return height;
  }

  /**
   * 获取平均行高
   */
  private _getAvgRowHeight(): number {
    // 使用固定的预估行高，避免缓存变化导致计算不稳定
    return this._estimatedRowHeight;
  }

  /**
   * 获取总内容高度
   */
  private _recalcTotalContentHeight() {
    const { top: paddingTop, bottom: paddingBottom } = parsePadding(
      this._style.tablePadding,
    );

    this._totalContentHeight =
      this._length * this._estimatedRowHeight + paddingTop + paddingBottom;
  }

  /**
   * 获取累积高度
   */
  private _getCumulativeHeight(endIndex: number): number {
    if (endIndex <= 0) return 0;
    return endIndex * this._estimatedRowHeight;
  }

  /**
   * 获取累积高度（动态行高）- 使用估算值
   */
  private _getCumulativeHeightDynamic(endIndex: number): number {
    if (endIndex <= 0) return 0;
    return endIndex * this._estimatedRowHeight;
  }

  /**
   * 获取指定行的顶部位置（增量优化）
   */
  private _getRowTop(rowIndex: number): number {
    if (this._useDynamicRowHeight) {
      return this._getCumulativeHeightDynamic(rowIndex);
    }
    return this._getCumulativeHeight(rowIndex);
  }

  private _getRowIndexAtY(y: number): number {
    if (y < 0 || this._length === 0) return -1;

    const layout = this._getLayout();
    const bodyTop = layout.paddingTop + layout.headerHeight;
    const visibleHeight =
      layout.canvasHeight -
      (layout.hasHorizontalScrollbar ? layout.horizontalScrollbarHeight : 0);
    const bodyBottom = bodyTop + visibleHeight;

    if (y < bodyTop || y >= bodyBottom) return -1;

    const baseRowHeight = this._estimatedRowHeight;
    const avgHeight = this._useDynamicRowHeight
      ? this._getAvgRowHeight()
      : baseRowHeight;

    const estimatedStartIndex = Math.max(
      0,
      Math.floor(this.scrollTop / avgHeight) - 20,
    );
    const startIndex = estimatedStartIndex;
    const endIndex = Math.min(
      this._length,
      startIndex + Math.ceil(visibleHeight / avgHeight) + 40,
    );

    let currentY = bodyTop + this._getRowTop(startIndex) - this.scrollTop;

    for (let rowIndex = startIndex; rowIndex < endIndex; rowIndex++) {
      if (currentY >= bodyBottom) break;

      let rowHeight: number;
      if (this._useDynamicRowHeight) {
        if (currentY + baseRowHeight >= bodyTop) {
          const row = this._getValue(rowIndex);
          rowHeight = this._getRowHeight(rowIndex, row);
        } else {
          rowHeight = baseRowHeight;
        }
      } else {
        rowHeight = baseRowHeight;
      }

      if (y >= currentY && y < currentY + rowHeight) {
        return rowIndex;
      }
      currentY += rowHeight;
    }

    return -1;
  }

  private _invalidateLayout() {
    this._layout = null;
    this._scrollbarInfo = null;
  }

  private _getScrollbarInfo(): ScrollbarInfo {
    if (this._scrollbarInfo && this._layout) {
      // 返回缓存，但更新动态值
      return {
        ...this._scrollbarInfo,
        scrollbarY: this._calcScrollbarY(this._scrollbarInfo),
        scrollbarX: this._calcScrollbarX(this._scrollbarInfo),
      };
    }

    const layout = this._getLayout();
    this._scrollbarInfo = this._calcScrollbarInfo(layout);
    return this._scrollbarInfo;
  }

  private _calcScrollbarY(info: ScrollbarInfo): number {
    if (info.maxScroll <= 0) return 0;
    return (
      (this.scrollTop / info.maxScroll) *
      (info.vScrollbarTrackHeight - info.scrollbarHeight)
    );
  }

  private _calcScrollbarX(info: ScrollbarInfo): number {
    if (info.maxScrollLeft <= 0) return 0;
    return (
      (this.scrollLeft / info.maxScrollLeft) *
      (info.viewWidth - info.hScrollbarWidth)
    );
  }

  private _calcScrollbarInfo(layout: RenderLayout): ScrollbarInfo {
    const scrollbarWidth = layout.scrollbarWidth;
    const canvasHeight = layout.canvasHeight;
    const contentHeight = layout.contentHeight;

    const hasVScrollbar = contentHeight > canvasHeight;
    const vScrollbarTrackHeight =
      canvasHeight - (layout.hasHorizontalScrollbar ? scrollbarWidth : 0);

    const maxScroll = Math.max(0, contentHeight - vScrollbarTrackHeight);
    const scrollbarHeight = Math.max(
      20,
      (vScrollbarTrackHeight / contentHeight) * vScrollbarTrackHeight,
    );

    const hasHScrollbar = layout.hasHorizontalScrollbar;
    const hScrollbarWidth = Math.max(
      20,
      (layout.viewWidth / layout.totalContentWidth) * layout.viewWidth,
    );
    const maxScrollLeft = layout.maxScrollLeft;

    return {
      maxScroll,
      scrollbarHeight,
      scrollbarY: 0, // 会在获取时计算
      maxScrollLeft,
      hScrollbarWidth,
      scrollbarX: 0, // 会在获取时计算
      hasHScrollbar,
      hasVScrollbar,
      vScrollbarTrackHeight,
      viewWidth: layout.viewWidth,
    };
  }

  private _getLayout(): RenderLayout {
    if (this._layout) return this._layout;
    this._layout = this._buildRenderLayout();
    return this._layout;
  }

  private _buildRenderLayout(): RenderLayout {
    const rowHeight = this._estimatedRowHeight;
    const minRowHeight = this._style.minRowHeight ?? 40;
    const maxRowHeight = this._style.maxRowHeight ?? 0;

    let headerHeight = this._style.headerHeight;
    if (headerHeight === undefined) {
      const headerPadding = parsePadding(
        this._style.headerCellPadding ?? [5, 10],
      );
      headerHeight = 14 + headerPadding.top + headerPadding.bottom;
    }
    headerHeight ??= 50;

    const {
      top: paddingTop,
      right: paddingRight,
      bottom: paddingBottom,
      left: paddingLeft,
    } = parsePadding(this._style.tablePadding ?? 0);
    const scrollbarWidth = this._style.scrollbarWidth ?? 12;
    const canvasHeight = this.el.clientHeight || 400;
    const canvasWidth = this.el.clientWidth || 800;
    const verticalPadding = paddingTop + paddingBottom;
    const horizontalPadding = paddingLeft + paddingRight;

    const contentHeight =
      headerHeight + this._totalContentHeight + verticalPadding;
    const hasVerticalScrollbar = contentHeight > canvasHeight;

    // 计算列宽
    const setWidths = this._columns.filter((col) => col.width !== undefined);
    const unsetCount = this._columns.length - setWidths.length;
    const assignedWidth = setWidths.reduce(
      (sum, col) => sum + (col.width ?? 0),
      0,
    );
    const availableWidth =
      canvasWidth -
      horizontalPadding -
      (hasVerticalScrollbar ? scrollbarWidth : 0) -
      assignedWidth;
    const avgWidth =
      unsetCount > 0 ? Math.max(100, availableWidth / unsetCount) : 100;
    const columnWidths = this._columns.map((col) => col.width ?? avgWidth);
    const totalContentWidth =
      columnWidths.reduce((sum, w) => sum + w, 0) + horizontalPadding;

    const viewWidth = hasVerticalScrollbar
      ? canvasWidth - scrollbarWidth
      : canvasWidth;
    const hasHorizontalScrollbar = totalContentWidth > viewWidth;
    const horizontalScrollbarHeight = hasHorizontalScrollbar
      ? scrollbarWidth
      : 0;

    const tempViewHeight = canvasHeight - horizontalScrollbarHeight;
    const maxScroll = Math.max(0, contentHeight - tempViewHeight);
    const contentWidth = viewWidth - horizontalPadding;
    const maxScrollLeft = Math.max(0, totalContentWidth - viewWidth);
    this.scrollLeft = Math.min(maxScrollLeft, this.scrollLeft);

    // 计算固定列宽度
    const fixedWidths = this._columns.reduce(
      (sum, col, i) => {
        if (col.fixed === "left") sum.left += columnWidths[i];
        if (col.fixed === "right") sum.right += columnWidths[i];
        return sum;
      },
      { left: 0, right: 0 },
    );

    return {
      rowHeight,
      minRowHeight,
      maxRowHeight,
      headerHeight,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      scrollbarWidth,
      canvasWidth,
      canvasHeight,
      columnWidths,
      totalContentWidth,
      leftFixedWidth: fixedWidths.left,
      rightFixedWidth: fixedWidths.right,
      hasHorizontalScrollbar,
      viewWidth,
      horizontalScrollbarHeight,
      contentWidth,
      contentHeight,
      maxScroll,
      maxScrollLeft,
      useDynamicRowHeight: this._useDynamicRowHeight,
    };
  }

  private _initEvents() {
    // 鼠标滚轮
    this.el.onwheel = (e) => {
      e.preventDefault();
      const horizontalDelta = Math.abs(e.deltaX) > 0 ? e.deltaX : e.deltaY;
      if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        this._handleHorizontalScroll(horizontalDelta);
      } else {
        this._handleScroll(e.deltaY);
      }
    };

    // 鼠标按下
    this.el.onmousedown = (e) => {
      if (e.buttons !== 1) return;
      this._handleMouseDown(e);
    };

    // 鼠标移动
    this.el.onmousemove = (e) => {
      this._handleMouseMove(e);
    };

    // 鼠标离开
    this.el.onmouseleave = () => {
      this._handleMouseLeave();
    };

    // 鼠标抬起
    this.el.onmouseup = () => {
      this._handleMouseUp();
    };

    // 全局鼠标移动（处理拖拽超出 canvas）
    window.addEventListener("mousemove", (e) => {
      if (this.isDraggingVScrollbar || this.isDraggingHScrollbar) {
        this._handleDragMove(e);
      }
    });

    // 全局鼠标抬起
    window.addEventListener("mouseup", () => {
      if (this.isDraggingVScrollbar || this.isDraggingHScrollbar) {
        this._handleMouseUp();
      }
    });
  }

  private _handleMouseDown(e: MouseEvent) {
    const scrollbarWidth = this._style.scrollbarWidth ?? 12;
    const canvasWidth = this.el.clientWidth || 800;
    const canvasHeight = this.el.clientHeight || 400;
    const info = this._getScrollbarInfo();
    const vScrollbarTrackHeight =
      canvasHeight - (info.hasHScrollbar ? scrollbarWidth : 0);

    // 检测垂直滚动条滑块点击
    if (info.hasVScrollbar) {
      const scrollbarY = this._calcScrollbarY(info);
      if (
        e.clientX >= canvasWidth - scrollbarWidth &&
        e.clientY >= scrollbarY &&
        e.clientY <= scrollbarY + info.scrollbarHeight
      ) {
        this.isDraggingVScrollbar = true;
        this.isPressedVScrollbar = true;
        this.dragStartY = e.clientY;
        this.dragStartScrollTop = this.scrollTop;
        this._startDragRenderLoop();
        return;
      }

      // 检测垂直滚动条轨道点击（翻页）
      if (e.clientX >= canvasWidth - scrollbarWidth) {
        if (e.clientY < scrollbarY) {
          this.scrollTop = Math.max(0, this.scrollTop - vScrollbarTrackHeight);
        } else if (e.clientY > scrollbarY + info.scrollbarHeight) {
          this.scrollTop = Math.min(
            info.maxScroll,
            this.scrollTop + vScrollbarTrackHeight,
          );
        }
        this.isPressedVScrollbar = true;
        this._scheduleRender();
        this._emitEvent("scroll", this.scrollTop, this.scrollLeft);
        return;
      }
    }

    // 检测水平滚动条
    if (info.hasHScrollbar) {
      const scrollbarX = this._calcScrollbarX(info);
      if (
        e.clientY >= canvasHeight - scrollbarWidth &&
        e.clientX >= scrollbarX &&
        e.clientX <= scrollbarX + info.hScrollbarWidth
      ) {
        this.isDraggingHScrollbar = true;
        this.isPressedHScrollbar = true;
        this.dragStartX = e.clientX;
        this.dragStartScrollLeft = this.scrollLeft;
        this._startDragRenderLoop();
        return;
      }

      // 水平滚动条轨道点击
      if (e.clientY >= canvasHeight - scrollbarWidth) {
        if (e.clientX < scrollbarX) {
          this.scrollLeft = Math.max(0, this.scrollLeft - canvasWidth);
        } else if (e.clientX > scrollbarX + info.hScrollbarWidth) {
          this.scrollLeft = Math.min(
            info.maxScrollLeft,
            this.scrollLeft + canvasWidth,
          );
        }
        this.isPressedHScrollbar = true;
        this._scheduleRender();
        this._emitEvent("scroll", this.scrollTop, this.scrollLeft);
        return;
      }
    }

    // 点击单元格
    const rowInfo = this._getRowAtPoint(e.clientX, e.clientY);
    if (rowInfo) {
      this._emitEvent("click", rowInfo.row, rowInfo.index);
    }
  }

  private _handleMouseMove(e: MouseEvent) {
    // 处理拖拽
    if (this.isDraggingVScrollbar || this.isDraggingHScrollbar) {
      this._handleDragMove(e);
      return;
    }

    // 更新 hover 状态
    this._updateHoverState(e);
  }

  private _handleDragMove(e: MouseEvent) {
    const info = this._getScrollbarInfo();
    const scrollbarWidth = this._style.scrollbarWidth ?? 12;
    const canvasHeight = this.el.clientHeight || 400;

    if (this.isDraggingVScrollbar) {
      const vScrollbarTrackHeight =
        canvasHeight - (info.hasHScrollbar ? scrollbarWidth : 0);
      const initialScrollbarY =
        info.maxScroll > 0
          ? (this.dragStartScrollTop / info.maxScroll) *
            (vScrollbarTrackHeight - info.scrollbarHeight)
          : 0;
      const deltaY = e.clientY - this.dragStartY;
      const newScrollbarY = initialScrollbarY + deltaY;
      const ratio =
        info.maxScroll > 0
          ? newScrollbarY / (vScrollbarTrackHeight - info.scrollbarHeight)
          : 0;
      this.scrollTop = Math.max(
        0,
        Math.min(info.maxScroll, ratio * info.maxScroll),
      );
    } else if (this.isDraggingHScrollbar) {
      const initialScrollbarX =
        info.maxScrollLeft > 0
          ? (this.dragStartScrollLeft / info.maxScrollLeft) *
            (info.viewWidth - info.hScrollbarWidth)
          : 0;
      const deltaX = e.clientX - this.dragStartX;
      const newScrollbarX = initialScrollbarX + deltaX;
      const ratio =
        info.maxScrollLeft > 0
          ? newScrollbarX / (info.viewWidth - info.hScrollbarWidth)
          : 0;
      this.scrollLeft = Math.max(
        0,
        Math.min(info.maxScrollLeft, ratio * info.maxScrollLeft),
      );
    }
  }

  private _handleMouseUp() {
    const wasDragging = this.isDraggingVScrollbar || this.isDraggingHScrollbar;
    const needsRender =
      this.isPressedVScrollbar || this.isPressedHScrollbar || wasDragging;

    this.isDraggingVScrollbar = false;
    this.isDraggingHScrollbar = false;
    this.isPressedVScrollbar = false;
    this.isPressedHScrollbar = false;
    this._stopDragRenderLoop();

    if (needsRender) {
      this._scheduleRender();
      this._emitEvent("scroll", this.scrollTop, this.scrollLeft);
    }
  }

  private _handleMouseLeave() {
    this.isHoveringVScrollbar = false;
    this.isHoveringHScrollbar = false;
    this.isPressedVScrollbar = false;
    this.isPressedHScrollbar = false;
    this.hoverRow = -1;
    this.el.style.cursor = "default";
    this._scheduleRender();
  }

  private _updateHoverState(e: MouseEvent) {
    const scrollbarWidth = this._style.scrollbarWidth ?? 12;
    const layout = this._getLayout();
    const info = this._getScrollbarInfo();

    const canvasWidth = layout.canvasWidth;
    const canvasHeight = layout.canvasHeight;

    const rect = this.el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let needsRender = false;

    // 计算 hover 行
    if (layout) {
      const { headerHeight, paddingTop, paddingBottom } = layout;
      const bodyTop = headerHeight + paddingTop;
      const bodyBottom =
        canvasHeight -
        paddingBottom -
        (layout.hasHorizontalScrollbar ? layout.horizontalScrollbarHeight : 0);

      // 检查鼠标是否在内容区域内
      if (y >= bodyTop && y < bodyBottom) {
        const newHoverRow = this._getRowIndexAtY(y);

        if (
          newHoverRow >= 0 &&
          newHoverRow < this._length &&
          x < layout.viewWidth
        ) {
          if (this.hoverRow !== newHoverRow) {
            this.hoverRow = newHoverRow;
            this._emitEvent("hover", this._getValue(newHoverRow), newHoverRow);
            needsRender = true;
          }
        } else if (this.hoverRow !== -1) {
          this.hoverRow = -1;
          needsRender = true;
        }
      } else if (this.hoverRow !== -1) {
        this.hoverRow = -1;
        needsRender = true;
      }
    }

    // 检测垂直滚动条 hover
    const wasHoveringV = this.isHoveringVScrollbar;
    this.isHoveringVScrollbar =
      info.hasVScrollbar &&
      x >= canvasWidth - scrollbarWidth &&
      y >= info.scrollbarY &&
      y <= info.scrollbarY + info.scrollbarHeight;
    if (wasHoveringV !== this.isHoveringVScrollbar) needsRender = true;

    // 检测水平滚动条 hover
    if (info.hasHScrollbar) {
      const wasHoveringH = this.isHoveringHScrollbar;
      const scrollbarX = this._calcScrollbarX(info);
      this.isHoveringHScrollbar =
        y >= canvasHeight - scrollbarWidth &&
        y <= canvasHeight &&
        x >= scrollbarX &&
        x <= scrollbarX + info.hScrollbarWidth;
      if (wasHoveringH !== this.isHoveringHScrollbar) needsRender = true;
    } else if (this.isHoveringHScrollbar) {
      this.isHoveringHScrollbar = false;
      needsRender = true;
    }

    if (needsRender) {
      this._scheduleRender();
    }

    // 更新光标
    const isHoveringRow = this._getRowAtPoint(e.clientX, e.clientY) !== null;
    const hasClickListener = this.eventListeners.click.size > 0;
    this.el.style.cursor =
      isHoveringRow && hasClickListener ? "pointer" : "default";
  }

  private _handleScroll(deltaY: number) {
    const info = this._getScrollbarInfo();
    this.scrollTop = Math.max(
      0,
      Math.min(info.maxScroll, this.scrollTop + deltaY),
    );
    this._scheduleRender();
    this._emitEvent("scroll", this.scrollTop, this.scrollLeft);
  }

  private _handleHorizontalScroll(deltaX: number) {
    const info = this._getScrollbarInfo();
    this.scrollLeft = Math.max(
      0,
      Math.min(info.maxScrollLeft, this.scrollLeft + deltaX),
    );
    this._scheduleRender();
    this._emitEvent("scroll", this.scrollTop, this.scrollLeft);
  }

  private _getRowAtPoint(clientX: number, clientY: number) {
    const layout = this._getLayout();
    const rect = this.el.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const bodyTop = layout.paddingTop + layout.headerHeight;
    const bodyBottom =
      layout.canvasHeight -
      layout.paddingBottom -
      (layout.hasHorizontalScrollbar ? layout.horizontalScrollbarHeight : 0);
    const bodyLeft = layout.paddingLeft;
    const bodyRight = layout.viewWidth - layout.paddingRight;

    if (x < bodyLeft || x >= bodyRight || y < bodyTop || y >= bodyBottom) {
      return null;
    }

    const avgHeight = this._getAvgRowHeight();
    const baseRowHeight = this._estimatedRowHeight;

    // 计算起始索引 - 使用估算值
    const estimatedStartIndex = Math.max(
      0,
      Math.floor(this.scrollTop / avgHeight) - 20,
    );
    const startIndex = estimatedStartIndex;

    // 计算起始 Y 坐标
    const startCumulativeHeight = this._getRowTop(startIndex);
    let currentY = bodyTop + startCumulativeHeight - this.scrollTop;

    let index = -1;
    for (let rowIndex = startIndex; rowIndex < this._length; rowIndex++) {
      if (currentY >= bodyBottom) {
        break;
      }

      // 与 _drawRows 保持一致：使用 baseRowHeight 判断是否可见
      if (currentY + baseRowHeight >= bodyTop || !this._useDynamicRowHeight) {
        const row = this._getValue(rowIndex);
        const actualRowHeight = this._useDynamicRowHeight
          ? this._getRowHeight(rowIndex, row)
          : baseRowHeight;

        // 检查鼠标是否在此行的范围内
        if (y >= currentY && y < currentY + actualRowHeight) {
          index = rowIndex;
          break;
        }
        currentY += actualRowHeight;
      } else {
        currentY += baseRowHeight;
      }
    }

    if (index < 0 || index >= this._length) {
      return null;
    }

    return { row: this._getValue(index), index };
  }

  private _emitEvent<T extends VirtualTableEventType>(
    type: T,
    ...args: Parameters<VirtualTableEventHandlerMap[T]>
  ) {
    if (type === "tableCreated") {
      this.eventListeners.tableCreated.forEach((listener) => listener());
      return;
    }
    if (type === "scroll") {
      const [scrollTop, scrollLeft] = args as [number, number];
      this.eventListeners.scroll.forEach((listener) =>
        listener(scrollTop, scrollLeft),
      );
      return;
    }
    const [row, index] = args as [Record<string, any>, number];
    if (type === "rowCreated") {
      this.eventListeners.rowCreated.forEach((listener) =>
        listener(row, index),
      );
      return;
    }
    if (type === "rowHeightChanged") {
      const [rowIndex, height] = args as [number, number];
      this.eventListeners.rowHeightChanged.forEach((listener) =>
        listener(rowIndex, height),
      );
      return;
    }
    if (type === "hover") {
      this.eventListeners.hover.forEach((listener) => listener(row, index));
      return;
    }
    this.eventListeners.click.forEach((listener) => listener(row, index));
  }

  private _scheduleRender() {
    if (this._renderScheduled || this._suppressRender) return;
    this._renderScheduled = true;
    requestAnimationFrame(() => {
      this._renderScheduled = false;
      this._render();
    });
  }

  private _render() {
    if (this._suppressRender) return;

    this.ctx ??= this.el.getContext("2d");
    if (!this.ctx) return;

    this._stats.renderCount++;

    const layout = this._getLayout();
    this._layout = layout;

    // 设置 Canvas 尺寸（只有改变时才设置，避免触发 ResizeObserver）
    const dpr = window.devicePixelRatio || 1;
    const newWidth = layout.canvasWidth * dpr;
    const newHeight = layout.canvasHeight * dpr;
    if (this.el.width !== newWidth || this.el.height !== newHeight) {
      this.el.width = newWidth;
      this.el.height = newHeight;
      this.el.style.width = `${layout.canvasWidth}px`;
      this.el.style.height = `${layout.canvasHeight}px`;
    }

    this.ctx.scale(dpr, dpr);
    this.ctx.clearRect(0, 0, layout.canvasWidth, layout.canvasHeight);

    const font =
      this._style.font ??
      "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    this.ctx.font = font;

    // 绘制
    this._drawRows(this.ctx, layout);
    this._drawHeader(this.ctx, layout);
    this._drawFixedColumnShadows(this.ctx, layout);
    this._drawVerticalDividers(this.ctx, layout);
    this._drawScrollbars(this.ctx, layout);
    this._drawOuterBorder(this.ctx, layout);
  }

  /**
   * 绘制行
   */
  private _drawRows(ctx: CanvasRenderingContext2D, layout: RenderLayout) {
    const { headerHeight, paddingTop } = layout;
    const visibleHeight =
      layout.canvasHeight -
      (layout.hasHorizontalScrollbar ? layout.horizontalScrollbarHeight : 0);
    const bodyTop = paddingTop + headerHeight;

    const baseRowHeight = this._estimatedRowHeight;
    const avgHeight = this._useDynamicRowHeight
      ? this._getAvgRowHeight()
      : baseRowHeight;

    const estimatedStartIndex = Math.max(
      0,
      Math.floor(this.scrollTop / avgHeight) - 20,
    );
    const startIndex = estimatedStartIndex;

    const endIndex = Math.min(
      this._length,
      startIndex + Math.ceil(visibleHeight / avgHeight) + 40,
    );

    // 计算起始 Y 坐标
    let currentY = bodyTop + this._getRowTop(startIndex) - this.scrollTop;

    for (let rowIndex = startIndex; rowIndex < endIndex; rowIndex++) {
      if (currentY >= bodyTop + visibleHeight) {
        break;
      }

      if (currentY + baseRowHeight >= bodyTop || !this._useDynamicRowHeight) {
        const row = this._getValue(rowIndex);
        const actualRowHeight = this._useDynamicRowHeight
          ? this._getRowHeight(rowIndex, row)
          : baseRowHeight;
        this._drawRow(ctx, layout, row, rowIndex, currentY, actualRowHeight);
        currentY += actualRowHeight;
      } else {
        currentY += baseRowHeight;
      }
    }
  }

  /**
   * 绘制单行
   */
  private _drawRow(
    ctx: CanvasRenderingContext2D,
    layout: RenderLayout,
    row: Record<string, any>,
    rowIndex: number,
    y: number,
    rowHeight: number,
  ) {
    const {
      paddingLeft,
      paddingRight,
      contentWidth,
      viewWidth,
      leftFixedWidth,
      rightFixedWidth,
    } = layout;
    const baseTextColor = this._style.textColor ?? "#333333";
    const baseFont =
      this._style.font ??
      "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

    // 获取行样式
    const rowStyle = this._style.rowStyleResolver?.(row, rowIndex);
    let rowBgColor =
      rowStyle?.backgroundColor ??
      (rowIndex % 2 === 0
        ? (this._style.rowBackgroundColor ?? "#ffffff")
        : (this._style.rowAltBackgroundColor ?? "#fafafa"));
    if (this.hoverRow === rowIndex) {
      rowBgColor =
        this._style.rowHoverBackgroundColor ??
        rowStyle?.hoverBackgroundColor ??
        "#f5f5f5";
    }
    const rowTextColor = rowStyle?.textColor ?? baseTextColor;
    const rowBorderColor =
      rowStyle?.borderColor ??
      this._style.horizontalDividerColor ??
      this._style.borderColor ??
      "#f0f0f0";

    // 绘制行背景
    ctx.fillStyle = rowBgColor;
    ctx.fillRect(paddingLeft, y, contentWidth, rowHeight);

    // 绘制单元格
    const middleStartX = paddingLeft + leftFixedWidth;
    const middleEndX = viewWidth - paddingRight - rightFixedWidth;
    const middleWidth = Math.max(0, middleEndX - middleStartX);

    // 绘制左侧固定列
    if (leftFixedWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(paddingLeft, y, leftFixedWidth, rowHeight);
      ctx.clip();
      ctx.fillStyle = rowTextColor;
      ctx.font = rowStyle?.font ?? baseFont;
      let x = paddingLeft;
      this._columns.forEach((col, i) => {
        if (col.fixed === "left") {
          const value = this._getCellDisplayValue(col, row, rowIndex);
          this._drawCellText(
            ctx,
            value,
            x,
            y,
            layout.columnWidths[i],
            rowHeight,
            col.wrap,
          );
          x += layout.columnWidths[i];
        }
      });
      ctx.restore();
    }

    // 绘制中间列
    if (middleWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(middleStartX, y, middleWidth, rowHeight);
      ctx.clip();
      ctx.fillStyle = rowTextColor;
      ctx.font = rowStyle?.font ?? baseFont;
      let x = middleStartX - this.scrollLeft;
      this._columns.forEach((col, i) => {
        if (!col.fixed) {
          const value = this._getCellDisplayValue(col, row, rowIndex);
          this._drawCellText(
            ctx,
            value,
            x,
            y,
            layout.columnWidths[i],
            rowHeight,
            col.wrap,
          );
          x += layout.columnWidths[i];
        }
      });
      ctx.restore();
    }

    // 绘制右侧固定列
    if (rightFixedWidth > 0) {
      ctx.save();
      const rightX = viewWidth - paddingRight - rightFixedWidth;
      ctx.beginPath();
      ctx.rect(rightX, y, rightFixedWidth, rowHeight);
      ctx.clip();
      ctx.fillStyle = rowTextColor;
      ctx.font = rowStyle?.font ?? baseFont;
      let x = rightX;
      this._columns.forEach((col, i) => {
        if (col.fixed === "right") {
          const value = this._getCellDisplayValue(col, row, rowIndex);
          this._drawCellText(
            ctx,
            value,
            x,
            y,
            layout.columnWidths[i],
            rowHeight,
            col.wrap,
          );
          x += layout.columnWidths[i];
        }
      });
      ctx.restore();
    }

    // 绘制行边框
    ctx.strokeStyle = rowBorderColor;
    ctx.lineWidth = this._style.horizontalDividerWidth ?? 1;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y + rowHeight);
    ctx.lineTo(viewWidth - paddingRight, y + rowHeight);
    ctx.stroke();
  }

  /**
   * 绘制单元格文本
   */
  private _drawCellText(
    ctx: CanvasRenderingContext2D,
    text: string,
    cellX: number,
    cellY: number,
    cellWidth: number,
    cellHeight: number,
    wrap?: boolean,
  ) {
    if (cellWidth <= 0) return;

    const cellPaddingObj = parsePadding(this._style.cellPadding ?? [5, 10]);
    const horizontalPadding = cellPaddingObj.left + cellPaddingObj.right;
    const textAlign = this._style.textAlign ?? "left";
    const maxTextWidth = Math.max(0, cellWidth - horizontalPadding);

    if (maxTextWidth <= 0) return;

    const fontSize = 14;
    const lineHeight = fontSize * 1.5;
    const maxCellLines = this._style.maxCellLines ?? 0;

    let displayLines: string[];
    if (wrap) {
      displayLines = this._wrapText(ctx, text, maxTextWidth);
      if (maxCellLines > 0 && displayLines.length >= maxCellLines) {
        displayLines = displayLines.slice(0, maxCellLines);
        const lastLine = displayLines[displayLines.length - 1];
        displayLines[displayLines.length - 1] = this._addEllipsis(
          ctx,
          lastLine,
          maxTextWidth,
        );
      }
    } else {
      let displayText = text;
      if (ctx.measureText(displayText).width > maxTextWidth) {
        displayText = this._addEllipsis(ctx, displayText, maxTextWidth);
      }
      displayLines = [displayText];
    }

    ctx.save();
    ctx.beginPath();
    ctx.rect(cellX, cellY, cellWidth, cellHeight);
    ctx.clip();
    ctx.textAlign = textAlign;
    ctx.textBaseline = "top";

    const totalTextHeight = displayLines.length * lineHeight;
    const availableHeight =
      cellHeight - cellPaddingObj.top - cellPaddingObj.bottom;
    const centeredY = (availableHeight - totalTextHeight) / 2;
    const textStartY = cellY + cellPaddingObj.top + Math.max(0, centeredY);

    displayLines.forEach((line, lineIndex) => {
      const textX =
        textAlign === "center"
          ? cellX + cellWidth / 2
          : textAlign === "right"
            ? cellX + cellWidth - cellPaddingObj.right
            : cellX + cellPaddingObj.left;
      const textY = textStartY + lineIndex * lineHeight;
      ctx.fillText(line, textX, textY);
    });

    ctx.restore();
  }

  /**
   * 文本换行
   */
  private _wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
  ): string[] {
    if (!text || maxWidth <= 0) return [text];

    const lines: string[] = [];
    let currentLine = "";

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const testLine = currentLine + char;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = char;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.length > 0 ? lines : [""];
  }

  /**
   * 添加省略号
   */
  private _addEllipsis(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
  ): string {
    if (maxWidth <= 0) return "";

    const ellipsis = "...";
    const ellipsisWidth = ctx.measureText(ellipsis).width;
    const availableWidth = maxWidth - ellipsisWidth;

    if (availableWidth <= 0) return ellipsis;

    let low = 0;
    let high = text.length;

    while (low < high) {
      const mid = Math.ceil((low + high) / 2);
      const testText = text.slice(0, mid);
      if (ctx.measureText(testText).width <= availableWidth) {
        low = mid;
      } else {
        high = mid - 1;
      }
    }

    return low > 0 ? `${text.slice(0, low)}${ellipsis}` : ellipsis;
  }

  /**
   * 绘制表头
   */
  private _drawHeader(ctx: CanvasRenderingContext2D, layout: RenderLayout) {
    const {
      paddingTop,
      paddingRight,
      paddingLeft,
      contentWidth,
      headerHeight,
      viewWidth,
      leftFixedWidth,
      rightFixedWidth,
    } = layout;

    // 表头背景
    ctx.fillStyle = this._style.headerBackgroundColor ?? "#f5f5f5";
    ctx.fillRect(paddingLeft, paddingTop, contentWidth, headerHeight);

    // 文本样式
    ctx.fillStyle = this._style.textColor ?? "#333333";
    ctx.font =
      this._style.headerFont ??
      "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textBaseline = "middle";

    // 左侧固定列表头
    if (leftFixedWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(paddingLeft, paddingTop, leftFixedWidth, headerHeight);
      ctx.clip();
      let x = paddingLeft;
      this._columns.forEach((col, i) => {
        if (col.fixed === "left") {
          this._drawCellText(
            ctx,
            col.name,
            x,
            paddingTop,
            layout.columnWidths[i],
            headerHeight,
            false,
          );
          x += layout.columnWidths[i];
        }
      });
      ctx.restore();
    }

    // 中间列表头
    const middleStartX = paddingLeft + leftFixedWidth;
    const middleEndX = viewWidth - paddingRight - rightFixedWidth;
    const middleWidth = Math.max(0, middleEndX - middleStartX);
    if (middleWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(middleStartX, paddingTop, middleWidth, headerHeight);
      ctx.clip();
      let x = middleStartX - this.scrollLeft;
      this._columns.forEach((col, i) => {
        if (!col.fixed) {
          this._drawCellText(
            ctx,
            col.name,
            x,
            paddingTop,
            layout.columnWidths[i],
            headerHeight,
            false,
          );
          x += layout.columnWidths[i];
        }
      });
      ctx.restore();
    }

    // 右侧固定列表头
    if (rightFixedWidth > 0) {
      ctx.save();
      const rightX = viewWidth - paddingRight - rightFixedWidth;
      ctx.beginPath();
      ctx.rect(rightX, paddingTop, rightFixedWidth, headerHeight);
      ctx.clip();
      let x = rightX;
      this._columns.forEach((col, i) => {
        if (col.fixed === "right") {
          this._drawCellText(
            ctx,
            col.name,
            x,
            paddingTop,
            layout.columnWidths[i],
            headerHeight,
            false,
          );
          x += layout.columnWidths[i];
        }
      });
      ctx.restore();
    }

    // 表头底部边框
    ctx.strokeStyle = this._style.borderColor ?? "#e0e0e0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, paddingTop + headerHeight);
    ctx.lineTo(viewWidth - paddingRight, paddingTop + headerHeight);
    ctx.stroke();
  }

  /**
   * 绘制固定列阴影
   */
  private _drawFixedColumnShadows(
    ctx: CanvasRenderingContext2D,
    layout: RenderLayout,
  ) {
    const shadowWidth = 12;
    const {
      paddingTop,
      paddingLeft,
      canvasHeight,
      paddingBottom,
      horizontalScrollbarHeight,
      leftFixedWidth,
      rightFixedWidth,
      viewWidth,
      paddingRight,
      maxScrollLeft,
    } = layout;

    const shadowHeight =
      canvasHeight - paddingTop - paddingBottom - horizontalScrollbarHeight;
    if (shadowHeight <= 0) return;

    // 左侧阴影
    if (leftFixedWidth > 0 && this.scrollLeft > 0) {
      const leftShadowX = paddingLeft + leftFixedWidth;
      const gradient = ctx.createLinearGradient(
        leftShadowX,
        0,
        leftShadowX + shadowWidth,
        0,
      );
      gradient.addColorStop(0, "rgba(0, 0, 0, 0.08)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(leftShadowX, paddingTop, shadowWidth, shadowHeight);
    }

    // 右侧阴影
    if (rightFixedWidth > 0 && this.scrollLeft < maxScrollLeft) {
      const rightShadowX =
        viewWidth - paddingRight - rightFixedWidth - shadowWidth;
      const gradient = ctx.createLinearGradient(
        rightShadowX,
        0,
        rightShadowX + shadowWidth,
        0,
      );
      gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0.08)");
      ctx.fillStyle = gradient;
      ctx.fillRect(rightShadowX, paddingTop, shadowWidth, shadowHeight);
    }
  }

  /**
   * 绘制垂直分隔线
   */
  private _drawVerticalDividers(
    ctx: CanvasRenderingContext2D,
    layout: RenderLayout,
  ) {
    if (!this._style.showVerticalDividers) return;

    const {
      paddingTop,
      paddingLeft,
      canvasHeight,
      paddingBottom,
      horizontalScrollbarHeight,
      viewWidth,
      paddingRight,
      rightFixedWidth,
      leftFixedWidth,
    } = layout;

    const top = paddingTop;
    const bottom = canvasHeight - paddingBottom - horizontalScrollbarHeight;
    if (bottom <= top) return;

    const visibleLeft = paddingLeft;
    const visibleRight = viewWidth - paddingRight - rightFixedWidth;
    const dividerXSet = new Set<number>();

    // 收集分隔线 X 坐标
    let leftX = paddingLeft;
    this._columns.forEach((col, i) => {
      if (col.fixed === "left") {
        leftX += layout.columnWidths[i];
        dividerXSet.add(leftX);
      }
    });

    let middleX = paddingLeft + leftFixedWidth - this.scrollLeft;
    this._columns.forEach((col, i) => {
      if (!col.fixed) {
        middleX += layout.columnWidths[i];
        dividerXSet.add(middleX);
      }
    });

    let rightX = viewWidth - paddingRight - rightFixedWidth;
    this._columns.forEach((col, i) => {
      if (col.fixed === "right") {
        rightX += layout.columnWidths[i];
        dividerXSet.add(rightX);
      }
    });

    ctx.strokeStyle =
      this._style.verticalDividerColor ?? this._style.borderColor ?? "#f0f0f0";
    ctx.lineWidth = this._style.verticalDividerWidth ?? 1;
    dividerXSet.forEach((x) => {
      if (x <= visibleLeft || x > visibleRight) return;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, bottom);
      ctx.stroke();
    });
  }

  /**
   * 绘制滚动条
   */
  private _drawScrollbars(ctx: CanvasRenderingContext2D, layout: RenderLayout) {
    const info = this._getScrollbarInfo();
    const scrollbarWidth = layout.scrollbarWidth;

    // 垂直滚动条
    if (info.hasVScrollbar) {
      const vTrackColor = this._style.scrollbarTrackColor ?? "#f1f1f1";
      const vThumbColor =
        this.isPressedVScrollbar || this.isDraggingVScrollbar
          ? (this._style.scrollbarThumbPressedColor ?? "#6b6b6b")
          : this.isHoveringVScrollbar
            ? (this._style.scrollbarThumbHoverColor ?? "#a8a8a8")
            : (this._style.scrollbarThumbColor ?? "#c1c1c1");

      // 轨道
      ctx.fillStyle = vTrackColor;
      ctx.fillRect(
        layout.viewWidth,
        0,
        scrollbarWidth,
        info.vScrollbarTrackHeight,
      );

      // 滑块
      const scrollbarY = this._calcScrollbarY(info);
      ctx.fillStyle = vThumbColor;
      ctx.beginPath();
      ctx.roundRect(
        layout.viewWidth + 2,
        scrollbarY + 2,
        scrollbarWidth - 4,
        info.scrollbarHeight - 4,
        4,
      );
      ctx.fill();
    }

    // 水平滚动条
    if (info.hasHScrollbar) {
      const hTrackColor = this._style.scrollbarTrackColor ?? "#f1f1f1";
      const hThumbColor =
        this.isPressedHScrollbar || this.isDraggingHScrollbar
          ? (this._style.scrollbarThumbPressedColor ?? "#6b6b6b")
          : this.isHoveringHScrollbar
            ? (this._style.scrollbarThumbHoverColor ?? "#a8a8a8")
            : (this._style.scrollbarThumbColor ?? "#c1c1c1");

      // 轨道
      ctx.fillStyle = hTrackColor;
      ctx.fillRect(
        0,
        layout.canvasHeight - scrollbarWidth,
        layout.viewWidth,
        scrollbarWidth,
      );

      // 滑块
      const scrollbarX = this._calcScrollbarX(info);
      ctx.fillStyle = hThumbColor;
      ctx.beginPath();
      ctx.roundRect(
        scrollbarX + 2,
        layout.canvasHeight - scrollbarWidth + 2,
        info.hScrollbarWidth - 4,
        scrollbarWidth - 4,
        4,
      );
      ctx.fill();
    }
  }

  /**
   * 绘制外边框
   */
  private _drawOuterBorder(
    ctx: CanvasRenderingContext2D,
    layout: RenderLayout,
  ) {
    const {
      paddingTop,
      paddingLeft,
      contentWidth,
      canvasHeight,
      paddingBottom,
      horizontalScrollbarHeight,
    } = layout;

    ctx.strokeStyle = this._style.borderColor ?? "#e0e0e0";
    ctx.strokeRect(
      paddingLeft,
      paddingTop,
      contentWidth,
      canvasHeight - paddingTop - paddingBottom - horizontalScrollbarHeight,
    );
  }
}

export {
  type TableFixed,
  type TableColumnType,
  type TableColumn,
  type RowStyleResolverResult,
  type RowStyleResolver,
  type TableStyle,
  type ValueBuilder,
  type TableOptions,
  type RenderLayout,
  type VirtualTableEventType,
  type VirtualTableEventHandlerMap,
  type VirtualTableCreateOptions,
  VirtualTable,
};
