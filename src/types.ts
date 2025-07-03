// 글로벌 타입 정의
export interface SuggestionElement extends HTMLElement {
  getAttribute(name: string): string | null;
  querySelector(selector: string): Element | null;
  classList: DOMTokenList;
  setAttribute(name: string, value: string): void;
}

export type Platform = "google" | "youtube";

export interface SearchConfig {
  selector: string;
  containerSelector: string[];
  urlTemplate: (query: string) => string;
}

export interface ExtensionConfig {
  buttonClass: string;
  processedAttribute: string;
  debounceDelay: number;
}

// DOM 이벤트 타입 확장
export interface ExtendedMouseEvent extends MouseEvent {
  stopPropagation: () => void;
  preventDefault: () => void;
}

// MutationObserver 콜백 타입
export type MutationCallback = (
  mutations: MutationRecord[],
  observer: MutationObserver
) => void;
