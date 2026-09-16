import type { Language, Translations } from "../types/i18n.js";

export class LanguageSwitcher {
  private readonly root: HTMLElement;
  private readonly translations: Translations;
  private readonly onChange?: (language: Language) => void;

  constructor(
    root: HTMLElement,
    translations: Translations,
    onChange?: (language: Language) => void,
  ) {
    this.root = root;
    this.translations = translations;
    this.onChange = onChange;
  }

  initialize(): void {
    this.root.hidden = false;
    this.root.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const button = target.closest<HTMLButtonElement>("button[data-lang]");
      const language = button?.dataset.lang;
      if (!this.isLanguage(language)) return;

      this.changeLanguage(language);
    });
  }

  private changeLanguage(language: Language): void {
    const dictionary = this.translations[language];

    document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      const translation = key ? dictionary[key] : undefined;
      if (!translation) return;

      if (element instanceof HTMLInputElement && element.type === "submit") {
        element.value = translation;
      } else {
        element.textContent = translation;
      }
    });

    document.documentElement.lang = language;
    this.root.querySelectorAll<HTMLButtonElement>("button[data-lang]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.lang === language));
    });
    this.onChange?.(language);
  }

  private isLanguage(value: string | undefined): value is Language {
    return value === "es" || value === "en";
  }
}
