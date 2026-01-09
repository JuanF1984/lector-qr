import { useEffect, useMemo, useState } from "react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type InstalledRelatedApp = {
  platform?: string;
  url?: string;
  id?: string;
};

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BIPEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const canInstall = useMemo(
    () => !!deferredPrompt && !isInstalled,
    [deferredPrompt, isInstalled]
  );

  useEffect(() => {
    let isMounted = true;

    const mq = window.matchMedia?.("(display-mode: standalone)");

    const checkInstalledState = async () => {
      const standalone = !!mq?.matches;

      const navAny = navigator as any;
      const iosStandalone = !!navAny?.standalone;

      let relatedInstalled = false;
      if (typeof navAny?.getInstalledRelatedApps === "function") {
        try {
          const apps = (await navAny.getInstalledRelatedApps()) as InstalledRelatedApp[];
          relatedInstalled = Array.isArray(apps) && apps.length > 0;
        } catch (e){
            console.error("Error checking installed related apps", e);
        }
      }

      if (isMounted) {
        const installed = standalone || iosStandalone || relatedInstalled;
        setIsInstalled(installed);
        if (installed) setDeferredPrompt(null);
      }
    };

    const updateInstalled = () => {
      checkInstalledState();
    };

    checkInstalledState();
    mq?.addEventListener?.("change", updateInstalled);

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      if (!isInstalled) setDeferredPrompt(e as BIPEvent);
    };

    const onAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      isMounted = false;
      mq?.removeEventListener?.("change", updateInstalled);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, [isInstalled]);

  const install = async () => {
    if (!deferredPrompt) return null;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    setDeferredPrompt(null);

    if (choice.outcome === "accepted") setIsInstalled(true);

    return choice.outcome;
  };

  return { canInstall, isInstalled, install };
}
