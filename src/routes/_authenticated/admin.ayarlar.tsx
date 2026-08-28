import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { AdminShell, Card, Field, inputClass, PrimaryButton } from "@/components/admin/shell";
import { changeAdminPassword, getAdminSession } from "@/lib/auth.functions";

export const Route = createFileRoute("/_authenticated/admin/ayarlar")({
  component: SettingsPage,
});

function SettingsPage() {
  const changeFn = useServerFn(changeAdminPassword);
  const sessionFn = useServerFn(getAdminSession);
  const { data: session } = useQuery({ queryKey: ["admin-session"], queryFn: () => sessionFn({}) });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await changeFn({ data: { currentPassword, newPassword } });
      toast.success("Şifreniz güncellendi.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Güncellenemedi.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminShell title="Ayarlar" description="Hesap güvenliği ve oturum bilgileri.">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-display text-lg mb-4">Hesap</h2>
          <p className="text-sm text-muted-foreground">E-posta</p>
          <p className="text-sm">{session?.email ?? "—"}</p>
        </Card>

        <Card>
          <h2 className="font-display text-lg mb-4">Şifre değiştir</h2>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Mevcut şifre">
              <input type="password" required minLength={6} className={inputClass} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </Field>
            <Field label="Yeni şifre">
              <input type="password" required minLength={8} className={inputClass} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </Field>
            <PrimaryButton type="submit" disabled={busy}>Kaydet</PrimaryButton>
          </form>
        </Card>
      </div>
    </AdminShell>
  );
}
