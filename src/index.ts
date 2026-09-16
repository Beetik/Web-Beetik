import { Cards } from "./components/Cards.js";
import { Header } from "./components/Header.js";
import { LanguageSwitcher } from "./components/LanguageSwitcher.js";
import { ProjectCarousel } from "./components/ProjectCarousel.js";
import { Starfield } from "./components/Starfield.js";
import { translations } from "./utils/translations.js";

document.addEventListener("DOMContentLoaded", () => {
  new Starfield().initialize();
  new Header().initialize();
  new Cards().initialize();
  new ProjectCarousel().initialize();

  const languageSwitcher = document.querySelector<HTMLElement>(".language-switcher");
  if (languageSwitcher) {
    new LanguageSwitcher(languageSwitcher, translations).initialize();
  }
});
