export class ProjectCarousel {
    intervalId;
    initialize() {
        const radios = Array.from(document.querySelectorAll('.blog-card input[type="radio"]'));
        if (radios.length < 2)
            return;
        let current = Math.max(0, radios.findIndex((radio) => radio.checked));
        this.intervalId = window.setInterval(() => {
            current = (current + 1) % radios.length;
            radios[current].checked = true;
        }, 12_000);
    }
    destroy() {
        if (this.intervalId !== undefined)
            window.clearInterval(this.intervalId);
    }
}
