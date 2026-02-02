import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertCertificate } from "@shared/routes";
import { contractService } from "@/services/contractService";

// Hook to fetch certificates from our local DB (optional analytics/history)
export function useCertificates() {
  return useQuery({
    queryKey: [api.certificates.list.path],
    queryFn: async () => {
      const res = await fetch(api.certificates.list.path);
      if (!res.ok) throw new Error("Failed to fetch certificates");
      return api.certificates.list.responses[200].parse(await res.json());
    },
  });
}

// Hook to issue a certificate via Blockchain AND sync to local DB
export function useIssueCertificate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertCertificate) => {
      // 1. Issue on Blockchain
      const tx = await contractService.issueCertificate(
        data.certificateId,
        data.studentName,
        data.courseName,
        data.ipfsHash
      );
      
      // Wait for confirmation
      await tx.wait();
      
      // 2. Sync to local DB for indexing/searchability (optional but good practice)
      const res = await fetch(api.certificates.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          transactionHash: tx.hash
        }),
      });

      if (!res.ok) {
        // Even if DB sync fails, the blockchain transaction succeeded.
        // We log it but don't block the UI success state strictly on DB.
        console.error("Failed to sync to local DB");
      }
      
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.certificates.list.path] });
    },
  });
}

// Hook to verify a certificate directly from Blockchain
export function useVerifyCertificate() {
  return useMutation({
    mutationFn: async (certificateId: string) => {
      const result = await contractService.verifyCertificate(certificateId);
      if (!result) throw new Error("Certificate not found on chain");
      return result;
    }
  });
}
