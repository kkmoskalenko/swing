define(['mdc', 'canvasState'], function (mdc, CanvasState) {
    class Application {
        constructor() {
            const canvas = document.getElementById('canvas');
            this.canvasState = new CanvasState(canvas);

            // MDC
            const MDCTextField = mdc.textField.MDCTextField;

            // Инициализируем поля ввода MDC
            const inputFields = Array.from(document.querySelectorAll(".mdc-text-field"));
            inputFields.forEach((inputField) => {
                new MDCTextField(inputField);
            });

            // Инициализируем обычные поля ввода
            const lengthEl = document.querySelector("#length");
            const decelerationEl = document.querySelector("#deceleration");

            // Инициализируем переключатель
            const toggle = document.querySelector("#switch");

            // Регистрируем обработчики событий для полей и переключателя
            lengthEl.addEventListener("change", () => {
                if (lengthEl.checkValidity()) {
                    this.canvasState.updatePendulumData(null, parseFloat(lengthEl.value), null);
                }
            });

            decelerationEl.addEventListener("change", () => {
                if (decelerationEl.checkValidity()) {
                    this.canvasState.updatePendulumData(null, null, parseFloat(decelerationEl.value));
                }
            });

            toggle.addEventListener('change', () => {
                this.canvasState.pendulum.run = toggle.checked;
                this.canvasState.valid = false;

                // Блокируем или разблокируем каждое поле ввода, в зависимости от положения переключателя
                lengthEl.disabled = !lengthEl.disabled;
                decelerationEl.disabled = !decelerationEl.disabled;

                inputFields.forEach((inputField => {
                    if (toggle.checked) {
                        inputField.classList.add("mdc-text-field--disabled");
                    }
                    else {
                        inputField.classList.remove("mdc-text-field--disabled");
                    }
                }));
            });
        }
    }

    return Application;
});