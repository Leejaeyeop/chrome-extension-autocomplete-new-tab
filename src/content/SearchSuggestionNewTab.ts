import { config } from "./platform/config";
import { Platform, SuggestionElement } from "./types";

// 자동완성 항목에 새 탭 버튼 추가
export default class SearchSuggestionNewTab {
  private observer: MutationObserver | null = null;
  private processedElements: WeakSet<Element> = new WeakSet();

  constructor() {
    this.init();
  }

  private init(): void {
    // 페이지 로드 시 초기 처리
    this.processSuggestions();

    // DOM 변화 감지 (자동완성이 동적으로 생성되므로)
    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      let shouldProcess = false;

      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              // 자동완성 관련 요소가 추가되었는지 확인
              if (element.classList && this.isRelevantElement(element)) {
                shouldProcess = true;
              }
            }
          });
        }
      });

      if (shouldProcess) {
        // 짧은 지연 후 처리 (DOM이 완전히 렌더링되도록)
        setTimeout(() => this.processSuggestions(), 50);
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  private isRelevantElement(element: Element): boolean {
    return (
      // Google 자동완성
      element.classList.contains("sbct") ||
      element.querySelector(".sbct") !== null ||
      // YouTube 자동완성 (새로운 구조)
      element.classList.contains("ytSuggestionComponentSuggestion") ||
      element.querySelector(".ytSuggestionComponentSuggestion") !== null
    );
  }

  private processSuggestions(): void {
    // 현재 도메인 확인
    const isYoutube = window.location.hostname.includes("youtube.com");
    const isGoogle = window.location.hostname.includes("google.com");

    if (isGoogle) {
      this.processGoogleSuggestions();
    } else if (isYoutube) {
      this.processYoutubeSuggestions();
    }
  }

  private processGoogleSuggestions(): void {
    const suggestions = document.querySelectorAll(
      config.google.selector
    ) as NodeListOf<SuggestionElement>;

    suggestions.forEach((item) => {
      if (item.attributes.getNamedItem("data-entityname"))
        this.addNewTabButton(item, "google");
    });
  }

  private processYoutubeSuggestions(): void {
    const suggestions = document.querySelectorAll(
      config.youtube.selector
    ) as NodeListOf<SuggestionElement>;

    suggestions.forEach((item) => this.addNewTabButton(item, "youtube"));
  }

  private addNewTabButton(
    suggestionElement: SuggestionElement,
    platform: Platform
  ): void {
    if (this.processedElements.has(suggestionElement)) {
      return;
    }

    suggestionElement.setAttribute("data-new-tab-processed", "true");
    this.processedElements.add(suggestionElement);

    const newTabButton = this.createNewTabButton(suggestionElement, platform);

    const targetContainer = this.findTargetContainer(
      suggestionElement,
      platform
    );
    if (targetContainer) {
      this.appendButtonToContainer(targetContainer, newTabButton);
    }
  }

  private extractAriaLabel(element: SuggestionElement): string | null {
    return (
      element.getAttribute("aria-label") ||
      element.querySelector("[aria-label]")?.getAttribute("aria-label") ||
      null
    );
  }

  private createNewTabButton(
    suggestionElement: SuggestionElement,
    platform: Platform
  ): HTMLDivElement {
    const newTabButton = document.createElement("div");
    newTabButton.className = "search-new-tab-btn";
    newTabButton.innerHTML = "↗️";
    newTabButton.title = `Search in new tab`;

    // 클릭 시 동적으로 ariaLabel 추출
    const handleClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      const ariaLabel = this.extractAriaLabel(suggestionElement);
      if (!ariaLabel) return;

      const searchUrl = config[platform].urlTemplate(ariaLabel);
      // ✅ 크롬 확장 전용 API로 새 탭을 백그라운드로 열기
      // 백그라운드 스크립트로 새 탭 열기 요청 메시지를 보냅니다.
      chrome.runtime.sendMessage({
        action: "openNewTab",
        url: searchUrl,
        active: false,
      });
    };

    newTabButton.addEventListener("mousedown", handleClick, true);

    newTabButton.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      },
      false
    );

    return newTabButton;
  }

  private findTargetContainer(
    suggestionElement: SuggestionElement,
    platform: Platform
  ): HTMLElement | null {
    const containerSelectors = config[platform].containerSelector;

    for (const selector of containerSelectors) {
      const container = suggestionElement.querySelector(
        selector
      ) as HTMLElement;
      if (container) {
        return container;
      }
    }

    return suggestionElement as HTMLElement;
  }

  private appendButtonToContainer(
    container: HTMLElement,
    button: HTMLDivElement
  ): void {
    container.style.position = "relative";

    // 부모 요소의 클릭 이벤트도 방지
    container.addEventListener(
      "click",
      (e: Event) => {
        if (e.target === button || button.contains(e.target as Node)) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return false;
        }
      },
      true
    );
    container.appendChild(button);
  }

  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
