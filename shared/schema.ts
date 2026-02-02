import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  certificateId: text("certificate_id").notNull().unique(), // Blockchain ID
  studentName: text("student_name").notNull(),
  courseName: text("course_name").notNull(),
  ipfsHash: text("ipfs_hash").notNull(),
  issuerAddress: text("issuer_address").notNull(),
  issuedAt: timestamp("issued_at").defaultNow(),
  isValid: boolean("is_valid").default(true),
  transactionHash: text("transaction_hash"),
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({ 
  id: true, 
  issuedAt: true,
  isValid: true 
});

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
