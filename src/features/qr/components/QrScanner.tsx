import { useQrScanner } from "../hooks/useQrScanner";
import { QrResultCard } from "./QrResultCard";
import { Button } from "../../../shared/ui/Button";
import { Card } from "../../../shared/ui/Card";

export function QrScanner() {
    const { regionId, status, error, payload, start, stop } = useQrScanner();

    return (
        <div className="min-h-dvh bg-slate-950 text-slate-100 p-4">
            <div className="mx-auto max-w-xl space-y-4">
                <header className="space-y-1">
                    <h1 className="text-xl font-semibold">Lector QR</h1>
                    <p className="text-sm text-slate-300">
                        Se pausa automáticamente cuando detecta un QR.
                    </p>
                </header>

                {status === "scanning" ? (
                    <Card>
                        <div id={regionId} className="w-full" />
                        <p className="mt-3 text-xs text-slate-400">
                            Tip: mejor luz y el QR dentro del recuadro.
                        </p>
                    </Card>
                ) : (
                    <QrResultCard payload={payload} />
                )}

                {error ? (
                    <div className="rounded-xl bg-red-900/30 border border-red-700 p-3 text-sm">
                        {error}
                    </div>
                ) : null}

                <div className="flex gap-2">
                    <Button className="flex-1" onClick={start} disabled={status === "scanning"}>
                        Escanear otro
                    </Button>
                    <Button variant="secondary" onClick={stop}>
                        Pausar
                    </Button>
                </div>
            </div>
        </div>
    );
}
