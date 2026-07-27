export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold text-white">
          Gizlilik Politikası
        </h1>

        <p className="mt-8 leading-8">
          CarVision AI, kullanıcıların yalnızca analiz etmek
          istedikleri araç ilanı bilgilerini işler.
        </p>

        <p className="mt-6 leading-8">
          Uzantı yalnızca kullanıcı tarafından başlatılan aktarım
          işlemi sırasında çalışır. Arka planda veri toplamaz,
          kullanıcı davranışlarını izlemez ve kişisel verileri
          üçüncü taraflarla paylaşmaz.
        </p>

        <p className="mt-6 leading-8">
          Aktarılan veriler yalnızca analiz oluşturmak amacıyla
          kullanılır.
        </p>

        <p className="mt-6 leading-8">
          İletişim:
          <br />
          e-posta: contact@carvision.ai
        </p>
      </div>
    </main>
  );
}
