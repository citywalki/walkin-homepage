import { render } from "solid-js/web";
import App from "./App";
import "./styles.css";
import { applyTheme, themeStorage, watchSystemTheme } from "@/utils/theme";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

themeStorage.getValue().then((mode) => {
	applyTheme(mode ?? "auto");
});

const unwatch = watchSystemTheme((resolved) => {
	// Only re-apply when user picked "auto"; explicit modes are already persisted.
	themeStorage.getValue().then((mode) => {
		if (mode === "auto" || !mode) {
			document.documentElement.setAttribute("data-theme", resolved);
		}
	});
});

window.addEventListener("beforeunload", unwatch);

render(() => <App />, root);
