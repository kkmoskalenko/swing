import PendulumUtilities from "../utilities/PendulumUtilities";
import MathUtilities from "../utilities/MathUtilities";

class Pendulum {
    /**
     * Создаёт маятник
     * @param supportX Координата точки крепления маятника по оси X
     * @param supportY Координата точки крепления маятника по оси Y
     * @param radius Радиус груза (так как он имеет форму шара)
     * @param angle0 Угол начального отклонения маятника (в градусах)
     * @param length Длина подвеса
     * @param deceleration Коэффицент затухания
     * @param run Запущен ли маятник при создании
     */
    constructor(supportX, supportY, radius, angle0, length, deceleration, run) {
        this.coef = 400; // Коэффециент масштабирования длины нити

        // Начальные координаты маятника
        this.x0 = supportX;
        this.y0 = supportY;

        // Текущие координаты маятника
        this.x = this.x0;
        this.y = this.y0;

        // Массив координат, задающих положение подвеса
        this.vertices = [];
        this.vertices.push({
            x: supportX,
            y: supportY
        });

        this.radius = radius;

        this.setAngle(angle0);
        this.setLength(length);
        this.setDeceleration(deceleration);

        this.run = run;
    }

    /**
     * Вычисляет предварительное значение x (без учёта начальных координат)
     * @returns {number} Значение x
     */
    calcX() {
        const angularFrequency = (2 * Math.PI) / this.period; //  Циклическая частота (ω = [1 рад/с])
        const deceleration = Math.pow(Math.E, -this.deceleration * this.getTime());

        // В данном случае начальная фаза равна нулю (φ0 = 0)
        return this.amplitude * Math.cos(angularFrequency * this.getTime()) * deceleration;
    }

    /**
     * Вычисляет предварительное значение y (без учёта начальных координат)
     * @returns {number} Значение y
     */
    calcY() {
        const lengthSquared = Math.pow(this.length, 2);
        const xSquared = Math.pow(this.calcX(), 2);

        return Math.sqrt(lengthSquared - xSquared) - this.length;
    }

    /**
     * Возвращает текущее время в секундах
     * @returns {number} Текущее время в секундах
     */
    getTime() {
        return this.time / 1000;
    }

    /**
     * Вычисляет текущий угол поворота маятника
     * @returns {number} Угол в градусах
     */
    calcAngle() {
        const lastVertex = this.getLastVertex();

        // Длины сторон треугольника
        const a = this.length;
        const b = this.length;
        const c = MathUtilities.calcLineSegmentLength(lastVertex.x, lastVertex.y + this.length, this.x, this.y);

        // Длины сторон треугольника, возведённые в квадрат
        const aSquared = Math.pow(a, 2);
        const bSquared = Math.pow(b, 2);
        const cSquared = Math.pow(c, 2);

        // Находим неизвестный угол (в радианах) по преобразованной теореме синусов
        let angle = Math.acos((aSquared + bSquared - cSquared) / (2 * a * b));
        angle = this.x < this.x0 ? -angle : angle;

        return Math.round(
            MathUtilities.degrees(angle)
        );
    }

    /**
     * Вычисляет длину последнего (активного) участка подвеса маятника
     * @returns {number} Вычисленная длина
     */
    calcLength() {
        const lastVertex = this.getLastVertex();

        return MathUtilities.calcLineSegmentLength(lastVertex.x, lastVertex.y, this.x, this.y);
    }

    /**
     * Вычисляет ближайшую точку к указанной, но при этом достижимую подвесом
     * @param x Координата x указанной точки
     * @param y Координата y указанной точки
     * @returns {{x: *, y: *}} Координаты требуемой точки
     */
    calcTheClosestPoint(x, y) {
        const lastVertex = this.getLastVertex();
        const angleInRads = Math.atan2(y - lastVertex.y, x - lastVertex.x);

        return {
            x: this.length * Math.cos(angleInRads) + lastVertex.x,
            y: this.length * Math.sin(angleInRads) + lastVertex.y
        }
    }

    /**
     * Возращает пары координат, задающие положение нити, на которой висит груз
     * @returns {*[]} Массив пар координат (x и y)
     */
    getCordVertices() {
        const vertices = Object.assign([], this.vertices);

        vertices.push({
            x: this.x,
            y: this.y
        });

        return vertices;
    }

    /**
     * Возвращает координаты последней точки крепления маятника
     * @returns {*} Пару координат: x и y
     */
    getLastVertex() {
        return this.vertices[this.vertices.length - 1];
    }

    /**
     * Добавляет точку, в которой нить маятника будет изогнута
     * @param x Координата x вершины
     * @param y Координата y вершины
     * @returns {boolean} Удалось ли добавить вершину
     */
    addVertex(x, y) {
        const newVertex = {
            x: x,
            y: y
        };

        // Если эта вершина уже добавлена, не добавляем её
        if (this.vertices.some(vertex =>
                vertex.x === newVertex.x &&
                vertex.y === newVertex.y)) {
            return false;
        }
        else {
            const angle = this.calcAngle();

            this.vertices.push(newVertex);

            // Во время встречи с ограничителем, мгновенно изменяется длина подвеса маятника и угловая скорость
            this.setLength(this.calcLength() / this.coef);
            this.setAngle(angle);

            return true;
        }
    }

