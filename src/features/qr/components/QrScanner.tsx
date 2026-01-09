import { useState } from "react";
import { useQrScanner } from "../hooks/useQrScanner";
import { usePwaInstall } from "../../../shared/hooks/usePwaInstall";
import { useIsIos } from "../../../shared/hooks/useIsIos";
import { QrResultCard } from "./QrResultCard";
import { Button } from "../../../shared/ui/Button";
import { Card } from "../../../shared/ui/Card";
import { Toast } from "../../../shared/ui/Toast";

export function QrScanner() {
    const { regionId, status, error, payload, start, stop } = useQrScanner();
    const { canInstall, isInstalled, install } = usePwaInstall();
    const isIos = useIsIos();
    const [toast, setToast] = useState<string>("");

    return (
        <div className="min-h-dvh bg-slate-950 text-slate-100 p-4">
            <div className="mx-auto max-w-xl space-y-4">
                <header className="space-y-1">
                    <h1 className="text-xl font-semibold">Lector QR</h1>
                    <p className="text-sm text-slate-300">
                        Se pausa automáticamente cuando detecta un QR.
                    </p>
                </header>

                {!isInstalled && canInstall ? (
                    <button
                        className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-3 font-medium"
                        onClick={async () => {
                            const outcome = await install();
                            if (outcome === "accepted") setToast("Instalada ✅");
                            else if (outcome === "dismissed") setToast("Instalación cancelada");
                            if (outcome) setTimeout(() => setToast(""), 2000);
                        }}
                    >
                        Instalar app
                    </button>
                ) : null}

                {!isInstalled && !canInstall && isIos ? (
                    <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-3 text-sm text-slate-200">
                        En iPhone: tocá <span className="font-semibold">Compartir</span> →{" "}
                        <span className="font-semibold">Agregar a inicio</span>.
                    </div>
                ) : null}

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
            {toast ? <Toast text={toast} /> : null}
        </div>
    );
}
