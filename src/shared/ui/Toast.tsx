export function Toast({ text }: { text: string }) {
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
            <div className="rounded-xl bg-slate-800/95 border border-slate-700 px-4 py-2 text-sm text-white shadow">
                {text}
            </div>
        </div>
    );
}
