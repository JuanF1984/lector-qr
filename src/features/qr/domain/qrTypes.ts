export type QrKind = "url" | "wifi" | "email" | "phone" | "geo" | "json" |"whatsapp"| "text";

export type QrPayload =
    | { kind: "url"; url: string }
    | { kind: "wifi"; raw: string }
    | { kind: "email"; to: string; raw: string }
    | { kind: "phone"; phone: string; raw: string }
    | { kind: "geo"; raw: string }
    | { kind: "json"; value: unknown; raw: string }
    | { kind: "whatsapp"; url: string; phone?: string ; raw: string }
    | { kind: "text"; text: string };
