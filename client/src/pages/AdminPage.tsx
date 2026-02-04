import { useState } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { contractService } from "@/services/contractService";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Loader2, 
  Shield, 
  UserPlus, 
  UserCheck, 
  Wallet,
  CheckCircle2,
  XCircle,
  Crown
} from "lucide-react";

type Role = "admin" | "issuer" | "user" | null;

export default function AdminPage() {
  const { toast } = useToast();
  const { address, connect, isConnecting, isConnected } = useWallet();
  
  const [role, setRole] = useState<Role>(null);
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  const [adminAddress, setAdminAddress] = useState<string | null>(null);
  
  const [issuerAddress, setIssuerAddress] = useState("");
  const [isAddingIssuer, setIsAddingIssuer] = useState(false);

  const handleConnectWallet = async () => {
    await connect();
  };

  const handleCheckAdmin = async () => {
    try {
      const admin = await contractService.checkAdmin();
      setAdminAddress(admin);
      toast({
        title: "Admin Address",
        description: `${admin.slice(0, 10)}...${admin.slice(-8)}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCheckRole = async () => {
    setIsCheckingRole(true);
    try {
      const userRole = await contractService.checkRole();
      setRole(userRole as Role);
      toast({
        title: "Role Detected",
        description: `You are logged in as: ${userRole.toUpperCase()}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCheckingRole(false);
    }
  };

  const handleAddIssuer = async () => {
    if (!issuerAddress || !issuerAddress.startsWith("0x")) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address",
        variant: "destructive",
      });
      return;
    }

    setIsAddingIssuer(true);
    try {
      await contractService.addIssuer(issuerAddress);
      toast({
        title: "Issuer Added!",
        description: `Successfully added ${issuerAddress.slice(0, 10)}...`,
      });
      setIssuerAddress("");
    } catch (error: any) {
      toast({
        title: "Failed to Add Issuer",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAddingIssuer(false);
    }
  };

  const getRoleBadge = () => {
    if (!role) return null;
    
    const badges = {
      admin: { color: "bg-purple-500/10 text-purple-600 border-purple-500/20", icon: Crown, label: "Admin" },
      issuer: { color: "bg-blue-500/10 text-blue-600 border-blue-500/20", icon: UserCheck, label: "Issuer" },
      user: { color: "bg-gray-500/10 text-gray-600 border-gray-500/20", icon: UserPlus, label: "User" },
    };
    
    const badge = badges[role];
    const Icon = badge.icon;
    
    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${badge.color}`}>
        <Icon className="w-4 h-4" />
        <span className="font-medium">{badge.label}</span>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-140px)] w-full py-12 px-4 md:px-8 bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Shield className="w-4 h-4" />
            <span>Admin Panel</span>
          </div>
          <h1 className="text-4xl font-display font-bold mb-4 text-foreground">
            Contract <span className="text-gradient">Administration</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Manage roles and permissions for the CertifyChain smart contract.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Wallet Connection Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold">Wallet Connection</h2>
              </div>
              
              {isConnected && address ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-700">Connected</p>
                      <p className="text-xs font-mono text-green-600/80">
                        {address.slice(0, 10)}...{address.slice(-8)}
                      </p>
                    </div>
                  </div>
                  
                  {getRoleBadge()}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <XCircle className="w-5 h-5 text-yellow-600" />
                    <p className="text-sm text-yellow-700">Wallet not connected</p>
                  </div>
                  
                  <Button 
                    onClick={handleConnectWallet} 
                    disabled={isConnecting}
                    className="w-full"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4 mr-2" />
                        Connect Wallet
                      </>
                    )}
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Role Check Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-accent/10">
                  <UserCheck className="w-5 h-5 text-accent" />
                </div>
                <h2 className="text-lg font-semibold">Role Management</h2>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={handleCheckRole} 
                  disabled={isCheckingRole || !isConnected}
                  variant="outline"
                  className="w-full"
                >
                  {isCheckingRole ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Check My Role
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleCheckAdmin} 
                  disabled={!isConnected}
                  variant="outline"
                  className="w-full"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Check Admin Address
                </Button>
                
                {adminAddress && (
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Contract Admin:</p>
                    <p className="text-sm font-mono break-all">{adminAddress}</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Add Issuer Card - Full Width */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2"
          >
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <UserPlus className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Add New Issuer</h2>
                  <p className="text-sm text-muted-foreground">Only admin can add new issuers</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="0xABC123..."
                  value={issuerAddress}
                  onChange={(e) => setIssuerAddress(e.target.value)}
                  className="flex-1 font-mono"
                  disabled={role !== "admin"}
                />
                <Button 
                  onClick={handleAddIssuer}
                  disabled={isAddingIssuer || !issuerAddress || role !== "admin"}
                  className="sm:w-auto"
                >
                  {isAddingIssuer ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Issuer
                    </>
                  )}
                </Button>
              </div>
              
              {role && role !== "admin" && (
                <p className="text-sm text-destructive mt-3">
                  ⚠️ Only the contract admin can add new issuers.
                </p>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
