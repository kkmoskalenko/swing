import MathUtilities from "../utilities/MathUtilities";

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
     * @returns {boolean} Результат проверки
     */
    contains(mx, my) {
        /*const xSquared = Math.pow(mx - this.x, 2);
        const ySquared = Math.pow(my - this.y, 2);
        const radiusSquared = Math.pow(this.radius, 2);

        return xSquared + ySquared < radiusSquared;*/

        // TODO: Вернуть метод к прежнему состоянию
        return false;
    }

    /**
     * Определяет, соприкасается ли ограничитель с определённым отрезком
     * @param x1 Координата x одного конца отрезка
     * @param y1 Координата y одного конца отрезка
     * @param x2 Координата x другого конца отрезка
     * @param y2 Координата y другого конца отрезка
     * @returns {boolean} Результат проверки
     */
    adjoinsTheLineSegment(x1, y1, x2, y2) {
        const dx = x2 - x1; // Δx
        const dy = y2 - y1; // Δy

        const distance = MathUtilities.calcDistance(this.x, this.y, x1, y1, x2, y2);

        if (distance > this.radius) {
            return false;
        }

        // Так как мы убедились, что точка лежит на прямой, остаётся только проверить, лежит ли она на отрезке
        if (Math.abs(dx) >= Math.abs(dy)) {
            return dx > 0 ?
                x1 <= this.x && this.x <= x2 :
                x2 <= this.x && this.x <= x1;
        }
        else {
            return dy > 0 ?
                y1 <= this.y && this.y <= y2 :
                y2 <= this.y && this.y <= y1;
        }
    }
}

export default Limiter;