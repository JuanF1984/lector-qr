import type { QrPayload } from "./qrTypes";

type Detector = {
    test: (text: string) => boolean;
    parse: (text: string) => QrPayload;
};

function digitsOnly(input: string) {
    return input.replace(/\D/g, "");
}

function isLikelyPhoneNumber(text: string) {
    const d = digitsOnly(text);
    return d.length >= 10 && d.length <= 15;
}

function toWaMeUrl(phoneDigits: string, message?: string) {
    const base = `https://wa.me/${phoneDigits}`;
    if (!message) return base;
    return `${base}?text=${encodeURIComponent(message)}`;
}

const detectors: Detector[] = [
  {
        test: (t) => {
            if (t.startsWith("whatsapp://send")) return true;

            try {
                const u = new URL(t);
                const host = u.hostname.replace(/^www\./, "");
                return (
                    host === "wa.me" ||
                    (host === "api.whatsapp.com" && u.pathname.startsWith("/send")) ||
                    (host === "whatsapp.com" && u.pathname.startsWith("/send"))
                );
            } catch {
                return false;
            }
        },
        parse: (t) => {
            if (t.startsWith("whatsapp://send")) {
                try {
                    const u = new URL(t);
                    const phone = digitsOnly(u.searchParams.get("phone") ?? "");
                    const url = phone ? toWaMeUrl(phone) : t;
                    return { kind: "whatsapp", url, phone: phone || undefined, raw: t };
                } catch {
                    return { kind: "whatsapp", url: t, raw: t };
                }
            }

            try {
                const u = new URL(t);
                const host = u.hostname.replace(/^www\./, "");

                if (host === "wa.me") {
                    const phone = digitsOnly(u.pathname.slice(1));
                    const url = phone ? toWaMeUrl(phone) : t;
                    return { kind: "whatsapp", url, phone: phone || undefined, raw: t };
                }

                const phone = digitsOnly(u.searchParams.get("phone") ?? "");
                const url = phone ? toWaMeUrl(phone) : t;
                return { kind: "whatsapp", url, phone: phone || undefined, raw: t };
            } catch {
                return { kind: "whatsapp", url: t, raw: t };
            }
        },
    },

    {
        test: (t) => isLikelyPhoneNumber(t),
        parse: (t) => {
            const phone = digitsOnly(t);
            return { kind: "whatsapp", url: toWaMeUrl(phone), phone, raw: t };
        },
    },

    {
        test: (t) => /^https?:\/\//i.test(t),
        parse: (t) => ({ kind: "url", url: t }),
    },
    {
        test: (t) => t.startsWith("WIFI:"),
        parse: (t) => ({ kind: "wifi", raw: t }),
    },
    {
        test: (t) => t.startsWith("mailto:"),
        parse: (t) => ({ kind: "email", to: t.slice(7), raw: t }),
    },
    {
        test: (t) => t.startsWith("tel:"),
        parse: (t) => ({ kind: "phone", phone: t.slice(4), raw: t }),
    },
    {
        test: (t) => t.startsWith("geo:"),
        parse: (t) => ({ kind: "geo", raw: t }),
    },
];

export function parseQr(raw: string): QrPayload {
    const text = (raw ?? "").trim();
    if (!text) return { kind: "text", text: "" };

    const detector = detectors.find((d) => d.test(text));
    if (detector) return detector.parse(text);

    try {
        return { kind: "json", value: JSON.parse(text), raw: text };
    } catch {
        return { kind: "text", text };
    }
}

