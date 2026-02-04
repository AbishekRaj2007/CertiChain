import { Link, useLocation } from "wouter";
import { ShieldCheck, Search, PlusCircle, Wallet, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navigation() {
  const [location] = useLocation();
  const { address, connect, disconnect, isConnecting, isConnected } = useWallet();

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="bg-gradient-to-tr from-primary to-accent p-2 rounded-lg shadow-lg group-hover:shadow-primary/25 transition-all">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">
            CertifyChain
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-1">
            <Link href="/">
              <Button 
                variant={isActive("/") ? "secondary" : "ghost"}
                className={`gap-2 ${isActive("/") ? "bg-secondary/80 font-semibold" : "text-muted-foreground"}`}
              >
                <PlusCircle className="w-4 h-4" />
                Issue
              </Button>
            </Link>
            <Link href="/verify">
              <Button 
                variant={isActive("/verify") ? "secondary" : "ghost"}
                className={`gap-2 ${isActive("/verify") ? "bg-secondary/80 font-semibold" : "text-muted-foreground"}`}
              >
                <Search className="w-4 h-4" />
                Verify
              </Button>
            </Link>
            <Link href="/admin">
              <Button 
                variant={isActive("/admin") ? "secondary" : "ghost"}
                className={`gap-2 ${isActive("/admin") ? "bg-secondary/80 font-semibold" : "text-muted-foreground"}`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Button>
            </Link>
          </div>

          <div className="h-6 w-px bg-border hidden md:block" />

          {isConnected && address ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50 hover:bg-secondary/70 transition-colors cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono text-sm font-medium text-foreground truncate max-w-[120px]">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onClick={() => navigator.clipboard.writeText(address)}
                  className="cursor-pointer"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Copy Address
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={disconnect}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              onClick={connect} 
              disabled={isConnecting}
              className="bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
