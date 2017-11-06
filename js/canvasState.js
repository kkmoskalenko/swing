define(['grid'], function (Grid) {
    class CanvasState {
        constructor(canvas) {
            // **** First some setup! ****
            this.canvas = canvas;
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.context = canvas.getContext('2d');

            // **** Keep track of state! ****
            this.valid = false; // when set to false, the canvas will redraw everything
            this.shapes = [];  // the collection of things to be drawn
            this.dragging = false; // Keep track of when we are dragging the current selected object. In the future we could turn this into an array for multiple selection
            this.selection = null;
            this.dragoffx = 0; // See mousedown and mousemove events for explanation
            this.dragoffy = 0;

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
            canvas.addEventListener('selectstart', function (e) {
                e.preventDefault();
                return false;
            }, false);

            // Up, down, and move are for dragging
            canvas.addEventListener('mousedown', function (e) {
                const mouse = CanvasState.getMouse(e);
                const mx = mouse.x;
                const my = mouse.y;
                const shapes = myState.shapes;
                for (let i = shapes.length - 1; i >= 0; i--) {
                    if (shapes[i].contains(mx, my)) {
                        const mySelection = shapes[i];
                        // Keep track of where in the object we clicked
                        // so we can move it smoothly (see mousemove)
                        myState.dragoffx = mx - mySelection.x;
                        myState.dragoffy = my - mySelection.y;
                        myState.dragging = true;
                        myState.selection = mySelection;
                        myState.valid = false;
                        return;
                    }
                }
                // haven't returned means we have failed to select anything.
                // If there was an object selected, we deselect it
                if (myState.selection) {
                    myState.selection = null;
                    myState.valid = false; // Need to clear the old selection border
                }
            }, true);

            canvas.addEventListener('mousemove', function (e) {
                if (myState.dragging) {
                    const mouse = CanvasState.getMouse(e);
                    // We don't want to drag the object by its top-left corner, we want to drag it
                    // from where we clicked. That's why we saved the offset and use it here
                    myState.selection.x = mouse.x - myState.dragoffx;
                    myState.selection.y = mouse.y - myState.dragoffy;
                    myState.valid = false; // Something's dragging so we must redraw
                }
            }, true);

            canvas.addEventListener('mouseup', function () {
                myState.dragging = false;
            }, true);

            // **** Options! ****
            this.selectionColor = '#CC0000';
            this.selectionWidth = 2;
            this.interval = 30;
            setInterval(() => myState.redraw(), myState.interval);
        }

        // Creates an object with x and y defined, set to the mouse position relative to the state's canvas
        static getMouse(e) {
            // We return a simple javascript object (a hash) with x and y defined
            return {x: e.pageX, y: e.pageY};
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

            this.valid = false;
            this.redraw(); // Call redraw() immediately, without waiting until setInterval() does it

            /* In this case, redraw() takes an average of 0.5ms
             * Whereas setInterval() method is set to a few dozen milliseconds
             * That's why calling redraw() manually makes the resize animation smoother */
        }

        /* While redraw is called as often as the INTERVAL variable demands,
        It only ever does something if the canvas gets invalidated by our code */
        redraw() {
            // if our state is invalid, redraw and validate!
            if (!this.valid) {
                const context = this.context;
                const shapes = this.shapes;
                this.clear();

                // Draw the grid in the background
                const grid = new Grid(30, "#CFD8DC"); // 50px, Blue Grey 100
                grid.draw(this.context);

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
                    context.strokeStyle = this.selectionColor;
                    context.lineWidth = this.selectionWidth;
                    const mySel = this.selection;
                    context.strokeRect(mySel.x, mySel.y, mySel.width, mySel.height);
                }

                this.valid = true;
            }
        }
    }

    return CanvasState;
});