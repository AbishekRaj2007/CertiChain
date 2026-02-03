import { useMutation } from "@tanstack/react-query";
import { contractService } from "@/services/contractService";
import type { InsertCertificate } from "@/lib/schema";

// Hook to issue a certificate via Blockchain only (no backend needed)
export function useIssueCertificate() {
  return useMutation({
    mutationFn: async (data: InsertCertificate) => {
      // Issue on Blockchain
      const tx = await contractService.issueCertificate(
        data.certificateId,
        data.studentName,
        data.courseName,
        data.ipfsHash
      );
      
      // Wait for confirmation
      await tx.wait();
      
      return tx;
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
