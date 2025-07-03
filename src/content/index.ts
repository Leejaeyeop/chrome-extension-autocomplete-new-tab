import "./styles.css";
import SearchSuggestionNewTab from "./SearchSuggestionNewTab";
// 익스텐션 시작
let searchNewTab: SearchSuggestionNewTab | null = null;

// 페이지가 완전히 로드된 후 시작
const initializeExtension = (): void => {
  searchNewTab = new SearchSuggestionNewTab();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeExtension);
} else {
  initializeExtension();
}

// 페이지 언로드 시 정리
window.addEventListener("beforeunload", () => {
  if (searchNewTab) {
    searchNewTab.destroy();
    searchNewTab = null;
  }
});
