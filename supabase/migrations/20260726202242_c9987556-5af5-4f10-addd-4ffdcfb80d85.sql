CREATE TYPE public.post_status AS ENUM ('draft', 'published');

CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL DEFAULT '',
  cover_image_url text,
  category text,
  tags text[] NOT NULL DEFAULT '{}',
  seo_title text,
  seo_description text,
  status public.post_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  author_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts"
  ON public.blog_posts FOR SELECT
  TO anon, authenticated
  USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert posts"
  ON public.blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update posts"
  ON public.blog_posts FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete posts"
  ON public.blog_posts FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER blog_posts_set_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE INDEX idx_blog_posts_status_published_at ON public.blog_posts (status, published_at DESC);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts (slug);

INSERT INTO public.blog_posts (slug, title, excerpt, content, category, tags, seo_title, seo_description, status, published_at) VALUES
('botoks-hakkinda-bilinmesi-gerekenler',
 'Botoks Hakkında Bilinmesi Gereken Her Şey',
 'Botoks uygulaması nedir, kimlere uygulanır, etkisi ne kadar sürer? Kardiyoloji ve estetik hekimi Dr. Gökhan Değirmencioğlu anlatıyor.',
 '<p>Botoks (botulinum toksin), mimik kaslarını kontrollü şekilde gevşeterek dinamik kırışıklıkların oluşumunu engelleyen, dünyada en çok uygulanan medikal estetik işlemlerden biridir. Doğru dozda ve doğru noktalara uygulandığında yüz ifadenizi bozmadan sizi <strong>daha dinlenmiş ve genç</strong> gösterir.</p><h2>Botoks Nerelere Uygulanır?</h2><ul><li>Alın çizgileri</li><li>Kaş arası (glabellar) çizgiler</li><li>Göz çevresi (kaz ayağı) kırışıklıkları</li><li>Bunny lines (burun kökü)</li><li>Çene ve boyun bantları</li></ul><h2>Uygulama Nasıl Yapılır?</h2><p>İşlem yaklaşık <strong>10-15 dakika</strong> sürer. İnce uçlu iğnelerle mimik kaslarına milimetrik dozlarda uygulanır. İşlem sonrası günlük hayatınıza hemen dönebilirsiniz.</p><h2>Etkisi Ne Zaman Başlar, Ne Kadar Sürer?</h2><p>Etkiler <strong>3-7 gün</strong> içinde belirginleşir, tam etki 14. günde ortaya çıkar. Ortalama <strong>4-6 ay</strong> etkinliğini korur.</p><h2>Kimlere Uygulanmaz?</h2><p>Hamilelik, emzirme dönemi, nöromusküler hastalıklar ve aktif cilt enfeksiyonu olan hastalara uygulanmaz. Uygulama öncesi mutlaka hekim değerlendirmesi yapılmalıdır.</p><blockquote>Doğru botoks, yaptırdığınız anlaşılmayan botokstur.</blockquote>',
 'Botoks', ARRAY['botoks','mimik kırışıklıkları','anti-aging'],
 'Botoks Nedir? Uygulama, Etki Süresi ve Fiyat | Dr. Gökhan Değirmencioğlu',
 'Botoks uygulaması nedir, nasıl yapılır, kaç ay etkilidir? Sarıyer İstanbul''da Dr. Gökhan Değirmencioğlu''nun kaleminden.',
 'published', now() - interval '1 day'),

('dolgu-uygulamasi-rehberi',
 'Dolgu Uygulaması: Doğal Hatlar İçin Rehber',
 'Hyaluronik asit dolguları ile hacim kaybını doğal şekilde geri kazanmanın yolları, riskler ve dikkat edilmesi gerekenler.',
 '<p>Yaşla birlikte ciltte kollajen ve hyaluronik asit üretimi azalır; elmacık kemikleri, dudaklar ve çene hattı hacmini kaybeder. <strong>Dermal dolgular</strong>, bu hacim kaybını doğal şekilde geri kazanmanın en etkili yollarından biridir.</p><h2>Hangi Bölgelere Uygulanır?</h2><ul><li>Dudak dolgusu</li><li>Elmacık kemiği ve orta yüz</li><li>Nazolabial (burun-dudak) çizgiler</li><li>Çene ucu ve jawline şekillendirme</li><li>Göz altı çukurluğu</li></ul><h2>Neden Hyaluronik Asit?</h2><p>Hyaluronik asit vücudumuzda doğal olarak bulunur, <strong>biyouyumludur ve geri döndürülebilir</strong>. Beğenilmediği durumlarda hyalüronidaz enzimi ile eritilebilir; bu özellik dolguyu son derece güvenli kılar.</p><h2>Kalıcılığı</h2><p>Kullanılan ürünün yoğunluğuna ve uygulama bölgesine göre <strong>9-18 ay</strong> arasında kalıcılığı vardır. Dudakta genellikle daha kısa, çene hattında daha uzun kalır.</p><h2>Uygulama Sonrası</h2><p>Hafif şişlik ve morarma normaldir, 3-5 günde geçer. İlk 24 saat sıcak ortamlardan ve yoğun spordan kaçınmak gerekir.</p>',
 'Dolgu', ARRAY['dolgu','hyaluronik asit','dudak dolgusu'],
 'Dolgu Uygulaması: Yüz, Dudak ve Çene Dolgusu Rehberi',
 'Hyaluronik asit dolgusu ile doğal görünümlü hacim kazanımı. Bölgelere göre uygulama ve kalıcılık süreleri.',
 'published', now() - interval '3 days'),

