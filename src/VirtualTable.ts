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
 * Padding 值类型，支持 CSS 风格的多种形式
 * - number: 四个方向相同
 * - [number, number]: 上下，左右
 * - [number, number, number]: 上，左右，下
 * - [number, number, number, number]: 上，右，下，左
 */
type PaddingValue =
  | number
  | [number, number]
  | [number, number, number]
  | [number, number, number, number];

/**
 * 解析 PaddingValue 为四个方向的值
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
  /** 行高 */
  rowHeight?: number;
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
};

/**
 * 数据构建函数类型
 */
type ValueBuilder = (index: number) => Record<string, any>;

/**
 * 表格选项接口
 */
type TableOptions = {
  /** 列配置 */
  columns: TableColumn[];
  /** 数据总长度 */
  length: number;
  /** 数据构建函数，按需构建指定下标的数据 */
  valueBuilder: ValueBuilder;
  /** 样式配置（可选） */
  style?: TableStyle;
};

/**
 * 渲染布局接口
 */
type RenderLayout = {
  /** 行高 */
  rowHeight: number;
  /** 表头高度 */
  headerHeight: number;
  /** 内边距 - 上右下左 */
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
  /** 滚动条宽度 */
  scrollbarWidth: number;
  /** 画布宽度 */
  canvasWidth: number;
  /** 画布高度 */
  canvasHeight: number;
  /** 列宽数组 */
  columnWidths: number[];
  /** 总内容宽度 */
  totalContentWidth: number;
  /** 左侧固定列宽度 */
  leftFixedWidth: number;
  /** 右侧固定列宽度 */
  rightFixedWidth: number;
  /** 是否有水平滚动条 */
  hasHorizontalScrollbar: boolean;
  /** 视图宽度 */
  viewWidth: number;
  /** 水平滚动条高度 */
  horizontalScrollbarHeight: number;
  /** 内容宽度 */
  contentWidth: number;
  /** 内容高度 */
  contentHeight: number;
  /** 最大垂直滚动值 */
  maxScroll: number;
  /** 最大水平滚动值 */
  maxScrollLeft: number;
};

type VirtualTableEventHandlerMap = {
  hover: (row: Record<string, any>, index: number) => void;
  click: (row: Record<string, any>, index: number) => void;
  tableCreated: () => void;
  rowCreated: (row: Record<string, any>, index: number) => void;
  scroll: (scrollTop: number, scrollLeft: number) => void;
};
type VirtualTableEventType = keyof VirtualTableEventHandlerMap;

type VirtualTableCreateOptions = {
  columns: TableColumn[];
  values: Record<string, any>[];
  style?: TableStyle;
};

class VirtualTable {
  static get MAX_LENGTH() {
    return 2998683910349035;
  }
  /** Canvas元素 */
  private el: HTMLCanvasElement;
  /** 垂直滚动位置 */
  private scrollTop = 0;
  /** 水平滚动位置 */
  private scrollLeft = 0;
  /** 是否正在拖动垂直滚动条 */
  private isDraggingScrollbar = false;
  /** 是否正在拖动水平滚动条 */
  private isDraggingHorizontalScrollbar = false;
  /** 是否hover垂直滚动条 */
  private isHoveringVScrollbar = false;
  /** 是否hover水平滚动条 */
  private isHoveringHScrollbar = false;
  /** 是否按下垂直滚动条 */
  private isPressedVScrollbar = false;
  /** 是否按下水平滚动条 */
  private isPressedHScrollbar = false;
  /** hover的行索引 */
  private hoverRow: number = -1;
  /** 拖动开始的Y坐标 */
  private dragStartY = 0;
  /** 拖动开始的X坐标 */
  private dragStartX = 0;
  /** 拖动开始时的滚动位置 */
  private dragStartScrollTop = 0;
  /** 拖动开始时的水平滚动位置 */
  private dragStartScrollLeft = 0;
  /** canvas上下文 */
  private ctx: CanvasRenderingContext2D | null = null;
  /** 表格是否已创建完成 */
  private isTableCreated = false;
  /** 事件监听器 */
  private eventListeners: {
    [K in VirtualTableEventType]: Set<VirtualTableEventHandlerMap[K]>;
  } = {
    hover: new Set(),
    click: new Set(),
    tableCreated: new Set(),
    rowCreated: new Set(),
    scroll: new Set(),
  };
  /** 列配置 */
  private _columns: TableColumn[] = [];
  /** 数据总长度 */
  private _length = 0;
  /** 数据构建函数 */
  private _valueBuilder: ValueBuilder = () => ({});
  /** 数据缓存 */
  private _cache: Map<number, Record<string, any>> = new Map();
  /** 缓存阈值，超过此值清理旧缓存 */
  private _cacheThreshold = 10_000;
  /** 样式配置 */
  private _style: TableStyle = {};
  /** 最近一次渲染布局快照 */
  private _layout: RenderLayout | null = null;

