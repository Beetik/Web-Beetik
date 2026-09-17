export class Header {
  private readonly header = document.querySelector<HTMLElement>(".header");
  private readonly topSection = document.querySelector<HTMLElement>(".header > .container");
  private readonly menuBar = document.querySelector<HTMLElement>(".header > .menu");

  initialize(): void {
    this.updateBrowserIcon();
    this.initializeStickyMenu();
    this.initializeBurgerMenu();
    this.initializeMobileDropdown();
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

      // Altura real del header completo (barra superior + navbar), expuesta
      // en :root para que el hero pueda centrar su contenido en el espacio
      // que realmente queda visible debajo del header fijo, en vez de
      // centrarse respecto a los 100vh completos (lo que lo dejaba tapado
      // parcialmente y descentrado).
      //
      // OJO: ".header > .menu" es position:fixed, por lo que NO forma parte
      // de la caja de ".header" y no contribuye a su offsetHeight. Medir solo
      // this.header.offsetHeight subestimaba la altura real (solo contaba la
      // barra superior, sin la navbar), dejando el hero descentrado hacia
      // arriba. Usamos el borde inferior real de la navbar en pantalla.
      const headerBottom = this.header!.getBoundingClientRect().bottom;
      const menuBottom = this.menuBar
        ? this.menuBar.getBoundingClientRect().bottom
        : headerBottom;
      // Pequeño margen de seguridad: sin esto, en subpáginas el primer
      // renglón del contenido (el "eyebrow" arriba del título) quedaba con
      // la parte de arriba tapada por el header fijo, porque la medición
      // real del header puede quedar unos px por debajo de lo que se ve
      // (bordes, sombras, redondeos de subpíxel). Con el margen, el
      // contenido siempre arranca claramente debajo del header.
      const HEADER_SAFETY_MARGIN = 12;
      const fullHeaderHeight = Math.max(headerBottom, menuBottom, 0) + HEADER_SAFETY_MARGIN;

      document.documentElement.style.setProperty(
        "--full-header-height",
        `${fullHeaderHeight}px`
      );
      frameId = null;
    };

    const requestUpdate = (): void => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateHeader);
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    updateHeader();

    // La fuente "Rajdhani" (Google Fonts) se carga de forma asíncrona.
    // Si el header se mide antes de que termine de cargar, su altura real
    // queda subestimada (el texto crece un poco al aplicarse la fuente
    // final), lo que descentraba el hero. Volvemos a medir cuando las
    // fuentes terminan de cargar y, como respaldo, un poco después del
    // load por si el navegador no soporta document.fonts.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => requestUpdate());
    }
    window.addEventListener("load", () => {
      requestUpdate();
      window.setTimeout(requestUpdate, 300);
    });
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

  // En escritorio "Servicios" se abre al pasar el mouse (hover) y el
  // click navega normal a grabado-laser.html. En móvil no hay hover, así
  // que sin esto el submenú de 5 links se mostraba siempre expandido en
  // el flujo normal (se veía como una columna fija) en vez de comportarse
  // como un dropdown real. Por debajo de 858px, el primer toque en
  // "Servicios" abre/cierra el submenú en vez de navegar; para ir a la
  // página de Servicios basta con tocar cualquiera de los links de adentro.
  private initializeMobileDropdown(): void {
    const trigger = document.querySelector<HTMLAnchorElement>(
      ".nav-items.has-dropdown > .nav-link-item"
    );
    const parentItem = document.querySelector<HTMLElement>(".nav-items.has-dropdown");
    if (!trigger || !parentItem) return;

    const mobileQuery = window.matchMedia("(max-width: 858px)");

    trigger.addEventListener("click", (event) => {
      if (!mobileQuery.matches) return;
      event.preventDefault();
      const isOpen = parentItem.classList.toggle("open");
      trigger.setAttribute("aria-expanded", String(isOpen));
    });

    // Si la ventana pasa a escritorio con el submenú abierto, se limpia
    // el estado para que no interfiera con el hover normal de escritorio.
    mobileQuery.addEventListener("change", (event) => {
      if (!event.matches) {
        parentItem.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  }
}
