import Link from "next/link";
import { Github, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-[#e8e8e8] bg-white">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-10 items-start">

          <div>
            <Link href="/">
              <span className="text-[#111] font-semibold text-xl tracking-tight">
                vido
              </span>
            </Link>
            <p className="text-sm text-[#999] mt-3 max-w-[220px] leading-relaxed">
              Upload, share, and watch videos — all in one place.
            </p>

            <div className="flex items-center gap-2 mt-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f5f5f5] text-[#999] hover:text-[#111] hover:bg-[#eee] transition-all duration-200"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f5f5f5] text-[#999] hover:text-[#111] hover:bg-[#eee] transition-all duration-200"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-[#f5f5f5] text-[#999] hover:text-[#111] hover:bg-[#eee] transition-all duration-200"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-4">
              Product
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Home", href: "/" },
                { label: "Upload", href: "/upload-video" },
                { label: "Sign In", href: "/signIn" },
                { label: "Sign Up", href: "/signUp" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#666] hover:text-[#111] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold text-[#999] uppercase tracking-wider mb-4">
              Legal
            </p>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Cookie Policy", href: "/cookies" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#666] hover:text-[#111] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-[#e8e8e8] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#bbb]">
            © {new Date().getFullYear()} vido. All rights reserved.
          </p>
          <p className="text-xs text-[#bbb]">
            built with next.js · imagekit · mongodb
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
