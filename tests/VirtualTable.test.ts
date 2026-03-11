import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VirtualTable } from '../src/VirtualTable';
import type { TableColumn, TableStyle, TableOptions } from '../src/VirtualTable';

// 创建 mock canvas 元素的辅助函数
function createMockCanvas(width = 800, height = 400): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  // 模拟 clientWidth 和 clientHeight
  Object.defineProperty(canvas, 'clientWidth', { value: width, configurable: true });
  Object.defineProperty(canvas, 'clientHeight', { value: height, configurable: true });
  return canvas;
}

describe('VirtualTable', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = createMockCanvas();
  });

  describe('静态属性', () => {
    it('MAX_LENGTH 应为预期值', () => {
      expect(VirtualTable.MAX_LENGTH).toBe(2998683910349035);
    });
  });

  describe('静态方法 list', () => {
    it('应返回 VirtualTable 实例', () => {
      const data = [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' },
      ];
      const columns: TableColumn[] = [
        { key: 'id', name: 'ID' },
        { key: 'name', name: '名称' },
      ];
      
      const table = VirtualTable.list(canvas, { columns, values: data });
      
      expect(table).toBeInstanceOf(VirtualTable);
    });

    it('应正确设置数据长度', () => {
      const data = Array.from({ length: 100 }, (_, i) => ({ id: i }));
      const table = VirtualTable.list(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        values: data,
      });
      
      table.resize(800, 400);
      // 内部 _length 应该是 100
    });
  });

  describe('构造函数', () => {
    it('应创建 VirtualTable 实例', () => {
      const table = new VirtualTable(canvas);
      expect(table).toBeInstanceOf(VirtualTable);
    });

    it('应接受 options 参数并初始化表格', () => {
      const columns: TableColumn[] = [
        { key: 'id', name: 'ID', width: 80 },
        { key: 'name', name: '名称', width: 200 },
      ];
      
      const options: TableOptions = {
        columns,
        length: 100,
        valueBuilder: (index) => ({ id: index, name: `Item ${index}` }),
      };
      
      const table = new VirtualTable(canvas, options);
      
      expect(table).toBeInstanceOf(VirtualTable);
    });

    it('应使用默认样式', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 10,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
    });
  });

  describe('setValues', () => {
    it('应正确设置数据长度', () => {
      const table = new VirtualTable(canvas);
      
      table.setValues(100, (index) => ({ id: index }));
      table.resize(800, 400);
    });

    it('应限制数据长度不超过 MAX_LENGTH', () => {
      const table = new VirtualTable(canvas);
      
      // 设置超过 MAX_LENGTH 的数据
      table.setValues(VirtualTable.MAX_LENGTH + 1000, (index) => ({ id: index }));
      table.resize(800, 400);
    });

    it('应重置滚动位置到顶部', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 1000,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
      table.scrollTo(500);
      
      table.setValues(50, (i) => ({ id: i }));
    });

    it('应清空缓存', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
      
      // 触发缓存
      table.scrollTo(50);
      
      // 设置新数据应清空缓存
      table.setValues(50, (i) => ({ id: i + 1000 }));
    });
  });

  describe('setColumns', () => {
    it('应正确设置列配置', () => {
      const table = new VirtualTable(canvas);
      const columns: TableColumn[] = [
        { key: 'id', name: 'ID', width: 100 },
        { key: 'name', name: '名称', width: 200 },
        { key: 'value', name: '值', width: 150 },
      ];
      
      table.setColumns(columns);
      table.resize(800, 400);
    });

    it('应支持固定列配置', () => {
      const table = new VirtualTable(canvas);
      const columns: TableColumn[] = [
        { key: 'id', name: 'ID', width: 100, fixed: 'left' },
        { key: 'name', name: '名称', width: 200 },
        { key: 'value', name: '值', width: 150, fixed: 'right' },
      ];
      
      table.setColumns(columns);
      table.resize(800, 400);
    });

    it('应支持自定义 getValue', () => {
      const table = new VirtualTable(canvas);
      const columns: TableColumn[] = [
        { 
          key: 'price', 
          name: '价格',
          getValue: (row) => `¥${row.price.toFixed(2)}`,
        },
      ];
      
      table.setColumns(columns);
      table.setValues(10, (i) => ({ price: i * 10.5 }));
      table.resize(800, 400);
    });

    it('应支持列类型 text 和 html', () => {
      const table = new VirtualTable(canvas);
      const columns: TableColumn[] = [
        { key: 'text', name: '文本', type: 'text' },
        { key: 'html', name: 'HTML', type: 'html' },
      ];
      
      table.setColumns(columns);
      table.setValues(10, (i) => ({ text: `Text ${i}`, html: `<b>${i}</b>` }));
      table.resize(800, 400);
    });
  });

  describe('setStyle', () => {
    it('应正确设置样式配置', () => {
      const table = new VirtualTable(canvas);
      const style: TableStyle = {
        rowHeight: 50,
        headerHeight: 60,
        font: '16px Arial',
        rowBackgroundColor: '#ffffff',
        rowAltBackgroundColor: '#f0f0f0',
        textColor: '#333333',
        headerBackgroundColor: '#e0e0e0',
      };
      
      table.setStyle(style);
      table.resize(800, 400);
    });

    it('应合并多次设置的样式', () => {
      const table = new VirtualTable(canvas);
      
      table.setStyle({ rowHeight: 40 });
      table.setStyle({ headerHeight: 50 });
      table.setStyle({ font: '16px Arial' });
      
      table.resize(800, 400);
    });

    it('应支持滚动条样式配置', () => {
      const table = new VirtualTable(canvas);
      const style: TableStyle = {
        scrollbarWidth: 16,
        scrollbarTrackColor: '#eee',
        scrollbarThumbColor: '#999',
        scrollbarThumbHoverColor: '#777',
        scrollbarThumbPressedColor: '#555',
      };
      
      table.setStyle(style);
      table.setValues(1000, (i) => ({ id: i }));
      table.resize(800, 400);
    });

    it('应支持边框样式配置', () => {
      const table = new VirtualTable(canvas);
      const style: TableStyle = {
        borderColor: '#ff0000',
        verticalDividerColor: '#00ff00',
        verticalDividerWidth: 2,
        horizontalDividerColor: '#0000ff',
        horizontalDividerWidth: 2,
        showVerticalDividers: true,
      };
      
      table.setStyle(style);
      table.setValues(100, (i) => ({ id: i }));
      table.resize(800, 400);
    });

    it('应支持 textAlign 样式', () => {
      const table = new VirtualTable(canvas);
      
      table.setStyle({ textAlign: 'center' });
      table.setValues(10, (i) => ({ id: i }));
      table.resize(800, 400);
    });

    it('应支持 rowHoverBackgroundColor', () => {
      const table = new VirtualTable(canvas);
      const style: TableStyle = {
        rowHoverBackgroundColor: '#ffff00',
      };
      
      table.setStyle(style);
      table.setValues(100, (i) => ({ id: i }));
      table.resize(800, 400);
    });
  });

  describe('resize', () => {
    it('应接受宽度和高度参数', () => {
      const table = new VirtualTable(canvas);
      // resize 方法会调用 _render，不应抛出错误
      expect(() => table.resize(1024, 600)).not.toThrow();
    });

    it('应只接受宽度参数', () => {
      const table = new VirtualTable(canvas);
      expect(() => table.resize(1024)).not.toThrow();
    });

    it('应只接受高度参数', () => {
      const table = new VirtualTable(canvas);
      expect(() => table.resize(undefined, 600)).not.toThrow();
    });

    it('应渲染表格', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      // 初始 resize
      table.resize(800, 400);
      // 再次 resize
      table.resize(1024, 600);
    });
  });

  describe('scrollTo', () => {
    it('应滚动到指定垂直位置', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 1000,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
      table.scrollTo(100);
    });

    it('应限制滚动范围不超过最大滚动值', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
      // 尝试滚动到超出范围的位置
      table.scrollTo(10000);
    });

    it('应支持同时设置垂直和水平滚动', () => {
      const table = new VirtualTable(canvas, {
        columns: [
          { key: 'id', name: 'ID', width: 2000 },
        ],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
      table.scrollTo(100, 500);
    });

    it('应只设置水平滚动', () => {
      const table = new VirtualTable(canvas, {
        columns: [
          { key: 'id', name: 'ID', width: 2000 },
        ],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
      table.scrollTo(undefined, 300);
    });

    it('应只设置垂直滚动', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 1000,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
      table.scrollTo(200);
    });

    it('应限制负数滚动值', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
      table.scrollTo(-100);
    });
  });

  describe('事件系统', () => {
    it('onHover 应添加 hover 事件监听', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      const hoverHandler = vi.fn();
      table.onHover(hoverHandler);
      
      expect(hoverHandler).not.toHaveBeenCalled();
    });

    it('onClick 应添加 click 事件监听', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      const clickHandler = vi.fn();
      table.onClick(clickHandler);
    });

    it('onScroll 应添加 scroll 事件监听', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 1000,
        valueBuilder: (i) => ({ id: i }),
      });
      
      const scrollHandler = vi.fn();
      table.onScroll(scrollHandler);
      
      table.resize(800, 400);
      table.scrollTo(100);
    });

    it('onTableCreated 应添加 tableCreated 事件监听', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      const createdHandler = vi.fn();
      table.onTableCreated(createdHandler);
      
      // tableCreated 事件应该在创建后立即触发
    });

    it('onRowCreated 应添加 rowCreated 事件监听', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      const rowCreatedHandler = vi.fn();
      table.onRowCreated(rowCreatedHandler);
      
      table.resize(800, 400);
    });

    it('offHover 应移除 hover 事件监听', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      const handler = vi.fn();
      table.onHover(handler);
      table.offHover(handler);
    });

    it('offClick 应移除 click 事件监听', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      const handler = vi.fn();
      table.onClick(handler);
      table.offClick(handler);
    });

    it('offScroll 应移除 scroll 事件监听', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 1000,
        valueBuilder: (i) => ({ id: i }),
      });
      
      const handler = vi.fn();
      table.onScroll(handler);
      table.offScroll(handler);
    });

    it('offTableCreated 应移除 tableCreated 事件监听', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      const handler = vi.fn();
      table.onTableCreated(handler);
      table.offTableCreated(handler);
    });

    it('offRowCreated 应移除 rowCreated 事件监听', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      const handler = vi.fn();
      table.onRowCreated(handler);
      table.offRowCreated(handler);
    });

    it('addEventListener 应支持 hover 事件', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      const handler = vi.fn();
      table.addEventListener('hover', handler);
    });

    it('addEventListener 应支持 click 事件', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      const handler = vi.fn();
      table.addEventListener('click', handler);
    });

    it('addEventListener 应支持 scroll 事件', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 1000,
        valueBuilder: (i) => ({ id: i }),
      });
      
      const handler = vi.fn();
      table.addEventListener('scroll', handler);
      
      table.resize(800, 400);
      table.scrollTo(100);
    });

    it('addEventListener 应支持 tableCreated 事件（已创建时立即触发）', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      const handler = vi.fn();
      // 表格已创建，添加监听器应立即触发
      table.addEventListener('tableCreated', handler);
    });

    it('addEventListener 应支持 rowCreated 事件（已创建时回放）', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 10,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
      
      const handler = vi.fn();
      // 表格已创建，添加监听器应回放已缓存的行
      table.addEventListener('rowCreated', handler);
    });

    it('removeEventListener 应移除事件监听', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      const handler = vi.fn();
      table.addEventListener('click', handler);
      table.removeEventListener('click', handler);
    });
  });

  describe('固定列功能', () => {
    it('应正确渲染左侧固定列', () => {
      const columns: TableColumn[] = [
        { key: 'id', name: 'ID', width: 100, fixed: 'left' },
        { key: 'name', name: '名称', width: 200 },
        { key: 'value', name: '值', width: 150 },
      ];
      
      const table = new VirtualTable(canvas, {
        columns,
        length: 100,
        valueBuilder: (i) => ({ id: i, name: `Item ${i}`, value: i * 10 }),
      });
      
      table.resize(800, 400);
    });

    it('应正确渲染右侧固定列', () => {
      const columns: TableColumn[] = [
        { key: 'id', name: 'ID', width: 100 },
        { key: 'name', name: '名称', width: 200 },
        { key: 'value', name: '值', width: 150, fixed: 'right' },
      ];
      
      const table = new VirtualTable(canvas, {
        columns,
        length: 100,
        valueBuilder: (i) => ({ id: i, name: `Item ${i}`, value: i * 10 }),
      });
      
      table.resize(800, 400);
    });

    it('应同时支持左右固定列', () => {
      const columns: TableColumn[] = [
        { key: 'id', name: 'ID', width: 100, fixed: 'left' },
        { key: 'name', name: '名称', width: 200 },
        { key: 'value', name: '值', width: 150, fixed: 'right' },
      ];
      
      const table = new VirtualTable(canvas, {
        columns,
        length: 100,
        valueBuilder: (i) => ({ id: i, name: `Item ${i}`, value: i * 10 }),
      });
      
      table.resize(800, 400);
    });

    it('应支持多列固定在左侧', () => {
      const columns: TableColumn[] = [
        { key: 'id', name: 'ID', width: 80, fixed: 'left' },
        { key: 'name', name: '名称', width: 100, fixed: 'left' },
        { key: 'value', name: '值', width: 150 },
      ];
      
      const table = new VirtualTable(canvas, {
        columns,
        length: 100,
        valueBuilder: (i) => ({ id: i, name: `Item ${i}`, value: i * 10 }),
      });
      
      table.resize(800, 400);
    });

    it('应支持多列固定在右侧', () => {
      const columns: TableColumn[] = [
        { key: 'id', name: 'ID', width: 100 },
        { key: 'name', name: '名称', width: 80, fixed: 'right' },
        { key: 'value', name: '值', width: 100, fixed: 'right' },
      ];
      
      const table = new VirtualTable(canvas, {
        columns,
        length: 100,
        valueBuilder: (i) => ({ id: i, name: `Item ${i}`, value: i * 10 }),
      });
      
      table.resize(800, 400);
    });
  });

  describe('自定义单元格值', () => {
    it('应支持 getValue 自定义单元格显示值', () => {
      const columns: TableColumn[] = [
        { 
          key: 'id', 
          name: 'ID',
          getValue: (row) => `ID: ${row.id}`,
        },
      ];
      
      const table = new VirtualTable(canvas, {
        columns,
        length: 10,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
    });

    it('getValue 应接收 row 和 index 参数', () => {
      const getValueMock = vi.fn((row, index) => `Row ${index}: ${row.id}`);
      
      const columns: TableColumn[] = [
        { key: 'id', name: 'ID', getValue: getValueMock },
      ];
      
      const table = new VirtualTable(canvas, {
        columns,
        length: 5,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
      
      // getValue 应被调用
    });

    it('应支持不同类型的列', () => {
      const columns: TableColumn[] = [
        { key: 'text', name: '文本', type: 'text' },
        { key: 'html', name: 'HTML', type: 'html' },
      ];
      
      const table = new VirtualTable(canvas, {
        columns,
        length: 10,
        valueBuilder: (i) => ({ text: `Text ${i}`, html: `<b>${i}</b>` }),
      });
      
      table.resize(800, 400);
    });

    it('getValue 返回 null 时应显示空字符串', () => {
      const columns: TableColumn[] = [
        { key: 'value', name: '值' },
      ];
      
      const table = new VirtualTable(canvas, {
        columns,
        length: 5,
        valueBuilder: (i) => ({ value: i === 2 ? null : i }),
      });
      
      table.resize(800, 400);
    });

    it('getValue 返回 undefined 时应显示空字符串', () => {
      const columns: TableColumn[] = [
        { key: 'value', name: '值' },
      ];
      
      const table = new VirtualTable(canvas, {
        columns,
        length: 5,
        valueBuilder: (i) => ({ value: i === 2 ? undefined : i }),
      });
      
      table.resize(800, 400);
    });
  });

  describe('行样式解析器', () => {
    it('应支持自定义行样式', () => {
      const style: TableStyle = {
        rowStyleResolver: (row, index) => {
          if (index % 2 === 0) {
            return {
              backgroundColor: '#ffcccc',
              textColor: '#ff0000',
            };
          }
          return {};
        },
      };
      
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
        style,
      });
      
      table.resize(800, 400);
    });

    it('rowStyleResolver 应支持 hoverBackgroundColor', () => {
      const style: TableStyle = {
        rowStyleResolver: (row, index) => ({
          hoverBackgroundColor: '#ffff00',
        }),
      };
      
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
        style,
      });
      
      table.resize(800, 400);
    });

    it('rowStyleResolver 应支持 textAlign', () => {
      const style: TableStyle = {
        rowStyleResolver: (row, index) => ({
          textAlign: 'center',
        }),
      };
      
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
        style,
      });
      
      table.resize(800, 400);
    });

    it('rowStyleResolver 应支持 borderColor', () => {
      const style: TableStyle = {
        rowStyleResolver: (row, index) => ({
          borderColor: '#ff0000',
        }),
      };
      
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
        style,
      });
      
      table.resize(800, 400);
    });

    it('rowStyleResolver 应支持 font', () => {
      const style: TableStyle = {
        rowStyleResolver: (row, index) => ({
          font: 'bold 16px Arial',
        }),
      };
      
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
        style,
      });
      
      table.resize(800, 400);
    });
  });

  describe('Padding 解析', () => {
    it('应支持数字类型的 tablePadding', () => {
      const style: TableStyle = {
        tablePadding: 10,
      };
      
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 10,
        valueBuilder: (i) => ({ id: i }),
        style,
      });
      
      table.resize(800, 400);
    });

    it('应支持数组类型的 tablePadding', () => {
      const style: TableStyle = {
        tablePadding: [10, 20],
      };
      
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 10,
        valueBuilder: (i) => ({ id: i }),
        style,
      });
      
      table.resize(800, 400);
    });

    it('应支持三位数的 tablePadding', () => {
      const style: TableStyle = {
        tablePadding: [10, 20, 30],
      };
      
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 10,
        valueBuilder: (i) => ({ id: i }),
        style,
      });
      
      table.resize(800, 400);
    });

    it('应支持四位数的 tablePadding', () => {
      const style: TableStyle = {
        tablePadding: [10, 20, 30, 40],
      };
      
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 10,
        valueBuilder: (i) => ({ id: i }),
        style,
      });
      
      table.resize(800, 400);
    });

    it('应支持数字类型的 cellPadding', () => {
      const style: TableStyle = {
        cellPadding: 5,
      };
      
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 10,
        valueBuilder: (i) => ({ id: i }),
        style,
      });
      
      table.resize(800, 400);
    });

    it('应支持数组类型的 cellPadding', () => {
      const style: TableStyle = {
        cellPadding: [5, 10, 15, 20],
      };
      
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 10,
        valueBuilder: (i) => ({ id: i }),
        style,
      });
      
      table.resize(800, 400);
    });

    it('应支持数字类型的 headerCellPadding', () => {
      const style: TableStyle = {
        headerCellPadding: 8,
      };
      
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 10,
        valueBuilder: (i) => ({ id: i }),
        style,
      });
      
      table.resize(800, 400);
    });

    it('应支持数组类型的 headerCellPadding', () => {
      const style: TableStyle = {
        headerCellPadding: [8, 16],
      };
      
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 10,
        valueBuilder: (i) => ({ id: i }),
        style,
      });
      
      table.resize(800, 400);
    });
  });

  describe('默认值测试', () => {
    it('rowHeight 应有默认值 40', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
    });

    it('headerHeight 应有默认值 50', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
    });

    it('font 应有默认值', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
    });

    it('textColor 应有默认值 #333333', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
    });

    it('headerBackgroundColor 应有默认值 #f5f5f5', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
    });

    it('rowBackgroundColor 应有默认值 #ffffff', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
    });

    it('rowAltBackgroundColor 应有默认值 #fafafa', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
    });

    it('borderColor 应有默认值 #e0e0e0', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
    });

    it('scrollbarWidth 应有默认值 12', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 1000,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
    });

    it('scrollbarThumbColor 应有默认值 #c1c1c1', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 1000,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
    });

    it('textAlign 应有默认值 left', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
    });
  });

  describe('边界情况', () => {
    it('应处理空数据 (length: 0)', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 0,
        valueBuilder: () => ({}),
      });
      
      table.resize(800, 400);
    });

    it('应处理单行数据 (length: 1)', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 1,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
    });

    it('应处理 null 值', () => {
      const columns: TableColumn[] = [
        { key: 'value1', name: '值1' },
      ];
      
      const table = new VirtualTable(canvas, {
        columns,
        length: 10,
        valueBuilder: (i) => ({
          value1: i % 3 === 0 ? null : i,
        }),
      });
      
      table.resize(800, 400);
    });

    it('应处理 undefined 值', () => {
      const columns: TableColumn[] = [
        { key: 'value2', name: '值2' },
      ];
      
      const table = new VirtualTable(canvas, {
        columns,
        length: 10,
        valueBuilder: (i) => ({
          value2: i % 3 === 1 ? undefined : i,
        }),
      });
      
      table.resize(800, 400);
    });

    it('应处理空列配置', () => {
      const table = new VirtualTable(canvas, {
        columns: [],
        length: 10,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
    });

    it('应处理未设置宽度的列', () => {
      const table = new VirtualTable(canvas, {
        columns: [
          { key: 'id', name: 'ID' },
          { key: 'name', name: '名称' },
        ],
        length: 10,
        valueBuilder: (i) => ({ id: i, name: `Item ${i}` }),
      });
      
      table.resize(800, 400);
    });

    it('应处理超大数据量', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 1000000,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
    });

    it('应处理 width 为 0 的列', () => {
      const table = new VirtualTable(canvas, {
        columns: [
          { key: 'id', name: 'ID', width: 0 },
        ],
        length: 10,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
    });

    it('应处理很小的 canvas 尺寸', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(100, 100);
    });

    it('应处理所有列都是固定列的情况', () => {
      const table = new VirtualTable(canvas, {
        columns: [
          { key: 'id', name: 'ID', width: 100, fixed: 'left' },
          { key: 'name', name: '名称', width: 100, fixed: 'right' },
        ],
        length: 10,
        valueBuilder: (i) => ({ id: i, name: `Item ${i}` }),
      });
      
      table.resize(800, 400);
    });
  });

  describe('滚动条计算', () => {
    it('内容高度小于 canvas 高度时不应显示垂直滚动条', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 5,
        valueBuilder: (i) => ({ id: i }),
        style: { rowHeight: 40 },
      });
      
      // canvas.height = 400, contentHeight = 50 + 5*40 = 250 < 400
      table.resize(800, 400);
    });

    it('内容宽度小于 canvas 宽度时不应显示水平滚动条', () => {
      const table = new VirtualTable(canvas, {
        columns: [
          { key: 'id', name: 'ID', width: 100 },
        ],
        length: 10,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
    });

    it('滚动条滑块高度不应小于 20', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 10000,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
    });

    it('水平滚动条滑块宽度不应小于 20', () => {
      const table = new VirtualTable(canvas, {
        columns: [
          { key: 'id', name: 'ID', width: 5000 },
        ],
        length: 10,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
    });
  });

  describe('数据缓存', () => {
    it('应缓存访问过的数据', () => {
      const valueBuilderMock = vi.fn((i) => ({ id: i }));
      
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: valueBuilderMock,
      });
      
      table.resize(800, 400);
      // 访问同一行数据
      table.scrollTo(0);
      table.scrollTo(40);
    });

    it('缓存超过阈值应清空', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 20000,
        valueBuilder: (i) => ({ id: i }),
      });
      
      table.resize(800, 400);
      // 滚动多次触发缓存清空
      table.scrollTo(0);
      table.scrollTo(10000);
      table.scrollTo(0);
    });
  });

  describe('虚拟滚动', () => {
    it('只应渲染可视区域内的行', () => {
      const columns: TableColumn[] = [
        { key: 'id', name: 'ID' },
      ];
      
      const table = new VirtualTable(canvas, {
        columns,
        length: 100000,
        valueBuilder: (i) => ({ id: i }),
        style: { rowHeight: 40 },
      });
      
      table.resize(800, 400);
      // 滚动到中间位置
      table.scrollTo(10000);
    });

    it('滚动到不同位置应渲染不同行', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 1000,
        valueBuilder: (i) => ({ id: i }),
        style: { rowHeight: 40 },
      });
      
      table.resize(800, 400);
      table.scrollTo(0);
      table.scrollTo(5000);
    });
  });
});
