define(['grid', 'pendulum'], function (Grid, Pendulum) {
    class CanvasState {
        constructor(canvas) {
            // **** Options! ****
            this.selectionColor = "#F44336"; // Red
            this.selectionWidth = 2;
            this.interval = 30;

            // **** First some setup! ****
            this.canvas = canvas;
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.context = canvas.getContext('2d');

            // Default pendulum options
            this.defaultPendulumOptions = {
                x0: this.width / 2,
                y0: 30,
                radius: 30,
                angle0: 0,
                length: 1,
                deceleration: 0,
                run: false
            };

            // Добавляем маятник
            this.pendulum = new Pendulum(
                this.defaultPendulumOptions.x0,
                this.defaultPendulumOptions.y0,
                this.defaultPendulumOptions.radius,
                this.defaultPendulumOptions.angle0,
                this.defaultPendulumOptions.length,
                this.defaultPendulumOptions.deceleration,
                this.defaultPendulumOptions.run
            );

            // **** Keep track of state! ****
            this.valid = false; // when set to false, the canvas will redraw everything
            this.shapes = [];  // the collection of things to be drawn
            this.dragging = false; // Keep track of when we are dragging the current selected object. In the future we could turn this into an array for multiple selection
            this.selection = null;
            this.dragOffX = 0; // See mousedown and mousemove events for explanation
            this.dragOffY = 0;

            // **** Then events! ****

            // Right here "this" means the CanvasState. But we are making events on the Canvas itself,
            // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
            // Since we still want to use this particular CanvasState in the events we have to save a reference to it.
            // This is our reference!
            const myState = this;

            // Resize the canvas when the window is resized
            window.addEventListener('resize', () => this.resizeCanvas(), false);
            this.resizeCanvas();

            // Fixes a problem where double clicking causes text to get selected on the canvas
            canvas.addEventListener('selectstart', (event) => {
                event.preventDefault();
                return false;
            }, false);

            // Up, down, and move are for dragging
            canvas.addEventListener("mousedown", (event) => CanvasState.handlePointerDown(event.pageX, event.pageY, myState), true);
            canvas.addEventListener("mousemove", (event) => CanvasState.handlePointerMove(event.pageX, event.pageY, myState), true);
            canvas.addEventListener("mouseup", () => CanvasState.handlePointerUp(myState), true);

            // Handle touch events
            canvas.addEventListener('touchstart', (event) => {
                const touches = event.changedTouches;
                const firstTouch = touches[0];

                const mX = firstTouch.pageX;
                const mY = firstTouch.pageY;

                CanvasState.handlePointerDown(mX, mY, myState);

                event.preventDefault();
            }, true);

            canvas.addEventListener('touchmove', (event) => {
                const touches = event.changedTouches;
                const firstTouch = touches[0];

                const mX = firstTouch.pageX;
                const mY = firstTouch.pageY;

                CanvasState.handlePointerMove(mX, mY, myState);

                event.preventDefault();
            }, true);

            canvas.addEventListener('touchend', () => {
                CanvasState.handlePointerUp(myState);

                event.preventDefault();
            }, true);


            setInterval(() => myState.redraw(), myState.interval);
        }

        addShape(shape) {
            const myState = this;
            const listener = function (event) {
                const center = shape.getCenter();

                shape.x = event.pageX - center.x;
                shape.y = event.pageY - center.y;

                myState.shapes.push(shape);
                myState.valid = false;

                myState.canvas.removeEventListener('click', listener)
            };

            this.canvas.addEventListener('click', listener);
        }

        clear() {
            this.context.clearRect(0, 0, this.width, this.height);
        }

        resizeCanvas() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            this.width = window.innerWidth;
            this.height = window.innerHeight;

            this.pendulum.x0 = this.width / 2; // При изменении размера окна, перемещаем точку крепления маятника в середину страницы (по горизонтали)
            this.defaultPendulumOptions.x0 = this.width / 2;

            const run = this.pendulum.run;
            if (run) {
                // Если маятник запущен, то останавливаем маятник на момент перерисовки, вызванной изменением размера окна
                this.pendulum.run = false;
            }

            this.redraw(); // Вызываем перериовку вручную, чтобы это выглядело плавнее

            this.pendulum.run = run; // После перерисовки возвращаем маятник в исходное состоянее (запущен или нет)

            this.valid = false;
        }

        /* While redraw is called as often as the INTERVAL variable demands,
        It only ever does something if the canvas gets invalidated by our code */
        redraw() {
            if (this.valid) return;

            const context = this.context;
            const shapes = this.shapes;
            const interval = this.interval;
            const pendulum = this.pendulum;

            this.clear();

            // Draw the grid in the background
            const grid = new Grid(30, "#CFD8DC"); // 50px, Blue Grey 100
            grid.draw(context);

            // Draw pendulum
            const pendulumIsDragging = this.selection === this.pendulum;
            pendulum.draw(context, interval, pendulumIsDragging);

            // Redraw all shapes
            for (let i = 0; i < shapes.length; i++) {
                const shape = shapes[i];
                // We can skip the drawing of elements that have moved off the screen:
                if (shape.x > this.width || shape.y > this.height ||
                    shape.x + shape.width < 0 || shape.y + shape.height < 0) continue;
                shapes[i].draw(context);
            }

            // redraw selection
            // right now this is just a stroke along the edge of the selected Shape
            if (this.selection !== null) {
                const mySelection = this.selection;

                context.strokeStyle = this.selectionColor;
                context.lineWidth = this.selectionWidth;

                context.beginPath();
                context.arc(mySelection.x, mySelection.y, mySelection.radius, 0, Math.PI * 2); // Допущение: выделение работает только для круглых фигур
                context.stroke();
            }

            // Считаем состояние canvas'а действительным только в том случае, если маятник сейчас не запущен
            if (!pendulum.run) {
                this.valid = true;
            }
        }

        updatePendulumData(angle, length, deceleration) {
            let run;

            // Проверяем, существует ли маятник, и сохраняем нужные параметры
            if (this.pendulum) {
                run = this.pendulum.run;

                if (!Number.isFinite(angle)) {
                    angle = this.pendulum.calcAngle();
                }

                if (!Number.isFinite(length)) {
                    length = this.pendulum.length / this.pendulum.coef;
                }

                if (!Number.isFinite(deceleration)) {
                    deceleration = this.pendulum.deceleration;
                }
            }

            // Если не получилось установить данные от старого маятника, устанавливаем стандартные
            if (!Number.isFinite(angle)) {
                angle = this.defaultPendulumOptions.angle0;
            }

            if (!Number.isFinite(length)) {
                length = this.defaultPendulumOptions.length;
            }

            if (!Number.isFinite(deceleration)) {
                deceleration = this.defaultPendulumOptions.deceleration;
            }

            if (run === undefined || run === null) {
                run = this.defaultPendulumOptions.run;
            }

            // Создаём новый маятник
            this.pendulum = new Pendulum(this.defaultPendulumOptions.x0, this.defaultPendulumOptions.y0, this.defaultPendulumOptions.radius, angle, length, deceleration, run);

            this.valid = false;
        }

        static handlePointerDown(mX, mY, myState) {
            const shapes = myState.shapes;

            // Ищем выделение среди фигур
            for (let i = shapes.length - 1; i >= 0; i--) {
                if (shapes[i].contains(mX, mY)) {
                    const mySelection = shapes[i];

                    // Keep track of where in the object we clicked
                    // so we can move it smoothly (see mousemove)
                    myState.dragOffX = mX - mySelection.x;
                    myState.dragOffY = mY - mySelection.y;

                    myState.dragging = true;
                    myState.selection = mySelection;
                    myState.valid = false;

                    return;
                }
            }

            // Если маятник не запущен, проверяем, выделен ли он
            if (!myState.pendulum.run && myState.pendulum.contains(mX, mY)) {
                const mySelection = myState.pendulum;

                // Keep track of where in the object we clicked
                // so we can move it smoothly (see mousemove)
                myState.dragOffX = mX - mySelection.x;
                myState.dragOffY = mY - mySelection.y;

                myState.dragging = true;
                myState.selection = mySelection;
                myState.valid = false;

                return;
            }

            // haven't returned means we have failed to select anything.
            // If there was an object selected, we deselect it
            if (myState.selection) {
                myState.selection = null;
                myState.valid = false; // Need to clear the old selection border
            }
        }

        static handlePointerMove(mX, mY, myState) {
            if (myState.dragging) {
                // We don't want to drag the object by its top-left corner, we want to drag it
                // from where we clicked. That's why we saved the offset and use it here
                const mouseX = mX - myState.dragOffX;
                const mouseY = mY - myState.dragOffY;

                if (myState.selection === myState.pendulum) {
                    // При попытке переместить груз маятника, ограничиваем траекторию перемещения
                    // Груз маятника может двигаться только по окружности с центром в точке крепления и радиусом равным длине шнура

                    const point = myState.pendulum.calcTheClosestPoint(mouseX, mouseY);

                    myState.selection.x = point.x;
                    myState.selection.y = point.y;
                }
                else {
                    myState.selection.x = mouseX;
                    myState.selection.y = mouseY;
                }

                myState.valid = false; // Something's dragging so we must redraw
            }
        }

        static handlePointerUp(myState) {
            // Если при отпускании мыши изменился угол маятника, обновляем эти данные
            if (myState.selection === myState.pendulum) {
                const newAngle = myState.pendulum.calcAngle();

                if (newAngle !== myState.pendulum.angle0) {
                    myState.updatePendulumData(newAngle, null, null);
                }
            }

            myState.dragging = false;
            myState.selection = null;
            myState.valid = false;
        }
    }

    return CanvasState;
});