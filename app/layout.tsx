import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: { default: "Writing", template: "%s · Writing" },
  description: "A blog.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-10 px-6 py-10">
            <header className="flex items-baseline justify-between border-b border-border pb-5">
              <Link href="/" className="text-lg font-semibold tracking-tight no-underline">
                Writing
              </Link>
              <span className="text-sm text-muted-foreground">Notes and essays</span>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-border pt-5 text-sm text-muted-foreground">
              Built with Next.js.
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
