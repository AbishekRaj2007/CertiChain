import { db } from "./db";
import {
  certificates,
  type InsertCertificate,
  type Certificate
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getCertificates(): Promise<Certificate[]>;
  createCertificate(cert: InsertCertificate): Promise<Certificate>;
}

export class DatabaseStorage implements IStorage {
  async getCertificates(): Promise<Certificate[]> {
    return await db.select().from(certificates);
  }

  async createCertificate(insertCert: InsertCertificate): Promise<Certificate> {
    const [cert] = await db.insert(certificates).values(insertCert).returning();
    return cert;
  }
}

export const storage = new DatabaseStorage();
