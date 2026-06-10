/* ============================================================
   Progress tracking — saves topic checkboxes to localStorage
   so your study progress survives page reloads & is per-cert.
   ============================================================ */
(function () {
  var pageKey = document.body.dataset.page || "page";

  function storageKey(id) {
    return "cisco-roadmap::" + pageKey + "::" + id;
  }

  var boxes = document.querySelectorAll('.topic input[type="checkbox"]');

  // Restore saved state
  boxes.forEach(function (box, i) {
    var id = box.id || "topic-" + i;
    box.id = id;
    if (localStorage.getItem(storageKey(id)) === "1") {
      box.checked = true;
    }
    box.addEventListener("change", function () {
      if (box.checked) {
        localStorage.setItem(storageKey(id), "1");
      } else {
        localStorage.removeItem(storageKey(id));
      }
      updateProgress();
    });
  });

  function updateProgress() {
    var total = boxes.length;
    if (!total) return;
    var done = 0;
    boxes.forEach(function (b) { if (b.checked) done++; });
    var pct = Math.round((done / total) * 100);

    var fill = document.querySelector(".progress-bar .fill");
    var label = document.querySelector(".progress-label .pct");
    if (fill) fill.style.width = pct + "%";
    if (label) label.textContent = done + " / " + total + " topics (" + pct + "%)";
  }

  updateProgress();

  // Per-domain counters in the summary headers
  document.querySelectorAll(".domain").forEach(function (domain) {
    var domainBoxes = domain.querySelectorAll('input[type="checkbox"]');
    var counter = domain.querySelector(".domain-count");
    if (!counter || !domainBoxes.length) return;

    function refresh() {
      var done = 0;
      domainBoxes.forEach(function (b) { if (b.checked) done++; });
      counter.textContent = done + "/" + domainBoxes.length;
      counter.style.color = done === domainBoxes.length ? "var(--accent-2)" : "var(--text-dim)";
    }
    domainBoxes.forEach(function (b) { b.addEventListener("change", refresh); });
    refresh();
  });
})();
