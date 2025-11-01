import { Button } from "@/components/ui/button";
import { useTranslation, Language } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage: Language = currentLanguage === 'en' ? 'bn' : 'en';
    setLanguage(newLanguage);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="ml-2 px-3 py-1 text-sm"
    >
      {currentLanguage === 'en' ? 'বাং' : 'ENG'}
    </Button>
  );
}
