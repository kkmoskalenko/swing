define(function () {
    class Pendulum {
        /**
         * Создаёт маятник
         * @param supportX0 Координата точки крепления маятника по оси X
         * @param supportY0 Координата точки крепления маятника по оси Y
         * @param radius Радиус груза (так как он имеет форму шара)
         * @param angle Угол начального отклонения маятника (в градусах)
         * @param length Длина подвеса
         * @param deceleration Коэффицент затухания
         */
        constructor(supportX0, supportY0, radius, angle, length, deceleration) {
            const coef = 400; // Коэффециент масштабирования длины нити
            length *= coef;

            // Начальные координаты маятника
            this.x0 = supportX0;
            this.y0 = supportY0 + length;

            // Текущие координаты маятника
            this.x = this.x0;
            this.y = this.y0;

            this.radius = radius;
            this.amplitude = Pendulum.calcAmplitude(angle, length);
            this.length = length;
            this.deceleration = deceleration;

            this.time = 0; // Время
            this.period = Pendulum.calcPeriod(length / coef); // Период колебаний

            this.run = true; // Запущен ли маятник при создании
        }

        /**
         * Вычисляет амплитуду колебания
         * @param angle Угол начального отклонения (в градусах)
         * @param length Длина подвеса
         * @returns {number} Амплитуда колебания
         */
        static calcAmplitude(angle, length) {
            const angleInRad = Pendulum.radians(angle);

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
         * Конвертирует градусы в радианы
         * @param degrees Значение в градусах
         * @returns {number} Значение в радианах
         */
        static radians(degrees) {
            return degrees * Math.PI / 180;
        };

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
         * Рисует точку крепления маятника
         * @param context Контекст 2D рендеринга для элемента canvas
         */
        drawSupport(context) {
            // Точка
            context.fillStyle = "#000000"; // Black

            context.beginPath();
            context.arc(this.x0, this.y0 - this.length, 6, 0, Math.PI * 2);
            context.fill();

            // Окружность вокрун точки
            context.strokeStyle = "#795548"; // Brown
            context.lineWidth = 4;

            context.beginPath();
            context.arc(this.x0, this.y0 - this.length, 10, 0, Math.PI * 2);
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
            drawLine(this.x0, this.y0 - this.length, this.x, this.y, "#000000"); // Black

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
         * Определяет, находится ли данная точка внутри фигуры
         * @param mx Координата x точки
         * @param my Координата y точки
         */
        contains(mx, my) {

        }

        /**
         * Рисует маятник целиком
         * @param context Контекст 2D рендеринга для элемента canvas
         * @param interval Интервал, через который происходит перерисовка canvas
         */
        draw(context, interval) {
            if (this.run) {
                this.time += interval;
            }

            this.x = this.calcX() + this.x0;
            this.y = this.calcY() + this.y0;

            this.drawCord(context);
            this.drawBob(context);
            this.drawSupport(context);
        }
    }

    return Pendulum;
});