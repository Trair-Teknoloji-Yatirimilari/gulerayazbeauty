import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { AdminShell, Card, Field, inputClass, PrimaryButton, GhostButton } from "@/components/admin/shell";
import {
  listHours,
  saveHours,
  listExceptions,
  saveException,
  deleteException,
  getFreeSlots,
  type HourException,
} from "@/lib/scheduling.functions";

export const Route = createFileRoute("/_authenticated/admin/saatler")({
  component: HoursPage,
});

const DAYS = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const hhmm = (t: string) => t.slice(0, 5);

function HoursPage() {
  const hoursFn = useServerFn(listHours);
  const saveFn = useServerFn(saveHours);
  const excFn = useServerFn(listExceptions);
  const saveExcFn = useServerFn(saveException);
  const delExcFn = useServerFn(deleteException);
  const slotsFn = useServerFn(getFreeSlots);

  const { data: hours } = useQuery({ queryKey: ["hours"], queryFn: () => hoursFn({}) });
  const { data: exceptions = [], refetch: refetchExc } = useQuery({ queryKey: ["exceptions"], queryFn: () => excFn({}) });

  const [rows, setRows] = useState<Array<{ weekday: number; openTime: string; closeTime: string; isClosed: boolean }>>([]);
  const [excDate, setExcDate] = useState("");
  const [excNote, setExcNote] = useState("");
  const [slotDate, setSlotDate] = useState("");
  const [slots, setSlots] = useState<string[] | null>(null);

  useEffect(() => {
    if (!hours) return;
    setRows(hours.map((h) => ({ weekday: h.weekday, openTime: hhmm(h.open_time), closeTime: hhmm(h.close_time), isClosed: h.is_closed })));
  }, [hours]);

  const save = async () => {
    try {
      await saveFn({ data: { hours: rows } });
      toast.success("Çalışma saatleri kaydedildi.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Kaydedilemedi.");
    }
  };

  const addException = async () => {
    if (!excDate) return;
    await saveExcFn({ data: { date: excDate, isClosed: true, note: excNote || null } });
    setExcDate("");
    setExcNote("");
    refetchExc();
  };

  const preview = async () => {
    if (!slotDate) return;
    setSlots(await slotsFn({ data: { date: slotDate, durationMin: 30 } }));
  };

  return (
    <AdminShell title="Çalışma saatleri" description="Boş slotlar bu tablodan ve mevcut rezervasyonlardan otomatik hesaplanır.">
      <div className="space-y-6">
        <Card>
          <div className="space-y-3">
            {rows.map((r, i) => (
              <div key={r.weekday} className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
                <span className="text-sm">{DAYS[r.weekday]}</span>
                <input type="time" className={inputClass} value={r.openTime} disabled={r.isClosed}
                  onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, openTime: e.target.value } : x)))} />
                <input type="time" className={inputClass} value={r.closeTime} disabled={r.isClosed}
                  onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, closeTime: e.target.value } : x)))} />
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <input type="checkbox" checked={r.isClosed}
                    onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, isClosed: e.target.checked } : x)))} />
                  Kapalı
                </label>
              </div>
            ))}
          </div>
          <PrimaryButton className="mt-5" onClick={save}>Kaydet</PrimaryButton>
        </Card>

        <Card>
          <h2 className="font-display text-lg mb-4">Tatil / istisna günleri</h2>
          <div className="flex flex-wrap gap-3 items-end">
            <Field label="Tarih">
              <input type="date" className={inputClass} value={excDate} onChange={(e) => setExcDate(e.target.value)} />
            </Field>
            <Field label="Not">
              <input className={inputClass} value={excNote} onChange={(e) => setExcNote(e.target.value)} placeholder="Resmî tatil" />
            </Field>
            <GhostButton onClick={addException}>Ekle</GhostButton>
          </div>
          <ul className="mt-4 divide-y divide-border/50">
            {exceptions.map((e: HourException) => (
              <li key={e.id} className="flex items-center justify-between py-2 text-sm">
                <span>{String(e.date).slice(0, 10)} — {e.note ?? "Kapalı"}</span>
                <button className="p-2 text-muted-foreground hover:text-destructive" onClick={async () => { await delExcFn({ data: { id: e.id } }); refetchExc(); }}>
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
            {!exceptions.length && <li className="py-3 text-sm text-muted-foreground">İstisna günü yok.</li>}
          </ul>
        </Card>

        <Card>
          <h2 className="font-display text-lg mb-4">Boş slot önizleme</h2>
          <div className="flex flex-wrap gap-3 items-end">
            <Field label="Gün">
              <input type="date" className={inputClass} value={slotDate} onChange={(e) => setSlotDate(e.target.value)} />
            </Field>
            <GhostButton onClick={preview}>Hesapla</GhostButton>
          </div>
          {slots && (
            <div className="mt-4 flex flex-wrap gap-2">
              {slots.length ? slots.map((s) => (
                <span key={s} className="rounded-full border border-border/60 px-3 py-1 text-xs">
                  {new Date(s).toISOString().slice(11, 16)}
                </span>
              )) : <p className="text-sm text-muted-foreground">Bu gün için boş slot yok.</p>}
            </div>
          )}
        </Card>
      </div>
    </AdminShell>
  );
}
