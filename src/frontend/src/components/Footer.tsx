import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "ipgt-app",
  );

  return (
    <footer className="bg-black border-t border-gold-800/30 text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-gold-400" />
              <span className="font-serif text-lg font-bold text-white">
                IPGT
              </span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              Global Intellectual Property Registry — securing innovation on the
              blockchain.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Platform
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-gold-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-gold-400 transition-colors"
                >
                  Register IP
                </Link>
              </li>
              <li>
                <Link
                  to="/database"
                  className="hover:text-gold-400 transition-colors"
                >
                  IP Database
                </Link>
              </li>
              <li>
                <Link
                  to="/whitepaper"
                  className="hover:text-gold-400 transition-colors"
                >
                  Whitepaper
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Features
            </h3>
            <ul className="space-y-2 text-sm">
              <li>Blockchain Registration</li>
              <li>SHA-256 Document Hashing</li>
              <li>Global IP Search</li>
              <li>On-Chain Verification</li>
              <li>Multi-Jurisdiction Support</li>
              <li>Immutable Timestamping</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Disclaimer</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gold-800/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>© {year} IPGT — Global IP Registry. All rights reserved.</span>
          <span>
            Built with <span className="text-gold-400">♥</span> using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-400 hover:text-gold-300 transition-colors"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
