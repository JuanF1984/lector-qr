import type { QrPayload } from "./qrTypes";

type Detector = {
    test: (text: string) => boolean;
    parse: (text: string) => QrPayload;
};

function normalizePhoneDigits(input: string) {
    const digits = input.replace(/\D/g, "");
    return digits.length ? digits : undefined;
}

const detectors: Detector[] = [
    {
        test: (t) => {
            try {
                const u = new URL(t);
                const host = u.hostname.replace(/^www\./, "");
                return (
                    host === "wa.me" ||
                    (host === "api.whatsapp.com" && u.pathname.startsWith("/send"))
                );
            } catch {
                return false;
            }
        },
        parse: (t) => {
            try {
                const u = new URL(t);
                const host = u.hostname.replace(/^www\./, "");

                if (host === "wa.me") {
                    const phone = normalizePhoneDigits(u.pathname.slice(1));
                    return { kind: "whatsapp", url: t, phone, raw: t };
                }

                const phone = normalizePhoneDigits(u.searchParams.get("phone") ?? "");
                return { kind: "whatsapp", url: t, phone, raw: t };
            } catch {
                return { kind: "whatsapp", url: t, raw: t };
            }
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
