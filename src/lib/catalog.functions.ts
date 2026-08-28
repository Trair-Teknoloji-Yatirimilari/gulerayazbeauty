import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "./db";
import { requireBusiness } from "./auth.functions";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  sku: string | null;
  price: string;
  currency: string;
  stock: number;
  image_url: string | null;
  checkout_url: string | null;
  is_active: boolean;
  sort_order: number;
};

export type Service = {
  id: string;
  name: string;
  description: string | null;
  duration_min: number;
  price: string;
  capacity: number;
  is_active: boolean;
  sort_order: number;
};

export const listProducts = createServerFn({ method: "GET" })
  .middleware([requireBusiness])
  .handler(async ({ context }) => {
    const res = await db().query(
      `SELECT id, name, description, sku, price, currency, stock, image_url, checkout_url, is_active, sort_order
         FROM products WHERE business_id = $1 ORDER BY sort_order, created_at DESC`,
      [context.businessId],
    );
    return res.rows as Product[];
  });

const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(160),
  description: z.string().trim().max(2000).optional().nullable(),
  sku: z.string().trim().max(60).optional().nullable(),
  price: z.number().min(0).max(10_000_000),
  stock: z.number().int().min(0).max(1_000_000),
  imageUrl: z.string().trim().max(500).optional().nullable(),
  isActive: z.boolean(),
});

export const saveProduct = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) => productSchema.parse(d))
  .handler(async ({ data, context }) => {
    const pool = db();
    if (data.id) {
      await pool.query(
        `UPDATE products SET name=$3, description=$4, sku=$5, price=$6, stock=$7, image_url=$8, is_active=$9
           WHERE id=$1 AND business_id=$2`,
        [
          data.id,
          context.businessId,
          data.name,
          data.description ?? null,
          data.sku ?? null,
          data.price,
          data.stock,
          data.imageUrl ?? null,
          data.isActive,
        ],
      );
      return { id: data.id };
    }
    const res = await pool.query(
      `INSERT INTO products (business_id, name, description, sku, price, stock, image_url, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [
        context.businessId,
        data.name,
        data.description ?? null,
        data.sku ?? null,
        data.price,
        data.stock,
        data.imageUrl ?? null,
        data.isActive,
      ],
    );
    return { id: res.rows[0].id as string };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await db().query("DELETE FROM products WHERE id=$1 AND business_id=$2", [data.id, context.businessId]);
    return { ok: true };
  });

/** Toplu ürün girişi: CSV satırlarından ürün ekler/günceller (SKU eşleşirse günceller). */
export const importProducts = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) =>
    z
      .object({
        rows: z
          .array(
            z.object({
              name: z.string().trim().min(1).max(160),
              description: z.string().trim().max(2000).optional().nullable(),
              sku: z.string().trim().max(60).optional().nullable(),
              price: z.number().min(0),
              stock: z.number().int().min(0),
              imageUrl: z.string().trim().max(500).optional().nullable(),
            }),
          )
          .min(1)
          .max(1000),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const pool = db();
    let inserted = 0;
    let updated = 0;
    for (const row of data.rows) {
      const existing = row.sku
        ? await pool.query("SELECT id FROM products WHERE business_id=$1 AND sku=$2", [
            context.businessId,
            row.sku,
          ])
        : { rows: [] as Array<{ id: string }> };
      if (existing.rows[0]) {
        await pool.query(
          "UPDATE products SET name=$2, description=$3, price=$4, stock=$5, image_url=$6 WHERE id=$1",
          [existing.rows[0].id, row.name, row.description ?? null, row.price, row.stock, row.imageUrl ?? null],
        );
        updated++;
      } else {
        await pool.query(
          `INSERT INTO products (business_id, name, description, sku, price, stock, image_url)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [
            context.businessId,
            row.name,
            row.description ?? null,
            row.sku ?? null,
            row.price,
            row.stock,
            row.imageUrl ?? null,
          ],
        );
        inserted++;
      }
    }
    return { inserted, updated };
  });

export const listServices = createServerFn({ method: "GET" })
  .middleware([requireBusiness])
  .handler(async ({ context }) => {
    const res = await db().query(
      `SELECT id, name, description, duration_min, price, capacity, is_active, sort_order
         FROM services WHERE business_id = $1 ORDER BY sort_order, created_at DESC`,
      [context.businessId],
    );
    return res.rows as Service[];
  });

const serviceSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(160),
  description: z.string().trim().max(2000).optional().nullable(),
  durationMin: z.number().int().min(5).max(600),
  price: z.number().min(0).max(10_000_000),
  capacity: z.number().int().min(1).max(200),
  isActive: z.boolean(),
});

export const saveService = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) => serviceSchema.parse(d))
  .handler(async ({ data, context }) => {
    const pool = db();
    if (data.id) {
      await pool.query(
        `UPDATE services SET name=$3, description=$4, duration_min=$5, price=$6, capacity=$7, is_active=$8
           WHERE id=$1 AND business_id=$2`,
        [
          data.id,
          context.businessId,
          data.name,
          data.description ?? null,
          data.durationMin,
          data.price,
          data.capacity,
          data.isActive,
        ],
      );
      return { id: data.id };
    }
    const res = await pool.query(
      `INSERT INTO services (business_id, name, description, duration_min, price, capacity, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      [
        context.businessId,
        data.name,
        data.description ?? null,
        data.durationMin,
        data.price,
        data.capacity,
        data.isActive,
      ],
    );
    return { id: res.rows[0].id as string };
  });

export const deleteService = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await db().query("DELETE FROM services WHERE id=$1 AND business_id=$2", [data.id, context.businessId]);
    return { ok: true };
  });
