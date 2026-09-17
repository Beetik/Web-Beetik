export class Header {
    header = document.querySelector(".header");
    topSection = document.querySelector(".header > .container");
    menuBar = document.querySelector(".header > .menu");
    initialize() {
        this.updateBrowserIcon();
        this.initializeStickyMenu();
        this.initializeBurgerMenu();
        this.initializeMobileDropdown();
    }
    updateBrowserIcon() {
        const icon = document.getElementById("3dicon");
        if (!icon)
            return;
        const isChrome = /Chrome\//.test(navigator.userAgent) && !/(Edg|OPR)\//.test(navigator.userAgent);
        icon.classList.remove(isChrome ? "fa-codepen" : "fa-battle-net");
        if (!isChrome)
            icon.classList.remove("fa-spin");
    }
    initializeStickyMenu() {
        if (!this.header || !this.topSection)
            return;
        let frameId = null;
        const updateHeader = () => {
            const topSectionHeight = this.topSection.offsetHeight;
            const hiddenDistance = Math.min(Math.max(window.scrollY, 0), topSectionHeight);
            this.header.style.removeProperty("transform");
            this.header.style.setProperty("--header-top-height", `${topSectionHeight}px`);
            this.header.style.setProperty("--header-collapse", `${hiddenDistance}px`);
            const headerBottom = this.header.getBoundingClientRect().bottom;
            const menuBottom = this.menuBar ? this.menuBar.getBoundingClientRect().bottom : headerBottom;
            const HEADER_SAFETY_MARGIN = 12;
            const fullHeaderHeight = Math.max(headerBottom, menuBottom, 0) + HEADER_SAFETY_MARGIN;
            document.documentElement.style.setProperty("--full-header-height", `${fullHeaderHeight}px`);
            frameId = null;
        };
        const requestUpdate = () => {
            if (frameId !== null)
                return;
            frameId = window.requestAnimationFrame(updateHeader);
        };
        window.addEventListener("scroll", requestUpdate, { passive: true });
        window.addEventListener("resize", requestUpdate);
        updateHeader();
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => requestUpdate());
        }
        window.addEventListener("load", () => {
            requestUpdate();
            window.setTimeout(requestUpdate, 300);
        });
    }
    initializeBurgerMenu() {
        const burger = document.querySelector("#burgerButton");
        const menuItems = document.querySelector(".menu-items");
        if (!burger || !menuItems)
            return;
        burger.addEventListener("click", () => {
            const isOpen = menuItems.classList.toggle("show");
            burger.setAttribute("aria-expanded", String(isOpen));
        });
    }
    initializeMobileDropdown() {
        const trigger = document.querySelector(".nav-items.has-dropdown > .nav-link-item");
        const parentItem = document.querySelector(".nav-items.has-dropdown");
        if (!trigger || !parentItem)
            return;
        const mobileQuery = window.matchMedia("(max-width: 858px)");
        trigger.addEventListener("click", (event) => {
            if (!mobileQuery.matches)
                return;
            event.preventDefault();
            const isOpen = parentItem.classList.toggle("open");
            trigger.setAttribute("aria-expanded", String(isOpen));
        });
        mobileQuery.addEventListener("change", (event) => {
            if (!event.matches) {
                parentItem.classList.remove("open");
                trigger.setAttribute("aria-expanded", "false");
            }
        });
    }
}
