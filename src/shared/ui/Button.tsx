import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "install";
};

export function Button({ variant = "primary", className = "", ...props }: Props) {
    const base =
        "rounded-xl px-4 py-3 font-medium transition active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed";
    const styles =
        variant === "install"
            ? "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white"
            : variant === "secondary"
                ? "bg-slate-800 hover:bg-slate-700 text-white"
                : "bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white";

    return <button className={`${base} ${styles} ${className}`} {...props} />;
}
