import type { PropsWithChildren } from "react";

export function Card({ children }: PropsWithChildren) {
    return <div className="rounded-2xl bg-slate-900/60 p-4 shadow">{children}</div>;
}
