define(["mdc", "canvasState"], function (mdc, CanvasState) {
    class Application {
        /**
         * Создаёт новое приложение
         */
        constructor() {
            this.canvas = document.getElementById("canvas");
            this.canvasState = new CanvasState(this.canvas);

            // MDC
            const MDCTextField = mdc.textField.MDCTextField;
            const MDCSnackbar = mdc.snackbar.MDCSnackbar;

            // Инициализируем поля ввода MDC
            this.inputFields = Array.from(document.querySelectorAll(".mdc-text-field"));
            this.inputFields.forEach((inputField) => {
                new MDCTextField(inputField);
            });

            // Инициализируем обычные поля ввода
            this.lengthEl = document.querySelector("#length");
            this.decelerationEl = document.querySelector("#deceleration");

            // Заполняем поля в зависимости от стандартных значений маятника
            this.lengthEl.value = this.canvasState.defaultPendulumOptions.length;
            this.decelerationEl.value = this.canvasState.defaultPendulumOptions.deceleration;

            // Инициализируем Snackbar
            this.snackbar = new MDCSnackbar(document.querySelector(".mdc-snackbar"));

            // Инициализируем FAB
            this.fab = document.querySelector(".mdc-fab");
            mdc.ripple.MDCRipple.attachTo(this.fab);

            // Инициализируем переключатель
            this.toggleEl = document.querySelector("#switch");

            // Устанавливаем положение переключателя в зависимости от стандартных значений маятника
            this.toggleEl.checked = this.canvasState.defaultPendulumOptions.run;

            // Обрабатываем случай, если маятник был запущен при запуске приложения
            this.toggleChangeHandler();

            // Регистрируем обработчики событий для элементов управления
            this.lengthEl.addEventListener("change", () => {
                if (this.lengthEl.checkValidity()) {
                    this.canvasState.updatePendulumData(null, parseFloat(this.lengthEl.value), null);
                }
            });

            this.decelerationEl.addEventListener("change", () => {
                if (this.decelerationEl.checkValidity()) {
                    this.canvasState.updatePendulumData(null, null, parseFloat(this.decelerationEl.value));
                }
            });

            this.toggleEl.addEventListener("change", () => this.toggleChangeHandler());

            this.fab.addEventListener("click", () => this.fabClickHandler());
        }

        /**
         * Обрабатывает изменение положения переключателя
         */
        toggleChangeHandler() {
            this.canvasState.pendulum.run = this.toggleEl.checked;
            this.canvasState.valid = false;

            // Блокируем или разблокируем каждое поле ввода, в зависимости от положения переключателя
            this.inputFields.forEach((inputField => {
                if (this.toggleEl.checked) {
                    this.lengthEl.disabled = true;
                    this.decelerationEl.disabled = true;

                    inputField.classList.add("mdc-text-field--disabled");
                }
                else {
                    this.lengthEl.disabled = false;
                    this.decelerationEl.disabled = false;

                    inputField.classList.remove("mdc-text-field--disabled");
                }
            }));
        }

        /**
         * Обрабатывает нажатие плавающей кнопки
         */
        fabClickHandler() {
            const foundation = this.snackbar.foundation_;

            const canvasClickHandler = (event) => {
                let x, y;

                if (event.type === "click") {
                    x = event.pageX;
                    y = event.pageY;
                }
                else {
                    const firstTouch = event.changedTouches[0];

                    x = firstTouch.pageX;
                    y = firstTouch.pageY;
                }

                this.canvasState.addLimiter(x, y);

                this.canvas.removeEventListener("click", canvasClickHandler);
                this.canvas.removeEventListener("touchstart", canvasClickHandler);

                foundation.cleanup_();
            };

            const dataObj = {
                message: "Нажмите в том месте страницы, где хотите разместить ограничитель",
                actionText: "Отмена",
                multiline: true,
                actionHandler: () => {
                    this.canvas.removeEventListener("click", canvasClickHandler);
                    this.canvas.removeEventListener("touchstart", canvasClickHandler);
                }
            };

            if (!foundation.active_) {
                this.snackbar.show(dataObj);
                this.canvas.addEventListener("click", canvasClickHandler);
                this.canvas.addEventListener("touchstart", canvasClickHandler);
            }

            // Очищаем timeout, чтобы Snackbar не закрылся автоматически
            clearTimeout(foundation.timeoutId_);
        }
    }

    return Application;
});