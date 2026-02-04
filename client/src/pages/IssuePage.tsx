import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useIssueCertificate } from "@/hooks/use-certificates";
import { useWallet } from "@/hooks/use-wallet";
import { insertCertificateSchema } from "@/lib/schema";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, FileCheck, UploadCloud, GraduationCap, User, Hash } from "lucide-react";

// Extend the schema for the form
const formSchema = insertCertificateSchema.extend({
  certificateId: z.string().min(3, "Certificate ID must be at least 3 chars"),
  studentName: z.string().min(2, "Name must be valid"),
  courseName: z.string().min(3, "Course name is required"),
  ipfsHash: z.string().min(10, "Valid IPFS hash required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function IssuePage() {
  const { toast } = useToast();
  const { address, connect } = useWallet();
  const issueMutation = useIssueCertificate();
  const [successTx, setSuccessTx] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      certificateId: "",
      studentName: "",
      courseName: "",
      ipfsHash: "",
      issuerAddress: "0x0", // Will be overwritten by contract service
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to issue certificates.",
        variant: "destructive",
      });
      connect();
      return;
    }

    // Set issuer address to current wallet
    data.issuerAddress = address;

    issueMutation.mutate(data, {
      onSuccess: (result) => {
        setSuccessTx(result.txHash);
        toast({
          title: "Certificate Issued!",
          description: "Transaction submitted to the blockchain successfully.",
        });
        form.reset();
      },
      onError: (error) => {
        toast({
          title: "Issuance Failed",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-[calc(100vh-140px)] w-full py-12 px-4 md:px-8 bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left: Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <UploadCloud className="w-4 h-4" />
            <span>Immutable Records</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-foreground leading-tight">
            Issue Verifiable <br />
            <span className="text-gradient">Blockchain Certificates</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Create tamper-proof credentials for your students. Every certificate is secured on the Ethereum Sepolia network and verified instantly.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-card border shadow-sm">
              <h3 className="font-bold text-2xl text-primary mb-1">100%</h3>
              <p className="text-sm text-muted-foreground">Digital & Secure</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-card border shadow-sm">
              <h3 className="font-bold text-2xl text-accent mb-1">Global</h3>
              <p className="text-sm text-muted-foreground">Instant Verification</p>
            </div>
          </div>
        </motion.div>

        {/* Right: Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-card p-6 md:p-8 relative overflow-hidden">
            {issueMutation.isPending && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="font-medium text-foreground">Confirming Transaction...</p>
                <p className="text-sm text-muted-foreground mt-1">Please confirm in MetaMask</p>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-primary" />
                Certificate Details
              </h2>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                
                <FormField
                  control={form.control}
                  name="certificateId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificate ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Hash className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input placeholder="CERT-2024-001" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="studentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Alex Johnson" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="courseName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <Input placeholder="Blockchain 101" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="ipfsHash"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IPFS Hash (Metadata)</FormLabel>
                      <FormControl>
                        <Input placeholder="QmXyZ..." className="font-mono text-sm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-medium shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all mt-2"
                  disabled={issueMutation.isPending}
                >
                  {issueMutation.isPending ? "Issuing..." : "Issue Certificate"}
                </Button>
              </form>
            </Form>

            {successTx && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-700">Issued Successfully</h4>
                    <p className="text-xs text-green-600/80 mt-1 break-all font-mono">
                      Tx: {successTx}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Icon for success message
import { CheckCircle2 } from "lucide-react";
