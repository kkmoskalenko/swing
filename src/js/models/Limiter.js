class Limiter {
    /**
     * Создаёт ограничитель
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.radius = 10;
    }

    /**
     * Рисует ограничитель в заданном контексте
     * @param context Контекст 2D рендеринга для элемента canvas
     */
    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = "#607D8B"; // Blue Grey
        context.fill();
    }

    /**
     * Определяет, находится ли данная точка внутри фигуры
     * @param mx Координата x точки
     * @param my Координата y точки
     */
    contains(mx, my) {
        const xSquared = Math.pow(mx - this.x, 2);
        const ySquared = Math.pow(my - this.y, 2);
        const radiusSquared = Math.pow(this.radius, 2);

        return xSquared + ySquared < radiusSquared;
    }
}

export default Limiter;