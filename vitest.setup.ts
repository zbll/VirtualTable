import { beforeAll } from 'vitest';

// 模拟 ResizeObserver
beforeAll(() => {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // 模拟 window.devicePixelRatio
  Object.defineProperty(global, 'devicePixelRatio', {
    writable: true,
    value: 1,
  });

  // 模拟 CanvasRenderingContext2D
  const mockContext = {
    clearRect: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    fill: () => {},
    fillText: () => {},
    measureText: () => ({ width: 0 }),
    scale: () => {},
    save: () => {},
    restore: () => {},
    clip: () => {},
    rect: () => {},
    createLinearGradient: () => ({
      addColorStop: () => {},
    }),
    roundRect: () => {},
    textAlign: 'left' as CanvasTextAlign,
    textBaseline: 'top' as CanvasTextBaseline,
    font: '',
    lineWidth: 1,
    strokeStyle: '',
    fillStyle: '',
  };

  // 模拟 getContext
  HTMLCanvasElement.prototype.getContext = function (
    contextType: string
  ): any {
    if (contextType === '2d') {
      return mockContext;
    }
    return null;
  };

  // 模拟 clientWidth 和 clientHeight
  Object.defineProperty(HTMLCanvasElement.prototype, 'clientWidth', {
    writable: true,
    value: 800,
  });

  Object.defineProperty(HTMLCanvasElement.prototype, 'clientHeight', {
    writable: true,
    value: 400,
  });

  // 模拟 getBoundingClientRect
  HTMLCanvasElement.prototype.getBoundingClientRect = function (): any {
    return {
      left: 0,
      top: 0,
      right: 800,
      bottom: 400,
      width: 800,
      height: 400,
      x: 0,
      y: 0,
    };
  };
});
