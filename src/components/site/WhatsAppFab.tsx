import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X } from "lucide-react";

export const WHATSAPP_NUMBER = "905346408888";
export const WHATSAPP_DISPLAY = "+90 534 640 88 88";

const DEFAULT_TEXT = "Merhaba, TrairX Connect hakkında bilgi almak istiyorum.";

export function WhatsAppFab() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_TEXT)}`;

  return (
    <AnimatePresence>
      {ready && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3"
        >
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="w-[19rem] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border border-border/60 bg-card/95 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center justify-between gap-2 bg-[#25D366]/12 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">TrairX AI Asistan</p>
                    <p className="text-[11px] text-muted-foreground">WhatsApp · genelde saniyeler içinde yanıtlar</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Kapat"
                    onClick={() => setOpen(false)}
                    className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-3 px-4 py-4">
                  <p className="rounded-2xl rounded-tl-sm bg-muted px-3 py-2 text-sm text-foreground">
                    Merhaba! Ürün, fiyat ve randevu sorularınızı WhatsApp’tan yazın — yapay zekâmız 7/24 yanıtlıyor.
                  </p>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
                  >
                    <MessageCircle className="h-4 w-4" /> {WHATSAPP_DISPLAY}
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="WhatsApp ile yazın"
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-105"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" />
            <MessageCircle className="relative h-6 w-6" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
