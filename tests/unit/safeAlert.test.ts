import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

class MockElement {
  id: string = '';
  style: Record<string, string> = {};
  children: MockElement[] = [];
  parentNode: MockElement | null = null;
  innerHTML: string = '';
  attributes: Record<string, string> = {};

  setAttribute(name: string, val: string) {
    this.attributes[name] = val;
  }
  appendChild(child: MockElement) {
    child.parentNode = this;
    this.children.push(child);
  }
  removeChild(child: MockElement) {
    this.children = this.children.filter((c) => c !== child);
    child.parentNode = null;
  }
  contains(child: any): boolean {
    return this.children.includes(child);
  }
}

const mockBody = new MockElement();
let elementRegistry: Record<string, MockElement> = {};

const mockDocument = {
  body: mockBody,
  getElementById: (id: string) => elementRegistry[id] || null,
  createElement: () => {
    const el = new MockElement();
    return el;
  },
};

(global as any).window = global;
(global as any).document = mockDocument;
(global as any).requestAnimationFrame = (cb: Function) => cb();

// Import after setting global.document
import { safeAlert, showToastBanner } from '../../src/utils/safeAlert';

describe('SafeAlert & Toast Notification Utility Unit Tests', () => {
  beforeEach(() => {
    mockBody.children = [];
    elementRegistry = {};
    // Intercept id set on elements
    const origCreateElement = mockDocument.createElement;
    mockDocument.createElement = () => {
      const el = origCreateElement();
      const origSetAttr = el.setAttribute.bind(el);
      el.setAttribute = (k, v) => {
        origSetAttr(k, v);
      };
      Object.defineProperty(el, 'id', {
        get() {
          return this._id || '';
        },
        set(val: string) {
          this._id = val;
          elementRegistry[val] = this;
        },
        configurable: true,
      });
      return el;
    };
    mockDocument.body.contains = (el: any) => mockBody.children.includes(el);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a floating toast notification in DOM on safeAlert', () => {
    safeAlert('Test alert message', 'warning');
    const container = mockDocument.getElementById('mycivy-toast-container');
    expect(container).toBeDefined();
    expect(container?.children.some((c) => c.innerHTML.includes('Test alert message'))).toBe(true);
  });

  it('renders success toast with correct icon and text', () => {
    showToastBanner('Berhasil terkirim!', 'success');
    const container = mockDocument.getElementById('mycivy-toast-container');
    expect(container?.children.some((c) => c.innerHTML.includes('Berhasil terkirim!') && c.innerHTML.includes('✅'))).toBe(true);
  });

  it('renders error toast with warning icon and text', () => {
    showToastBanner('Format tidak valid', 'error');
    const container = mockDocument.getElementById('mycivy-toast-container');
    expect(container?.children.some((c) => c.innerHTML.includes('Format tidak valid') && c.innerHTML.includes('⚠️'))).toBe(true);
  });

  it('automatically removes toast after duration', () => {
    showToastBanner('Temporary notification', 'info', 1000);
    const container = mockDocument.getElementById('mycivy-toast-container');
    const countBefore = container?.children.length || 0;
    expect(countBefore).toBeGreaterThan(0);

    // Fast-forward past timeout and fade out
    vi.advanceTimersByTime(1400);
    expect(container?.children.length).toBe(countBefore - 1);
  });
});
