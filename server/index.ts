import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import cors from "cors";

const allowedOrigins = [
  "https://growthx.rami-kadri.workers.dev",
  /\.replit\.app$/,
  /\.replit\.dev$/,
];

const app = express();

// Trust proxy for production (Replit runs behind a reverse proxy)
app.set("trust proxy", 1);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some(o =>
      typeof o === "string" ? o === origin : o.test(origin)
    );
    callback(null, allowed);
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await setupAuth(app);
  const httpServer = createServer(app);
  await registerRoutes(httpServer, app);

  // Seed admin user
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminUsername && adminPassword) {
    try {
      const existingAdmin = await storage.getUserByUsername(adminUsername);
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      if (!existingAdmin) {
        await storage.createUser({
          username: adminUsername,
          password: hashedPassword,
        });
        log(`Admin user '${adminUsername}' created.`);
      } else {
        await storage.updateUser(existingAdmin.id, { password: hashedPassword });
        log(`Admin user '${adminUsername}' password updated.`);
      }
    } catch (err) {
      log(`Warning: Could not seed admin user — database may be unavailable: ${err}`);
    }
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
