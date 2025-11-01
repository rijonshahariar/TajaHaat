import { Footer } from "@/components/Footer";
import { useTranslation } from "@/lib/i18n";

export default function Forecast() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-white">
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-ag-green-50 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">{t('forecast.title')}</h1>
          <p className="text-muted-foreground">{t('forecast.subtitle')}</p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground mb-4">
            {t('forecast.expand_note')}
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
