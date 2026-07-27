import { createServerFn, createMiddleware } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { z } from "zod";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { db } from "./db";

const COOKIE_NAME = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 gün

function secret(): string {
  const s = process.env.SESSION_SECRET || process.env.DATABASE_URL;
  if (!s) throw new Error("SESSION_SECRET veya DATABASE_URL tanımlı olmalı.");
  return crypto.createHash("sha256").update(s).digest("hex");
}

function signToken(email: string): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `${Buffer.from(email).toString("base64url")}.${exp}`;
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function verifyToken(token: string | undefined): string | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [emailB64, expStr, sig] = parts;
  const payload = `${emailB64}.${expStr}`;
  const expected = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  if (Number(expStr) < Math.floor(Date.now() / 1000)) return null;
  return Buffer.from(emailB64, "base64url").toString();
}

/** Korumalı server fonksiyonları için middleware */
export const requireAdmin = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const email = verifyToken(getCookie(COOKIE_NAME));
  if (!email) throw new Error("Yetkisiz erişim. Lütfen giriş yapın.");
  return next({ context: { adminEmail: email } });
});

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});

export const login = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => loginSchema.parse(d))
  .handler(async ({ data }) => {
    const pool = db();
    const email = data.email.toLowerCase();

    let res = await pool.query(
      "SELECT email, password_hash FROM admin_users WHERE lower(email) = $1",
      [email],
    );

    // İlk kurulum: hiç admin yoksa, env'deki ADMIN_EMAIL/ADMIN_PASSWORD ile
    // eşleşen ilk giriş admin hesabını oluşturur.
    if (res.rowCount === 0) {
      const count = await pool.query("SELECT count(*)::int AS c FROM admin_users");
      const bootEmail = process.env.ADMIN_EMAIL?.toLowerCase();
      const bootPass = process.env.ADMIN_PASSWORD;
      if (count.rows[0].c === 0 && bootEmail && bootPass && email === bootEmail && data.password === bootPass) {
        const hash = await bcrypt.hash(bootPass, 12);
        await pool.query(
          "INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)",
          [email, hash],
        );
        res = await pool.query(
          "SELECT email, password_hash FROM admin_users WHERE lower(email) = $1",
          [email],
        );
      }
    }

    const row = res.rows[0];
    const ok = row ? await bcrypt.compare(data.password, row.password_hash) : false;
    if (!ok) throw new Error("E-posta veya şifre hatalı.");

    setCookie(COOKIE_NAME, signToken(row.email), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: MAX_AGE,
    });
    return { email: row.email };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(COOKIE_NAME, { path: "/" });
  return { ok: true };
});

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const email = verifyToken(getCookie(COOKIE_NAME));
  return email ? { email } : null;
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(8),
});

export const changeAdminPassword = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((d: unknown) => changePasswordSchema.parse(d))
  .handler(async ({ data, context }) => {
    const pool = db();
    const res = await pool.query(
      "SELECT password_hash FROM admin_users WHERE lower(email) = $1",
      [context.adminEmail.toLowerCase()],
    );
    const row = res.rows[0];
    if (!row || !(await bcrypt.compare(data.currentPassword, row.password_hash))) {
      throw new Error("Mevcut şifre hatalı.");
    }
    const hash = await bcrypt.hash(data.newPassword, 12);
    await pool.query(
      "UPDATE admin_users SET password_hash = $1 WHERE lower(email) = $2",
      [hash, context.adminEmail.toLowerCase()],
    );
    return { ok: true };
  });
