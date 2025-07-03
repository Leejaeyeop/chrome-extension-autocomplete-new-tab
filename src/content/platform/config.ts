import { Platform, SearchConfig } from "../types";

export const config: Record<Platform, SearchConfig> = {
  google: {
    selector: ".sbct:not([data-new-tab-processed])",
    containerSelector: [".eIPGRd", ".pcTkSc"],
    urlTemplate: (query: string) =>
      `https://www.google.com/search?q=${encodeURIComponent(query)}`,
  },
  youtube: {
    selector: ".ytSuggestionComponentSuggestion:not([data-new-tab-processed])",
    containerSelector: [".ytSuggestionComponentRightContainer"],
    urlTemplate: (query: string) =>
      `https://www.youtube.com/results?search_query=${encodeURIComponent(
        query
      )}`,
  },
};
