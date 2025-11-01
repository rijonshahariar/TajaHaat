import { Footer } from "@/components/Footer";
import { useTranslation } from "@/lib/i18n";

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Header Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-ag-green-50 border-b border-border">
        <div className="max-w-7xl mx-auto text-center sm:text-left">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {t("about.title")}
          </h1>
          <p className="text-muted-foreground">{t("about.subtitle")}</p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="prose prose-lg text-muted-foreground space-y-6 mb-12">
            <p>
              {t("about.content") ||
                "We are a passionate team working to revolutionize agricultural data insights through technology, sustainability, and innovation. Our platform helps farmers, buyers, and policymakers make smarter decisions based on real-time data."}
            </p>
          </div>

          {/* Mission and Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
              <h2 className="text-2xl font-semibold text-green-700 mb-4">
                🌱 Our Mission
              </h2>
              <p className="text-muted-foreground">
                To empower communities with accessible agricultural market
                insights, improve decision-making, and promote sustainability
                through the power of AI and open data.
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
              <h2 className="text-2xl font-semibold text-green-700 mb-4">
                🌍 Our Vision
              </h2>
              <p className="text-muted-foreground">
                To build a globally connected agricultural ecosystem that
                ensures food security, supports local farmers, and creates
                transparent, data-driven markets for everyone.
              </p>
            </div>
          </div>

          {/* Our Team Section */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              👥 Our Team
            </h2>
            <p className="text-muted-foreground mb-8">
              We’re a diverse group of innovators, developers, and researchers
              dedicated to improving the future of agriculture through
              technology.
            </p>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Shahariar Rijon
                </h3>
                <p className="text-muted-foreground">Data Analyst</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Muntakim
                </h3>
                <p className="text-muted-foreground">Developer</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Mainur Rahat
                </h3>
                <p className="text-muted-foreground">Agriculture Analyst</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
