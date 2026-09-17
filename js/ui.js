
const UI = {
  _ensureModal() {
    if (document.getElementById("uiModalVeil")) return;
    const div = document.createElement("div");
    div.id = "uiModalVeil";
    div.className = "modal-veil";
    div.innerHTML = `
      <div class="modal" style="max-width:440px;">
        <div class="modal-head">
          <div>
            <h3 id="uiModalTitle"></h3>
          </div>
          <button class="modal-close" id="uiModalCloseBtn" type="button">&times;</button>
        </div>
        <div class="modal-body" id="uiModalBody"></div>
        <div class="modal-foot" id="uiModalFoot"></div>
      </div>`;
    document.body.appendChild(div);
    div.addEventListener("click", (e) => {
      if (e.target === div) UI.close();
    });
    document
      .getElementById("uiModalCloseBtn")
      .addEventListener("click", () => UI.close());
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") UI.close();
    });
  },

  close() {
    const veil = document.getElementById("uiModalVeil");
    if (veil) veil.classList.remove("show");
  },


  info(title, bodyHtml, onClose) {
    this._ensureModal();
    document.getElementById("uiModalTitle").textContent = title;
    document.getElementById("uiModalBody").innerHTML = bodyHtml;
    document.getElementById("uiModalFoot").innerHTML =
      `<button class="btn primary" id="uiModalOkBtn" type="button">OK</button>`;
    document.getElementById("uiModalVeil").classList.add("show");
    document.getElementById("uiModalOkBtn").addEventListener("click", () => {
      UI.close();
      if (onClose) onClose();
    });
  },

  promptNumber(title, labelText, defaultValue, onConfirm) {
    this._ensureModal();
    document.getElementById("uiModalTitle").textContent = title;
    document.getElementById("uiModalBody").innerHTML = `
      <div class="field"><label>${labelText}</label><input type="number" id="uiPromptInput" min="1" value="${defaultValue}"></div>
    `;
    document.getElementById("uiModalFoot").innerHTML = `
      <button class="btn ghost" id="uiPromptCancelBtn" type="button">Cancel</button>
      <button class="btn primary" id="uiPromptOkBtn" type="button">Confirm</button>
    `;
    document.getElementById("uiModalVeil").classList.add("show");
    document
      .getElementById("uiPromptCancelBtn")
      .addEventListener("click", () => UI.close());
    document.getElementById("uiPromptOkBtn").addEventListener("click", () => {
      const val = parseInt(document.getElementById("uiPromptInput").value, 10);
      UI.close();
      if (val) onConfirm(val);
    });
  },

  confirm(title, bodyHtml, confirmLabel, onConfirm) {
    this._ensureModal();
    document.getElementById("uiModalTitle").textContent = title;
    document.getElementById("uiModalBody").innerHTML = bodyHtml;
    document.getElementById("uiModalFoot").innerHTML = `
      <button class="btn ghost" id="uiConfirmCancelBtn" type="button">Cancel</button>
      <button class="btn danger" id="uiConfirmOkBtn" type="button">${confirmLabel || "Confirm"}</button>
    `;
    document.getElementById("uiModalVeil").classList.add("show");
    document
      .getElementById("uiConfirmCancelBtn")
      .addEventListener("click", () => UI.close());
    document.getElementById("uiConfirmOkBtn").addEventListener("click", () => {
      UI.close();
      onConfirm();
    });
  },

  /* ---------- top-bar dropdown (notifications / messages) ---------- */

  _openDropdown: null,

  bindDropdown(buttonId, panelId, renderFn) {
    const btn = document.getElementById(buttonId);
    const panel = document.getElementById(panelId);
    if (!btn || !panel) return;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const willOpen = !panel.classList.contains("open");
      document
        .querySelectorAll(".top-dropdown.open")
        .forEach((p) => p.classList.remove("open"));
      if (willOpen) {
        renderFn(panel);
        panel.classList.add("open");
        UI._openDropdown = panel;
      } else {
        UI._openDropdown = null;
      }
    });
    panel.addEventListener("click", (e) => e.stopPropagation());
  },
};

document.addEventListener("click", () => {
  document
    .querySelectorAll(".top-dropdown.open")
    .forEach((p) => p.classList.remove("open"));
});
