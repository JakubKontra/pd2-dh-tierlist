export type MercActLabel = "Act 1" | "Act 2" | "Act 3" | "Act 4" | "Act 5";

export interface MercSlot {
  mercTypes: string[];
  items: string[];
  sameAsOffensive?: boolean;
  notApplicable?: boolean;
}

export interface MercBuildRow {
  name: string;
  offensive: MercSlot;
  defensive: MercSlot;
  starter: MercSlot;
}

export interface ActPriority {
  act: MercActLabel;
  lines: string[];
}

export interface MercGuideData {
  builds: MercBuildRow[];
  priorities: ActPriority[];
  fetchedAt: number;
}
