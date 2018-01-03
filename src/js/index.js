import Application from "./Application";

// CSS
import "@material/card/dist/mdc.card.min.css";
import "@material/fab/dist/mdc.fab.min.css";
import "@material/ripple/dist/mdc.ripple.min.css";
import "@material/snackbar/dist/mdc.snackbar.min.css";
import "@material/switch/dist/mdc.switch.min.css";
import "@material/textfield/dist/mdc.textfield.min.css";
import "../style.css";

window.addEventListener("load", () => {
    new Application();
});