  static list(el: HTMLCanvasElement, options: VirtualTableCreateOptions) {
    const { columns, values, style } = options;
    return new VirtualTable(el, {
      columns,
      length: values.length,
      valueBuilder: (index) => values[index],
      style,
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

  /**
   * 初始化ResizeObserver监听容器大小变化
   */
  private _initResizeObserver() {
    const observer = new ResizeObserver(() => {
      this._render();
    });
    observer.observe(this.el.parentElement || this.el);
  }

  /**
   * 初始化表格配置
   * @param options 表格配置选项
   */
  private _initTable(options: TableOptions) {
    this._columns = options.columns;
    this._length = Math.min(options.length, VirtualTable.MAX_LENGTH);
    this._valueBuilder = options.valueBuilder;
    this._cache.clear();
    if (options.style) {
      this._style = { ...this._style, ...options.style };
    }
    this._render();
    this.isTableCreated = true;
    this._emitEvent("tableCreated");
  }

  /**
   * 设置表格数据
   * @param length 数据长度
   * @param valueBuilder 数据构建函数
   */
  setValues(length: number, valueBuilder: ValueBuilder) {
    this._length = Math.min(length, VirtualTable.MAX_LENGTH);
    this._valueBuilder = valueBuilder;
    this._cache.clear();
    this.scrollTop = 0;
    this._render();
  }

  /**
   * 调整Canvas大小并重新渲染
   * @param width 宽度（可选，不传则使用容器宽度）
   * @param height 高度（可选，不传则使用容器高度）
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
    this._render();
  }

  /**
   * 设置表格列
   * @param columns 列配置
   */
  setColumns(columns: TableColumn[]) {
    this._columns = columns;
    this._render();
  }

  /**
   * 设置表格样式
   * @param style 样式配置
   */
  setStyle(style: TableStyle) {
    this._style = { ...this._style, ...style };
    this._render();
  }

  /**
   * 添加事件监听
   * @param type 事件类型
   * @param listener 监听函数
   */
  addEventListener<T extends VirtualTableEventType>(
    type: T,
    listener: VirtualTableEventHandlerMap[T],
  ) {
    this.eventListeners[type].add(listener);
    if (type === "tableCreated" && this.isTableCreated) {
      (listener as VirtualTableEventHandlerMap["tableCreated"])();
      return;
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

  /**
   * 回放已创建的行数据事件
   * @param listener 行创建监听器
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
   * 获取指定下标的数据（带缓存）
   * @param index 数据下标
   */
  private _getValue(index: number): Record<string, any> {
    if (this._cache.has(index)) {
      return this._cache.get(index)!;
    }
    const value = this._valueBuilder(index);
    if (this._cache.size >= this._cacheThreshold) {
      this._cache.clear();
    }
    this._cache.set(index, value);
    this._emitEvent("rowCreated", value, index);
    return value;
  }

  /**
   * 获取单元格显示文本
   * @param col 列配置
   * @param row 行数据
   * @param rowIndex 行下标
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
   * 触发表格事件
   * @param type 事件类型
   * @param args 事件参数
   */
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
    if (type === "hover") {
      this.eventListeners.hover.forEach((listener) => listener(row, index));
      return;
    }
    this.eventListeners.click.forEach((listener) => listener(row, index));
  }

  /**
   * 根据鼠标位置获取行信息
   * @param clientX 鼠标X坐标（视口坐标）
   * @param clientY 鼠标Y坐标（视口坐标）
   */
  private _getRowAtPoint(clientX: number, clientY: number) {
    const layout = this._layout ?? this._buildRenderLayout();
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

    const index = Math.floor((y - bodyTop + this.scrollTop) / layout.rowHeight);
    if (index < 0 || index >= this._length) {
      return null;
    }

    return {
      row: this._getValue(index),
      index,
    };
  }

  /**
   * 滚动到指定位置
   * @param scrollTop 垂直滚动位置
   * @param scrollLeft 水平滚动位置
   */
  scrollTo(scrollTop?: number, scrollLeft?: number) {
    const { maxScroll, maxScrollLeft } = this._getScrollbarInfo();

    if (scrollTop !== undefined) {
      this.scrollTop = Math.max(0, Math.min(maxScroll, scrollTop));
    }

    if (scrollLeft !== undefined) {
      this.scrollLeft = Math.max(0, Math.min(maxScrollLeft, scrollLeft));
    }

    this._render();
    this._emitEvent("scroll", this.scrollTop, this.scrollLeft);
  }

  /**
   * 处理拖动移动
   * @param e 鼠标事件
   */
  private _handleDragMove(e: MouseEvent) {
    if (this.isDraggingScrollbar) {
      const { maxScroll, scrollbarHeight, hasHScrollbar } =
        this._getScrollbarInfo();
      const scrollbarWidth = this._style.scrollbarWidth ?? 12;
      const vScrollbarTrackHeight =
        this.el.clientHeight - (hasHScrollbar ? scrollbarWidth : 0);
      const initialScrollbarY =
        maxScroll > 0
          ? (this.dragStartScrollTop / maxScroll) *
            (vScrollbarTrackHeight - scrollbarHeight)
          : 0;
      const deltaY = e.clientY - this.dragStartY;
      const newScrollbarY = initialScrollbarY + deltaY;
      const ratio =
        maxScroll > 0
          ? newScrollbarY / (vScrollbarTrackHeight - scrollbarHeight)
          : 0;
      this.scrollTop = Math.max(0, Math.min(maxScroll, ratio * maxScroll));
      this._render();
      this._emitEvent("scroll", this.scrollTop, this.scrollLeft);
    } else if (this.isDraggingHorizontalScrollbar) {
      const { maxScrollLeft, hScrollbarWidth } = this._getScrollbarInfo();
      const initialScrollbarX =
        maxScrollLeft > 0
          ? (this.dragStartScrollLeft / maxScrollLeft) *
            (this.el.clientWidth - hScrollbarWidth)
          : 0;
      const deltaX = e.clientX - this.dragStartX;
      const newScrollbarX = initialScrollbarX + deltaX;
      const ratio =
        maxScrollLeft > 0
          ? newScrollbarX / (this.el.clientWidth - hScrollbarWidth)
          : 0;
      this.scrollLeft = Math.max(
        0,
        Math.min(maxScrollLeft, ratio * maxScrollLeft),
      );
      this._render();
      this._emitEvent("scroll", this.scrollTop, this.scrollLeft);
    }
  }

  /**
   * 停止拖动
   */
  private _stopDragging() {
    this.isDraggingScrollbar = false;
    this.isDraggingHorizontalScrollbar = false;
  }

  /**
   * 初始化事件
   */
  private _initEvents() {
    // 处理鼠标滚轮事件
    this.el.onwheel = (e) => {
      e.preventDefault();
      const horizontalDelta = Math.abs(e.deltaX) > 0 ? e.deltaX : e.deltaY;
      if (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        this._handleHorizontalScroll(horizontalDelta);
      } else {
        this._handleScroll(e.deltaY);
      }
    };

    // 处理鼠标按下事件
    this.el.onmousedown = (e) => {
      if (e.buttons !== 1) return;
      const scrollbarWidth = this._style.scrollbarWidth ?? 12;
      const canvasWidth = this.el.clientWidth || 800;
      const canvasHeight = this.el.clientHeight || 400;
      const {
        maxScrollLeft,
        hasHScrollbar,
        maxScroll,
        scrollbarHeight,
        scrollbarY,
      } = this._getScrollbarInfo();
      const vScrollbarTrackHeight =
        canvasHeight - (hasHScrollbar ? scrollbarWidth : 0);

      // 检测是否点击了垂直滚动条滑块
      if (
        maxScroll > 0 &&
        e.clientX >= canvasWidth - scrollbarWidth &&
        e.clientY >= scrollbarY &&
        e.clientY <= scrollbarY + scrollbarHeight
      ) {
        this.isDraggingScrollbar = true;
        this.isPressedVScrollbar = true;
        this.dragStartY = e.clientY;
        this.dragStartScrollTop = this.scrollTop;
        this._render();
        return;
      }

      // 检测是否点击了垂直滚动条轨道（翻页）
      if (
        e.clientX >= canvasWidth - scrollbarWidth &&
        e.clientY < canvasHeight - (hasHScrollbar ? scrollbarWidth : 0)
      ) {
        if (e.clientY < scrollbarY) {
          // 点击滚动条上方 - 向上翻页
          this.scrollTop = Math.max(0, this.scrollTop - vScrollbarTrackHeight);
        } else if (e.clientY > scrollbarY + scrollbarHeight) {
          // 点击滚动条下方 - 向下翻页
          this.scrollTop = Math.min(
            maxScroll,
            this.scrollTop + vScrollbarTrackHeight,
          );
        }
        this.isPressedVScrollbar = true;
        this._render();
        this._emitEvent("scroll", this.scrollTop, this.scrollLeft);
        return;
      }

      // 检测是否点击了水平滚动条滑块
      if (hasHScrollbar) {
        const hScrollbarWidth = Math.max(
          20,
          (canvasWidth / (maxScrollLeft + canvasWidth)) * canvasWidth,
        );
        const hScrollbarX =
          maxScrollLeft > 0
            ? (this.scrollLeft / maxScrollLeft) *
              (canvasWidth - hScrollbarWidth)
            : 0;

        if (
          e.clientY >= canvasHeight - scrollbarWidth &&
          e.clientX >= hScrollbarX &&
          e.clientX <= hScrollbarX + hScrollbarWidth
        ) {
          this.isDraggingHorizontalScrollbar = true;
          this.isPressedHScrollbar = true;
          this.dragStartX = e.clientX;
          this.dragStartScrollLeft = this.scrollLeft;
          this._render();
          return;
        }

        // 检测是否点击了水平滚动条轨道
        if (e.clientY >= canvasHeight - scrollbarWidth) {
          if (e.clientX < hScrollbarX) {
            this.scrollLeft = Math.max(0, this.scrollLeft - canvasWidth);
          } else if (e.clientX > hScrollbarX + hScrollbarWidth) {
            this.scrollLeft = Math.min(
              maxScrollLeft,
              this.scrollLeft + canvasWidth,
            );
          }
          this.isPressedHScrollbar = true;
          this._render();
          this._emitEvent("scroll", this.scrollTop, this.scrollLeft);
          return;
        }
      }

      const rowInfo = this._getRowAtPoint(e.clientX, e.clientY);
      if (rowInfo) {
        this._emitEvent("click", rowInfo.row, rowInfo.index);
      }
    };

    // 处理鼠标移动事件
    this.el.onmousemove = (e) => {
      this._handleDragMove(e);
      this._updateScrollbarHoverState(e);
    };

    // 处理鼠标离开事件
    this.el.onmouseleave = () => {
      this.isHoveringVScrollbar = false;
      this.isHoveringHScrollbar = false;
      this.isPressedVScrollbar = false;
      this.isPressedHScrollbar = false;
      this.hoverRow = -1;
      this.el.style.cursor = "default";
      this._render();
    };

    // 处理鼠标抬起事件
    this.el.onmouseup = () => {
      const needsRender =
        this.isPressedVScrollbar ||
        this.isPressedHScrollbar ||
        this.isDraggingScrollbar ||
        this.isDraggingHorizontalScrollbar;
      this.isPressedVScrollbar = false;
      this.isPressedHScrollbar = false;
      this._stopDragging();
      if (needsRender) {
        this._render();
      }
    };

    // 监听窗口鼠标移动事件
    window.addEventListener("mousemove", (e) => {
      this._handleDragMove(e);
      this._updateScrollbarHoverState(e);
    });

    // 监听窗口鼠标抬起事件
    window.addEventListener("mouseup", () => {
      const needsRender =
        this.isPressedVScrollbar ||
        this.isPressedHScrollbar ||
        this.isDraggingScrollbar ||
        this.isDraggingHorizontalScrollbar;
      this.isPressedVScrollbar = false;
      this.isPressedHScrollbar = false;
      this._stopDragging();
      if (needsRender) {
        this._render();
      }
    });
  }

  /**
   * 更新滚动条hover状态
   */
  private _updateScrollbarHoverState(e: MouseEvent) {
    const scrollbarWidth = this._style.scrollbarWidth ?? 12;
    const canvasWidth = this.el.clientWidth || 800;
    const canvasHeight = this.el.clientHeight || 400;
    const {
      hasHScrollbar,
      maxScroll,
      scrollbarHeight,
      scrollbarY,
      hScrollbarWidth,
      scrollbarX,
    } = this._getScrollbarInfo();

    let needsRender = false;

    // 计算hover行
    const rect = this.el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const layout = this._layout;
    if (layout) {
      const { rowHeight, headerHeight, paddingTop } = layout;
      const newHoverRow = Math.floor(
        (y - headerHeight - paddingTop + this.scrollTop) / rowHeight,
      );
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
    }

    // 检测垂直滚动条hover
    const wasHoveringV = this.isHoveringVScrollbar;
    this.isHoveringVScrollbar =
      maxScroll > 0 &&
      x >= canvasWidth - scrollbarWidth &&
      y >= scrollbarY &&
      y <= scrollbarY + scrollbarHeight;

    if (wasHoveringV !== this.isHoveringVScrollbar) {
      needsRender = true;
    }

    // 检测水平滚动条hover
    if (hasHScrollbar) {
      const wasHoveringH = this.isHoveringHScrollbar;
      this.isHoveringHScrollbar =
        y >= canvasHeight - scrollbarWidth &&
        y <= canvasHeight &&
        x >= scrollbarX &&
        x <= scrollbarX + hScrollbarWidth;

      if (wasHoveringH !== this.isHoveringHScrollbar) {
        needsRender = true;
      }
    } else if (this.isHoveringHScrollbar) {
      this.isHoveringHScrollbar = false;
      needsRender = true;
    }

    if (needsRender) {
      this._render();
    }

    const isHoveringRow = this._getRowAtPoint(e.clientX, e.clientY) !== null;
    const hasClickListener = this.eventListeners.click.size > 0;
    this.el.style.cursor =
      isHoveringRow && hasClickListener ? "pointer" : "default";
  }

  /**
   * 处理垂直滚动
   * @param deltaY 滚动 delta 值
   */
  private _handleScroll(deltaY: number) {
    const { maxScroll } = this._getScrollbarInfo();
    this.scrollTop = Math.max(0, Math.min(maxScroll, this.scrollTop + deltaY));
    this._render();
    this._emitEvent("scroll", this.scrollTop, this.scrollLeft);
  }

  /**
   * 处理水平滚动
   * @param deltaX 滚动 delta 值
   */
  private _handleHorizontalScroll(deltaX: number) {
    const { maxScrollLeft } = this._getScrollbarInfo();
    this.scrollLeft = Math.max(
      0,
      Math.min(maxScrollLeft, this.scrollLeft + deltaX),
    );
    this._render();
    this._emitEvent("scroll", this.scrollTop, this.scrollLeft);
  }

  /**
   * 获取滚动条信息
   * @returns 滚动条信息对象
   */
  private _getScrollbarInfo() {
    let rowHeight = this._style.rowHeight;
    if (rowHeight === undefined) {
      const cellPadding = parsePadding(this._style.cellPadding ?? [5, 10]);
      rowHeight = 14 + cellPadding.top + cellPadding.bottom;
    }
    rowHeight ??= 40;
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
    } = parsePadding(this._style.tablePadding);
    const scrollbarWidth = this._style.scrollbarWidth ?? 12;
    const canvasHeight = this.el.clientHeight || 400;
    const canvasWidth = this.el.clientWidth || 800;
    const verticalPadding = paddingTop + paddingBottom;
    const horizontalPadding = paddingLeft + paddingRight;
    const contentHeight =
      headerHeight + this._length * rowHeight + verticalPadding;
    const hasVScrollbar = contentHeight > canvasHeight;

    // 计算列宽
    const setWidths = this._columns.filter((col) => col.width !== undefined);
    const unsetCount = this._columns.length - setWidths.length;
    const assignedWidth = setWidths.reduce(
      (sum, col) => sum + (col.width ?? 0),
      0,
    );
    const availableWidthForColumns =
      canvasWidth -
      horizontalPadding -
      (hasVScrollbar ? scrollbarWidth : 0) -
      assignedWidth;
    const avgWidth =
      unsetCount > 0
        ? Math.max(100, availableWidthForColumns / unsetCount)
        : 100;
    const columnWidths = this._columns.map((col) => col.width ?? avgWidth);
    const totalContentWidth = Number(
      (columnWidths.reduce((sum, w) => sum + w, 0) + horizontalPadding).toFixed(
        2,
      ),
    );

    // 计算滚动信息
    const viewHeight = canvasHeight;
    const maxScroll = Math.max(0, contentHeight - viewHeight);
    const viewWidth = hasVScrollbar
      ? canvasWidth - scrollbarWidth
      : canvasWidth;
    const hasHScrollbar = totalContentWidth > viewWidth;
    const vScrollbarTrackHeight =
      viewHeight - (hasHScrollbar ? scrollbarWidth : 0);
    const scrollbarHeight = Math.max(
      20,
      (vScrollbarTrackHeight / contentHeight) * vScrollbarTrackHeight,
    );
    const scrollbarY =
      maxScroll > 0
        ? (this.scrollTop / maxScroll) *
          (vScrollbarTrackHeight - scrollbarHeight)
        : 0;

    const maxScrollLeft = Math.max(0, totalContentWidth - viewWidth);
    const hScrollbarWidth = Math.max(
      20,
      (viewWidth / totalContentWidth) * viewWidth,
    );
    const scrollbarX =
      maxScrollLeft > 0
        ? (this.scrollLeft / maxScrollLeft) * (viewWidth - hScrollbarWidth)
        : 0;

    return {
      maxScroll,
      scrollbarHeight,
      scrollbarY,
      maxScrollLeft,
      hScrollbarWidth,
      scrollbarX,
      hasHScrollbar,
      hasVScrollbar: maxScroll > 0,
    };
  }

  /**
   * 构建渲染布局
   * @returns 渲染布局对象
   */
  private _buildRenderLayout(): RenderLayout {
    let rowHeight = this._style.rowHeight;
    if (rowHeight === undefined) {
      const cellPadding = parsePadding(this._style.cellPadding ?? [5, 10]);
      rowHeight = 14 + cellPadding.top + cellPadding.bottom;
    }
    rowHeight ??= 40;
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
    } = parsePadding(this._style.tablePadding);
    const scrollbarWidth = this._style.scrollbarWidth ?? 12;
    const canvasWidth = this.el.clientWidth || 800;
    const canvasHeight = this.el.clientHeight || 400;
    const verticalPadding = paddingTop + paddingBottom;
    const horizontalPadding = paddingLeft + paddingRight;
    const contentHeight =
      headerHeight + this._length * rowHeight + verticalPadding;
    const hasVerticalScrollbar = contentHeight > canvasHeight;

    // 计算列宽
    const setWidths = this._columns.filter((col) => col.width !== undefined);
    const unsetCount = this._columns.length - setWidths.length;
    const assignedWidth = setWidths.reduce(
      (sum, col) => sum + (col.width ?? 0),
      0,
    );
    const availableWidthForColumns =
      canvasWidth -
      horizontalPadding -
      (hasVerticalScrollbar ? scrollbarWidth : 0) -
      assignedWidth;
    const avgWidth =
      unsetCount > 0
        ? Math.max(100, availableWidthForColumns / unsetCount)
        : 100;

    const columnWidths = this._columns.map((col) => col.width ?? avgWidth);
    const totalContentWidth = Number(
      (columnWidths.reduce((sum, w) => sum + w, 0) + horizontalPadding).toFixed(
        2,
      ),
    );

    // 计算固定列宽度
    const fixedWidths = this._columns.reduce(
      (sum, col, i) => {
        if (col.fixed === "left") {
          sum.left += columnWidths[i];
        }
        if (col.fixed === "right") {
          sum.right += columnWidths[i];
        }
        return sum;
      },
      { left: 0, right: 0 },
    );

    // 计算布局信息
    const viewWidth = hasVerticalScrollbar
      ? canvasWidth - scrollbarWidth
      : canvasWidth;
    const hasHorizontalScrollbar = totalContentWidth > viewWidth;
    const tempViewHeight = canvasHeight;
    const maxScroll = Math.max(0, contentHeight - tempViewHeight);
    const horizontalScrollbarHeight = hasHorizontalScrollbar
      ? scrollbarWidth
      : 0;
    const contentWidth = viewWidth - horizontalPadding;
    const maxScrollLeft = Math.max(0, totalContentWidth - viewWidth);
    this.scrollLeft = Math.min(maxScrollLeft, this.scrollLeft);

    return {
      rowHeight,
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
    };
  }

  /**
   * 绘制表格行
   * @param ctx Canvas 2D 上下文
   * @param layout 渲染布局
   */
  private _drawRows(ctx: CanvasRenderingContext2D, layout: RenderLayout) {
    const {
      rowHeight,
      headerHeight,
      paddingTop,
      paddingRight,
      paddingLeft,
      contentWidth,
      viewWidth,
    } = layout;
    const baseTextColor = this._style.textColor ?? "#333333";
    const baseFont =
      this._style.font ??
      "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    const startIndex = Math.max(0, Math.floor(this.scrollTop / rowHeight));
    const endIndex = Math.min(
      this._length,
      Math.ceil(
        (this.scrollTop + layout.canvasHeight - paddingTop - headerHeight) /
          rowHeight,
      ) + 1,
    );

    for (let rowIndex = startIndex; rowIndex < endIndex; rowIndex++) {
      const row = this._getValue(rowIndex);
      const y =
        paddingTop + headerHeight + rowIndex * rowHeight - this.scrollTop;
      const middleStartX = paddingLeft + layout.leftFixedWidth;
      const middleEndX = viewWidth - paddingRight - layout.rightFixedWidth;
      const middleWidth = Math.max(0, middleEndX - middleStartX);
      const rowStyle = this._style.rowStyleResolver?.(row, rowIndex);
      let rowBgColor =
        rowStyle?.backgroundColor ??
        (rowIndex % 2 === 0
          ? (this._style.rowBackgroundColor ?? "#ffffff")
          : (this._style.rowAltBackgroundColor ?? "#fafafa"));
      // hover行背景色
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
      ctx.fillStyle = rowTextColor;
      ctx.font = rowStyle?.font ?? baseFont;

      // 绘制左侧固定列
      if (layout.leftFixedWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(paddingLeft, y, layout.leftFixedWidth, rowHeight);
        ctx.clip();
        ctx.fillStyle = rowBgColor;
        ctx.fillRect(paddingLeft, y, layout.leftFixedWidth, rowHeight);
        ctx.fillStyle = rowTextColor;
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
            );
            x += layout.columnWidths[i];
          }
        });
        ctx.restore();
      }

