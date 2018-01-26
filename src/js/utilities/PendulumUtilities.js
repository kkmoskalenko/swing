import MathUtilities from "./MathUtilities";

class PendulumUtilities {
    /**
     * Вычисляет амплитуду колебания
     * @param angle Угол начального отклонения (в градусах)
     * @param length Длина подвеса
     * @returns {number} Амплитуда колебания
     */
    static calcAmplitude(angle, length) {
        const angleInRad = MathUtilities.radians(angle);

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
}

export default PendulumUtilities;