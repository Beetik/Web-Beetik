import { LanguageSwitcher } from "../components/LanguageSwitcher.js";
import { legalTranslations } from "../utils/legalTranslations.js";
import { translations as siteTranslations } from "../utils/translations.js";
const translations = {
    es: { ...siteTranslations.es, ...legalTranslations.es },
    en: { ...siteTranslations.en, ...legalTranslations.en },
};
function updateMetadata(language) {
    const page = document.body.dataset.legalPage;
    if (page !== "privacy" && page !== "terms")
        return;
    const dictionary = translations[language];
    const title = dictionary[`${page}Title`];
    const description = dictionary[`${page}Description`];
    const descriptionElement = document.querySelector('meta[name="description"]');
    if (title)
        document.title = title;
    if (description && descriptionElement)
        descriptionElement.content = description;
}
document.addEventListener("DOMContentLoaded", () => {
    const root = document.querySelector(".language-switcher");
    if (root)
        new LanguageSwitcher(root, translations, updateMetadata).initialize();
});
