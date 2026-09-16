export class Header {
    header = document.querySelector(".header");
    topSection = document.querySelector(".header > .container");
    initialize() {
        this.updateBrowserIcon();
        this.initializeStickyMenu();
        this.initializeBurgerMenu();
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
}