      // 绘制中间可滚动列
      if (middleWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(middleStartX, y, middleWidth, rowHeight);
        ctx.clip();
        let middleX = middleStartX - this.scrollLeft;
        this._columns.forEach((col, i) => {
          if (!col.fixed) {
            const value = this._getCellDisplayValue(col, row, rowIndex);
            this._drawCellText(
              ctx,
              value,
              middleX,
              y,
              layout.columnWidths[i],
              rowHeight,
            );
            middleX += layout.columnWidths[i];
          }
        });
        ctx.restore();
      }

      // 绘制右侧固定列
      if (layout.rightFixedWidth > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(
          viewWidth - paddingRight - layout.rightFixedWidth,
          y,
          layout.rightFixedWidth,
          rowHeight,
        );
        ctx.clip();
        ctx.fillStyle = rowBgColor;
        ctx.fillRect(
          viewWidth - paddingRight - layout.rightFixedWidth,
          y,
          layout.rightFixedWidth,
          rowHeight,
        );
        ctx.fillStyle = rowTextColor;
        let rightX = viewWidth - paddingRight - layout.rightFixedWidth;
        this._columns.forEach((col, i) => {
          if (col.fixed === "right") {
            const value = this._getCellDisplayValue(col, row, rowIndex);
            this._drawCellText(
              ctx,
              value,
              rightX,
              y,
              layout.columnWidths[i],
              rowHeight,
            );
            rightX += layout.columnWidths[i];
          }
        });
        ctx.restore();
      }

