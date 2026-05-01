import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import connectPgSimple from "connect-pg-simple";
import { storage } from "./storage";
import { type User } from "../shared/schema";
import { db, pool } from "./db";
import { sql } from "drizzle-orm";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

import { type User as SelectUser } from "../shared/schema";

export async function setupAuth(app: express.Express) {
  const PostgresStore = connectPgSimple(session);

  let sessionStore: session.Store | undefined;
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      ) WITH (OIDS=FALSE)
    `);
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire")
    `);
    sessionStore = new PostgresStore({ pool, tableName: "session" });
  } catch (err) {
    console.warn("Warning: Could not set up PostgreSQL session store, falling back to memory store:", err);
  }

  app.use(
    session({
      ...(sessionStore ? { store: sessionStore } : {}),
      secret: process.env.SESSION_SECRET || "growthx-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: app.get("env") === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return done(null, false, { message: "Invalid username or password" });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  res.sendStatus(401);
}
