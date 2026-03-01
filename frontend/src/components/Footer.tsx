export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'ip-global-terminal');

  return (
    <footer className="border-t border-border bg-navy py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/ipgt-logo.dim_128x128.png"
              alt="IPGT"
              className="w-8 h-8 rounded-sm object-cover opacity-80"
            />
            <div>
              <div className="font-serif font-bold text-sm gold-text">IP Global Terminal</div>
              <div className="text-xs text-muted-foreground">Securing Intellectual Property on the Blockchain</div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
            <div>© {year} IP Global Terminal. All rights reserved.</div>
            <div className="flex items-center gap-1">
              Built with{' '}
              <span style={{ color: 'oklch(0.78 0.14 85)' }}>♥</span>
              {' '}using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: 'oklch(0.78 0.14 85)' }}
              >
                caffeine.ai
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Powered by ICP</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>IPGT Blockchain</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
