define(['mdc', 'canvasState', 'grid', 'limiter'], function (mdc, CanvasState, Grid, Limiter) {
    class Application {
        constructor() {
            const canvas = document.getElementById('canvas');
            this.canvasState = new CanvasState(canvas);
        }
    }

    return Application;
});