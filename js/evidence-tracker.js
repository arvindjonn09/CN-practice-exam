// Local proof-of-work tracker for static GitHub Pages.
// Notes and small attachment previews are saved in this browser's localStorage.
// For permanent portfolio proof, export the note and commit screenshots/videos to GitHub.
(function () {
  const STORAGE_PREFIX = "cnjourney::evidence::";
  const MAX_STORE_BYTES = 1024 * 1024 * 2; // keep localStorage friendly

  function key(taskId, field) {
    return STORAGE_PREFIX + taskId + "::" + field;
  }

  function byteSize(value) {
    return new Blob([value || ""]).size;
  }

  function downloadText(filename, text) {
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function setStatus(card, message, ready) {
    const status = card.querySelector(".evidence-status");
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("ready", Boolean(ready));
  }

  function updatePreview(card, type, dataUrl, fileName) {
    const preview = card.querySelector(".evidence-preview");
    if (!preview) return;
    preview.innerHTML = "";

    if (!dataUrl) return;

    if (type === "image") {
      const img = document.createElement("img");
      img.src = dataUrl;
      img.alt = fileName || "Screenshot evidence";
      preview.appendChild(img);
    } else if (type === "video") {
      const video = document.createElement("video");
      video.src = dataUrl;
      video.controls = true;
      preview.appendChild(video);
    }

    if (fileName) {
      const name = document.createElement("div");
      name.className = "evidence-file-name";
      name.textContent = fileName;
      preview.appendChild(name);
    }
  }

  function buildMarkdown(card) {
    const taskId = card.dataset.taskId;
    const title = card.querySelector("h3")?.textContent?.trim() || taskId;
    const note = card.querySelector("textarea[data-field='note']")?.value?.trim() || "";
    const commands = card.querySelector("textarea[data-field='commands']")?.value?.trim() || "";
    const reflection = card.querySelector("textarea[data-field='reflection']")?.value?.trim() || "";
    const screenshotName = localStorage.getItem(key(taskId, "screenshotName")) || "Not attached";
    const videoName = localStorage.getItem(key(taskId, "videoName")) || "Not attached";
    const today = new Date().toISOString().slice(0, 10);

    return `# ${title}\n\n` +
      `Date: ${today}\n\n` +
      `## What I did\n${note || "- "}\n\n` +
      `## Commands / clicks I used\n${commands || "- "}\n\n` +
      `## What I proved\n${reflection || "- "}\n\n` +
      `## Evidence files\n` +
      `- Screenshot: ${screenshotName}\n` +
      `- Video: ${videoName}\n\n` +
      `## Next review\n- Explain this task without looking at notes.\n`;
  }

  function saveCard(card) {
    const taskId = card.dataset.taskId;
    card.querySelectorAll("textarea[data-field]").forEach((textarea) => {
      localStorage.setItem(key(taskId, textarea.dataset.field), textarea.value);
    });
    setStatus(card, "Saved locally in this browser. Export note and commit evidence to GitHub for permanent proof.", true);
  }

  function clearCard(card) {
    const taskId = card.dataset.taskId;
    ["note", "commands", "reflection", "screenshot", "screenshotName", "video", "videoName"].forEach((field) => {
      localStorage.removeItem(key(taskId, field));
    });
    card.querySelectorAll("textarea[data-field]").forEach((textarea) => textarea.value = "");
    card.querySelectorAll("input[type='file']").forEach((input) => input.value = "");
    const preview = card.querySelector(".evidence-preview");
    if (preview) preview.innerHTML = "";
    setStatus(card, "Cleared local evidence for this task.", false);
  }

  function handleFile(card, input, type) {
    const taskId = card.dataset.taskId;
    const file = input.files && input.files[0];
    if (!file) return;

    const warning = card.querySelector(".evidence-warning");
    if (warning) warning.textContent = "";

    const reader = new FileReader();
    reader.onload = function () {
      const dataUrl = reader.result;
      if (byteSize(dataUrl) > MAX_STORE_BYTES) {
        if (warning) {
          warning.textContent = "This file is too large for browser storage. Keep the original file and commit it to GitHub manually.";
        }
        localStorage.setItem(key(taskId, type + "Name"), file.name);
        updatePreview(card, type, "", file.name);
        setStatus(card, "File name saved. Large file must be stored in GitHub manually.", false);
        return;
      }

      localStorage.setItem(key(taskId, type), dataUrl);
      localStorage.setItem(key(taskId, type + "Name"), file.name);
      updatePreview(card, type, dataUrl, file.name);
      setStatus(card, "Evidence attached locally. Export note and commit files to GitHub for permanent proof.", true);
    };
    reader.readAsDataURL(file);
  }

  function hydrateCard(card) {
    const taskId = card.dataset.taskId;
    card.querySelectorAll("textarea[data-field]").forEach((textarea) => {
      textarea.value = localStorage.getItem(key(taskId, textarea.dataset.field)) || "";
    });

    const screenshot = localStorage.getItem(key(taskId, "screenshot"));
    const screenshotName = localStorage.getItem(key(taskId, "screenshotName"));
    if (screenshot || screenshotName) updatePreview(card, "image", screenshot, screenshotName);

    const video = localStorage.getItem(key(taskId, "video"));
    const videoName = localStorage.getItem(key(taskId, "videoName"));
    if (video || videoName) updatePreview(card, "video", video, videoName);
  }

  function init() {
    document.querySelectorAll(".evidence-card[data-task-id]").forEach((card) => {
      hydrateCard(card);

      card.querySelectorAll("textarea[data-field]").forEach((textarea) => {
        textarea.addEventListener("input", () => saveCard(card));
      });

      card.querySelector("input[data-evidence='screenshot']")?.addEventListener("change", (event) => {
        handleFile(card, event.target, "screenshot");
      });

      card.querySelector("input[data-evidence='video']")?.addEventListener("change", (event) => {
        handleFile(card, event.target, "video");
      });

      card.querySelector("button[data-action='save']")?.addEventListener("click", () => saveCard(card));
      card.querySelector("button[data-action='clear']")?.addEventListener("click", () => clearCard(card));
      card.querySelector("button[data-action='export']")?.addEventListener("click", () => {
        const taskId = card.dataset.taskId;
        downloadText(taskId + "-evidence.md", buildMarkdown(card));
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
