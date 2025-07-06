export interface HypaV2Data {
  lastMainChunkID: number;
  mainChunks: {
    id: number;
    text: string;
    chatMemos: Set<string>;
    lastChatMemo: string;
  }[];
  chunks: {
    mainChunkID: number;
    text: string;
  }[];
}

export interface SerializableHypaV2Data extends Omit<HypaV2Data, "mainChunks"> {
  mainChunks: {
    id: number;
    text: string;
    chatMemos: string[];
    lastChatMemo: string;
  }[];
}
