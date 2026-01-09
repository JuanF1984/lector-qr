import { useEffect, useMemo, useRef, useState } from "react";
import type { QrPayload } from "../domain/qrTypes";
import { parseQr } from "../domain/parseQr";
import { ScannerService } from "../services/scannerService";

type Status = "scanning" | "paused" | "error";

export function useQrScanner() {
    const regionId = useMemo(
        () => `qr-region-${crypto?.randomUUID?.() ?? Math.random().toString(16).slice(2)}`,
        []
    );

    const serviceRef = useRef<ScannerService | null>(null);
    const busyRef = useRef(false);

    const [status, setStatus] = useState<Status>("scanning");
    const [error, setError] = useState<string>("");
    const [payload, setPayload] = useState<QrPayload | null>(null);

    const stop = async () => {
        await serviceRef.current?.stop();
        setStatus("paused");
    };

    const start = async () => {
        setError("");
        setPayload(null);
        setStatus("scanning");

        try {
            serviceRef.current ??= new ScannerService(regionId);

            await serviceRef.current.start(async (decodedText) => {
                // Evita disparos múltiples
                if (busyRef.current) return;
                busyRef.current = true;

                // Pausar escaneo al leer
                await serviceRef.current?.stop();

                setPayload(parseQr(decodedText));
                setStatus("paused");

                if (navigator.vibrate) navigator.vibrate(60);

                busyRef.current = false;
            });
        } catch (e) {
            console.error(e);
            setStatus("error");
            setError("No pude abrir la cámara. Revisá permisos y que esté en HTTPS.");
            busyRef.current = false;
        }
    };

    useEffect(() => {
        start();
        return () => {
            serviceRef.current?.stop();
        };
    }, []);

    return { regionId, status, error, payload, start, stop };
}
