import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Minimal API to satisfy template requirements
  // In a real DApp, frontend talks to blockchain mostly
  
  app.get(api.certificates.list.path, async (req, res) => {
    const certs = await storage.getCertificates();
    res.json(certs);
  });

  app.post(api.certificates.create.path, async (req, res) => {
    try {
      const input = api.certificates.create.input.parse(req.body);
      const cert = await storage.createCertificate(input);
      res.status(201).json(cert);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