('mezoterapi-genclik-asisi',
 'Mezoterapi ve Gençlik Aşısı Nedir?',
 'Cildinizi içeriden besleyerek canlandıran mezoterapi tedavisinin faydaları, kimlere uygun olduğu ve seans planı.',
 '<p><strong>Mezoterapi</strong>, cildin ihtiyacı olan vitaminleri, mineralleri, amino asitleri ve hyaluronik asidi mikro dozlarda doğrudan cildin ara katmanına uygulama yöntemidir. Cildi <em>içeriden</em> besler ve canlandırır.</p><h2>Faydaları</h2><ul><li>Cilt tonunu ve parlaklığını artırır</li><li>İnce kırışıklıkları azaltır</li><li>Cildin nem dengesini düzenler</li><li>Gözenekleri sıkılaştırır</li><li>Saç dökülmesinde etkilidir (saç mezoterapisi)</li></ul><h2>Seans Planı</h2><p>Optimum sonuç için <strong>2-4 hafta arayla 4-6 seans</strong> uygulanır. Ardından yılda 1-2 kez hatırlatma seansı önerilir.</p><h2>Gençlik Aşısı Farkı</h2><p>Gençlik aşısı, mezoterapinin özel bir formu olup yüksek konsantrasyonlu stabilize hyaluronik asit içerir. Tek seansta bile <strong>belirgin cilt kalitesi artışı</strong> sağlar.</p>',
 'Mezoterapi', ARRAY['mezoterapi','gençlik aşısı','cilt bakımı'],
 'Mezoterapi ve Gençlik Aşısı: Cilt Canlandırma Rehberi',
 'Mezoterapi nasıl uygulanır, gençlik aşısından farkı nedir? Seans planı ve beklenen sonuçlar.',
 'published', now() - interval '5 days'),

('altin-igne-radyofrekans',
 'Altın İğne (Fraksiyonel Radyofrekans) Nedir?',
 'Altın iğne uygulaması ile cilt sıkılaştırma, akne izi ve gözenek tedavisinin bilimsel arka planı.',
 '<p><strong>Altın iğne</strong>, altın kaplı mikro iğneler aracılığıyla cildin dermis katmanına radyofrekans enerjisi ileten hibrit bir tedavi yöntemidir. Hem <em>mikro iğneleme</em> hem <em>ısı enerjisi</em>nin sinerjik etkisiyle kollajen üretimini uyarır.</p><h2>Hangi Sorunlarda Kullanılır?</h2><ul><li>Cilt sarkması ve gevşekliği</li><li>Akne izleri ve atrofik skarlar</li><li>Geniş gözenekler</li><li>İnce kırışıklıklar</li><li>Stria (çatlak) tedavisi</li></ul><h2>Nasıl Çalışır?</h2><p>Altın kaplı iğneler cildin belirlediğimiz derinliğine iner ve yalnızca uç kısımdan radyofrekans yayar. Bu sayede <strong>epidermis korunur</strong>, ısı sadece hedef katmana verilir. Sonuç: yanık riski minimum, kollajen sentezi maksimum.</p><h2>Kaç Seans Gerekir?</h2><p>Cilt sorununa göre <strong>3-4 seans, 4 hafta arayla</strong> uygulanır. Etkiler 8. haftadan itibaren belirginleşir ve aylarca gelişmeye devam eder.</p><h2>İyileşme Süresi</h2><p>Uygulama sonrası 24-48 saat hafif kızarıklık olabilir; ertesi gün makyaj yapılabilir.</p>',
 'Cihaz Tedavileri', ARRAY['altın iğne','radyofrekans','cilt sıkılaştırma'],
 'Altın İğne Nedir, Ne İşe Yarar? Uygulama Sonuçları',
 'Fraksiyonel radyofrekans altın iğne ile cilt sıkılaştırma, akne izi ve gözenek tedavisi.',
 'published', now() - interval '7 days'),

