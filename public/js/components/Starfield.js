export class Starfield {
    page = document.querySelector(".page");
    canvas = document.createElement("canvas");
    context = this.canvas.getContext("2d");
    reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    stars = [];
    constellations = [];
    animationId = null;
    resizeTimer = null;
    initialize() {
        if (!this.page || !this.context)
            return;
        this.canvas.className = "starfield";
        this.canvas.setAttribute("aria-hidden", "true");
        this.page.prepend(this.canvas);
        this.rebuild();
        window.addEventListener("load", () => this.rebuild(), { once: true });
        window.addEventListener("resize", () => {
            if (this.resizeTimer !== null)
                window.clearTimeout(this.resizeTimer);
            this.resizeTimer = window.setTimeout(() => this.rebuild(), 150);
        });
        if (!this.reduceMotion.matches) {
            this.animationId = window.requestAnimationFrame(this.animate);
        }
    }
    rebuild() {
        if (!this.page || !this.context)
            return;
        const width = this.page.clientWidth;
        const height = this.page.scrollHeight;
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        this.canvas.width = Math.round(width * pixelRatio);
        this.canvas.height = Math.round(height * pixelRatio);
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        const starCount = Math.max(110, Math.round((width * height) / 13000));
        this.stars = Array.from({ length: starCount }, () => this.createStar(width, height));
        this.constellations = this.createConstellations(width, height);
        this.draw(performance.now());
    }
    createStar(width, height) {
        const y = Math.pow(Math.random(), 1.35) * height * 0.78;
        const fade = Math.max(0, 1 - y / (height * 0.82));
        const palette = ["220, 239, 255", "255, 255, 255", "255, 235, 190"];
        return {
            x: Math.random() * width,
            y,
            radius: 0.45 + Math.random() * 1.45,
            opacity: (0.18 + Math.random() * 0.72) * Math.pow(fade, 0.75),
            phase: Math.random() * Math.PI * 2,
            speed: 0.0007 + Math.random() * 0.0014,
            color: palette[Math.floor(Math.random() * palette.length)] ?? palette[0],
        };
    }
    createConstellations(width, height) {
        const count = Math.max(3, Math.min(7, Math.round(width / 320)));
        return Array.from({ length: count }, () => {
            const centerX = width * (0.1 + Math.random() * 0.8);
            const centerY = height * (0.08 + Math.random() * 0.48);
            const pointCount = 4 + Math.floor(Math.random() * 4);
            const spreadX = Math.min(190, width * 0.14);
            const spreadY = Math.min(150, height * 0.06);
            const fade = Math.max(0, 1 - centerY / (height * 0.72));
            const points = Array.from({ length: pointCount }, (_, index) => ({
                x: centerX + (index / Math.max(1, pointCount - 1) - 0.5) * spreadX + (Math.random() - 0.5) * 55,
                y: centerY + (Math.random() - 0.5) * spreadY,
            })).sort((a, b) => a.x - b.x);
            return { points, opacity: 0.1 + fade * 0.17 };
        });
    }
    animate = (time) => {
        this.draw(time);
        this.animationId = window.requestAnimationFrame(this.animate);
    };
    draw(time) {
        if (!this.context || !this.page)
            return;
        const width = this.page.clientWidth;
        const height = this.page.scrollHeight;
        this.context.clearRect(0, 0, width, height);
        for (const constellation of this.constellations) {
            this.context.beginPath();
            constellation.points.forEach((point, index) => {
                if (index === 0)
                    this.context.moveTo(point.x, point.y);
                else
                    this.context.lineTo(point.x, point.y);
            });
            this.context.strokeStyle = `rgba(126, 190, 235, ${constellation.opacity})`;
            this.context.lineWidth = 0.7;
            this.context.stroke();
            for (const point of constellation.points) {
                this.drawGlow(point.x, point.y, 1.5, constellation.opacity * 2.2, "202, 232, 255");
            }
        }
        for (const star of this.stars) {
            const twinkle = this.reduceMotion.matches
                ? 0.8
                : 0.62 + Math.sin(time * star.speed + star.phase) * 0.38;
            this.drawGlow(star.x, star.y, star.radius, star.opacity * twinkle, star.color);
        }
    }
    drawGlow(x, y, radius, opacity, color) {
        if (!this.context)
            return;
        this.context.beginPath();
        this.context.arc(x, y, radius, 0, Math.PI * 2);
        this.context.fillStyle = `rgba(${color}, ${opacity})`;
        this.context.shadowColor = `rgba(${color}, ${Math.min(1, opacity * 1.4)})`;
        this.context.shadowBlur = radius > 1.2 ? 7 : 3;
        this.context.fill();
        this.context.shadowBlur = 0;
    }
}
