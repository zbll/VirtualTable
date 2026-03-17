// ==================== 常量定义 ====================
const DEFAULT_FONT =
  "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const DEFAULT_HEADER_FONT =
  "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const DEFAULT_ROW_HEIGHT = 40;
const DEFAULT_MIN_ROW_HEIGHT = 35;
const DEFAULT_HEADER_HEIGHT = 50;
const DEFAULT_SCROLLBAR_WIDTH = 12;
const DEFAULT_CELL_PADDING: [number, number] = [5, 10];
const DEFAULT_ROW_BG = "#ffffff";
const DEFAULT_ROW_ALT_BG = "#fafafa";
const DEFAULT_HEADER_BG = "#f5f5f5";
const DEFAULT_TEXT_COLOR = "#333333";
const DEFAULT_BORDER_COLOR = "#e0e0e0";
const DEFAULT_DIVIDER_COLOR = "#f0f0f0";
const DEFAULT_HOVER_BG = "#f5f5f5";
const SCROLL_BUFFER = 200; // 渲染缓冲区
const INDEX_BUFFER = 50; // 索引缓冲区
const ROW_HEIGHT_ESTIMATE = 20; // 每行预估高度（用于计算可见行数）
const MAX_ROW_HEIGHT_CACHE = 10000;

type TableFixed = "left" | "right";

/**
 * 表格列接口
 */
