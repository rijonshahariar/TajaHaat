import { Leaf, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/lib/i18n";

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ag-green-50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <div className="flex items-center justify-center w-8 h-8 bg-ag-green-600 rounded-lg">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-ag-green-600">তাজা হাট</span>
            </div>
            <p className="text-muted-foreground text-sm">
              {t("footer.brand_tagline")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {t("footer.quick_links")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/marketplace"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("nav.marketplace")}
                </Link>
              </li>
              <li>
                <Link
                  to="/forecast"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("nav.forecast")}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("nav.about")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {t("footer.support")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("nav.contact")}
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.help_center")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("auth.privacy_policy")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("auth.terms_of_service")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              {t("footer.contact_info")}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  123 Chawkbajar, Chittagong ,Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a
                  href="tel:+8801890159627"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +88 01890159627
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a
                  href="mailto:info@tajahaat.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  info@tajahaat.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} তাজা হাট. {t("footer.all_rights_reserved")}
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M18.77 7.8h-7.56v2.32h4.72c-.36 1.89-2.1 3.48-4.72 3.48-2.82 0-5.11-2.29-5.11-5.11s2.29-5.11 5.11-5.11c1.27 0 2.41.48 3.3 1.25l1.84-1.84c-1.43-1.34-3.34-2.15-5.15-2.15-4.26 0-7.71 3.45-7.71 7.71s3.45 7.71 7.71 7.71c4.26 0 7.71-3.45 7.71-7.71 0-.51-.06-1-.16-1.46z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M19 3.795a6.558 6.558 0 0 1-1.89.518 3.297 3.297 0 0 0 1.443-1.816 6.591 6.591 0 0 1-2.084.794 3.286 3.286 0 0 0-5.603 2.997 9.33 9.33 0 0 1-6.766-3.43 3.285 3.285 0 0 0 1.017 4.382A3.267 3.267 0 0 1 .64 6.738v.041a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.491-.039 3.297 3.297 0 0 0 3.067 2.285 6.59 6.59 0 0 1-4.077 1.404A6.557 6.557 0 0 1 0 13.803a9.32 9.32 0 0 0 5.032 1.475c6.038 0 9.34-5.002 9.34-9.339 0-.143-.003-.285-.009-.426a6.662 6.662 0 0 0 1.637-1.697z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.447 16.447h-2.822v-4.427c0-1.056-.382-1.776-1.324-1.776-.722 0-1.151.487-1.339 1.056-.069.168-.086.403-.086.638v4.51h-2.822V7.498h2.822v.944h.04c.394-.629 1.37-1.293 2.822-1.293 2.657 0 4.71 1.736 4.71 5.476v4.222zM3.97 6.229c-.906 0-1.49-.601-1.49-1.35 0-.769.594-1.352 1.528-1.352.936 0 1.49.583 1.51 1.351 0 .749-.574 1.351-1.548 1.351zm1.275 10.218H2.695V7.498h2.55v8.949zM17.84 0H.16C.072 0 0 .073 0 .16v19.68c0 .087.072.16.16.16h17.68c.088 0 .16-.073.16-.16V.16c0-.087-.072-.16-.16-.16z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