    /**
     * Рисует точку крепления маятника
     * @param context Контекст 2D рендеринга для элемента canvas
     */
    drawSupport(context) {
        const supportX = this.vertices[0].x;
        const supportY = this.vertices[0].y;

        // Точка
        context.fillStyle = "#000000"; // Black

        context.beginPath();
        context.arc(supportX, supportY, 6, 0, Math.PI * 2);
        context.fill();

        // Окружность вокрун точки
        context.strokeStyle = "#795548"; // Brown
        context.lineWidth = 4;

        context.beginPath();
        context.arc(supportX, supportY, 10, 0, Math.PI * 2);
        context.stroke();
    }

    /**
     * Рисует груз
     * @param context Контекст 2D рендеринга для элемента canvas
     */
    drawBob(context) {
        context.fillStyle = "#FFC107"; // Amber

        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
    }

    /**
     * Рисует шнур/стержень (cord/rod), на котором висит груз
     * @param context Контекст 2D рендеринга для элемента canvas
     */
    drawCord(context) {
        const vertices = this.getCordVertices();

        for (let i = 0; i < vertices.length; i++) {

            // Останавливаем цикл, когда дошли до последней вершины
            if (i + 1 === vertices.length) {
                break;
            }

            const vertex = vertices[i];
            const nextVertex = vertices[i + 1];

            drawLine(vertex.x, vertex.y, nextVertex.x, nextVertex.y, "#000000"); // Black
        }

        /**
         * Рисует отрезок
         * @param x0 Начальная координата x
         * @param y0 Начальная координата y
         * @param x Конечная координата x
         * @param y Конечная координата y
         * @param color Цвет отрезка
         */
        function drawLine(x0, y0, x, y, color) {
            context.beginPath();
            context.lineWidth = 1;
            context.strokeStyle = color;
            context.moveTo(x0, y0);
            context.lineTo(x, y);
            context.closePath();
            context.stroke();
        }
    }

    /**
     * Рисует угол отклонения маятника
     * @param context Контекст 2D рендеринга для элемента canvas
     */
    drawAngle(context) {
        const lastVertex = this.getLastVertex();

        const cX = lastVertex.x;
        const cY = lastVertex.y;

        const radius = 60; // Радиус значка угла
        const startAngle = 0.5 * Math.PI;
        const endAngle = MathUtilities.radians(90 - this.calcAngle());
        const counterClockwise = endAngle < startAngle;

        context.fillStyle = "rgba(244, 67, 54, 0.5)"; // Red, 50% opacity

        // Рисуем значок угла
        context.beginPath();
        context.moveTo(cX, cY);
        context.arc(cX, cY, radius, startAngle, endAngle, counterClockwise);
        context.lineTo(cX, cY);
        context.fill();
    }

    /**
     * Отображает значение угла отклонения маятника
     * @param context Контекст 2D рендеринга для элемента canvas
     */
    writeAngleValue(context) {
        const lastVertex = this.getLastVertex();
        const angle = this.calcAngle() + "°";

        const x = lastVertex.x;
        const y = lastVertex.y - 30;

        context.fillStyle = "#000000"; // Black
        context.font = "30px sans-serif";
        context.textAlign = "center";
        context.fillText(angle, x, y);
    }

    /**
     * Определяет, находится ли данная точка внутри груза маятника
     * @param mx Координата x точки
     * @param my Координата y точки
     * @returns {boolean} Находится ли точка внутри груза маятника
     */
    contains(mx, my) {
        const xSquared = Math.pow(mx - this.x, 2);
        const ySquared = Math.pow(my - this.y, 2);
        const radiusSquared = Math.pow(this.radius, 2);

        return xSquared + ySquared < radiusSquared;
    }

    /**
     * Рисует маятник целиком
     * @param context Контекст 2D рендеринга для элемента canvas
     * @param interval Интервал, через который происходит перерисовка canvas
     * @param dragging Находится ли маятник сейчас в режиме перетаскивания
     */
    draw(context, interval, dragging) {
        if (this.run) {
            this.time += interval;
        }

        if (!dragging) {
            this.x = this.calcX() + this.x0;
            this.y = this.calcY() + this.y0;
        }

        // Если маятник не запущен, рисуем угол поворота
        if (!this.run) {
            this.writeAngleValue(context);
            this.drawAngle(context);
        }

        this.drawCord(context);
        this.drawBob(context);
        this.drawSupport(context);
    }

    /**
     * Заменяет текущий угол отклонения маятника на указанное значение
     * @param angle Угол отклонения маятника (в градусах)
     */
    setAngle(angle) {
        // TODO: Добавить поддержку углов <-90° и >90°

        if (angle === null) {
            return;
        }

        this.angle0 = angle;
        this.amplitude = PendulumUtilities.calcAmplitude(angle, this.length);

        this.time = 0;
    }

    // FIXME: Иногда изменение длины подвеса или коэффицента затухания, может привести к изменению угла отклонения
    // Это происходит, когда угол был установлен не вручную, а после остановки маятника

    /**
     * Заменяет текущую длину подвеса маятника на указанное значение
     * @param length Длина подвеса маятника
     */
    setLength(length) {
        if (length === null) {
            return;
        }

        const lastVertex = this.getLastVertex();
        length *= this.coef;

        this.x0 = lastVertex.x;
        this.y0 = lastVertex.y + length;
        this.length = length;

        this.amplitude = PendulumUtilities.calcAmplitude(this.angle0, length); // Амплитуда колебания
        this.period = PendulumUtilities.calcPeriod(length / this.coef); // Период колебаний
    }

    /**
     * Заменяет текущий коэффицент затухания маятника на указанное значение
     * @param deceleration Коэффицент затухания маятника
     */
    setDeceleration(deceleration) {
        if (deceleration === null) {
            return;
        }

        this.deceleration = deceleration;
    }
}

export default Pendulum;