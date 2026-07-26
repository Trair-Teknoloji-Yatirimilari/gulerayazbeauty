## Hedef
Site 3 dilde yayınlanacak: Türkçe (varsayılan), İngilizce, Farsça. Farsça sağdan-sola (RTL). Her dilin kendi URL öneki olacak: `/tr/...`, `/en/...`, `/fa/...`. Blog yazıları da 3 dilde yazılabilecek ve dil seçimine göre listelenecek.

## Yeni URL yapısı

```text
/                       → /tr'ye yönlendir (kullanıcı tarayıcı diline göre /en veya /fa)
/tr, /en, /fa           → anasayfa (tek sayfa, tüm bölümler)
/tr/blog, /en/blog…     → blog listesi
/tr/blog/:slug …        → blog detayı
/tr/kvkk, /en/privacy…  → gizlilik metni (dil bazlı içerik)
/auth                   → giriş (dilden bağımsız)
/admin                  → panel (dilden bağımsız, admin arayüzü TR kalır)
```

Dil değişimi header'daki dil seçici (TR / EN / FA) ile yapılır — mevcut sayfada kalınır, sadece önek değişir.

## i18n altyapısı

1. Yeni klasör: `src/i18n/`
   - `types.ts` — desteklenen diller ve tip
   - `dictionaries/tr.ts`, `en.ts`, `fa.ts` — tüm arayüz metinleri (nav, hero, hizmetler, cihazlar, biyografi, süreç, SSS, iletişim, footer, form, KVKK sayfası, admin panelinin kullanıcıya bakan tarafı, hata mesajları)
   - `index.ts` — `useT()` hook'u ve `getDict(lang)` yardımcıları
2. Aktif dil `useParams({ strict: false }).lang` üzerinden okunur.
3. Farsça için `<html dir="rtl" lang="fa">`; TR/EN için `ltr`. `__root.tsx` içinde dinamik.
4. Google Fonts'a Farsça için **Vazirmatn** eklenir; başlıklar Farsça'da uygun font-fallback ile gösterilir.

## Route dosyaları

- Mevcut `src/routes/index.tsx` içeriği `src/routes/$lang/index.tsx`'e taşınır ve tüm metinler `useT()` üzerinden çekilir.
- `src/routes/index.tsx` yeni bir yönlendirici olur: tarayıcı diline göre `/tr`, `/en` veya `/fa`'ya `redirect`.
- Blog: `src/routes/blog.tsx` → `src/routes/$lang/blog.tsx`; `src/routes/blog.$slug.tsx` → `src/routes/$lang/blog.$slug.tsx`.
- KVKK: `src/routes/kvkk.tsx` → `src/routes/$lang/legal.tsx` (dil bazlı içerik; slug/başlık dilde değişir).
- `$lang.tsx` pathless layout dosyası: geçerli dilleri (`tr|en|fa`) doğrular, geçersizse 404. Dil değişkenini alt route'lara context ile geçer.

## Blog için veritabanı değişikliği

`blog_posts` tablosuna dil bazlı alanlar eklenir (migration):

- `title_tr, title_en, title_fa`
- `excerpt_tr, excerpt_en, excerpt_fa`
- `content_tr, content_en, content_fa`
- `seo_title_tr/_en/_fa`, `seo_description_tr/_en/_fa`

Mevcut `title / excerpt / content / seo_title / seo_description` alanları `*_tr` sütunlarına kopyalanır, sonra kaldırılmaz (geri uyumluluk) ama okuma artık dile bakılarak yapılır: `title_<lang> ?? title_tr`. Slug tek kalır — üç dilde de aynı URL slug'ı kullanılır.

Server fonksiyonları (`src/lib/blog.functions.ts`) `lang` parametresi alır ve doğru sütunları döner.

## Admin paneli blog formu

`src/components/BlogPostForm.tsx` üç sekme (TR / EN / FA) ile güncellenir:
- Her sekmede: başlık, özet, içerik (Tiptap), SEO başlığı, SEO açıklaması
- Slug, kategori, etiketler, kapak, durum ortak alan olarak kalır
- TR alanları zorunlu; EN/FA opsiyonel — boşsa okuma TR'ye düşer

Admin dashboard'un kendi arayüzü (`admin.tsx`, `admin.blog.tsx`) çevrilmez, TR kalır.

## SEO ve head

`__root.tsx`: `og:site_name`, viewport, dinamik `<html lang dir>`.

Her dilli sayfa kendi `head()` içinde:
- `title`, `description`, `og:title`, `og:description` — dile göre
- `canonical` → `https://cinemaflow-aesthetics.lovable.app/<lang>/...`
- `hreflang` alternate link'leri: her sayfada 3 dilin URL'si + `x-default` (Google için)

Blog detayında `head()` `loaderData` üzerinden dile göre başlık, açıklama, kapak görselini çeker.

## Dil seçici

Header'a küçük bir `TR | EN | FA` seçici eklenir. Aktif dil vurgulanır. Tıklandığında `useNavigate` ile şu anki path'in dil önekini değiştirir (aynı sayfada kalınır).

## Randevu formu ve KVKK

- Form etiketleri, hata mesajları, buton ve başarı mesajları 3 dilde
- KVKK metni her dil için ayrı tam metin (TR mevcut, EN ve FA için yeni yazılır)
- Form onay kutusundaki bağlantı `/<lang>/legal`'e gider

## Uygulama sırası

1. i18n altyapısı ve TR sözlüğü (mevcut metinlerden çıkarılır)
2. `$lang` layout + kök `/` redirect + Farsça font ve RTL
3. Anasayfa route'unu `$lang/index.tsx`'e taşı ve `useT()` ile bağla
4. Blog migration + `$lang/blog*` route'ları + server fonksiyonu güncelle
5. Admin blog formunu 3 sekme yap
6. KVKK/legal 3 dilli
7. Header dil seçici + hreflang
8. EN ve FA sözlüklerini doldur

## Not
Bu kapsamlı bir çalışma. Farsça çeviriler profesyonel medikal terminolojiye uygun yazılacak ama sonradan hoca tarafından gözden geçirilmesi önerilir. Mevcut Türkçe blog yazıları EN/FA sütunları boş bırakılarak Türkçe olarak kalır — dil sekmesinden istediğiniz zaman doldurulabilir; boş dillerde otomatik olarak Türkçe içerik gösterilir (`?? title_tr` fallback).

Onaylarsanız uygulamaya başlıyorum.