import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { createAppointment, type AppointmentInput } from "@/lib/appointments.functions";

const services = [
  "Botoks",
  "Dolgu",
  "Mezoterapi",
  "Altın İğne",
  "Q-Switch Lazer",
  "HIFU / LIFU",
  "Konsültasyon",
  "Diğer",
];

export function AppointmentForm() {
  const submit = useServerFn(createAppointment);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentInput>();

  const onSubmit = async (values: AppointmentInput) => {
    try {
      await submit({ data: values });
      setSent(true);
      reset();
      toast.success("Randevu talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Bir hata oluştu.";
      toast.error(msg);
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card/60 backdrop-blur border border-primary/40 rounded-sm p-10 text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 text-primary mb-6">
          <Check className="w-8 h-8" strokeWidth={1.5} />
        </div>
        <h3 className="font-display text-2xl md:text-3xl text-gold-gradient">
          Talebiniz alındı
        </h3>
        <p className="mt-4 text-foreground/70 max-w-md mx-auto">
          Randevu ekibimiz en kısa sürede sizinle iletişime geçecek. Bize güvendiğiniz için teşekkür ederiz.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-8 text-xs uppercase tracking-[0.35em] text-primary hover:text-primary/80"
        >
          Yeni talep oluştur
        </button>
      </motion.div>
    );
  }

  const inputCls =
    "w-full bg-background/40 border border-border/60 focus:border-primary/70 rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors";
  const labelCls = "block text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-card/60 backdrop-blur border border-border/60 rounded-sm p-6 md:p-10 space-y-5"
    >
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Ad Soyad *</label>
          <input
            {...register("full_name", { required: "Zorunlu alan", minLength: 2, maxLength: 100 })}
            className={inputCls}
            placeholder="Adınız Soyadınız"
            autoComplete="name"
          />
          {errors.full_name && <p className="mt-1 text-xs text-destructive">Ad soyad zorunlu.</p>}
        </div>
        <div>
          <label className={labelCls}>Telefon *</label>
          <input
            {...register("phone", { required: "Zorunlu alan", minLength: 5, maxLength: 30 })}
            className={inputCls}
            placeholder="+90 5__ ___ __ __"
            inputMode="tel"
            autoComplete="tel"
          />
          {errors.phone && <p className="mt-1 text-xs text-destructive">Telefon zorunlu.</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>E-posta</label>
          <input
            type="email"
            {...register("email", { maxLength: 255 })}
            className={inputCls}
            placeholder="ornek@eposta.com"
            autoComplete="email"
          />
        </div>
        <div>
          <label className={labelCls}>Tercih Edilen Tarih</label>
          <input type="date" {...register("preferred_date")} className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>İlgilendiğiniz Uygulama</label>
        <select
          {...register("service")}
          className={inputCls + " appearance-none cursor-pointer"}
          defaultValue=""
        >
          <option value="" className="bg-background">Seçiniz (opsiyonel)</option>
          {services.map((s) => (
            <option key={s} value={s} className="bg-background">
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>Mesajınız</label>
        <textarea
          {...register("message", { maxLength: 2000 })}
          className={inputCls + " min-h-[110px] resize-y"}
          placeholder="Beklentileriniz, sorularınız veya notlarınız..."
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-primary px-10 py-4 text-sm uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all glow-gold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Gönderiliyor...
            </>
          ) : (
            "Randevu Talep Et"
          )}
        </button>
        <p className="mt-4 text-xs text-muted-foreground/70">
          Bilgileriniz gizli tutulur. Kliniğimiz size en kısa sürede geri dönüş yapacaktır.
        </p>
      </div>
    </form>
  );
}