type TableColumn = {
  /** 列的唯一标识符 */
  key: string;
  /** 列的显示名称 */
  name: string;
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
  if (padding === undefined) {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
  if (typeof padding === "number") {
    return { top: padding, right: padding, bottom: padding, left: padding };
  }
  switch (padding.length) {
    case 2:
      return {
        top: padding[0],
        right: padding[1],
        bottom: padding[0],
        left: padding[1],
      };
    case 3:
      return {
        top: padding[0],
        right: padding[1],
        bottom: padding[2],
        left: padding[1],
      };
    case 4:
      return {
        top: padding[0],
        right: padding[1],
        bottom: padding[2],
        left: padding[3],
      };
    default:
      return { top: 0, right: 0, bottom: 0, left: 0 };
  }
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
 * 包含表格渲染所需的所有布局计算结果
 */
type RenderLayout = {
  /** 预估行高 */
  rowHeight: number;
  /** 最小行高 */
  minRowHeight: number;
  /** 最大行高（0 表示无限制） */
  maxRowHeight: number;
  /** 表头高度 */
  headerHeight: number;
  /** 表格顶部内边距 */
  paddingTop: number;
  /** 表格右侧内边距 */
  paddingRight: number;
  /** 表格底部内边距 */
  paddingBottom: number;
  /** 表格左侧内边距 */
  paddingLeft: number;
  /** 滚动条宽度 */
  scrollbarWidth: number;
  /** Canvas 元素宽度 */
  canvasWidth: number;
  /** Canvas 元素高度 */
  canvasHeight: number;
  /** 各列宽度数组 */
  columnWidths: number[];
  /** 内容区域总宽度（所有列宽 + 内边距） */
  totalContentWidth: number;
  /** 左侧固定列总宽度 */
  leftFixedWidth: number;
  /** 右侧固定列总宽度 */
  rightFixedWidth: number;
  /** 是否显示水平滚动条 */
  hasHorizontalScrollbar: boolean;
  /** 视口宽度（减去垂直滚动条后的宽度） */
  viewWidth: number;
  /** 水平滚动条高度 */
  horizontalScrollbarHeight: number;
  /** 内容区域宽度（减去内边距和滚动条） */
  contentWidth: number;
  /** 内容区域总高度 */
  contentHeight: number;
  /** 垂直方向最大滚动值 */
  maxScroll: number;
  /** 水平方向最大滚动值 */
  maxScrollLeft: number;
  /** 是否启用动态行高 */
  useDynamicRowHeight: boolean;
};

/**
 * 事件处理器映射表
 * 定义表格支持的所有事件类型及其回调函数签名
 */
type VirtualTableEventHandlerMap = {
  /** 鼠标悬停事件 - 当鼠标悬停在某行上时触发 */
  hover: (row: Record<string, any>, index: number) => void;
  /** 点击事件 - 当点击某行时触发 */
  click: (row: Record<string, any>, index: number) => void;
  /** 表格创建完成事件 - 当表格初始化完成后触发 */
  tableCreated: () => void;
  /** 行创建事件 - 当某行数据首次被访问时触发 */
  rowCreated: (row: Record<string, any>, index: number) => void;
  /** 滚动事件 - 当表格滚动时触发 */
  scroll: (scrollTop: number, scrollLeft: number) => void;
  /** 行高变化事件 - 当某行高度计算完成后触发 */
  rowHeightChanged: (index: number, height: number) => void;
};

/**
 * 事件类型联合类型
 * VirtualTableEventHandlerMap 中所有键的联合类型
 */
type VirtualTableEventType = keyof VirtualTableEventHandlerMap;

/**
 * 使用数组数据创建表格的选项
 */
type VirtualTableCreateOptions = {
  /** 列配置数组 */
  columns: TableColumn[];
  /** 行数据数组 */
  values: Record<string, any>[];
  /** 表格样式配置（可选） */
  style?: TableStyle;
  /** 是否启用动态行高（可选，默认 true） */
  dynamicRowHeight?: boolean;
};

/**
 * 滚动条信息缓存
 * 包含滚动条的各种计算参数，用于渲染和交互
 */
interface ScrollbarInfo {
  /** 垂直方向最大滚动值 */
  maxScroll: number;
  /** 垂直滚动条滑块高度 */
  scrollbarHeight: number;
  /** 垂直滚动条滑块 Y 坐标位置 */
  scrollbarY: number;
  /** 水平方向最大滚动值 */
  maxScrollLeft: number;
  /** 水平滚动条滑块宽度 */
  hScrollbarWidth: number;
  /** 水平滚动条滑块 X 坐标位置 */
  scrollbarX: number;
  /** 是否显示水平滚动条 */
  hasHScrollbar: boolean;
  /** 是否显示垂直滚动条 */
  hasVScrollbar: boolean;
  /** 垂直滚动条轨道高度 */
  vScrollbarTrackHeight: number;
  /** 视口宽度（减去滚动条宽度后的值） */
  viewWidth: number;
}

/**
 * 可见行范围
 * 用于虚拟滚动计算，确定需要渲染的行范围
 */
type VisibleRange = {
  /** 可见区域起始行索引 */
  startIndex: number;
  /** 可见区域结束行索引（不包含） */
  endIndex: number;
  /** 第一行在 Canvas 上的 Y 坐标 */
  startY: number;
};

class VirtualTable {
  /**
   * 表格支持的最大行数
   * 约为 3 万亿行
   */
  static get MAX_LENGTH() {
    return 2998683910349035;
  }

  // ==================== 实例属性 ====================
  /** Canvas DOM 元素 */
  private el: HTMLCanvasElement;
  /** Canvas 2D 渲染上下文 */
  private ctx: CanvasRenderingContext2D | null = null;

  // 滚动状态
  /** 垂直滚动位置 */
  private scrollTop = 0;
  /** 水平滚动位置 */
  private scrollLeft = 0;

  // 拖拽状态
  /** 是否正在拖拽垂直滚动条 */
  private isDraggingV = false;
  /** 是否正在拖拽水平滚动条 */
  private isDraggingH = false;
  /** 拖拽起始 Y 坐标 */
  private dragStartY = 0;
  /** 拖拽起始 X 坐标 */
  private dragStartX = 0;
  /** 拖拽起始滚动位置（垂直） */
  private dragStartScrollTop = 0;
  /** 拖拽起始滚动位置（水平） */
  private dragStartScrollLeft = 0;

  // Hover 状态
  /** 当前 hover 的行索引，-1 表示无 */
  private hoverRow: number = -1;
  /** 是否 hover 在垂直滚动条上 */
  private isHoveringV = false;
  /** 是否 hover 在水平滚动条上 */
  private isHoveringH = false;
  /** 是否按下垂直滚动条 */
  private isPressedV = false;
  /** 是否按下水平滚动条 */
  private isPressedH = false;

  // 数据
  /** 列配置数组 */
  private _columns: TableColumn[] = [];
  /** 数据行数 */
  private _length = 0;
  /** 数据生成函数 */
  private _valueBuilder: ValueBuilder = () => ({});
  /** 样式配置 */
  private _style: TableStyle = {};
  /** 数据缓存 Map */
  private _cache: Map<number, Record<string, any>> = new Map();
  /** 行高缓存 Map */
  private _rowHeightCache: Map<number, number> = new Map();
  /** 预估行高 */
  private _estimatedRowHeight = DEFAULT_ROW_HEIGHT;
  /** 渲染布局缓存 */
  private _layout: RenderLayout | null = null;
  /** 滚动条信息缓存 */
  private _scrollbarInfo: ScrollbarInfo | null = null;
  /** 内容总高度 */
  private _totalContentHeight = 0;
  /** 是否使用动态行高 */
  private _useDynamicRowHeight = true;

  // 状态标志
  /** 表格是否已创建 */
  private isTableCreated = false;
  /** 是否已安排渲染（避免重复安排） */
  private _renderScheduled = false;
  /** 是否暂停渲染 */
  private _suppressRender = false;

  // 事件监听器
  /** 事件监听器集合 */
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

  // 统计
  /** 渲染统计信息 */
  private _stats = {
    /** 渲染次数 */
    renderCount: 0,
    /** 缓存命中次数 */
    cacheHitCount: 0,
    /** 缓存未命中次数 */
    cacheMissCount: 0,
  };

  /** 拖拽渲染动画帧 ID */
  private _dragRenderRafId: number | null = null;

  // ==================== 公共静态方法 ====================
  /**
   * 使用数组数据创建表格的静态工厂方法
   * 适用于数据量较小的场景
   * @param el Canvas 元素
   * @param options 创建选项
   * @returns VirtualTable 实例
   */
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

  /**
   * 构造函数
   * @param el Canvas 元素
   * @param options 表格配置选项（可选）
   */
  constructor(el: HTMLCanvasElement, options?: TableOptions) {
    this.el = el;
    this._initEvents();
    this._initResizeObserver();
    if (options) {
      this._initTable(options);
    }
  }

  // ==================== 公共方法 ====================
  /**
   * 设置表格数据
   * @param length 数据行数
   * @param valueBuilder 数据生成函数，接收索引返回行数据
   */
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

  /**
   * 调整表格大小
   * @param width 宽度（可选）
   * @param height 高度（可选）
   */
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

  /**
   * 设置列配置
   * @param columns 列配置数组
   */
  setColumns(columns: TableColumn[]) {
    this._columns = columns;
    this._invalidateLayout();
    this._scheduleRender();
  }

  /**
   * 设置表格样式
   * @param style 样式配置对象
   */
  setStyle(style: TableStyle) {
    this._style = { ...this._style, ...style };
    this._estimateBaseRowHeight();
    this._invalidateLayout();
    this._recalcTotalContentHeight();
    this._scheduleRender();
  }

  /**
   * 启用/禁用动态行高
   * @param enabled 是否启用
   */
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

  /**
   * 获取行高缓存
   * @returns 行高缓存 Map
   */
  getRowHeightCache(): Map<number, number> {
    return this._rowHeightCache;
  }

  /**
   * 清空行高缓存并重新渲染
   */
  clearRowHeightCache() {
    this._clearRowHeightCache();
    this._invalidateLayout();
    this._recalcTotalContentHeight();
    this._scheduleRender();
  }

  /**
   * 滚动到指定位置
   * @param scrollTop 垂直滚动位置（可选）
   * @param scrollLeft 水平滚动位置（可选）
   */
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

  /**
   * 滚动到指定行
   * @param rowIndex 行索引
   * @param align 对齐方式：top(顶部)、center(居中)、bottom(底部)
   */
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

  // ==================== 事件方法 ====================
  /**
   * 添加事件监听器
   * @param type 事件类型
   * @param listener 回调函数
   */
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

  /**
   * 移除事件监听器
   * @param type 事件类型
   * @param listener 回调函数
   */
  removeEventListener<T extends VirtualTableEventType>(
    type: T,
    listener: VirtualTableEventHandlerMap[T],
  ) {
    this.eventListeners[type].delete(listener);
  }

  /** 注册悬停事件监听器 */
  onHover = (listener: VirtualTableEventHandlerMap["hover"]) =>
    this.addEventListener("hover", listener);
  /** 移除悬停事件监听器 */
  offHover = (listener: VirtualTableEventHandlerMap["hover"]) =>
    this.removeEventListener("hover", listener);
  /** 注册点击事件监听器 */
  onClick = (listener: VirtualTableEventHandlerMap["click"]) =>
    this.addEventListener("click", listener);
  /** 移除点击事件监听器 */
  offClick = (listener: VirtualTableEventHandlerMap["click"]) =>
    this.removeEventListener("click", listener);
  /** 注册表格创建完成事件监听器 */
  onTableCreated = (listener: VirtualTableEventHandlerMap["tableCreated"]) =>
    this.addEventListener("tableCreated", listener);
  /** 移除表格创建完成事件监听器 */
  offTableCreated = (listener: VirtualTableEventHandlerMap["tableCreated"]) =>
    this.removeEventListener("tableCreated", listener);
  /** 注册行创建事件监听器 */
  onRowCreated = (listener: VirtualTableEventHandlerMap["rowCreated"]) =>
    this.addEventListener("rowCreated", listener);
  /** 移除行创建事件监听器 */
  offRowCreated = (listener: VirtualTableEventHandlerMap["rowCreated"]) =>
    this.removeEventListener("rowCreated", listener);
  /** 注册滚动事件监听器 */
  onScroll = (listener: VirtualTableEventHandlerMap["scroll"]) =>
    this.addEventListener("scroll", listener);
  /** 移除滚动事件监听器 */
  offScroll = (listener: VirtualTableEventHandlerMap["scroll"]) =>
    this.removeEventListener("scroll", listener);
  /** 注册行高变化事件监听器 */
  onRowHeightChanged = (
    listener: VirtualTableEventHandlerMap["rowHeightChanged"],
  ) => this.addEventListener("rowHeightChanged", listener);
  /** 移除行高变化事件监听器 */
  offRowHeightChanged = (
    listener: VirtualTableEventHandlerMap["rowHeightChanged"],
  ) => this.removeEventListener("rowHeightChanged", listener);

  // ==================== 私有方法 ====================

  /**
   * 初始化 ResizeObserver
   * 监听容器尺寸变化，自动重新布局和渲染
   */
  private _initResizeObserver() {
    const observer = new ResizeObserver(() => {
      this._invalidateLayout();
      this._scheduleRender();
    });
    observer.observe(this.el.parentElement || this.el);
  }

  /**
   * 初始化表格
   * 设置列、数据、样式等配置，并触发首次渲染
   * @param options - 表格配置选项
   */
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

  /**
   * 估算基础行高
   * 根据字体大小和内边距计算行高
   */
  private _estimateBaseRowHeight() {
    const cellPadding = parsePadding(
      this._style.cellPadding ?? DEFAULT_CELL_PADDING,
    );
    const verticalPadding = cellPadding.top + cellPadding.bottom;
    const baseRowHeight = 14 + verticalPadding;

    this._estimatedRowHeight = this._useDynamicRowHeight
      ? (this._style.minRowHeight ?? DEFAULT_ROW_HEIGHT)
      : (this._style.minRowHeight ?? baseRowHeight);
  }

  /**
   * 回放已创建的行事件
   * 当订阅 rowCreated 事件时，触发所有已缓存行的回调
   * @param listener - 行创建事件监听器
   */
  private _replayCreatedRows(
    listener: VirtualTableEventHandlerMap["rowCreated"],
  ) {
    Array.from(this._cache.entries())
      .sort((a, b) => a[0] - b[0])
      .forEach(([index, row]) => {
        listener(row, index);
      });
  }

  /**
   * 获取指定索引的行数据
   * @param index - 行索引
   * @returns 行数据对象
   */
  private _getValue(index: number): Record<string, any> {
    if (this._cache.has(index)) {
      return this._cache.get(index)!;
    }
    const value = this._valueBuilder(index);
    this._cache.set(index, value);
    // 触发 rowCreated 事件
    this._emitEvent("rowCreated", value, index);
    return value;
  }

  /**
   * 获取单元格的显示值
   * 如果列定义了 getValue 则使用，否则使用原始数据
   * @param col - 列配置
   * @param row - 行数据
   * @param rowIndex - 行索引
   * @returns 单元格显示文本
   */
  private _getCellDisplayValue(
    col: TableColumn,
    row: Record<string, any>,
    rowIndex: number,
  ): string {
    const rawValue = col.getValue ? col.getValue(row, rowIndex) : row[col.key];
    if (rawValue === undefined || rawValue === null) return "";
    return String(rawValue);
  }

  /**
   * 获取缓存的行高
   * @param rowIndex - 行索引
   * @returns 行高（像素）
   */
  private _getCachedRowHeight(rowIndex: number): number {
    if (this._rowHeightCache.has(rowIndex)) {
      this._stats.cacheHitCount++;
      return this._rowHeightCache.get(rowIndex)!;
    }
    this._stats.cacheMissCount++;
    return this._estimatedRowHeight;
  }

  /**
   * 清除行高缓存
   */
  private _clearRowHeightCache() {
    this._rowHeightCache.clear();
  }

  /**
   * 计算单行高度
   * 根据内容换行情况计算行的实际高度
   * @param row - 行数据
   * @param rowIndex - 行索引
   * @param colWidths - 列宽数组
   * @returns 行高（像素）
   */
  private _calculateRowHeight(
    row: Record<string, any>,
    rowIndex: number,
    colWidths: number[],
  ): number {
    const cellPadding = parsePadding(
      this._style.cellPadding ?? DEFAULT_CELL_PADDING,
    );
    const verticalPadding = cellPadding.top + cellPadding.bottom;
    const maxCellLines = this._style.maxCellLines ?? 0;

    let maxLines = 1;
    const wrapColumns = this._columns.filter((c) => c.wrap);

    if (wrapColumns.length > 0 && this.ctx) {
      const horizontalPadding = cellPadding.left + cellPadding.right;
      this.ctx.font = this._style.font ?? DEFAULT_FONT;

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
   * 如果缓存已满则清除旧缓存
   * @param rowIndex - 行索引
   * @param row - 行数据
   * @param layout - 渲染布局
   * @returns 行高（像素）
   */
  private _getRowHeight(
    rowIndex: number,
    row: Record<string, any>,
    layout: RenderLayout,
  ): number {
    if (this._rowHeightCache.has(rowIndex)) {
      return this._rowHeightCache.get(rowIndex)!;
    }

    const colWidths = layout?.columnWidths ?? [];
    const height = this._calculateRowHeight(row, rowIndex, colWidths);

    if (this._rowHeightCache.size >= MAX_ROW_HEIGHT_CACHE) {
      this._rowHeightCache.clear();
    }

    this._rowHeightCache.set(rowIndex, height);
    this._emitEvent("rowHeightChanged", rowIndex, height);
    return height;
  }

  /**
   * 重新计算总内容高度
   */
  private _recalcTotalContentHeight() {
    const { top: paddingTop, bottom: paddingBottom } = parsePadding(
      this._style.tablePadding,
    );
    this._totalContentHeight =
      this._getRowTop(this._length) + paddingTop + paddingBottom;
  }

  /**
   * 获取累积高度（固定行高模式）
   * @param endIndex - 结束行索引
   * @returns 累积高度（像素）
   */
  private _getCumulativeHeight(endIndex: number): number {
    if (endIndex <= 0) return 0;
    return endIndex * this._estimatedRowHeight;
  }

  /**
   * 获取累积高度（动态行高模式）
   * @param endIndex - 结束行索引
   * @returns 累积高度（像素）
   */
  private _getCumulativeHeightDynamic(endIndex: number): number {
    if (endIndex <= 0) return 0;
    if (this._rowHeightCache.size === 0) {
      return endIndex * this._estimatedRowHeight;
    }

    let cachedHeight = 0;
    let cachedCount = 0;

    const cachedIndices = Array.from(this._rowHeightCache.keys())
      .filter((i) => i < endIndex)
      .sort((a, b) => a - b);

    for (const idx of cachedIndices) {
      cachedHeight += this._rowHeightCache.get(idx)!;
      cachedCount++;
    }

    const uncachedCount = endIndex - cachedCount;
    return cachedHeight + uncachedCount * this._estimatedRowHeight;
  }

  /**
   * 获取指定行的顶部 Y 坐标位置
   * @param rowIndex - 行索引
   * @returns 该行顶部 Y 坐标（像素）
   */
  private _getRowTop(rowIndex: number): number {
    return this._useDynamicRowHeight
      ? this._getCumulativeHeightDynamic(rowIndex)
      : this._getCumulativeHeight(rowIndex);
  }

  /**
   * 计算可见行范围
   * 用于虚拟滚动，确定当前需要渲染的行范围
   * @returns 可见行范围对象 { startIndex, endIndex, startY }
   */
  private _getVisibleRange(): VisibleRange {
    const layout = this._getLayout();
    const bodyTop = layout.paddingTop + layout.headerHeight;
    const visibleHeight =
      layout.canvasHeight -
      (layout.hasHorizontalScrollbar ? layout.horizontalScrollbarHeight : 0);
    const baseRowHeight = this._estimatedRowHeight;

    let startIndex: number;
    if (this._useDynamicRowHeight && this._rowHeightCache.size > 0) {
      startIndex = this._findStartIndexByCumulativeHeight(this.scrollTop);
      startIndex = Math.max(0, startIndex - INDEX_BUFFER);
    } else {
      startIndex = Math.max(
        0,
        Math.floor(this.scrollTop / baseRowHeight) - INDEX_BUFFER,
      );
    }

    const endIndex = Math.min(
      this._length,
      startIndex +
        Math.ceil(visibleHeight / ROW_HEIGHT_ESTIMATE) +
        SCROLL_BUFFER,
    );
    const startY = bodyTop + this._getRowTop(startIndex) - this.scrollTop;

    return { startIndex, endIndex, startY };
  }

  /**
   * 根据滚动位置找到起始行索引（二分查找）
   * @param scrollTop - 滚动位置
   * @returns 起始行索引
   */
  private _findStartIndexByCumulativeHeight(scrollTop: number): number {
    let low = 0;
    let high = this._length - 1;
    let result = 0;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const cumulativeHeight = this._getRowTop(mid + 1);

      if (cumulativeHeight <= scrollTop) {
        low = mid + 1;
      } else {
        result = mid;
        high = mid - 1;
      }
    }

    return result;
  }

  /**
   * 使布局缓存失效
   * 下次访问时重新计算布局
   */
  private _invalidateLayout() {
    this._layout = null;
    this._scrollbarInfo = null;
  }

  /**
   * 获取滚动条信息
   * @returns 滚动条信息对象
   */
  private _getScrollbarInfo(): ScrollbarInfo {
    if (this._scrollbarInfo && this._layout) {
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

  /**
   * 计算垂直滚动条滑块 Y 坐标
   * @param info - 滚动条信息
   * @returns 滑块 Y 坐标
   */
  private _calcScrollbarY(info: ScrollbarInfo): number {
    if (info.maxScroll <= 0) return 0;
    return (
      (this.scrollTop / info.maxScroll) *
      (info.vScrollbarTrackHeight - info.scrollbarHeight)
    );
  }

  /**
   * 计算水平滚动条滑块 X 坐标
   * @param info - 滚动条信息
   * @returns 滑块 X 坐标
   */
  private _calcScrollbarX(info: ScrollbarInfo): number {
    if (info.maxScrollLeft <= 0) return 0;
    return (
      (this.scrollLeft / info.maxScrollLeft) *
      (info.viewWidth - info.hScrollbarWidth)
    );
  }

  /**
   * 计算滚动条信息
   * @param layout - 渲染布局
   * @returns 滚动条信息对象
   */
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
      scrollbarY: 0,
      maxScrollLeft,
      hScrollbarWidth,
      scrollbarX: 0,
      hasHScrollbar,
      hasVScrollbar,
      vScrollbarTrackHeight,
      viewWidth: layout.viewWidth,
    };
  }

  /**
   * 获取渲染布局
   * @returns 渲染布局对象
   */
  private _getLayout(): RenderLayout {
    if (this._layout) return this._layout;
    this._layout = this._buildRenderLayout();
    return this._layout;
  }

  /**
   * 构建渲染布局
   * 计算表格的所有布局参数，包括列宽、滚动条、可见区域等
   * @returns 渲染布局对象
   */
  private _buildRenderLayout(): RenderLayout {
    const rowHeight = this._estimatedRowHeight;
    const minRowHeight = this._style.minRowHeight ?? DEFAULT_MIN_ROW_HEIGHT;
    const maxRowHeight = this._style.maxRowHeight ?? 0;

    let headerHeight = this._style.headerHeight;
    if (headerHeight === undefined) {
      const headerPadding = parsePadding(
        this._style.headerCellPadding ?? DEFAULT_CELL_PADDING,
      );
      headerHeight = 14 + headerPadding.top + headerPadding.bottom;
    }
    headerHeight ??= DEFAULT_HEADER_HEIGHT;

    const {
      top: paddingTop,
      right: paddingRight,
      bottom: paddingBottom,
      left: paddingLeft,
    } = parsePadding(this._style.tablePadding ?? 0);
    const scrollbarWidth =
      this._style.scrollbarWidth ?? DEFAULT_SCROLLBAR_WIDTH;
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

  // ==================== 事件处理 ====================
  private _initEvents() {
    this.el.onwheel = (e) => {
      e.preventDefault();
      const horizontalDelta = Math.abs(e.deltaX) > 0 ? e.deltaX : e.deltaY;
      if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        this._handleHorizontalScroll(horizontalDelta);
      } else {
        this._handleScroll(e.deltaY);
      }
    };

    this.el.onmousedown = (e) => {
      if (e.buttons !== 1) return;
      this._handleMouseDown(e);
    };

    this.el.onmousemove = (e) => this._handleMouseMove(e);
    this.el.onmouseleave = () => this._handleMouseLeave();
    this.el.onmouseup = () => this._handleMouseUp();

    window.addEventListener("mousemove", (e) => {
      if (this.isDraggingV || this.isDraggingH) {
        this._handleDragMove(e);
      }
    });

    window.addEventListener("mouseup", () => {
      if (this.isDraggingV || this.isDraggingH) {
        this._handleMouseUp();
      }
    });
  }

  private _handleMouseDown(e: MouseEvent) {
    const scrollbarWidth =
      this._style.scrollbarWidth ?? DEFAULT_SCROLLBAR_WIDTH;
    const canvasWidth = this.el.clientWidth || 800;
    const canvasHeight = this.el.clientHeight || 400;
    const info = this._getScrollbarInfo();
    const vScrollbarTrackHeight =
      canvasHeight - (info.hasHScrollbar ? scrollbarWidth : 0);

    // 垂直滚动条检测
    if (info.hasVScrollbar) {
      const scrollbarY = this._calcScrollbarY(info);
      const inVThumb =
        e.clientX >= canvasWidth - scrollbarWidth &&
        e.clientY >= scrollbarY &&
        e.clientY <= scrollbarY + info.scrollbarHeight;

      if (inVThumb) {
        this.isDraggingV = true;
        this.isPressedV = true;
        this.dragStartY = e.clientY;
        this.dragStartScrollTop = this.scrollTop;
        this._startDragRenderLoop();
        return;
      }

      // 轨道点击（翻页）
      if (e.clientX >= canvasWidth - scrollbarWidth) {
        if (e.clientY < scrollbarY) {
          this.scrollTop = Math.max(0, this.scrollTop - vScrollbarTrackHeight);
        } else if (e.clientY > scrollbarY + info.scrollbarHeight) {
          this.scrollTop = Math.min(
            info.maxScroll,
            this.scrollTop + vScrollbarTrackHeight,
          );
        }
        this.isPressedV = true;
        this._scheduleRender();
        this._emitEvent("scroll", this.scrollTop, this.scrollLeft);
        return;
      }
    }

    // 水平滚动条检测
    if (info.hasHScrollbar) {
      const scrollbarX = this._calcScrollbarX(info);
      const inHThumb =
        e.clientY >= canvasHeight - scrollbarWidth &&
        e.clientX >= scrollbarX &&
        e.clientX <= scrollbarX + info.hScrollbarWidth;

      if (inHThumb) {
        this.isDraggingH = true;
        this.isPressedH = true;
        this.dragStartX = e.clientX;
        this.dragStartScrollLeft = this.scrollLeft;
        this._startDragRenderLoop();
        return;
      }

      // 轨道点击
      if (e.clientY >= canvasHeight - scrollbarWidth) {
        if (e.clientX < scrollbarX) {
          this.scrollLeft = Math.max(0, this.scrollLeft - canvasWidth);
        } else if (e.clientX > scrollbarX + info.hScrollbarWidth) {
          this.scrollLeft = Math.min(
            info.maxScrollLeft,
            this.scrollLeft + canvasWidth,
          );
        }
        this.isPressedH = true;
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
    if (this.isDraggingV || this.isDraggingH) {
      this._handleDragMove(e);
      return;
    }
    this._updateHoverState(e);
  }

  private _handleDragMove(e: MouseEvent) {
    const info = this._getScrollbarInfo();
    const scrollbarWidth =
      this._style.scrollbarWidth ?? DEFAULT_SCROLLBAR_WIDTH;
    const canvasHeight = this.el.clientHeight || 400;

    if (this.isDraggingV) {
      const vScrollbarTrackHeight =
        canvasHeight - (info.hasHScrollbar ? scrollbarWidth : 0);
      const initialY =
        info.maxScroll > 0
          ? (this.dragStartScrollTop / info.maxScroll) *
            (vScrollbarTrackHeight - info.scrollbarHeight)
          : 0;
      const deltaY = e.clientY - this.dragStartY;
      const ratio =
        info.maxScroll > 0
          ? (initialY + deltaY) / (vScrollbarTrackHeight - info.scrollbarHeight)
          : 0;
      this.scrollTop = Math.max(
        0,
        Math.min(info.maxScroll, ratio * info.maxScroll),
      );
    } else if (this.isDraggingH) {
      const initialX =
        info.maxScrollLeft > 0
          ? (this.dragStartScrollLeft / info.maxScrollLeft) *
            (info.viewWidth - info.hScrollbarWidth)
          : 0;
      const deltaX = e.clientX - this.dragStartX;
      const ratio =
        info.maxScrollLeft > 0
          ? (initialX + deltaX) / (info.viewWidth - info.hScrollbarWidth)
          : 0;
      this.scrollLeft = Math.max(
        0,
        Math.min(info.maxScrollLeft, ratio * info.maxScrollLeft),
      );
    }
  }

  private _handleMouseUp() {
    const wasDragging = this.isDraggingV || this.isDraggingH;
    const needsRender = this.isPressedV || this.isPressedH || wasDragging;

    this.isDraggingV = false;
    this.isDraggingH = false;
    this.isPressedV = false;
    this.isPressedH = false;
    this._stopDragRenderLoop();

    if (needsRender) {
      this._scheduleRender();
      this._emitEvent("scroll", this.scrollTop, this.scrollLeft);
    }
  }

  private _handleMouseLeave() {
    this.isHoveringV = false;
    this.isHoveringH = false;
    this.isPressedV = false;
    this.isPressedH = false;
    this.hoverRow = -1;
    this.el.style.cursor = "default";
    this._scheduleRender();
  }

  private _updateHoverState(e: MouseEvent) {
    const scrollbarWidth =
      this._style.scrollbarWidth ?? DEFAULT_SCROLLBAR_WIDTH;
    const layout = this._getLayout();
    const info = this._getScrollbarInfo();
    const canvasWidth = layout.canvasWidth;
    const canvasHeight = layout.canvasHeight;
    const rect = this.el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let needsRender = false;

    // 计算 hover 行
    const { headerHeight, paddingTop, paddingBottom } = layout;
    const bodyTop = headerHeight + paddingTop;
    const bodyBottom =
      canvasHeight -
      paddingBottom -
      (layout.hasHorizontalScrollbar ? layout.horizontalScrollbarHeight : 0);

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

    // 滚动条 hover 检测（合并逻辑）
    const wasHoveringV = this.isHoveringV;
    this.isHoveringV =
      info.hasVScrollbar &&
      x >= canvasWidth - scrollbarWidth &&
      y >= info.scrollbarY &&
      y <= info.scrollbarY + info.scrollbarHeight;
    if (wasHoveringV !== this.isHoveringV) needsRender = true;

    if (info.hasHScrollbar) {
      const wasHoveringH = this.isHoveringH;
      const scrollbarX = this._calcScrollbarX(info);
      this.isHoveringH =
        y >= canvasHeight - scrollbarWidth &&
        y <= canvasHeight &&
        x >= scrollbarX &&
        x <= scrollbarX + info.hScrollbarWidth;
      if (wasHoveringH !== this.isHoveringH) needsRender = true;
    } else if (this.isHoveringH) {
      this.isHoveringH = false;
      needsRender = true;
    }

    if (needsRender) {
      this._scheduleRender();
    }

    // 更新光标
    const isHoveringRow = this._getRowAtPoint(e.clientX, e.clientY) !== null;
    this.el.style.cursor =
      isHoveringRow && this.eventListeners.click.size > 0
        ? "pointer"
        : "default";
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

  private _getRowIndexAtY(y: number): number {
    if (y < 0 || this._length === 0) return -1;

    const layout = this._getLayout();
    const bodyTop = layout.paddingTop + layout.headerHeight;
    const visibleHeight =
      layout.canvasHeight -
      (layout.hasHorizontalScrollbar ? layout.horizontalScrollbarHeight : 0);
    const bodyBottom = bodyTop + visibleHeight;

    if (y < bodyTop || y >= bodyBottom) return -1;

    const range = this._getVisibleRange();
    let currentY = range.startY;

    for (
      let rowIndex = range.startIndex;
      rowIndex < range.endIndex;
      rowIndex++
    ) {
      if (currentY >= bodyBottom + SCROLL_BUFFER) break;

      const row = this._getValue(rowIndex);
      const actualRowHeight = this._useDynamicRowHeight
        ? this._getRowHeight(rowIndex, row, layout)
        : this._estimatedRowHeight;

      if (y >= currentY && y < currentY + actualRowHeight) {
        return rowIndex;
      }
      currentY += actualRowHeight;
    }

    return -1;
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

    const range = this._getVisibleRange();
    let currentY = range.startY;

    let index = -1;
    for (
      let rowIndex = range.startIndex;
      rowIndex < range.endIndex;
      rowIndex++
    ) {
      if (currentY >= bodyBottom + SCROLL_BUFFER) break;

      const row = this._getValue(rowIndex);
      const actualRowHeight = this._useDynamicRowHeight
        ? this._getRowHeight(rowIndex, row, layout)
        : this._estimatedRowHeight;

      if (y >= currentY && y < currentY + actualRowHeight) {
        index = rowIndex;
        break;
      }
      currentY += actualRowHeight;
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
    switch (type) {
      case "tableCreated":
        this.eventListeners.tableCreated.forEach((listener) => listener());
        break;
      case "scroll":
        const [scrollTop, scrollLeft] = args as [number, number];
        this.eventListeners.scroll.forEach((listener) =>
          listener(scrollTop, scrollLeft),
        );
        break;
      case "rowCreated":
        const [row, index] = args as [Record<string, any>, number];
        this.eventListeners.rowCreated.forEach((listener) =>
          listener(row, index),
        );
        break;
      case "rowHeightChanged":
        const [rowIndex, height] = args as [number, number];
        this.eventListeners.rowHeightChanged.forEach((listener) =>
          listener(rowIndex, height),
        );
        break;
      case "hover":
        const [hoverRow, hoverIndex] = args as [Record<string, any>, number];
        this.eventListeners.hover.forEach((listener) =>
          listener(hoverRow, hoverIndex),
        );
        break;
      case "click":
        const [clickRow, clickIndex] = args as [Record<string, any>, number];
        this.eventListeners.click.forEach((listener) =>
          listener(clickRow, clickIndex),
        );
        break;
    }
  }

  private _startDragRenderLoop() {
    if (this._dragRenderRafId !== null) return;
    const loop = () => {
      if (!this.isDraggingV && !this.isDraggingH) {
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
    this.isDraggingV = false;
    this.isDraggingH = false;
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
    const cachedRowCountBefore = this._rowHeightCache.size;
    const layout = this._getLayout();
    this._layout = layout;

    // 渲染
    this._drawRows(this.ctx, layout);
    this._drawHeader(this.ctx, layout);
    this._drawFixedColumnShadows(this.ctx, layout);
    this._drawVerticalDividers(this.ctx, layout);
    this._drawScrollbars(this.ctx, layout);
    this._drawOuterBorder(this.ctx, layout);

    // 如果缓存行数变化了，更新总高度和滚动条
    if (
      this._useDynamicRowHeight &&
      this._rowHeightCache.size !== cachedRowCountBefore
    ) {
      this._recalcTotalContentHeight();
      this._invalidateLayout();
    }
  }

  // ==================== 绘制方法 ====================

  /**
   * 绘制行
   */
  private _drawRows(ctx: CanvasRenderingContext2D, layout: RenderLayout) {
    const {
      headerHeight,
      paddingTop,
      canvasHeight,
      hasHorizontalScrollbar,
      horizontalScrollbarHeight,
    } = layout;
    const visibleHeight =
      canvasHeight - (hasHorizontalScrollbar ? horizontalScrollbarHeight : 0);
    const bodyTop = paddingTop + headerHeight;

    const range = this._getVisibleRange();
    let currentY = range.startY;

    for (
      let rowIndex = range.startIndex;
      rowIndex < range.endIndex;
      rowIndex++
    ) {
      if (currentY >= bodyTop + visibleHeight + SCROLL_BUFFER) break;

      const row = this._getValue(rowIndex);
      const actualRowHeight = this._useDynamicRowHeight
        ? this._getRowHeight(rowIndex, row, layout)
        : this._estimatedRowHeight;

      if (
        currentY + actualRowHeight >= bodyTop - SCROLL_BUFFER ||
        !this._useDynamicRowHeight ||
        currentY + actualRowHeight >= bodyTop
      ) {
        this._drawRow(ctx, layout, row, rowIndex, currentY, actualRowHeight);
      }
      currentY += actualRowHeight;
    }
  }

  /**
   * 绘制单行（提取公共逻辑）
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

    // 获取行样式
    const rowStyle = this._style.rowStyleResolver?.(row, rowIndex);
    let rowBgColor =
      rowStyle?.backgroundColor ??
      (rowIndex % 2 === 0
        ? (this._style.rowBackgroundColor ?? DEFAULT_ROW_BG)
        : (this._style.rowAltBackgroundColor ?? DEFAULT_ROW_ALT_BG));
    if (this.hoverRow === rowIndex) {
      rowBgColor =
        this._style.rowHoverBackgroundColor ??
        rowStyle?.hoverBackgroundColor ??
        DEFAULT_HOVER_BG;
    }
    const rowBorderColor =
      rowStyle?.borderColor ??
      this._style.horizontalDividerColor ??
      this._style.borderColor ??
      DEFAULT_DIVIDER_COLOR;

    // 绘制行背景
    ctx.fillStyle = rowBgColor;
    ctx.fillRect(paddingLeft, y, contentWidth, rowHeight);

    // 绘制三部分列（使用公共方法）
    const middleStartX = paddingLeft + leftFixedWidth;
    const middleEndX = viewWidth - paddingRight - rightFixedWidth;
    const middleWidth = Math.max(0, middleEndX - middleStartX);

    // 左侧固定列
    if (leftFixedWidth > 0) {
      this._drawColumnGroup(
        ctx,
        layout,
        row,
        rowIndex,
        paddingLeft,
        y,
        rowHeight,
        (col) => col.fixed === "left",
        0,
      );
    }

    // 中间列
    if (middleWidth > 0) {
      this._drawColumnGroup(
        ctx,
        layout,
        row,
        rowIndex,
        middleStartX - this.scrollLeft,
        y,
        rowHeight,
        (col) => !col.fixed,
        0,
      );
    }

    // 右侧固定列
    if (rightFixedWidth > 0) {
      const rightX = viewWidth - paddingRight - rightFixedWidth;
      this._drawColumnGroup(
        ctx,
        layout,
        row,
        rowIndex,
        rightX,
        y,
        rowHeight,
        (col) => col.fixed === "right",
        0,
      );
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
   * 绘制列组（公共方法）
   */
  private _drawColumnGroup(
    ctx: CanvasRenderingContext2D,
    layout: RenderLayout,
    row: Record<string, any>,
    rowIndex: number,
    startX: number,
    y: number,
    rowHeight: number,
    filter: (col: TableColumn) => boolean,
    xOffset: number = 0,
  ) {
    const baseFont = this._style.font ?? DEFAULT_FONT;
    const rowStyle = this._style.rowStyleResolver?.(row, rowIndex);
    const rowTextColor =
      rowStyle?.textColor ?? this._style.textColor ?? DEFAULT_TEXT_COLOR;

    ctx.save();
    ctx.beginPath();
    ctx.rect(
      startX,
      y,
      layout.viewWidth - layout.paddingLeft - layout.paddingRight,
      rowHeight,
    );
    ctx.clip();
    ctx.fillStyle = rowTextColor;
    ctx.font = rowStyle?.font ?? baseFont;

    let x = startX + xOffset;
    this._columns.forEach((col, i) => {
      if (filter(col)) {
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

    const cellPaddingObj = parsePadding(
      this._style.cellPadding ?? DEFAULT_CELL_PADDING,
    );
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
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
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
   * 绘制表头（使用公共方法）
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

    ctx.fillStyle = this._style.headerBackgroundColor ?? DEFAULT_HEADER_BG;
    ctx.fillRect(paddingLeft, paddingTop, contentWidth, headerHeight);

    ctx.fillStyle = this._style.textColor ?? DEFAULT_TEXT_COLOR;
    ctx.font = this._style.headerFont ?? DEFAULT_HEADER_FONT;
    ctx.textBaseline = "middle";

    // 左侧固定列表头
    if (leftFixedWidth > 0) {
      this._drawHeaderGroup(
        ctx,
        layout,
        paddingLeft,
        (col) => col.fixed === "left",
      );
    }

    // 中间列表头
    const middleStartX = paddingLeft + leftFixedWidth;
    const middleEndX = viewWidth - paddingRight - rightFixedWidth;
    const middleWidth = Math.max(0, middleEndX - middleStartX);
    if (middleWidth > 0) {
      this._drawHeaderGroup(
        ctx,
        layout,
        middleStartX - this.scrollLeft,
        (col) => !col.fixed,
      );
    }

    // 右侧固定列表头
    if (rightFixedWidth > 0) {
      const rightX = viewWidth - paddingRight - rightFixedWidth;
      this._drawHeaderGroup(
        ctx,
        layout,
        rightX,
        (col) => col.fixed === "right",
      );
    }

    // 表头底部边框
    ctx.strokeStyle = this._style.borderColor ?? DEFAULT_BORDER_COLOR;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, paddingTop + headerHeight);
    ctx.lineTo(viewWidth - paddingRight, paddingTop + headerHeight);
    ctx.stroke();
  }

  /**
   * 绘制表头组（公共方法）
   */
  private _drawHeaderGroup(
    ctx: CanvasRenderingContext2D,
    layout: RenderLayout,
    startX: number,
    filter: (col: TableColumn) => boolean,
  ) {
    const { headerHeight, paddingTop } = layout;
    ctx.save();
    ctx.beginPath();
    ctx.rect(
      startX,
      paddingTop,
      layout.viewWidth - layout.paddingLeft - layout.paddingRight,
      headerHeight,
    );
    ctx.clip();

    let x = startX;
    this._columns.forEach((col, i) => {
      if (filter(col)) {
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

    // 收集分隔线 X 坐标（使用公共方法）
    let x = paddingLeft;
    this._columns.forEach((col, i) => {
      if (col.fixed === "left") {
        x += layout.columnWidths[i];
        dividerXSet.add(x);
      }
    });

    x = paddingLeft + leftFixedWidth - this.scrollLeft;
    this._columns.forEach((col, i) => {
      if (!col.fixed) {
        x += layout.columnWidths[i];
        dividerXSet.add(x);
      }
    });

    x = viewWidth - paddingRight - rightFixedWidth;
    this._columns.forEach((col, i) => {
      if (col.fixed === "right") {
        x += layout.columnWidths[i];
        dividerXSet.add(x);
      }
    });

    ctx.strokeStyle =
      this._style.verticalDividerColor ??
      this._style.borderColor ??
      DEFAULT_DIVIDER_COLOR;
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
   * 绘制滚动条（合并垂直和水平逻辑）
   */
  private _drawScrollbars(ctx: CanvasRenderingContext2D, layout: RenderLayout) {
    const info = this._getScrollbarInfo();
    const scrollbarWidth = layout.scrollbarWidth;

    // 垂直滚动条
    if (info.hasVScrollbar) {
      this._drawScrollbar(ctx, "vertical", layout, info, scrollbarWidth);
    }

    // 水平滚动条
    if (info.hasHScrollbar) {
      this._drawScrollbar(ctx, "horizontal", layout, info, scrollbarWidth);
    }
  }

  /**
   * 绘制单个滚动条（公共方法）
   */
  private _drawScrollbar(
    ctx: CanvasRenderingContext2D,
    type: "vertical" | "horizontal",
    layout: RenderLayout,
    info: ScrollbarInfo,
    scrollbarWidth: number,
  ) {
    const trackColor = this._style.scrollbarTrackColor ?? "#f1f1f1";
    const thumbColor =
      (type === "vertical" ? this.isPressedV : this.isPressedH) ||
      (type === "vertical" ? this.isDraggingV : this.isDraggingH)
        ? (this._style.scrollbarThumbPressedColor ?? "#6b6b6b")
        : (type === "vertical" ? this.isHoveringV : this.isHoveringH)
          ? (this._style.scrollbarThumbHoverColor ?? "#a8a8a8")
          : (this._style.scrollbarThumbColor ?? "#c1c1c1");

    if (type === "vertical") {
      const scrollbarY = this._calcScrollbarY(info);
      // 轨道
      ctx.fillStyle = trackColor;
      ctx.fillRect(
        layout.viewWidth,
        0,
        scrollbarWidth,
        info.vScrollbarTrackHeight,
      );
      // 滑块
      ctx.fillStyle = thumbColor;
      ctx.beginPath();
      ctx.roundRect(
        layout.viewWidth + 2,
        scrollbarY + 2,
        scrollbarWidth - 4,
        info.scrollbarHeight - 4,
        4,
      );
      ctx.fill();
    } else {
      const scrollbarX = this._calcScrollbarX(info);
      // 轨道
      ctx.fillStyle = trackColor;
      ctx.fillRect(
        0,
        layout.canvasHeight - scrollbarWidth,
        layout.viewWidth,
        scrollbarWidth,
      );
      // 滑块
      ctx.fillStyle = thumbColor;
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

    ctx.strokeStyle = this._style.borderColor ?? DEFAULT_BORDER_COLOR;
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
