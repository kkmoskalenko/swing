requirejs.config({
    baseUrl: "js",
    paths: {
        mdc: 'lib/material-components-web.min', // https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js
        grid: 'models/grid',
        pendulum: 'models/pendulum',
        limiter: 'models/limiter'
    }
});

require(['application'], function (Application) {
    new Application();
});