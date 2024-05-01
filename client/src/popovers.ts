import { createSignal } from "solid-js";

const [showError, setShowError] = createSignal(false);

const [errorMessage, setErrorMessage] = createSignal("");

function showErrorPopover(message: string) {
    setShowError(_ => true);
    setErrorMessage(_ => message);
}

export { showErrorPopover };

export default {
    showError, setShowError, errorMessage
}