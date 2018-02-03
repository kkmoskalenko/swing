import {MDCTextField} from "@material/textfield";
import {MDCSnackbar} from "@material/snackbar";
import {MDCRipple} from "@material/ripple";
import CanvasState from "./CanvasState";

class Application {
    /**
     * Создаёт новое приложение
     */
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.canvasState = new CanvasState(this.canvas, () => this.setLengthFieldValue());

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
        MDCRipple.attachTo(this.fab);

        // Инициализируем переключатель
        this.toggleEl = document.querySelector("#switch");

        // Устанавливаем положение переключателя в зависимости от стандартных значений маятника
        this.toggleEl.checked = this.canvasState.defaultPendulumOptions.run;

        // Обрабатываем случай, если маятник был запущен при запуске приложения
        this.handleToggleChange();

        // Регистрируем обработчики событий для элементов управления
        this.lengthEl.addEventListener("change", () => {
            if (this.lengthEl.checkValidity()) {
                const lengthValue = parseFloat(this.lengthEl.value);

                this.canvasState.pendulum.setLength(lengthValue);
                this.canvasState.valid = false;
            }
        });

        this.decelerationEl.addEventListener("change", () => {
            if (this.decelerationEl.checkValidity()) {
                const decelerationValue = parseFloat(this.decelerationEl.value);

                this.canvasState.pendulum.setDeceleration(decelerationValue);
                this.canvasState.valid = false;
            }
        });

        this.toggleEl.addEventListener("change", () => this.handleToggleChange());

        this.fab.addEventListener("click", () => this.handleFabClick());
    }

    /**
     * Обрабатывает изменение положения переключателя
     */
    handleToggleChange() {
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
    handleFabClick() {
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

    /**
     * Получает длину  подвеса последнего участка маятника и устанавливает это число в поле ввода
     */
    setLengthFieldValue() {
        const pendulum = this.canvasState.pendulum;
        const length = pendulum.length / pendulum.coef;

        this.lengthEl.value = length.toFixed(2);
    }
}

export default Application;