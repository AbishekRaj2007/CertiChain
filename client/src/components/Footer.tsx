import { Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/20 py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} CertifyChain. All rights reserved.</span>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent-foreground text-xs font-mono font-medium">
          <Terminal className="w-3 h-3" />
          <span>Running on Sepolia Testnet</span>
        </div>
      </div>
    </footer>
  );
}
