export class Header {
  private readonly header = document.querySelector<HTMLElement>(".header");
  private readonly topSection = document.querySelector<HTMLElement>(".header > .container");

  initialize(): void {
    this.updateBrowserIcon();
    this.initializeStickyMenu();
    this.initializeBurgerMenu();
  }

  private updateBrowserIcon(): void {
    const icon = document.getElementById("3dicon");
    if (!icon) return;

    const isChrome = /Chrome\//.test(navigator.userAgent) && !/(Edg|OPR)\//.test(navigator.userAgent);
    icon.classList.remove(isChrome ? "fa-codepen" : "fa-battle-net");
    if (!isChrome) icon.classList.remove("fa-spin");
  }

  private initializeStickyMenu(): void {
    if (!this.header || !this.topSection) return;

    let frameId: number | null = null;

    const updateHeader = (): void => {
      const topSectionHeight = this.topSection!.offsetHeight;
      const hiddenDistance = Math.min(Math.max(window.scrollY, 0), topSectionHeight);

      this.header!.style.removeProperty("transform");
      this.header!.style.setProperty("--header-top-height", `${topSectionHeight}px`);
      this.header!.style.setProperty("--header-collapse", `${hiddenDistance}px`);
      frameId = null;
    };

    const requestUpdate = (): void => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateHeader);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    updateHeader();
  }

  private initializeBurgerMenu(): void {
    const burger = document.querySelector<HTMLButtonElement>("#burgerButton");
    const menuItems = document.querySelector<HTMLElement>(".menu-items");
    if (!burger || !menuItems) return;

    burger.addEventListener("click", () => {
      const isOpen = menuItems.classList.toggle("show");
      burger.setAttribute("aria-expanded", String(isOpen));
    });
  }
}
