export class LanguageSwitcher {
    root;
    translations;
    onChange;
    constructor(root, translations, onChange) {
        this.root = root;
        this.translations = translations;
        this.onChange = onChange;
    }
    initialize() {
        this.root.hidden = false;
        this.root.addEventListener("click", (event) => {
            const target = event.target;
            if (!(target instanceof Element))
                return;
            const button = target.closest("button[data-lang]");
            const language = button?.dataset.lang;
            if (!this.isLanguage(language))
                return;
            this.changeLanguage(language);
        });
    }
    changeLanguage(language) {
        const dictionary = this.translations[language];
        document.querySelectorAll("[data-i18n]").forEach((element) => {
            const key = element.dataset.i18n;
            const translation = key ? dictionary[key] : undefined;
            if (!translation)
                return;
            if (element instanceof HTMLInputElement && element.type === "submit") {
                element.value = translation;
            }
            else {
                element.textContent = translation;
            }
        });
        document.documentElement.lang = language;
        this.root.querySelectorAll("button[data-lang]").forEach((button) => {
            button.setAttribute("aria-pressed", String(button.dataset.lang === language));
        });
        this.onChange?.(language);
    }
    isLanguage(value) {
        return value === "es" || value === "en";
    }
}
