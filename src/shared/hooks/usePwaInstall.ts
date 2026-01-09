import { useEffect, useMemo, useState } from "react";

type BIPEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function usePwaInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<BIPEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    const canInstall = useMemo(
        () => !!deferredPrompt && !isInstalled,
        [deferredPrompt, isInstalled]
    );

    useEffect(() => {
        const mq = window.matchMedia?.("(display-mode: standalone)");
        const updateInstalled = () => setIsInstalled(!!mq?.matches);
        updateInstalled();

        mq?.addEventListener?.("change", updateInstalled);

        const onBeforeInstallPrompt = (e: Event) => {
            e.preventDefault(); // guardamos el prompt para dispararlo nosotros
            setDeferredPrompt(e as BIPEvent);
        };

        const onAppInstalled = () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
        };

        window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
        window.addEventListener("appinstalled", onAppInstalled);

        return () => {
            mq?.removeEventListener?.("change", updateInstalled);
            window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
            window.removeEventListener("appinstalled", onAppInstalled);
        };
    }, []);

    const install = async () => {
        if (!deferredPrompt) return null;

        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;

        // el evento solo sirve una vez
        setDeferredPrompt(null);

        return choice.outcome; // "accepted" | "dismissed"
    };

    return { canInstall, isInstalled, install };
}
