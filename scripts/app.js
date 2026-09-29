import { renderApp } from "./render.js";
import { createAppStore } from "./state.js";

const store = createAppStore();
const shell = document.querySelector("[data-app-shell]");

function render(state) {
  renderApp(state);
}

store.subscribe(render);
render(store.getState());

document.addEventListener("click", (event) => {
  const viewButton = event.target.closest("[data-view-button]");
  if (viewButton) {
    const view = viewButton.dataset.viewButton;
    shell.dataset.view = view;
    document.querySelectorAll("[data-view-button]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button === viewButton));
    });
    if (view === "forecast" && matchMedia("(max-width: 63.99rem)").matches) {
      document.querySelector("#forecast")?.scrollIntoView({ block: "start" });
    }
    return;
  }

  const unitButton = event.target.closest("[data-unit]");
  if (unitButton) {
    store.setUnits(unitButton.dataset.unit);
    return;
  }

  const dateButton = event.target.closest("[data-date]");
  if (dateButton) {
    store.selectDate(dateButton.dataset.date);
    if (dateButton.classList.contains("forecast-row") && matchMedia("(max-width: 63.99rem)").matches) {
      shell.dataset.view = "today";
      document.querySelectorAll("[data-view-button]").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.viewButton === "today"));
      });
      document.querySelector("[data-weather-experience]")?.scrollIntoView({ block: "start" });
    }
  }
});

const restoredLocation = store.getState().activeLocation;
if (restoredLocation) store.refresh();

window.addEventListener("pagehide", () => store.destroy(), { once: true });
