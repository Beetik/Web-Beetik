export class ProjectCarousel {
  private intervalId?: number;

  initialize(): void {
    const radios = Array.from(
      document.querySelectorAll<HTMLInputElement>('.blog-card input[type="radio"]'),
    );
    if (radios.length < 2) return;

    let current = Math.max(0, radios.findIndex((radio) => radio.checked));
    this.intervalId = window.setInterval(() => {
      current = (current + 1) % radios.length;
      radios[current]!.checked = true;
    }, 12_000);
  }

  destroy(): void {
    if (this.intervalId !== undefined) window.clearInterval(this.intervalId);
  }
}
