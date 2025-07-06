export interface SerializableHypaV3Data {
  summaries: {
    text: string;
    chatMemos: string[];
    isImportant: boolean;
  }[];
  lastSelectedSummaries?: number[];
}