('q-switch-lazer',
 'Q-Switch Lazer ile Leke ve Cilt Yenileme',
 'Q-Switch teknolojisi ile güneş lekeleri, melazma ve dövme silme uygulamalarının detayları.',
 '<p><strong>Q-Switch lazer</strong>, pikosaniye-nanosaniye sürelerinde çok yüksek enerjili darbeler üreterek melanin pigmentini parçalayan ileri düzey bir lazer teknolojisidir. Çevre dokuya zarar vermeden <em>hedef pigmenti</em> ortadan kaldırır.</p><h2>Hangi Sorunlarda Etkilidir?</h2><ul><li>Güneş lekeleri (lentigolar)</li><li>Melazma</li><li>Dövme silme</li><li>Karbon peeling ile porselen görünüm</li><li>Cilt tonu eşitleme</li></ul><h2>Karbon Peeling (Hollywood Peeling)</h2><p>Cilde ince bir karbon tabakası sürülür ve Q-Switch lazer ile buharlaştırılır. Anında <strong>parlak, gözeneksiz, porselen bir görünüm</strong> sağlar; kırmızı halı öncesi tercih edilir.</p><h2>Kaç Seans Yeterlidir?</h2><p>Leke tipine göre <strong>3-6 seans, 3-4 hafta arayla</strong> planlanır. Uygulama ağrısızdır ve sosyal hayata dönüş sürekli hemen aynı gündür.</p>',
 'Lazer', ARRAY['q-switch','leke tedavisi','karbon peeling'],
 'Q-Switch Lazer: Leke Tedavisi ve Karbon Peeling',
 'Güneş lekeleri, melazma ve dövme silmede Q-Switch lazer teknolojisi ve seans planı.',
 'published', now() - interval '10 days'),

('hifu-lifu-cilt-sikilastirma',
 'HIFU ve LIFU ile Cerrahisiz Yüz Germe',
 'Yüksek yoğunluklu odaklanmış ultrason (HIFU/LIFU) ile ameliyatsız cilt sıkılaştırmanın mucizesi.',
 '<p><strong>HIFU (High Intensity Focused Ultrasound)</strong> ve daha konforlu versiyonu <strong>LIFU</strong>, cerrahi bir işlem yapmadan cildin en derin katmanı olan SMAS''a ısı enerjisi ulaştırarak kalıcı sıkılaşma sağlayan teknolojidir. Estetik cerrahi öncesi <em>en güçlü alternatif</em> olarak kabul edilir.</p><h2>Etkili Olduğu Bölgeler</h2><ul><li>Alt yüz ve jawline sarkması</li><li>Çene altı toparlama</li><li>Kaş kaldırma (non-surgical browlift)</li><li>Boyun bölgesi</li><li>Vücut sıkılaştırma</li></ul><h2>Nasıl Çalışır?</h2><p>HIFU ultrason enerjisini cildin belirli derinliklerine (1.5mm, 3.0mm, 4.5mm) odaklar. Bu noktalarda mikroskobik ısı bölgeleri oluşur; vücut buraları onarırken <strong>yoğun kollajen üretir</strong>.</p><h2>Sonuçlar Ne Zaman Görülür?</h2><p>İlk etki uygulama sonrası hemen fark edilir ancak asıl sıkılaşma <strong>2-3 ay</strong> içinde belirginleşir ve <strong>12-18 ay</strong> kalıcıdır. Yılda bir hatırlatma seansı önerilir.</p><h2>Kimler İçin İdealdir?</h2><p>30-60 yaş arasında hafif-orta düzeyde cilt sarkması olan, ameliyat istemeyen bireyler için mükemmel bir çözümdür.</p>',
 'Cihaz Tedavileri', ARRAY['hifu','lifu','yüz germe','cilt sıkılaştırma'],
 'HIFU ve LIFU: Ameliyatsız Yüz Germe Rehberi',
 'HIFU ve LIFU teknolojisi ile cerrahisiz cilt sıkılaştırma. Etki süresi ve sonuçlar.',
 'published', now() - interval '14 days');
