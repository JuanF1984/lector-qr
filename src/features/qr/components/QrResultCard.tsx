import type { QrPayload } from "../domain/qrTypes";
import { Card } from "../../../shared/ui/Card";

export function QrResultCard({ payload }: { payload: QrPayload | null }) {
    if (!payload) {
        return (
            <Card>
                <p className="text-slate-300">Sin lectura aún.</p>
            </Card>
        );
    }

    return (
        <Card>
            <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Tipo</span>
                <span className="rounded-lg bg-slate-800 px-2 py-1 text-sm">
                    {payload.kind.toUpperCase()}
                </span>
            </div>

            <div className="mt-3">{renderBody(payload)}</div>
        </Card>
    );
}

function renderBody(payload: QrPayload) {
    switch (payload.kind) {
        case "url":
            return (
                <div className="space-y-2">
                    <p className="wrap-break-word">{payload.url}</p>
                    <a
                        className="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 font-medium"
                        href={payload.url}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Abrir link
                    </a>
                </div>
            );

        case "whatsapp":
            return (
                <div className="space-y-2">
                    <p className="wrap-break-word">{payload.url}</p>

                    <a
                        className="inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 font-medium"
                        href={payload.url}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Abrir WhatsApp
                    </a>

                    {payload.phone ? (
                        <p className="text-xs text-slate-400">Tel: {payload.phone}</p>
                    ) : null}
                </div>
            );

        case "json":
            return (
                <pre className="rounded-xl bg-slate-950/60 p-3 text-xs overflow-auto">
                    {JSON.stringify(payload.value, null, 2)}
                </pre>
            );

        case "text":
            return <p className="wrap-break-word">{payload.text}</p>;

        case "wifi":
            return <p className="wrap-break-word">{payload.raw}</p>;

        case "email":
            return <p className="wrap-break-word">{payload.raw}</p>;

        case "phone":
            return <p className="wrap-break-word">{payload.raw}</p>;

        case "geo":
            return <p className="wrap-break-word">{payload.raw}</p>;

        default: {
            const _exhaustive: never = payload;
            return _exhaustive;
        }
    }
}

