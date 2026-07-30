import Link from "next/link";

import { Logo } from "@/components/shared/logo";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-10 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <Logo />
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Level Line. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#faq" className="hover:text-foreground transition-colors">
            FAQ
          </a>
          <Link href="/test" className="hover:text-foreground transition-colors">
            Start Test
          </Link>
          <Link href="/admin/login" className="hover:text-foreground transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