      // 绘制行底部边框
      const horizontalDividerWidth = this._style.horizontalDividerWidth ?? 1;
      ctx.lineWidth = horizontalDividerWidth;
      ctx.strokeStyle = rowBorderColor;
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y + rowHeight);
      ctx.lineTo(viewWidth - paddingRight, y + rowHeight);
      ctx.stroke();
    }
  }

  /**
   * 绘制单元格文本
   * @param ctx Canvas 2D 上下文
   * @param text 文本内容
   * @param cellX 单元格X坐标
   * @param cellY 单元格Y坐标
   * @param cellWidth 单元格宽度
   * @param cellHeight 单元格高度
   */
  private _drawCellText(
    ctx: CanvasRenderingContext2D,
    text: string,
    cellX: number,
    cellY: number,
    cellWidth: number,
    cellHeight: number,
    customPadding?: PaddingValue,
  ) {
    if (cellWidth <= 0) return;
    const cellPaddingObj = parsePadding(
      customPadding ?? this._style.cellPadding ?? [5, 10],
    );
    const horizontalPadding = cellPaddingObj.left + cellPaddingObj.right;
    const textAlign = this._style.textAlign ?? "left";
    const maxTextWidth = Math.max(0, cellWidth - horizontalPadding);
    let displayText = text;

    if (maxTextWidth <= 0) return;
    // 文本过长时添加省略号
    if (ctx.measureText(displayText).width > maxTextWidth) {
      const ellipsis = "...";
      const ellipsisWidth = ctx.measureText(ellipsis).width;
      let low = 0;
      let high = displayText.length;
      while (low < high) {
        const mid = Math.ceil((low + high) / 2);
        const next = `${displayText.slice(0, mid)}${ellipsis}`;
        if (ctx.measureText(next).width <= maxTextWidth) {
          low = mid;
        } else {
          high = mid - 1;
        }
      }
      displayText =
        low > 0 && ellipsisWidth <= maxTextWidth
          ? `${displayText.slice(0, low)}${ellipsis}`
          : ellipsisWidth <= maxTextWidth
            ? ellipsis
            : "";
    }

    // 绘制文本
    ctx.save();
    ctx.beginPath();
    ctx.rect(cellX, cellY, cellWidth, cellHeight);
    ctx.clip();
    ctx.textAlign = textAlign;
    ctx.textBaseline = "top";
    const textX =
      textAlign === "center"
        ? cellX + cellWidth / 2
        : textAlign === "right"
          ? cellX + cellWidth - cellPaddingObj.right
          : cellX + cellPaddingObj.left;
    // textBaseline="top" 时，textY 为文本顶部位置
    const effectiveTopPadding = Math.min(cellPaddingObj.top, cellHeight - 10);
    const textY = cellY + effectiveTopPadding;
    ctx.fillText(displayText, textX, textY);
    ctx.restore();
  }

  /**
   * 绘制表头
   * @param ctx Canvas 2D 上下文
   * @param layout 渲染布局
   */
  private _drawHeader(ctx: CanvasRenderingContext2D, layout: RenderLayout) {
    const {
      paddingTop,
      paddingRight,
      paddingLeft,
      contentWidth,
      headerHeight,
      viewWidth,
    } = layout;
    const headerCellPadding = this._style.headerCellPadding ?? [5, 10];
    // 绘制表头背景
    ctx.fillStyle = this._style.headerBackgroundColor ?? "#f5f5f5";
    ctx.fillRect(paddingLeft, paddingTop, contentWidth, headerHeight);

    // 设置文本样式
    ctx.fillStyle = this._style.textColor ?? "#333333";
    ctx.font =
      this._style.headerFont ??
      "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textBaseline = "middle";

    let headerLeftFixedX = paddingLeft;
    let headerRightFixedX = viewWidth - paddingRight - layout.rightFixedWidth;
    const headerMiddleStartX = paddingLeft + layout.leftFixedWidth;
    const headerMiddleEndX = viewWidth - paddingRight - layout.rightFixedWidth;
    const headerMiddleWidth = Math.max(
      0,
      headerMiddleEndX - headerMiddleStartX,
    );

    // 绘制左侧固定列表头
    if (layout.leftFixedWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(paddingLeft, paddingTop, layout.leftFixedWidth, headerHeight);
      ctx.clip();
      this._columns.forEach((col, i) => {
        if (col.fixed === "left") {
          this._drawCellText(
            ctx,
            col.name,
            headerLeftFixedX,
            paddingTop,
            layout.columnWidths[i],
            headerHeight,
            headerCellPadding,
          );
          headerLeftFixedX += layout.columnWidths[i];
        }
      });
      ctx.restore();
    }

    // 绘制中间可滚动列表头
    if (headerMiddleWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(headerMiddleStartX, paddingTop, headerMiddleWidth, headerHeight);
      ctx.clip();
      let headerMiddleX = headerMiddleStartX - this.scrollLeft;
      this._columns.forEach((col, i) => {
        if (!col.fixed) {
          this._drawCellText(
            ctx,
            col.name,
            headerMiddleX,
            paddingTop,
            layout.columnWidths[i],
            headerHeight,
            headerCellPadding,
          );
          headerMiddleX += layout.columnWidths[i];
        }
      });
      ctx.restore();
    }

    // 绘制右侧固定列表头
    if (layout.rightFixedWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(
        viewWidth - paddingRight - layout.rightFixedWidth,
        paddingTop,
        layout.rightFixedWidth,
        headerHeight,
      );
      ctx.clip();
      this._columns.forEach((col, i) => {
        if (col.fixed === "right") {
          this._drawCellText(
            ctx,
            col.name,
            headerRightFixedX,
            paddingTop,
            layout.columnWidths[i],
            headerHeight,
            headerCellPadding,
          );
          headerRightFixedX += layout.columnWidths[i];
        }
      });
      ctx.restore();
    }

    // 绘制表头底部边框
    ctx.strokeStyle = this._style.borderColor ?? "#e0e0e0";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, paddingTop + headerHeight);
    ctx.lineTo(viewWidth - paddingRight, paddingTop + headerHeight);
    ctx.stroke();
  }

  /**
   * 绘制固定列阴影
   * @param ctx Canvas 2D 上下文
   * @param layout 渲染布局
   */
  private _drawFixedColumnShadows(
    ctx: CanvasRenderingContext2D,
    layout: RenderLayout,
  ) {
    const shadowWidth = 12;
    const shadowTop = layout.paddingTop;
    const shadowHeight =
      layout.canvasHeight -
      layout.paddingTop -
      layout.paddingBottom -
      (layout.hasHorizontalScrollbar ? layout.horizontalScrollbarHeight : 0);

    // 绘制左侧固定列阴影
    if (layout.leftFixedWidth > 0 && shadowHeight > 0 && this.scrollLeft > 0) {
      const leftShadowX = layout.paddingLeft + layout.leftFixedWidth;
      const leftShadow = ctx.createLinearGradient(
        leftShadowX,
        0,
        leftShadowX + shadowWidth,
        0,
      );
      leftShadow.addColorStop(0, "rgba(0, 0, 0, 0.08)");
      leftShadow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = leftShadow;
      ctx.fillRect(leftShadowX, shadowTop, shadowWidth, shadowHeight);
    }

    // 绘制右侧固定列阴影
    if (
      layout.rightFixedWidth > 0 &&
      shadowHeight > 0 &&
      this.scrollLeft < layout.maxScrollLeft
    ) {
      const rightShadowX =
        layout.viewWidth -
        layout.paddingRight -
        layout.rightFixedWidth -
        shadowWidth;
      const rightShadow = ctx.createLinearGradient(
        rightShadowX,
        0,
        rightShadowX + shadowWidth,
        0,
      );
      rightShadow.addColorStop(0, "rgba(0, 0, 0, 0)");
      rightShadow.addColorStop(1, "rgba(0, 0, 0, 0.08)");
      ctx.fillStyle = rightShadow;
      ctx.fillRect(rightShadowX, shadowTop, shadowWidth, shadowHeight);
    }
  }

  /**
   * 绘制滚动条
   * @param ctx Canvas 2D 上下文
   * @param layout 渲染布局
   */
  private _drawScrollbars(ctx: CanvasRenderingContext2D, layout: RenderLayout) {
    const vScrollbarTrackHeight =
      layout.canvasHeight -
      (layout.hasHorizontalScrollbar ? layout.horizontalScrollbarHeight : 0);
    const scrollbarHeight = Math.max(
      20,
      (vScrollbarTrackHeight / layout.contentHeight) * vScrollbarTrackHeight,
    );
    const scrollbarY =
      layout.maxScroll > 0
        ? (this.scrollTop / layout.maxScroll) *
          (vScrollbarTrackHeight - scrollbarHeight)
        : 0;

    const vTrackColor = this._style.scrollbarTrackColor ?? "#f1f1f1";
    const vThumbColor =
      this.isPressedVScrollbar || this.isDraggingScrollbar
        ? (this._style.scrollbarThumbPressedColor ?? "#6b6b6b")
        : this.isHoveringVScrollbar
          ? (this._style.scrollbarThumbHoverColor ?? "#a8a8a8")
          : (this._style.scrollbarThumbColor ?? "#c1c1c1");
    const hTrackColor = this._style.scrollbarTrackColor ?? "#f1f1f1";
    const hThumbColor =
      this.isPressedHScrollbar || this.isDraggingHorizontalScrollbar
        ? (this._style.scrollbarThumbPressedColor ?? "#6b6b6b")
        : this.isHoveringHScrollbar
          ? (this._style.scrollbarThumbHoverColor ?? "#a8a8a8")
          : (this._style.scrollbarThumbColor ?? "#c1c1c1");

    // 绘制垂直滚动条
    if (layout.maxScroll > 0) {
      ctx.fillStyle = vTrackColor;
      ctx.fillRect(
        layout.viewWidth,
        0,
        layout.scrollbarWidth,
        layout.canvasHeight -
          (layout.hasHorizontalScrollbar
            ? layout.horizontalScrollbarHeight
            : 0),
      );

      ctx.fillStyle = vThumbColor;
      ctx.beginPath();
      ctx.roundRect(
        layout.viewWidth + 2,
        scrollbarY + 2,
        layout.scrollbarWidth - 4,
        scrollbarHeight - 4,
        4,
      );
      ctx.fill();
    }

    // 绘制水平滚动条
    if (layout.hasHorizontalScrollbar) {
      const hScrollbarWidth = Math.max(
        20,
        (layout.viewWidth / layout.totalContentWidth) * layout.viewWidth,
      );
      const hScrollbarX =
        layout.maxScrollLeft > 0
          ? (this.scrollLeft / layout.maxScrollLeft) *
            (layout.viewWidth - hScrollbarWidth)
          : 0;

      ctx.fillStyle = hTrackColor;
      ctx.fillRect(
        0,
        layout.canvasHeight - layout.horizontalScrollbarHeight,
        layout.viewWidth,
        layout.horizontalScrollbarHeight,
      );

      ctx.fillStyle = hThumbColor;
      ctx.beginPath();
      ctx.roundRect(
        hScrollbarX + 2,
        layout.canvasHeight - layout.horizontalScrollbarHeight + 2,
        hScrollbarWidth - 4,
        layout.horizontalScrollbarHeight - 4,
        4,
      );
      ctx.fill();
    }
  }

  /**
   * 绘制垂直分隔线
   * @param ctx Canvas 2D 上下文
   * @param layout 渲染布局
   */
  private _drawVerticalDividers(
    ctx: CanvasRenderingContext2D,
    layout: RenderLayout,
  ) {
    if (!this._style.showVerticalDividers) return;

    const top = layout.paddingTop;
    const bottom =
      layout.canvasHeight -
      layout.paddingBottom -
      (layout.hasHorizontalScrollbar ? layout.horizontalScrollbarHeight : 0);
    if (bottom <= top) return;

    const visibleLeft = layout.paddingLeft;
    const visibleRight =
      layout.viewWidth - layout.paddingRight - layout.rightFixedWidth;
    const dividerXSet = new Set<number>();

    let leftX = layout.paddingLeft;
    this._columns.forEach((col, i) => {
      if (col.fixed === "left") {
        leftX += layout.columnWidths[i];
        dividerXSet.add(leftX);
      }
    });

    let middleX = layout.paddingLeft + layout.leftFixedWidth - this.scrollLeft;
    this._columns.forEach((col, i) => {
      if (!col.fixed) {
        middleX += layout.columnWidths[i];
        dividerXSet.add(middleX);
      }
    });

    let rightX =
      layout.viewWidth - layout.paddingRight - layout.rightFixedWidth;
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
   * 绘制外边框
   * @param ctx Canvas 2D 上下文
   * @param layout 渲染布局
   */
  private _drawOuterBorder(
    ctx: CanvasRenderingContext2D,
    layout: RenderLayout,
  ) {
    ctx.strokeStyle = this._style.borderColor ?? "#e0e0e0";
    ctx.strokeRect(
      layout.paddingLeft,
      layout.paddingTop,
      layout.contentWidth,
      layout.canvasHeight -
        layout.paddingTop -
        layout.paddingBottom -
        (layout.hasHorizontalScrollbar ? layout.horizontalScrollbarHeight : 0),
    );
  }

  /**
   * 渲染表格
   */
  private _render() {
    this.ctx ??= this.el.getContext("2d");
    if (!this.ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const layout = this._buildRenderLayout();
    this._layout = layout;

    this.el.style.width = `${layout.canvasWidth}px`;
    this.el.style.height = `${layout.canvasHeight}px`;
    this.el.width = layout.canvasWidth * dpr;
    this.el.height = layout.canvasHeight * dpr;

    this.ctx.scale(dpr, dpr);
    this.ctx.clearRect(0, 0, layout.canvasWidth, layout.canvasHeight);
    this.ctx.font =
      this._style.font ??
      "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    this._drawRows(this.ctx, layout);
    this._drawHeader(this.ctx, layout);
    this._drawFixedColumnShadows(this.ctx, layout);
    this._drawVerticalDividers(this.ctx, layout);
    this._drawScrollbars(this.ctx, layout);
    this._drawOuterBorder(this.ctx, layout);
  }
}

export type {
  TableFixed,
  TableColumnType,
  TableColumn,
  RowStyleResolverResult,
  RowStyleResolver,
  TableStyle,
  ValueBuilder,
  TableOptions,
  RenderLayout,
  VirtualTableEventType,
  VirtualTableEventHandlerMap,
  VirtualTableCreateOptions,
};

export { VirtualTable };
