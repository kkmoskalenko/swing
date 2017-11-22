define(function () {
    class Pendulum {
        /**
         * Создаёт маятник
         * @param supportX0 Координата точки крепления маятника по оси X
         * @param supportY0 Координата точки крепления маятника по оси Y
         * @param radius Радиус груза (так как он имеет форму шара)
         * @param angle0 Угол начального отклонения маятника (в градусах)
         * @param length Длина подвеса
         * @param deceleration Коэффицент затухания
         * @param run Запущен ли маятник при создании
         */
        constructor(supportX0, supportY0, radius, angle0, length, deceleration, run) {
            this.coef = 400; // Коэффециент масштабирования длины нити
            length *= this.coef;

            // Начальные координаты маятника
            this.x0 = supportX0;
            this.y0 = supportY0 + length;

            // Текущие координаты маятника
            this.x = this.x0;
            this.y = this.y0;

            this.radius = radius;
            this.amplitude = Pendulum.calcAmplitude(angle0, length);
            this.length = length;
            this.deceleration = deceleration;

            this.time = 0; // Время
            this.period = Pendulum.calcPeriod(length / this.coef); // Период колебаний

            this.run = run;
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
         * Конвертирует радианы в градусы
         * @param radians Значение в радианах
         * @returns {number} Значение в градусах
         */
        static degrees(radians) {
            return radians * 180 / Math.PI;
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
         * Вычисляет текущий угол поворота маятника
         * @returns {number} Угол в градусах
         */
        calcAngle() {
            // Длины сторон треугольника
            const a = this.length;
            const b = this.length;
            const c = Pendulum.calcLineSegmentLength(this.x0, this.y0 + this.length / this.coef, this.x, this.y);

            // Длины сторон треугольника, возведённые в квадрат
            const aSquared = Math.pow(a, 2);
            const bSquared = Math.pow(b, 2);
            const cSquared = Math.pow(c, 2);

            // Находим неизвестный угол (в радианах) по преобразованной теореме синусов
            const angle = Math.acos((aSquared + bSquared - cSquared) / (2 * a * b));

            // TODO: Исправить логику
            if (this.x < this.x0) {
                return Pendulum.degrees(-angle);
            }
            else {
                return Pendulum.degrees(angle);
            }
        }

        /**
         * Вычисляет ближайшую точку к указанной, но при этом достижимую подвесом
         * @param x Координата x указанной точки
         * @param y Координата y указанной точки
         * @returns {{x: *, y: *}} Координаты требуемой точки
         */
        calcTheClosestPoint(x, y) {
            const angleInRads = Math.atan2(y - (this.y0 - this.length), x - this.x0);

            return {
                x: this.length * Math.cos(angleInRads) + this.x0,
                y: this.length * Math.sin(angleInRads) + (this.y0 - this.length)
            }
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

            this.drawCord(context);
            this.drawBob(context);
            this.drawSupport(context);
        }
    }

    return Pendulum;
});