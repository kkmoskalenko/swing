import Grid from "./models/Grid";
import Pendulum from "./models/Pendulum";
import Limiter from "./models/Limiter";

class CanvasState {
    /**
     * Создаёт новый CanvasState
     * @param canvas HTML5 элемент "Canvas"
     * @param callback Метод, который должен вызываться, когда изменится длина маятника
     */
    constructor(canvas, callback) {
        // Настройки по умолчанию
        this.selectionColor = "#F44336"; // Red
        this.selectionWidth = 2;
        this.interval = 30;
        this.defaultPendulumOptions = {
            supportX: window.innerWidth / 2,
            supportY: 60,
            radius: 30,
            angle0: 0,
            length: 1,
            deceleration: 0,
            run: false
        };


        this.canvas = canvas;
        this.context = canvas.getContext("2d");

        this.callback = callback;

        this.valid = false; // Если это значение ложно, всё полотно будет перерисовано
        this.shapes = [];  // Массив с объектами, которые будут нарисованы

        this.selection = null; // Выбранный объект
        this.dragging = false; // Хранит информацию, перемещают ли выбранный объект в данный момент

        this.dragOffX = 0;
        this.dragOffY = 0;

        // Добавляем маятник
        this.pendulum = new Pendulum(
            this.defaultPendulumOptions.supportX,
            this.defaultPendulumOptions.supportY,
            this.defaultPendulumOptions.radius,
            this.defaultPendulumOptions.angle0,
            this.defaultPendulumOptions.length,
            this.defaultPendulumOptions.deceleration,
            this.defaultPendulumOptions.run
        );


        // Обработка изменения размера окна
        window.addEventListener("resize", () => this.resizeCanvas(), false);
        this.resizeCanvas();

        // Исправляет ошибку, приводящую к выделению текста
        canvas.addEventListener("selectstart", (event) => {
            event.preventDefault();

            return false;
        }, false);

        // Обработка перетаскивания объектов мышью
        canvas.addEventListener("mousedown", (event) => this.handlePointerDown(event.pageX, event.pageY), true);
        canvas.addEventListener("mousemove", (event) => this.handlePointerMove(event.pageX, event.pageY), true);
        canvas.addEventListener("mouseup", () => this.handlePointerUp(), true);

        // Обработка перетаскивания объектов на сенсорных экранах
        canvas.addEventListener("touchstart", (event) => {
            const touches = event.changedTouches;
            const firstTouch = touches[0];

            const x = firstTouch.pageX;
            const y = firstTouch.pageY;

            this.handlePointerDown(x, y);

            event.preventDefault();
        }, true);

        canvas.addEventListener("touchmove", (event) => {
            const touches = event.changedTouches;
            const firstTouch = touches[0];

            const x = firstTouch.pageX;
            const y = firstTouch.pageY;

            this.handlePointerMove(x, y);

            event.preventDefault();
        }, true);

        canvas.addEventListener("touchend", () => {
            this.handlePointerUp();

            event.preventDefault();
        }, true);


        // Запуска таймера перерисовки
        setInterval(() => this.redraw(), this.interval);
    }

