import { Cards } from "../components/Cards.js";
import { Header } from "../components/Header.js";
import { LanguageSwitcher } from "../components/LanguageSwitcher.js";
import { ProjectCarousel } from "../components/ProjectCarousel.js";
import { Starfield } from "../components/Starfield.js";
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
// Las páginas legales (Privacidad/Términos) ahora comparten el mismo
// header fijo, fondo de estrellas/constelaciones y menú que el resto del
// sitio, así que inicializan los mismos componentes que index.ts.
document.addEventListener("DOMContentLoaded", () => {
    new Starfield().initialize();
    new Header().initialize();
    new Cards().initialize();
    new ProjectCarousel().initialize();
    const root = document.querySelector(".language-switcher");
    if (root)
        new LanguageSwitcher(root, translations, updateMetadata).initialize();
});
