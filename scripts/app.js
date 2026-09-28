const statusElement = document.querySelector("[data-app-status]");
const startButton = document.querySelector("[data-start-button]");

if (statusElement) {
  statusElement.textContent = "Project shell ready. Live weather is the next data checkpoint.";
}

startButton?.addEventListener("click", () => {
  statusElement?.focus?.();
  document.querySelector("#build-status-title")?.scrollIntoView({ block: "center" });
});
