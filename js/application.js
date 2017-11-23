define(['mdc', 'canvasState'], function (mdc, CanvasState) {
    class Application {
        constructor() {
            const canvas = document.getElementById('canvas');
            this.canvasState = new CanvasState(canvas);

            // MDC
            const MDCTextField = mdc.textField.MDCTextField;

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

            // Инициализируем переключатель
            this.toggleEl = document.querySelector("#switch");

            // Устанавливаем положение переключателя в зависимости от стандартных значений маятника
            this.toggleEl.checked = this.canvasState.defaultPendulumOptions.run;

            // Обрабатываем случай, если маятник был запущен при запуске приложения
            this.toggleChangeHandler();

            // Регистрируем обработчики событий для полей и переключателя
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

            this.toggleEl.addEventListener('change', () => this.toggleChangeHandler());
        }

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
    }

    return Application;
});