    /**
     * Очищает холст
     */
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Выполняет все необходимые операции для конеретного отображения приложения после изменения размера окна
     */
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.valid = false;
    }

    /**
     * Перерисовывает всё содержимое холста
     */
    redraw() {
        // Если состояние полотна ещё не изменялось, отменяем перерисовку
        if (this.valid) return;

        const context = this.context;
        const shapes = this.shapes;
        const interval = this.interval;
        const pendulum = this.pendulum;

        // Очищаем полотно
        this.clear();

        // Рисуем координатную плоскость на заднем плане
        const grid = new Grid(30, "#CFD8DC", "#90A4AE"); // Цвет сетки: Blue Grey 100. Цвет направляющей: Blue Grey 300.
        grid.draw(context);
        grid.drawGuide(context, pendulum.x0);

        // Рисуем маятник
        const pendulumIsDragging = this.selection === this.pendulum;
        pendulum.draw(context, interval, pendulumIsDragging);

        // Рисуем все фигуры
        for (let i = 0; i < shapes.length; i++) {
            const shape = shapes[i];

            // Пропускаем рисование объектов, которые находятся за границами полотна
            if (shape.x > this.canvas.width || shape.y > this.canvas.height ||
                shape.x + shape.width < 0 || shape.y + shape.height < 0) {
                continue;
            }

            // Точки, задающие положение нити маятника
            const vertices = pendulum.getCordVertices();
            const penultimateVertex = vertices[vertices.length - 2]; // Предпоследняя вершина
            const lastVertex = vertices[vertices.length - 1]; // Последняя вершина (сам груз)

            // Сцепляем маятник с ограничителем только если это событие произошло на последнем отрезке подвеса
            if (shape.adjoinsTheLineSegment(penultimateVertex.x, penultimateVertex.y, lastVertex.x, lastVertex.y)) {
                if (pendulum.addVertex(shape.x, shape.y)) {
                    // Произошло изменение длины последнего участка шнура, поэтому вызываем callback (оповещаем)
                    this.callback();

                    // TODO: Заменить вывод в консоль на логирование
                    console.log(`Подвес маятника встретился с препятствием в точке (${shape.x}, ${shape.y}).`);
                }
            }


            shape.draw(context);
        }

        // Рисуем выделение – обводку вокруг выделенной фигуры
        if (this.selection !== null) {
            const selection = this.selection;

            context.strokeStyle = this.selectionColor;
            context.lineWidth = this.selectionWidth;

            context.beginPath();
            context.arc(selection.x, selection.y, selection.radius, 0, Math.PI * 2);
            context.stroke();
        }

        // Считаем состояние canvas'а действительным только в том случае, если маятник сейчас не запущен
        if (!pendulum.run) {
            this.valid = true;
        }
    }

    /**
     * Добавляет точечный ограничитель по указанным координатам
     * @param x Координата x ограничителя
     * @param y Координата y ограничителя
     */
    addLimiter(x, y) {
        const limiter = new Limiter(x, y);

        this.shapes.push(limiter);
        this.valid = false;
    }

    /**
     * Обрабатывает нажатие кнопки указывающего устройства
     * @param x Координата x указателя
     * @param y Координата y указателя
     */
    handlePointerDown(x, y) {
        const shapes = this.shapes;
        let selection;

        // Ищем выделение среди фигур
        for (let i = shapes.length - 1; i >= 0; i--) {
            if (shapes[i].contains(x, y)) {
                selection = shapes[i];
            }
        }

        // Если маятник не запущен, проверяем, выделен ли он
        if (!this.pendulum.run && this.pendulum.contains(x, y)) {
            selection = this.pendulum;
        }

        if (selection !== undefined) {
            this.dragOffX = x - selection.x;
            this.dragOffY = y - selection.y;

            this.dragging = true;
            this.selection = selection;
            this.valid = false;
        }
    }

    /**
     * Обрабатывает движение указателя
     * @param x Координата x указателя
     * @param y Координата y указателя
     */
    handlePointerMove(x, y) {
        if (this.dragging) {
            const mouseX = x - this.dragOffX;
            const mouseY = y - this.dragOffY;

            if (this.selection === this.pendulum) {
                // При попытке переместить груз маятника, ограничиваем траекторию перемещения
                // Груз маятника может двигаться только по окружности с центром в точке крепления и радиусом равным длине шнура
                const point = this.pendulum.calcTheClosestPoint(mouseX, mouseY);

                this.selection.x = point.x;
                this.selection.y = point.y;
            }
            else {
                this.selection.x = mouseX;
                this.selection.y = mouseY;
            }

            this.valid = false;
        }
    }

    /**
     * Обрабатывает отпускание кнопки указывающего устройства
     */
    handlePointerUp() {
        // Обновляем угол отклонения маятника
        if (this.selection === this.pendulum) {
            const newAngle = this.pendulum.calcAngle();
            this.pendulum.setAngle(newAngle);
        }

        this.dragging = false;

        // Снимаем выделение
        this.selection = null;
        this.valid = false;
    }
}

export default CanvasState;