class PendulumUtilities {
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
     * Вычисляет амплитуду колебания
     * @param angle Угол начального отклонения (в градусах)
     * @param length Длина подвеса
     * @returns {number} Амплитуда колебания
     */
    static calcAmplitude(angle, length) {
        const angleInRad = PendulumUtilities.radians(angle);

        return Math.sin(angleInRad) * length;
    }

    /**
     * Вычисляет период колебания
     * @param length Длина подвеса
     * @returns {number} Период колебания
     */
    static calcPeriod(length) {
        const g = 9.80665; // Среднее ускорение свободного падения на Земле

        return 2 * Math.PI * Math.sqrt(length / g);
    }

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
}

export default PendulumUtilities;