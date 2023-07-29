import { type PropsWithChildren } from "react";

export default function PageLayout({ children }: PropsWithChildren) {
  return (
    <main className="flex h-screen justify-center">
      <div className="relative w-full overflow-y-auto border-x border-slate-400 md:max-w-2xl">
        {children}
      </div>
    </main>
  );
}
