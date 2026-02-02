import { useState } from "react";
import { useVerifyCertificate } from "@/hooks/use-certificates";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Search, Loader2, Award, Calendar, User, Link as LinkIcon, AlertCircle } from "lucide-react";

export default function VerifyPage() {
  const [certId, setCertId] = useState("");
  const verifyMutation = useVerifyCertificate();
  const [hasSearched, setHasSearched] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    setHasSearched(true);
    verifyMutation.mutate(certId);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] w-full py-16 px-4 flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20">
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mb-12"
      >
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
          <Search className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-display font-bold mb-4">Verify a Certificate</h1>
        <p className="text-muted-foreground text-lg">
          Enter the unique certificate ID to instantly verify its authenticity on the Ethereum blockchain.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-xl"
      >
        <form onSubmit={handleVerify} className="relative flex items-center mb-12">
          <Input 
            className="h-14 pl-6 pr-32 text-lg rounded-full shadow-lg border-2 border-transparent focus:border-primary/50 transition-all"
            placeholder="Enter Certificate ID..."
            value={certId}
            onChange={(e) => setCertId(e.target.value)}
          />
          <Button 
            type="submit" 
            size="lg" 
            className="absolute right-1.5 h-11 rounded-full px-8 shadow-md"
            disabled={verifyMutation.isPending || !certId.trim()}
          >
            {verifyMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Verify"
            )}
          </Button>
        </form>

        <AnimatePresence mode="wait">
          {verifyMutation.isError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 rounded-xl bg-destructive/5 border border-destructive/20 text-center"
            >
              <div className="inline-flex p-3 rounded-full bg-destructive/10 text-destructive mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-destructive mb-1">Verification Failed</h3>
              <p className="text-muted-foreground">
                We couldn't find a certificate with ID "{certId}" on the blockchain.
              </p>
            </motion.div>
          )}

          {verifyMutation.isSuccess && verifyMutation.data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="glass-card border-t-4 border-t-primary overflow-hidden relative">
                {/* Decorative background pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full -z-10" />

                <div className="p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Certificate of Completion</h2>
                      <h3 className="text-3xl font-display font-bold text-foreground">{verifyMutation.data.courseName}</h3>
                    </div>
                    <StatusBadge isValid={verifyMutation.data.isValid} className="px-4 py-1.5" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-secondary rounded-lg">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Awarded To</p>
                        <p className="text-lg font-semibold">{verifyMutation.data.studentName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-secondary rounded-lg">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">Issued On</p>
                        <p className="text-lg font-semibold">{verifyMutation.data.timestamp}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-dashed">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Award className="w-4 h-4" /> Issuer Address
                      </span>
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {verifyMutation.data.issuer}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <LinkIcon className="w-4 h-4" /> IPFS Hash
                      </span>
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded truncate max-w-[200px]">
                        {verifyMutation.data.ipfsHash}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
