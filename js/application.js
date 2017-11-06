define(['mdc', 'canvasState', 'grid', 'pendulum', 'limiter'], function (mdc, CanvasState, Grid, Pendulum, Limiter) {
    class Application {
        constructor() {
            const canvas = document.getElementById('canvas');
            this.canvasState = new CanvasState(canvas);
        }
    }

    return Application;
});