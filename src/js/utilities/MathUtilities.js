class MathUtilities {
    /**
     * Конвертирует градусы в радианы
     * @param degrees Значение в градусах
     * @returns {number} Значение в радианах
     */
    static radians(degrees) {
        return degrees * Math.PI / 180;
    };

    /**
     * Конвертирует радианы в градусы
     * @param radians Значение в радианах
     * @returns {number} Значение в градусах
     */
    static degrees(radians) {
        return radians * 180 / Math.PI;
    };

    /**
     * Вычисляет длину отрезка по координатам начальной и конечной точек
     * @param x0 Координата x начальной точки
     * @param y0 Координата y начальной точки
     * @param x Координата x конечной точки
     * @param y Координата y конечной точки
     * @returns {number} Длина отрезка
     */
    static calcLineSegmentLength(x0, y0, x, y) {
        const xSquared = Math.pow(x - x0, 2);
        const ySquared = Math.pow(y - y0, 2);

        return Math.sqrt(xSquared + ySquared);
    }

    /**
     * Вычисляет расстояние от точки до прямой
     * @param x Координата x точки
     * @param y Координата y точки
     * @param x1 Координата x одного конца отрезка
     * @param y1 Координата y одного конца отрезка
     * @param x2 Координата x другого конца отрезка
     * @param y2 Координата y другого конца отрезка
     * @returns {number} Растояние от точки до прямой
     */
    static calcDistance(x, y, x1, y1, x2, y2) {
        // Длина заданного отрезка
        const length = MathUtilities.calcLineSegmentLength(x1, y1, x2, y2);

        const dx = x2 - x1; // Δx
        const dy = y2 - y1; // Δy

        // Удвоенная площадь треугольника с вершинами (x0, y0), (x1, y1) и (x2, y2)
        const doubleArea = Math.abs(dy * x - dx * y + x2 * y1 - y2 * x1);

        return doubleArea / length;
    }
}

export default MathUtilities;