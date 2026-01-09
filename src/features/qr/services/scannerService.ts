// scannerService.ts
import { Html5Qrcode } from "html5-qrcode";

export type ScannerConfig = {
    fps?: number;
    boxSize?: number;
    camera?: "rear" | "front";
};

export class ScannerService {
    private scanner: Html5Qrcode;

    constructor(regionId: string) {
        this.scanner = new Html5Qrcode(regionId);
    }

    async start(onDecoded: (text: string) => void, config: ScannerConfig = {}) {
        const fps = config.fps ?? 10;
        const boxSize = config.boxSize ?? 280;
        const facingMode = config.camera === "front" ? "user" : "environment";

        await this.scanner.start(
            { facingMode },
            { fps, qrbox: { width: boxSize, height: boxSize } },
            onDecoded,
            () => { }
        );
    }

    async stop() {
        // ✅ Pausa: solo detener cámara
        try {
            if (this.scanner.isScanning) await this.scanner.stop();
        } catch {
            // noop
        }
    }

    async dispose() {
        // ✅ Final: detener + limpiar UI interna
        try {
            if (this.scanner.isScanning) await this.scanner.stop();
            await this.scanner.clear();
        } catch {
            // noop
        }
    }
}
