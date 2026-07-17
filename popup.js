const input   = document.getElementById("apiKey");
const saveBtn = document.getElementById("saveBtn");
const status  = document.getElementById("status");

chrome.storage.sync.get("apiKey", ({ apiKey }) => {
  if (apiKey) input.value = apiKey;
});

saveBtn.addEventListener("click", () => {
  const key = input.value.trim();
  if (!key) {
    status.style.color = "#ff6b6b";
    status.textContent = "Please enter a valid key.";
    return;
  }
  chrome.storage.sync.set({ apiKey: key }, () => {
    status.style.color = "#6bcb77";
    status.textContent = "✓ Key saved!";
    setTimeout(() => (status.textContent = ""), 2500);
  });
});
