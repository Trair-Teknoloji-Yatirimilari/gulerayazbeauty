import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, MessageCircle, Instagram, Facebook } from "lucide-react";
import { AdminShell, Card, Field, inputClass, PrimaryButton, GhostButton } from "@/components/admin/shell";
import { listChannels, upsertChannel, getBusiness, type Channel } from "@/lib/business.functions";

export const Route = createFileRoute("/_authenticated/admin/kanallar")({
  component: ChannelsPage,
});

const KINDS = [
  { kind: "whatsapp" as const, label: "WhatsApp Business", icon: MessageCircle, hint: "WhatsApp Business telefon numarası kimliği" },
  { kind: "instagram" as const, label: "Instagram DM", icon: Instagram, hint: "Instagram profesyonel hesap kimliği" },
  { kind: "facebook" as const, label: "Facebook Messenger", icon: Facebook, hint: "Facebook sayfa kimliği" },
];

function ChannelsPage() {
  const listFn = useServerFn(listChannels);
  const saveFn = useServerFn(upsertChannel);
  const bizFn = useServerFn(getBusiness);

  const { data: channels = [], refetch } = useQuery({ queryKey: ["channels"], queryFn: () => listFn({}) });
  const { data: business } = useQuery({ queryKey: ["business"], queryFn: () => bizFn({}) });

  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const current = (kind: string): Channel | undefined => channels.find((c: Channel) => c.kind === kind);

  const save = async (kind: "whatsapp" | "instagram" | "facebook", status: "connected" | "disconnected") => {
    try {
      await saveFn({ data: { kind, status, externalId: drafts[kind] ?? current(kind)?.external_id ?? null } });
      toast.success("Kanal güncellendi.");
      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Güncellenemedi.");
    }
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const embed = `<script src="${origin}/widget.js" data-trairx-id="${business?.id ?? "ISLETME_ID"}" async></script>`;

  return (
    <AdminShell title="Kanallar & widget" description="Yapay zekânın mesaj alacağı kanalları bağlayın, web sitenize widget'ı ekleyin.">
      <div className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          {KINDS.map(({ kind, label, icon: Icon, hint }) => {
            const ch = current(kind);
            const connected = ch?.status === "connected";
            return (
              <Card key={kind}>
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{label}</p>
                    <p className={`text-xs ${connected ? "text-emerald-500" : "text-muted-foreground"}`}>
                      {connected ? "Bağlı" : "Bağlı değil"}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Field label={hint}>
                    <input
                      className={inputClass}
                      value={drafts[kind] ?? ch?.external_id ?? ""}
                      onChange={(e) => setDrafts({ ...drafts, [kind]: e.target.value })}
                    />
                  </Field>
                </div>
                <div className="mt-4 flex gap-2">
                  <PrimaryButton onClick={() => save(kind, "connected")}>Bağla</PrimaryButton>
                  {connected && <GhostButton onClick={() => save(kind, "disconnected")}>Kaldır</GhostButton>}
                </div>
              </Card>
            );
          })}
        </div>

        <Card>
          <h2 className="font-display text-lg mb-2">Web sitesi widget kodu</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Bu kodu sitenizin &lt;/body&gt; etiketinden hemen önce yapıştırın.
          </p>
          <pre className="overflow-x-auto rounded-xl bg-muted/40 px-4 py-3 text-xs">{embed}</pre>
          <GhostButton className="mt-3" onClick={() => { navigator.clipboard.writeText(embed); toast.success("Kopyalandı."); }}>
            <Copy className="w-3.5 h-3.5" /> Kodu kopyala
          </GhostButton>
        </Card>
      </div>
    </AdminShell>
  );
}
