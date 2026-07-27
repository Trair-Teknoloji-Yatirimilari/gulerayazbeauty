-- Test blog yazıları (varsa dokunmaz)
INSERT INTO blog_posts (slug, title, excerpt, content, category, tags, status, published_at) VALUES
('botoks-uygulamasi', 'Botoks Uygulaması',
 'Botoks ile mimik kaynaklı kırışıklıkların görünümünü azaltın.',
 '<p>Botoks, mimik kaslarının aşırı hareketinden kaynaklanan kırışıklıkların görünümünü azaltmak için uygulanan, dünyada en sık tercih edilen medikal estetik işlemlerden biridir.</p><p>Uygulama yaklaşık 15-20 dakika sürer ve günlük yaşama hemen dönülebilir. Etkisi ortalama 3-4 gün içinde başlar, 10-14 günde tam sonuca ulaşır.</p>',
 'Botoks', ARRAY['botoks','kırışıklık','medikal estetik'], 'published', now() - interval '2 days'),
('dolgu-uygulamalari', 'Dolgu Uygulamaları',
 'Hyalüronik asit dolgularla yüz hatlarınıza doğal denge kazandırın.',
 '<p>Dolgu uygulamaları, hyalüronik asit bazlı ürünlerle yüzdeki hacim kayıplarını gidermek, hatları belirginleştirmek ve cilt kalitesini artırmak amacıyla yapılır.</p><p>Dudak, yanak, çene ve göz altı en sık uygulanan bölgelerdir. Sonuçlar uygulamadan hemen sonra görülür.</p>',
 'Dolgu', ARRAY['dolgu','hyalüronik asit'], 'published', now() - interval '1 day'),
('mezoterapi-ile-cilt-genclestirme', 'Mezoterapi ile Cilt Gençleştirme',
 'Mezoterapi ile cildinize içeriden gelen bir ışıltı kazandırın.',
 '<p>Mezoterapi; vitamin, mineral ve hyalüronik asit içeren karışımların cilde mikro enjeksiyonlarla verildiği bir cilt gençleştirme yöntemidir.</p><p>Cilt tonunu eşitler, nem dengesini artırır ve ince çizgilerin görünümünü azaltır. Genellikle 3-4 seanslık kürler halinde uygulanır.</p>',
 'Cilt Bakımı', ARRAY['mezoterapi','cilt gençleştirme'], 'published', now())
ON CONFLICT (slug) DO NOTHING;
