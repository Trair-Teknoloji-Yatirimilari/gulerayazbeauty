# TrairX Connect — Partner (İşletme) Paneli

## Amaç
İşletmelerin yapay zekâ müşteri temsilcisini kendi verileriyle "eğitebileceği" bir panel. Panele girilen ürün, hizmet, fiyat, çalışma saati ve politika bilgileri; WhatsApp / Instagram / Facebook mesajlarına verilen AI cevaplarının kaynağı olur.

## Kullanıcı rolleri
- **Partner (işletme sahibi/personeli):** kendi işletmesinin verilerini yönetir.
- **Süper admin (TrairX):** işletmeleri, başvuruları ve abonelikleri görür.

Mevcut çerez tabanlı admin oturumu (`src/lib/auth.functions.ts`) genişletilir: `admin_users` tablosuna `business_id` ve `role` (`partner` | `superadmin`) eklenir.

## Panel bölümleri (v1)
1. **Genel bakış** — işletme durumu, eksik alan uyarıları ("AI hazırlık skoru"), son mesaj/rezervasyon özeti.
2. **İşletme profili** — ad, sektör, açıklama, adres, telefon, para birimi, zaman dilimi, dil.
3. **Ürünler** — ad, açıklama, SKU, fiyat, stok, görsel URL, satış linki, aktif/pasif. Liste + arama + toplu CSV içe aktarma.
4. **Hizmetler** — ad, açıklama, süre (dk), fiyat, kapasite, aktif/pasif.
5. **Çalışma saatleri & slotlar** — haftalık saat tablosu, tatil/istisna günleri, slot aralığı (ör. 30 dk). Boş slotlar mevcut rezervasyonlardan otomatik hesaplanır.
6. **Rezervasyonlar** — takvim/liste görünümü, durum (bekliyor / onaylı / iptal), manuel ekleme.
7. **Siparişler & ödeme linki** — AI'ın gönderdiği satış linkleri, sipariş durumu, ödeme durumu.
8. **AI eğitimi (bilgi tabanı)** — SSS soru/cevapları, ton ayarı (resmî/samimi), kampanya notları, "yapma" kuralları, serbest metin doküman alanı.
9. **Kanallar** — WhatsApp / Instagram / Facebook bağlantı durumu ve widget embed kodu (kopyala-yapıştır).
10. **Ekip & ayarlar** — kullanıcı davet, şifre değiştir.

## Toplu ürün girişi
CSV yükleme: sütun eşleme ekranı → önizleme → içe aktar. Hatalı satırlar raporlanır. Şablon CSV indirilebilir.

## Ödeme / satış linki akışı
- Her ürün için otomatik `checkout` linki: `/pay/:orderToken`.
- AI sohbette bu linki gönderir; son kullanıcı ürünü görür, adres/iletişim girer, kart ekranına ulaşır.
- v1'de kart ekranı Stripe/Paddle sağlayıcısına devredilir (ham kart verisi bizde tutulmaz). Sağlayıcı seçilene kadar link "test/manuel ödeme" modunda çalışır.

## Veri modeli (PostgreSQL, `db/init.sql` içine eklenir)
```text
businesses(id, name, slug, sector, description, phone, email, address,
           currency, timezone, locale, plan, status, created_at, updated_at)
admin_users(+ business_id, role, name)
products(id, business_id, name, description, sku, price, currency,
         stock, image_url, checkout_url, is_active, sort_order, ...)
services(id, business_id, name, description, duration_min, price,
         capacity, is_active, sort_order, ...)
business_hours(id, business_id, weekday 0-6, open_time, close_time, is_closed)
hour_exceptions(id, business_id, date, is_closed, open_time, close_time, note)
bookings(id, business_id, service_id, customer_name, phone, email,
         starts_at, ends_at, status, source_channel, notes, ...)
orders(id, business_id, token, customer_*, total, currency, status,
       payment_status, created_at)
order_items(id, order_id, product_id, name, unit_price, qty)
knowledge_items(id, business_id, type: faq|note|rule|doc, question, answer, ...)
ai_settings(id, business_id, tone, language, greeting, fallback_message,
            handoff_rules, updated_at)
channels(id, business_id, kind: whatsapp|instagram|facebook,
         status, external_id, connected_at)
partner_applications(id, company, name, email, phone, message, status, created_at)
```
Tüm sorgular `business_id` ile kapsamlanır; server fonksiyonlarında oturumdaki `business_id` zorunlu filtre olarak uygulanır.

## Teknik plan
- Rotalar: `src/routes/_authenticated/admin.*.tsx` (genel bakış, urunler, hizmetler, saatler, rezervasyonlar, siparisler, ai-egitimi, kanallar, ayarlar) + `superadmin` alt bölümü.
- Sunucu fonksiyonları: `src/lib/business.functions.ts`, `products.functions.ts`, `services.functions.ts`, `hours.functions.ts`, `bookings.functions.ts`, `orders.functions.ts`, `knowledge.functions.ts` — her biri `requireAdmin` middleware'i ile.
- Zod ile giriş doğrulama, `pg` parametreli sorgular.
- Ortak panel kabuğu: sol menü + üst bar (`src/components/admin/*`).
- Genel (public) tarafta: `/partner` başvuru sayfası ve `/pay/$token` ödeme sayfası.
- Panel arayüzü TR/EN sözlüklerine bağlanır.

## Uygulama sırası
1. Şema + auth genişletme (business_id, role) ve panel kabuğu/menü.
2. İşletme profili + Ürünler (CRUD + CSV) + Hizmetler.
3. Çalışma saatleri + slot hesaplama + Rezervasyonlar.
4. AI eğitimi (bilgi tabanı) + Kanallar/embed kodu.
5. Siparişler + ödeme linki ve `/pay/$token` ekranı.
6. Süper admin görünümü + `/partner` başvuru sayfası.

## Kapsam dışı (şimdilik)
- Gerçek WhatsApp/Instagram/Facebook API bağlantıları
- Canlı ödeme sağlayıcısı entegrasyonu (sağlayıcı seçilince eklenir)
- AI model çağrıları / gerçek mesaj işleme
