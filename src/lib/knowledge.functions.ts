import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "./db";
import { requireBusiness } from "./auth.functions";

export type KnowledgeItem = {
  id: string;
  type: "faq" | "note" | "rule" | "doc";
  question: string | null;
  answer: string;
  created_at: string;
};

export const listKnowledge = createServerFn({ method: "GET" })
  .middleware([requireBusiness])
  .handler(async ({ context }) => {
    const res = await db().query(
      "SELECT id, type, question, answer, created_at FROM knowledge_items WHERE business_id=$1 ORDER BY created_at DESC",
      [context.businessId],
    );
    return res.rows as KnowledgeItem[];
  });

const schema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(["faq", "note", "rule", "doc"]),
  question: z.string().trim().max(300).optional().nullable(),
  answer: z.string().trim().min(2).max(8000),
});

export const saveKnowledge = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) => schema.parse(d))
  .handler(async ({ data, context }) => {
    const pool = db();
    if (data.id) {
      await pool.query(
        "UPDATE knowledge_items SET type=$3, question=$4, answer=$5 WHERE id=$1 AND business_id=$2",
        [data.id, context.businessId, data.type, data.question ?? null, data.answer],
      );
      return { id: data.id };
    }
    const res = await pool.query(
      "INSERT INTO knowledge_items (business_id, type, question, answer) VALUES ($1,$2,$3,$4) RETURNING id",
      [context.businessId, data.type, data.question ?? null, data.answer],
    );
    return { id: res.rows[0].id as string };
  });

export const deleteKnowledge = createServerFn({ method: "POST" })
  .middleware([requireBusiness])
  .validator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await db().query("DELETE FROM knowledge_items WHERE id=$1 AND business_id=$2", [
      data.id,
      context.businessId,
    ]);
    return { ok: true };
  });
