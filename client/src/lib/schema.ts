import { z } from "zod";

// Certificate schema without database dependencies
export const insertCertificateSchema = z.object({
  certificateId: z.string().min(1, "Certificate ID is required"),
  studentName: z.string().min(1, "Student name is required"),
  courseName: z.string().min(1, "Course name is required"),
  ipfsHash: z.string().min(1, "IPFS hash is required"),
  issuerAddress: z.string().min(1, "Issuer address is required"),
  transactionHash: z.string().optional(),
});

export type Certificate = {
  id: number;
  certificateId: string;
  studentName: string;
  courseName: string;
  ipfsHash: string;
  issuerAddress: string;
  issuedAt: Date;
  isValid: boolean;
  transactionHash: string | null;
};

export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
