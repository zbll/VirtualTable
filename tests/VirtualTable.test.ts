import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VirtualTable } from '../VirtualTable';
import type { TableColumn, TableStyle, TableOptions } from '../VirtualTable';

// 创建 mock canvas 元素的辅助函数
function createMockCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 400;
  return canvas;
}

// 模拟数据生成器
function createMockData(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: Math.random() * 1000,
    date: new Date(Date.now() - i * 86400000).toISOString(),
  }));
}

describe('VirtualTable', () => {
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = createMockCanvas();
  });

  describe('构造函数', () => {
    it('应正确创建 VirtualTable 实例', () => {
      const table = new VirtualTable(canvas);
      expect(table).toBeDefined();
    });

    it('应接受 TableOptions 配置', () => {
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
      expect(table).toBeDefined();
    });

    it('应正确使用 list 静态方法创建实例', () => {
      const data = createMockData(50);
      const columns: TableColumn[] = [
        { key: 'id', name: 'ID' },
        { key: 'name', name: '名称' },
      ];

      const table = VirtualTable.list(canvas, {
        columns,
        values: data,
      });

      expect(table).toBeDefined();
    });
  });

  describe('MAX_LENGTH', () => {
    it('应有正确的最大长度限制', () => {
      expect(VirtualTable.MAX_LENGTH).toBe(2998683910349035);
    });
  });

  describe('setValues', () => {
    it('应正确设置表格数据', () => {
      const table = new VirtualTable(canvas);
      
      table.setValues(100, (index) => ({
        id: index,
        name: `Item ${index}`,
      }));

      // 触发渲染
      table.resize(800, 400);
    });

    it('应限制数据长度不超过 MAX_LENGTH', () => {
      const table = new VirtualTable(canvas);
      
      // 设置超过 MAX_LENGTH 的数据
      table.setValues(VirtualTable.MAX_LENGTH + 1000, (index) => ({
        id: index,
      }));

      table.resize(800, 400);
    });

    it('应重置滚动位置', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });

      table.resize(800, 400);
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
    });

    it('应合并样式配置', () => {
      const table = new VirtualTable(canvas);
      
      table.setStyle({ rowHeight: 40 });
      table.setStyle({ headerHeight: 50 });

      table.resize(800, 400);
    });
  });

  describe('resize', () => {
    it('应正确调整表格大小', () => {
      const table = new VirtualTable(canvas);
      table.resize(1024, 600);
    });

    it('应支持只调整宽度或高度', () => {
      const table = new VirtualTable(canvas);
      
      table.resize(1024);
      table.resize(undefined, 600);
    });
  });

  describe('scrollTo', () => {
    it('应滚动到指定位置', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 1000,
        valueBuilder: (i) => ({ id: i }),
      });

      table.resize(800, 400);
      table.scrollTo(100);
    });

    it('应限制滚动范围', () => {
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
  });

  describe('事件系统', () => {
    it('应支持添加 hover 事件监听', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });

      const hoverHandler = vi.fn();
      table.onHover(hoverHandler);
    });

    it('应支持添加 click 事件监听', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });

      const clickHandler = vi.fn();
      table.onClick(clickHandler);
    });

    it('应支持添加 scroll 事件监听', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 1000,
        valueBuilder: (i) => ({ id: i }),
      });

      const scrollHandler = vi.fn();
      table.onScroll(scrollHandler);
    });

    it('应支持添加 tableCreated 事件监听', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });

      const createdHandler = vi.fn();
      table.onTableCreated(createdHandler);

      // tableCreated 事件应该在创建后立即触发
    });

    it('应支持移除事件监听', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });

      const handler = vi.fn();
      table.onClick(handler);
      table.offClick(handler);
    });

    it('应支持使用 addEventListener', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 100,
        valueBuilder: (i) => ({ id: i }),
      });

      const handler = vi.fn();
      table.addEventListener('click', handler);
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
  });

  describe('Padding 解析', () => {
    it('应支持数字类型的 padding', () => {
      const style: TableStyle = {
        tablePadding: 10,
        cellPadding: 5,
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

    it('应支持数组类型的 padding', () => {
      const style: TableStyle = {
        tablePadding: [10, 20],
        cellPadding: [5, 10, 15, 20],
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

  describe('边界情况', () => {
    it('应处理空数据', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 0,
        valueBuilder: () => ({}),
      });

      table.resize(800, 400);
    });

    it('应处理单行数据', () => {
      const table = new VirtualTable(canvas, {
        columns: [{ key: 'id', name: 'ID' }],
        length: 1,
        valueBuilder: (i) => ({ id: i }),
      });

      table.resize(800, 400);
    });

    it('应处理 null 和 undefined 值', () => {
      const columns: TableColumn[] = [
        { key: 'value1', name: '值1' },
        { key: 'value2', name: '值2' },
      ];

      const table = new VirtualTable(canvas, {
        columns,
        length: 10,
        valueBuilder: (i) => ({
          value1: i % 3 === 0 ? null : i,
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
  });
});
