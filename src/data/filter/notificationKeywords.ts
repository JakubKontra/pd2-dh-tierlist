// Notification / minimap keywords: %BORDER-XX%, %MAP-XX%, %DOT-XX%, %PX-XX%, %SOUNDID-N%, %NOTIFY-X%, %TIER-N%
// Size order (largest→smallest icon): BORDER > MAP > DOT > PX

export type NotifKind = "BORDER" | "MAP" | "DOT" | "PX" | "SOUNDID" | "NOTIFY" | "TIER";

export const NOTIF_KINDS: Array<{ kind: NotifKind; label: string; paramLabel: string }> = [
  { kind: "BORDER",  label: "Border (large icon)",    paramLabel: "2-digit hex color" },
  { kind: "MAP",     label: "Map (medium icon)",       paramLabel: "optional 2-digit hex color" },
  { kind: "DOT",     label: "Dot (small icon)",       paramLabel: "2-digit hex color" },
  { kind: "PX",      label: "Pixel (tiny icon)",      paramLabel: "2-digit hex color" },
  { kind: "SOUNDID", label: "Drop sound",             paramLabel: "sound index (sounds.txt; 4714-4729 are PoE-style)" },
  { kind: "NOTIFY",  label: "Notification (legacy)",  paramLabel: "1-digit color code 0-F, or DEAD" },
  { kind: "TIER",    label: "Filter strictness gate", paramLabel: "0..12" },
];
