import { RoundSummary } from "@shared/models";
import { createSignal } from "solid-js";

const [showError, setShowError] = createSignal(false);
const [errorMessage, setErrorMessage] = createSignal("");

function showErrorPopover(message: string) {
    setShowError(_ => true);
    setErrorMessage(_ => message);
}

const [showRoundSummary, setShowRoundSummary] = createSignal(true);
const [roundSummary, setRoundSummary] = createSignal<RoundSummary>({
    article: "Test Article",
    reader: "readername",
    guesser: "guessername",
    guessed: "guessedname",
    hadError: false
});

function showRoundSummaryPopover(summary: RoundSummary) {
    setShowRoundSummary(_ => true);
    setRoundSummary(_ => ({...summary}));
}

export { showErrorPopover, showRoundSummaryPopover };

export default {
    showError, setShowError, errorMessage,
    showRoundSummary, setShowRoundSummary, roundSummary
}