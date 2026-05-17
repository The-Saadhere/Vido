import Link from "next/link";
import { Github, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer
      className="border-t border-white/[0.06] bg-[#0a0a0a] text-white"
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-8 items-start">

          {/* Brand */}
          <div>
            <Link href="/">
              <span
                className="text-white font-black text-2xl"
                style={{ letterSpacing: "-0.05em" }}
              >
                vido
              </span>
            </Link>
            <p className="text-xs text-white/25 font-mono mt-2 max-w-[200px] leading-relaxed">
              Upload, share, and watch videos — all in one place.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/30 hover:text-white hover:bg-white/[0.08] transition-all"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/30 hover:text-white hover:bg-white/[0.08] transition-all"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/30 hover:text-white hover:bg-white/[0.08] transition-all"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Links — Product */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25 mb-3">
              Product
            </p>
            <ul className="flex flex-col gap-2">
              {[
                { label: "Home", href: "/" },
                { label: "Upload", href: "/upload" },
                { label: "Sign In", href: "/signIn" },
                { label: "Sign Up", href: "/signUp" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/35 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links — Legal */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/25 mb-3">
              Legal
            </p>
            <ul className="flex flex-col gap-2">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Cookie Policy", href: "/cookies" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/35 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/15 font-mono">
            © {new Date().getFullYear()} vido. All rights reserved.
          </p>
          <p className="text-[11px] text-white/10 font-mono">
            built with next.js · imagekit · mongodb
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;