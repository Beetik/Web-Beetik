export class Cards {
  initialize(): void {
    if (!window.matchMedia("(max-width: 768px)").matches) return;

    document.querySelectorAll<HTMLElement>(".card").forEach((card) => {
      card.addEventListener("click", () => {
        const isExpanded = card.classList.toggle("expanded");
        void card.offsetWidth;
        card.style.height = isExpanded ? "70vh" : "45vh";
      });
    });
  }
}
