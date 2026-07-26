import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { createAppointment, type AppointmentInput } from "@/lib/appointments.functions";
import { useT } from "@/i18n/context";

export function AppointmentForm() {
  const { t } = useT();
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
      toast.success(t.form.successToast);
    } catch (e) {
      const msg = e instanceof Error ? e.message : t.form.error;
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
        <h3 className="font-display text-2xl md:text-3xl text-gold-gradient">{t.form.successTitle}</h3>
        <p className="mt-4 text-foreground/70 max-w-md mx-auto">{t.form.successBody}</p>
        <button
          onClick={() => setSent(false)}
          className="mt-8 text-xs uppercase tracking-[0.35em] text-primary hover:text-primary/80"
        >
          {t.form.newRequest}
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
          <label className={labelCls}>{t.form.fullName} *</label>
          <input
            {...register("full_name", { required: true, minLength: 2, maxLength: 100 })}
            className={inputCls}
            placeholder={t.form.fullNamePh}
            autoComplete="name"
          />
          {errors.full_name && <p className="mt-1 text-xs text-destructive">{t.form.reqFullName}</p>}
        </div>
        <div>
          <label className={labelCls}>{t.form.phone} *</label>
          <input
            {...register("phone", { required: true, minLength: 5, maxLength: 30 })}
            className={inputCls}
            placeholder={t.form.phonePh}
            inputMode="tel"
            autoComplete="tel"
          />
          {errors.phone && <p className="mt-1 text-xs text-destructive">{t.form.reqPhone}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>{t.form.email}</label>
          <input
            type="email"
            {...register("email", { maxLength: 255 })}
            className={inputCls}
            placeholder={t.form.emailPh}
            autoComplete="email"
          />
        </div>
        <div>
          <label className={labelCls}>{t.form.date}</label>
          <input type="date" {...register("preferred_date")} className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>{t.form.service}</label>
        <select
          {...register("service")}
          className={inputCls + " appearance-none cursor-pointer"}
          defaultValue=""
        >
          <option value="" className="bg-background">{t.form.selectPlaceholder}</option>
          {t.form.services.map((s) => (
            <option key={s} value={s} className="bg-background">{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelCls}>{t.form.message}</label>
        <textarea
          {...register("message", { maxLength: 2000 })}
          className={inputCls + " min-h-[110px] resize-y"}
          placeholder={t.form.messagePh}
        />
      </div>

      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            {...register("consent_given", { required: t.form.consentRequired })}
            className="sr-only peer"
          />
          <span className="mt-0.5 w-5 h-5 flex-shrink-0 rounded border border-border/70 bg-background/40 peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center transition-colors">
            <Check className="w-3.5 h-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity" />
          </span>
          <span className="text-sm text-foreground/80 leading-relaxed group-hover:text-foreground/90 transition-colors">
            {t.form.consentPrefix}{" "}
            <Link
              to="/kvkk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
            >
              {t.form.consentLink}
            </Link>
            {t.form.consentSuffix} *
          </span>
        </label>
        {errors.consent_given && (
          <p className="mt-2 text-xs text-destructive">{errors.consent_given.message as string}</p>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-primary px-10 py-4 text-sm uppercase tracking-widest text-primary-foreground hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all glow-gold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> {t.form.sending}
            </>
          ) : (
            t.form.submit
          )}
        </button>
        <p className="mt-4 text-xs text-muted-foreground/70">{t.form.footer}</p>
      </div>
    </form>
  );
}
