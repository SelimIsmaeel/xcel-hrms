(function () {
  // ---------- auth guard ----------
  const currentUser = DataManager.getSession();
  if (!currentUser || currentUser.role !== "employee") {
    window.location.href = "index.html";
    return;
  }

  const empMain = document.getElementById("empMain");
  const tabButtons = document.querySelectorAll(".emp-tabs button");
  const empTabsNav = document.getElementById("empTabs");
  const empMenuToggle = document.getElementById("empMenuToggle");

  // ---------- helpers ----------
  function initials(name) {
    return name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
  function escapeHtml(str) {
    return String(str).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  }
  function daysBetween(startIso, endIso) {
    const ms =
      new Date(endIso + "T00:00:00") - new Date(startIso + "T00:00:00");
    return Math.round(ms / 86400000) + 1;
  }
  function freshUser() {
    return DataManager.getUser(currentUser.id);
  }

  // ---------- profile button / menu ----------
  document.getElementById("profileBtn").textContent = initials(
    currentUser.name,
  );
  const profileMenu = document.getElementById("profileMenu");
  document.getElementById("profileBtn").addEventListener("click", (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle("open");
  });
  document.addEventListener("click", () =>
    profileMenu.classList.remove("open"),
  );
  document
    .getElementById("menuMyProfile")
    .addEventListener("click", () => navigate("profile", "dashboard"));
  document.getElementById("menuSignOut").addEventListener("click", () => {
    DataManager.clearSession();
    window.location.href = "index.html";
  });

  // ---------- top nav ----------
  function closeMobileNav() {
    empTabsNav.classList.remove("open");
    empMenuToggle.setAttribute("aria-expanded", "false");
  }
  empMenuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !empTabsNav.classList.contains("open");
    empTabsNav.classList.toggle("open", willOpen);
    empMenuToggle.setAttribute("aria-expanded", String(willOpen));
  });
  document.addEventListener("click", closeMobileNav);
  empTabsNav.addEventListener("click", (e) => e.stopPropagation());

  tabButtons.forEach((b) =>
    b.addEventListener("click", () => {
      const tab = b.dataset.tab;
      if (tab === "dashboard") navigate("overview", "dashboard");
      else if (tab === "requests") navigate("leaveApplication", "requests");
      else if (tab === "payroll") navigate("payroll", "payroll");
      else if (tab === "company") navigate("company", "company");
      else if (tab === "extras") navigate("extras", "extras");
      closeMobileNav();
    }),
  );

  function setActiveTab(tab) {
    tabButtons.forEach((b) =>
      b.classList.toggle("active", b.dataset.tab === tab),
    );
  }

  // ---------- router ----------
  let route = { page: "overview" };
  let leaveCarouselTimer = null; // auto-advance interval for the leave-type carousel

  function navigate(page, activeTab, params) {
    if (leaveCarouselTimer) {
      clearInterval(leaveCarouselTimer);
      leaveCarouselTimer = null;
    }
    route = Object.assign({ page }, params || {});
    setActiveTab(activeTab || "dashboard");
    render();
    updateTopbarBadges();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function render() {
    if (route.page === "overview") return renderOverview();
    if (route.page === "leaveApplication") return renderLeaveApplication();
    if (route.page === "leaveForm") return renderLeaveForm(route.type);
    if (route.page === "leaveRecall") return renderLeaveRecall();
    if (route.page === "payroll") return renderPayroll();
    if (route.page === "company") return renderCompany();
    if (route.page === "extras") return renderExtras();
    if (route.page === "profile") return renderProfile();
  }

  // ---------- top-bar: notifications / mail ----------
  function updateTopbarBadges() {
    const u = freshUser();
    const myLeave = DataManager.getLeaveForUser(u.id);
    const notifCount = myLeave.filter(
      (l) => l.status === "recalled" && l.recall && !l.recall.response,
    ).length;
    const notifBadge = document.getElementById("notifBadge");
    notifBadge.textContent = notifCount;
    notifBadge.style.display = notifCount ? "" : "none";

    const mailCount = DataManager.getAnnouncements().length;
    const mailBadge = document.getElementById("mailBadge");
    mailBadge.textContent = mailCount;
    mailBadge.style.display = mailCount ? "" : "none";
  }

  UI.bindDropdown("notifBtn", "notifPanel", (panel) => {
    const u = freshUser();
    const myLeave = DataManager.getLeaveForUser(u.id);
    const items = [];
    myLeave.forEach((l) => {
      if (l.status === "recalled" && l.recall && !l.recall.response) {
        items.push({
          title: `You've been recalled from ${l.type} leave`,
          sub: `Respond before ${formatDate(l.recall.newResumptionDate)}`,
          action: "recall",
        });
      } else if (l.status === "approved") {
        items.push({
          title: `${l.type} leave approved`,
          sub: `${formatDate(l.startDate)} – ${formatDate(l.endDate)}`,
        });
      } else if (l.status === "rejected") {
        items.push({
          title: `${l.type} leave declined`,
          sub: `${formatDate(l.startDate)} – ${formatDate(l.endDate)}`,
        });
      }
    });
    panel.innerHTML = `
      <div class="td-head">Notifications ${items.length ? `<a id="notifViewAll">View leave &#8594;</a>` : ""}</div>
      ${
        items.length
          ? items
              .slice(0, 6)
              .map(
                (i) =>
                  `<div class="td-item" ${i.action === "recall" ? "data-goto-recall" : ""}><div class="td-title">${escapeHtml(i.title)}</div><div class="td-sub">${escapeHtml(i.sub)}</div></div>`,
              )
              .join("")
          : `<div class="td-empty">Nothing new right now.</div>`
      }
    `;
    const link = document.getElementById("notifViewAll");
    if (link)
      link.addEventListener("click", () => {
        navigate("leaveApplication", "dashboard");
        panel.classList.remove("open");
      });
    panel.querySelectorAll("[data-goto-recall]").forEach((el) =>
      el.addEventListener("click", () => {
        navigate("leaveRecall", "dashboard");
        panel.classList.remove("open");
      }),
    );
  });

  UI.bindDropdown("mailBtn", "mailPanel", (panel) => {
    const anns = DataManager.getAnnouncements().slice(0, 6);
    panel.innerHTML = `
      <div class="td-head">Messages <a id="mailViewAll">View all &#8594;</a></div>
      ${anns.length ? anns.map((a) => `<div class="td-item"><div class="td-title">${escapeHtml(a.title)}</div><div class="td-sub">${formatDate(a.date)}</div></div>`).join("") : `<div class="td-empty">No announcements yet.</div>`}
    `;
    const link = document.getElementById("mailViewAll");
    if (link)
      link.addEventListener("click", () => {
        navigate("company", "company");
        panel.classList.remove("open");
      });
  });

  // ================= OVERVIEW (Dashboard) =================
  function renderOverview() {
    const u = freshUser();
    const pendingRecall = DataManager.getPendingRecallForUser(u.id);
    const leaveTypes = DataManager.getLeaveTypes();
    const anns = DataManager.getAnnouncements().slice(0, 4);

    const recallBanner = pendingRecall
      ? `
      <div class="panel" style="border-left:4px solid var(--red); margin-bottom:20px;">
        <div class="panel-body" style="display:flex; justify-content:space-between; align-items:center; gap:14px; flex-wrap:wrap; padding-top:18px;">
          <div><strong>You've been recalled from leave.</strong><div class="desc" style="margin-top:3px;">Review the details and respond.</div></div>
          <button class="btn recall" id="reviewRecallBtn">Review Recall</button>
        </div>
      </div>`
      : "";

    const todos = [
      [
        "Complete Onboarding Document Upload",
        "Upload your signed offer letter and ID to HR before your next check-in.",
      ],
      [
        "Follow up on clients on documents",
        "Confirm the client has received the latest handover notes.",
      ],
      [
        "Design wireframes for LMS",
        "Draft the first pass of screens for the internal learning system.",
      ],
      [
        "Create case study for next IT project",
        "Summarize the last sprint for the upcoming kickoff deck.",
      ],
    ];

    empMain.innerHTML = `
      <div class="profile-banner">
        <div class="who-row">
          <div class="avatar">${initials(u.name)}</div>
          <div>
            <div class="name">${escapeHtml(u.name)}</div>
            <div class="title">${escapeHtml(u.title || "Employee")}</div>
          </div>
        </div>
        <button class="edit-btn" id="editProfileBtn">Edit Profile</button>
      </div>

      ${recallBanner}

      <h3 style="margin-bottom:12px; font-size:15px;">Quick Actions</h3>
      <div class="quick-actions">
        <button id="qaApply">Apply for Leave</button>
        <button id="qaKpi">KPI Goals</button>
        <button id="qaAppraisal">Take Appraisal</button>
        <button id="qaPayslip">View Payslip</button>
        <button id="qaProfile">Update Profile</button>
        <button id="qaEvents">Events</button>
      </div>

      <div class="grid-2">
        <div class="panel">
          <div class="panel-head"><h2>Available Leave Days</h2></div>
          <div class="panel-body" style="padding-top:16px;">
            ${leaveTypes
              .map((t) => {
                const bal = DataManager.getLeaveBalance(u, t.name);
                const pct = t.duration
                  ? Math.round((bal / t.duration) * 100)
                  : 0;
                return `<div class="leave-progress-item">
                <div class="lp-top"><span class="lbl">${escapeHtml(t.name)} Leave</span><span class="val">${bal} of ${t.duration} day(s)</span></div>
                <div class="leave-progress-bar"><div class="fill" style="width:${pct}%;"></div></div>
              </div>`;
              })
              .join("")}
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><h2>To-dos</h2></div>
          <div class="panel-body" style="padding-top:16px;">
            ${todos
              .map(
                ([title, detail]) => `
              <details class="dd-list-item"><summary>${escapeHtml(title)}<span class="chev">&#9662;</span></summary><div class="dd-body">${escapeHtml(detail)}</div></details>
            `,
              )
              .join("")}
          </div>
        </div>
      </div>

      <div class="grid-2">
        <div class="panel">
          <div class="panel-head"><h2>Announcement(s)</h2></div>
          <div class="panel-body" style="padding-top:16px;">
            ${
              anns.length
                ? anns
                    .map(
                      (a) => `
              <details class="dd-list-item"><summary>${escapeHtml(a.title)}<span class="chev">&#9662;</span></summary><div class="dd-body">${escapeHtml(a.body)}</div></details>
            `,
                    )
                    .join("")
                : `<div class="empty-row">No announcements yet.</div>`
            }
          </div>
        </div>

        <div class="panel">
          <div class="panel-head"><h2>April Pay slip breakdown</h2></div>
          <div class="panel-body" style="padding-top:16px;">
            ${payslipTableHtml()}
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head"><h2>Birthdays</h2></div>
        <div class="panel-body" style="padding-top:16px;">
          ${birthdaysHtml()}
        </div>
      </div>
    `;

    if (pendingRecall)
      document
        .getElementById("reviewRecallBtn")
        .addEventListener("click", () => navigate("leaveRecall", "dashboard"));
    document
      .getElementById("editProfileBtn")
      .addEventListener("click", () => navigate("profile", "dashboard"));
    document
      .getElementById("qaApply")
      .addEventListener("click", () =>
        navigate("leaveApplication", "dashboard"),
      );
    document
      .getElementById("qaKpi")
      .addEventListener("click", () =>
        UI.info("KPI Goals", "KPI Goals isn't set up yet — check back soon."),
      );
    document
      .getElementById("qaAppraisal")
      .addEventListener("click", () =>
        UI.info(
          "Take Appraisal",
          "Appraisals aren't set up yet — check back soon.",
        ),
      );
    document
      .getElementById("qaPayslip")
      .addEventListener("click", () => navigate("payroll", "payroll"));
    document
      .getElementById("qaProfile")
      .addEventListener("click", () => navigate("profile", "dashboard"));
    document
      .getElementById("qaEvents")
      .addEventListener("click", () =>
        UI.info("Events", "No events on the calendar yet."),
      );

    empMain
      .querySelectorAll("[data-send-wish]")
      .forEach((b) =>
        b.addEventListener("click", () =>
          UI.info("Birthday wish", "Birthday wish sent!"),
        ),
      );
  }

  function fmtMoney(n) {
    return n.toLocaleString("en-US");
  }

  function payslipTableHtml() {
    const u = freshUser();
    const p = DataManager.getPayrollForUser(u);
    const earningRows = [["Basic Wage", fmtMoney(p.basicWage)]].concat(
      p.earnings.map((e) => [escapeHtml(e.label), fmtMoney(e.amount)]),
    );
    const deductionRows = [
      ["Tax (10%)", fmtMoney(p.tax)],
      ["Pension (10%)", fmtMoney(p.pension)],
    ];
    const rowCount = Math.max(earningRows.length, deductionRows.length);
    let bodyRows = "";
    for (let i = 0; i < rowCount; i++) {
      const [eLabel, eAmt] = earningRows[i] || ["", ""];
      const [dLabel, dAmt] = deductionRows[i] || ["", ""];
      bodyRows += `<tr><td>${eLabel}</td><td>${eAmt}</td><td>${dLabel}</td><td>${dAmt}</td></tr>`;
    }
    bodyRows += `<tr style="font-weight:700;"><td>Gross Pay</td><td>${fmtMoney(p.grossPay)}</td><td>Net Pay</td><td>${fmtMoney(p.netPay)}</td></tr>`;
    return `<table class="payslip-table">
      <thead><tr><th>Earnings</th><th>Amount</th><th>Deductions</th><th>Total</th></tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>`;
  }

  function birthdaysHtml() {
    const names = ["Biruk Kidan", "Saron Tekle", "Yonas Bekele"];
    return names
      .map(
        (n) => `
      <div class="birthday-item">
        <div class="bd-name">&#127874; ${escapeHtml(n)}'s Day — April 25th</div>
        <button data-send-wish>Send Wishes</button>
      </div>
    `,
      )
      .join("");
  }

  // ================= LEAVE APPLICATION (carousel + history) =================
  function renderLeaveApplication() {
    const u = freshUser();
    const leaveTypes = DataManager.getLeaveTypes();
    const history = DataManager.getLeaveForUser(u.id);
    const EXPORT_CURRENT_YEAR = new Date().getFullYear();
    const EXPORT_PREVIOUS_YEAR = EXPORT_CURRENT_YEAR - 1;

    empMain.innerHTML = `
      <div class="crumb-bar"><b>Dashboard</b> <span class="sep">&#8250;</span> Apply for Leave</div>
      <div class="page-head"><span class="picto">&#128214;</span><h1>Leave Application</h1></div>

      <div class="leave-carousel-wrap">
        <button class="lc-nav-btn lc-nav-left" id="leaveCarouselPrev" type="button" aria-label="Scroll left">&#8249;</button>
        <div class="leave-carousel" id="leaveCarousel">
          ${leaveTypes
            .map((t) => {
              const bal = DataManager.getLeaveBalance(u, t.name);
              return `<div class="leave-card">
              <div class="circle ${bal === 0 ? "zero" : ""}">${bal}</div>
              <div class="lc-body">
                <div class="lc-title">${escapeHtml(t.name)} Leave</div>
                ${
                  bal > 0
                    ? `<button class="lc-apply" data-apply="${escapeHtml(t.name)}">Apply</button>`
                    : `<button class="lc-unavailable" disabled>Not Available</button>`
                }
              </div>
            </div>`;
            })
            .join("")}
        </div>
        <button class="lc-nav-btn lc-nav-right" id="leaveCarouselNext" type="button" aria-label="Scroll right">&#8250;</button>
      </div>

      <div class="panel">
        <div class="panel-head">
          <h2>Leave History</h2>
          <div class="actions-dd" id="leaveExportDd">
            <button class="btn primary small" id="exportOwnLeaveBtn" type="button">Export &#8964;</button>
            <div class="actions-dd-menu" id="leaveExportMenu">
              <button data-export-range="current">This year (${EXPORT_CURRENT_YEAR})</button>
              <button data-export-range="previous">Last year (${EXPORT_PREVIOUS_YEAR})</button>
              <button data-export-range="both">Last year – current (${EXPORT_PREVIOUS_YEAR}–${EXPORT_CURRENT_YEAR})</button>
              <button data-export-range="all">All time</button>
            </div>
          </div>
        </div>
        <div class="panel-body pad0">
          <table>
            <thead><tr><th>Name(s)</th><th>Duration(s)</th><th>Start Date</th><th>End Date</th><th>Type</th><th>Reason(s)</th><th>Actions</th></tr></thead>
            <tbody>
              ${
                history.length
                  ? history
                      .map(
                        (l) => `
                <tr>
                  <td>${escapeHtml(u.name)}</td><td>${l.days}</td>
                  <td>${formatDate(l.startDate)}</td><td>${formatDate(l.endDate)}</td>
                  <td>${escapeHtml(l.type)}<br><span class="badge ${l.status}" style="margin-top:4px;">${l.status}</span></td>
                  <td>${escapeHtml(l.category || l.reason || "—")}</td>
                  <td>
                    <div class="actions-dd">
                      <button class="btn blue small" data-toggle-dd="${l.id}">Actions &#8964;</button>
                      <div class="actions-dd-menu" id="dd-${l.id}">
                        <button data-view="${l.id}">View Details</button>
                        ${l.status === "pending" ? `<button data-cancel="${l.id}" class="warn">Cancel Request</button>` : ""}
                      </div>
                    </div>
                  </td>
                </tr>
              `,
                      )
                      .join("")
                  : `<tr><td colspan="7" class="empty-row">You haven't applied for leave yet.</td></tr>`
              }
            </tbody>
          </table>
        </div>
      </div>
    `;

    initLeaveCarousel();

    empMain
      .querySelectorAll("[data-apply]")
      .forEach((b) =>
        b.addEventListener("click", () =>
          navigate("leaveForm", "dashboard", { type: b.dataset.apply }),
        ),
      );

    empMain.querySelectorAll("[data-toggle-dd]").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        const menu = document.getElementById("dd-" + b.dataset.toggleDd);
        const isOpen = menu.classList.contains("open");
        empMain
          .querySelectorAll(".actions-dd-menu.open")
          .forEach((m) => m.classList.remove("open"));
        if (!isOpen) menu.classList.add("open");
      }),
    );
    document.addEventListener("click", () =>
      empMain
        .querySelectorAll(".actions-dd-menu.open")
        .forEach((m) => m.classList.remove("open")),
    );

    empMain.querySelectorAll("[data-view]").forEach((b) =>
      b.addEventListener("click", () => {
        const l = DataManager.getLeaveRequests().find(
          (x) => x.id === b.dataset.view,
        );
        UI.info(
          "Leave request details",
          `
        <div class="profile-grid">
          <div class="profile-field"><div class="k">Type</div><div class="v">${escapeHtml(l.type)} Leave</div></div>
          <div class="profile-field"><div class="k">Dates</div><div class="v">${formatDate(l.startDate)} – ${formatDate(l.endDate)}</div></div>
          <div class="profile-field"><div class="k">Days</div><div class="v">${l.days}</div></div>
          <div class="profile-field"><div class="k">Status</div><div class="v" style="text-transform:capitalize;">${l.status}</div></div>
          <div class="profile-field" style="grid-column:1 / -1;"><div class="k">Reason</div><div class="v">${escapeHtml(l.reason || l.category || "—")}</div></div>
        </div>
      `,
        );
      }),
    );
    empMain.querySelectorAll("[data-cancel]").forEach((b) =>
      b.addEventListener("click", () => {
        UI.confirm(
          "Cancel leave request?",
          "This can't be undone.",
          "Cancel request",
          () => {
            DataManager.deleteLeaveRequest(b.dataset.cancel);
            renderLeaveApplication();
          },
        );
      }),
    );

    const exportBtn = document.getElementById("exportOwnLeaveBtn");
    const exportMenu = document.getElementById("leaveExportMenu");
    exportBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = exportMenu.classList.contains("open");
      empMain
        .querySelectorAll(".actions-dd-menu.open")
        .forEach((m) => m.classList.remove("open"));
      if (!isOpen) exportMenu.classList.add("open");
    });
    exportMenu.querySelectorAll("[data-export-range]").forEach((b) =>
      b.addEventListener("click", () => {
        exportMenu.classList.remove("open");
        exportLeaveHistory(b.dataset.exportRange);
      }),
    );
  }

  /** Filters leave history to a given period and triggers a CSV download.
   *  range: "current" | "previous" | "both" (previous+current) | "all" */
  function exportLeaveHistory(range) {
    const u = freshUser();
    const history = DataManager.getLeaveForUser(u.id);
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    const yearOf = (iso) => (iso ? parseInt(iso.slice(0, 4), 10) : null);
    const filtered = history.filter((l) => {
      const y = yearOf(l.startDate);
      if (range === "current") return y === currentYear;
      if (range === "previous") return y === previousYear;
      if (range === "both") return y === currentYear || y === previousYear;
      return true; // "all"
    });

    const rows = filtered.map((l) =>
      [
        u.name,
        l.days,
        l.startDate,
        l.endDate,
        l.type,
        l.category || l.reason || "",
        l.status,
      ].join(","),
    );
    const csv =
      "Name,Duration,Start,End,Type,Reason,Status\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const labels = {
      current: String(currentYear),
      previous: String(previousYear),
      both: `${previousYear}-${currentYear}`,
      all: "all-time",
    };
    a.download = `my-leave-history-${labels[range] || "all-time"}.csv`;
    a.click();
  }

  // ---------- leave-type carousel: left/right buttons + auto-advance ----------
  function initLeaveCarousel() {
    const track = document.getElementById("leaveCarousel");
    const prevBtn = document.getElementById("leaveCarouselPrev");
    const nextBtn = document.getElementById("leaveCarouselNext");
    if (!track || !prevBtn || !nextBtn) return;

    const AUTOPLAY_DELAY = 4000; // ms to wait before auto-advancing
    const GAP = 16; // must match the .leave-carousel gap in employee.css

    function atStart() {
      return track.scrollLeft <= 1;
    }
    function atEnd() {
      return track.scrollLeft >= track.scrollWidth - track.clientWidth - 1;
    }
    function step() {
      const card = track.querySelector(".leave-card");
      return card ? card.offsetWidth + GAP : track.clientWidth;
    }
    function goTo(dir) {
      if (dir > 0 && atEnd()) {
        track.scrollTo({ left: 0, behavior: "smooth" });
      } else if (dir < 0 && atStart()) {
        track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
      } else {
        track.scrollBy({ left: dir * step(), behavior: "smooth" });
      }
    }
    function stopAutoplay() {
      if (leaveCarouselTimer) {
        clearInterval(leaveCarouselTimer);
        leaveCarouselTimer = null;
      }
    }
    function startAutoplay() {
      stopAutoplay();
      if (track.scrollWidth <= track.clientWidth) return; // everything already fits
      leaveCarouselTimer = setInterval(() => goTo(1), AUTOPLAY_DELAY);
    }

    prevBtn.addEventListener("click", () => {
      goTo(-1);
      startAutoplay(); // pushes the next auto-advance back out after manual use
    });
    nextBtn.addEventListener("click", () => {
      goTo(1);
      startAutoplay();
    });
    track.addEventListener("mouseenter", stopAutoplay);
    track.addEventListener("mouseleave", startAutoplay);

    startAutoplay();
  }

  // ================= LEAVE APPLICATION FORM (per type) =================
  function renderLeaveForm(typeName) {
    const u = freshUser();
    const type = DataManager.getLeaveTypeByName(typeName);
    const balance = DataManager.getLeaveBalance(u, typeName);
    const officers = DataManager.getReliefOfficers();

    empMain.innerHTML = `
      <div class="crumb-bar">
        <b>Dashboard</b> <span class="sep">&#8250;</span>
        <a href="#" id="crumbBackToApply" style="color:inherit; text-decoration:underline; cursor:pointer;">Apply for Leave</a>
        <span class="sep">&#8250;</span> ${escapeHtml(typeName)} Leave
      </div>

      <div class="leave-form-card">
        <div class="lf-head"><h2>&#128214; Leave Application</h2></div>
        <div class="lf-sub">Fill the required fields below to apply for ${escapeHtml(typeName.toLowerCase())} leave.</div>

        <div class="form-msg error" id="lfMsg"></div>

        <form id="lfForm">
          <div class="field">
            <label>Leave Type</label>
            <input type="text" class="readonly-field" value="${escapeHtml(typeName)} Leave" readonly>
          </div>
          <div class="field-row">
            <div class="field"><label for="lfStart">Start Date</label><input type="date" id="lfStart" required></div>
            <div class="field"><label for="lfEnd">End Date</label><input type="date" id="lfEnd" required></div>
          </div>
          <div class="field-row">
            <div class="field">
              <label for="lfDuration">Duration</label>
              <input type="number" id="lfDuration" min="1" max="${balance}" value="${Math.min(type ? type.duration : balance, balance) || 1}" required>
            </div>
            <div class="field"><label for="lfResumption">Resumption Date</label><input type="date" id="lfResumption"></div>
          </div>
          <div class="field">
            <label for="lfReason">Reason for leave</label>
            <textarea id="lfReason" required></textarea>
          </div>
          <div class="field">
            <label>Attach handover document (pdf, jpg, docx or any other format)</label>
            <div class="file-choose-row">
              <label class="file-choose-btn" for="lfFile">Choose File</label>
              <span class="file-name" id="lfFileName">No file chosen</span>
              <input type="file" id="lfFile" style="display:none;">
            </div>
          </div>
          <div class="field">
            <label for="lfOfficer">Choose Relief Officer</label>
            <select id="lfOfficer" required>
              <option value="" disabled selected>Select your relief officer</option>
              ${officers.map((o) => `<option value="${escapeHtml(o.name)}">${escapeHtml(o.name)} — ${escapeHtml(o.department)}</option>`).join("")}
            </select>
          </div>

          <div class="lf-actions">
            <button type="submit" class="btn primary">Submit</button>
            <button type="reset" class="btn danger" id="lfResetBtn">Reset</button>
          </div>
        </form>
      </div>
    `;

    document
      .getElementById("crumbBackToApply")
      .addEventListener("click", (e) => {
        e.preventDefault();
        navigate("leaveApplication", "dashboard");
      });
    document.getElementById("lfFile").addEventListener("change", (e) => {
      document.getElementById("lfFileName").textContent = e.target.files[0]
        ? e.target.files[0].name
        : "No file chosen";
    });
    document.getElementById("lfResetBtn").addEventListener("click", () => {
      document.getElementById("lfFileName").textContent = "No file chosen";
      document.getElementById("lfMsg").classList.remove("show");
    });

    document.getElementById("lfForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = document.getElementById("lfMsg");
      const start = document.getElementById("lfStart").value;
      const end = document.getElementById("lfEnd").value;
      const duration = parseInt(
        document.getElementById("lfDuration").value,
        10,
      );
      const officer = document.getElementById("lfOfficer").value;
      const reason = document.getElementById("lfReason").value.trim();

      if (end < start) {
        msg.textContent = "End date can't be before the start date.";
        msg.classList.add("show");
        return;
      }
      if (!officer) {
        msg.textContent = "Choose a relief officer to cover for you.";
        msg.classList.add("show");
        return;
      }
      if (duration > balance) {
        msg.textContent = `You only have ${balance} ${typeName} day(s) available.`;
        msg.classList.add("show");
        return;
      }
      msg.classList.remove("show");

      DataManager.addLeaveRequest({
        userId: u.id,
        type: typeName,
        category: "Personal",
        startDate: start,
        endDate: end,
        days: duration,
        reason,
        reliefOfficer: officer,
        resumptionDate: document.getElementById("lfResumption").value,
      });

      navigate("leaveApplication", "dashboard");
    });
  }

  // ================= LEAVE RECALL RESPONSE =================
  function renderLeaveRecall() {
    const u = freshUser();
    const req = DataManager.getPendingRecallForUser(u.id);

    empMain.innerHTML = `
      <div class="crumb-bar"><b>Dashboard</b> <span class="sep">&#8250;</span> Leave Recall</div>
      <div class="page-head"><span class="picto">&#128214;</span><h1>Leave Recall</h1></div>

      <div class="leave-form-card" style="max-width:760px;">
        ${
          req
            ? `
          <div class="recall-msg-box">
            Dear ${escapeHtml(u.name.split(" ")[0])},<br><br>
            This is to inform you that you have been <b>RECALLED</b> from your <b>${escapeHtml(req.type.toUpperCase())}</b> Leave
            by your line manager named <b>${escapeHtml(req.recall.initiatedBy || "HR")}</b>
            ${req.recall.reason ? " for " + escapeHtml(req.recall.reason.replace(/\.$/, "")) : ""}
            to be completed in the office before <b>${formatDate(req.recall.newResumptionDate)}</b>.
          </div>

          <div class="field">
            <label for="rcDeclineReason">If No, state reason why?</label>
            <textarea id="rcDeclineReason" placeholder="State your reason..."></textarea>
          </div>

          <div class="lf-actions">
            <button class="btn primary" id="rcApproveBtn">Approve</button>
            <button class="btn danger" id="rcDeclineBtn">Decline</button>
          </div>
        `
            : `<div class="recall-empty">You have no pending leave recalls right now.</div>`
        }
      </div>
    `;

    if (req) {
      document.getElementById("rcApproveBtn").addEventListener("click", () => {
        DataManager.respondToRecall(req.id, true);
        UI.info("Recall approved", "See you in the office.", () =>
          navigate("overview", "dashboard"),
        );
      });
      document.getElementById("rcDeclineBtn").addEventListener("click", () => {
        const reason = document.getElementById("rcDeclineReason").value.trim();
        if (!reason) {
          UI.info("Reason required", "Please state a reason before declining.");
          return;
        }
        DataManager.respondToRecall(req.id, false, reason);
        UI.info("Decline sent", "Your leave stays as approved.", () =>
          navigate("overview", "dashboard"),
        );
      });
    }
  }

  const XCELTECH_LOGO_DATA_URI =
    "data:image/png;base64,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";

  // ================= PAYROLL =================
  const PAYSLIP_MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function downloadPayslip(month, year) {
    const u = freshUser();
    const p = DataManager.getPayrollForUser(u);
    const periodMonth = month || PAYSLIP_MONTHS[new Date().getMonth()];
    const periodYear = year || new Date().getFullYear();
    const issued = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const earningRows = [["Basic Wage", fmtMoney(p.basicWage)]].concat(
      p.earnings.map((e) => [escapeHtml(e.label), fmtMoney(e.amount)]),
    );
    const deductionRows = [
      ["Tax (10%)", fmtMoney(p.tax)],
      ["Pension (10%)", fmtMoney(p.pension)],
    ];
    const rowCount = Math.max(earningRows.length, deductionRows.length);
    let payslipBodyRows = "";
    for (let i = 0; i < rowCount; i++) {
      const [eLabel, eAmt] = earningRows[i] || ["", ""];
      const [dLabel, dAmt] = deductionRows[i] || ["", ""];
      payslipBodyRows += `<tr><td>${eLabel}</td><td>${eAmt}</td><td>${dLabel}</td><td>${dAmt}</td></tr>`;
    }
    payslipBodyRows += `<tr class="total"><td>Gross Pay</td><td>${fmtMoney(p.grossPay)}</td><td>Total Deductions</td><td>${fmtMoney(p.tax + p.pension)}</td></tr>`;

    const win = window.open("", "_blank");
    if (!win) {
      UI.info(
        "Pop-up blocked",
        "Please allow pop-ups for this site, then try downloading your payslip again.",
      );
      return;
    }

    win.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Payslip — ${escapeHtml(u.name)}</title>
<style>
  body { font-family: 'Inter', Arial, sans-serif; color:#1B2331; padding:40px; }
  .ps-head { display:flex; justify-content:space-between; align-items:flex-start; border-bottom:3px solid #0E1B3D; padding-bottom:16px; margin-bottom:26px; }
  .ps-head h1 { margin:0; font-size:22px; color:#0E1B3D; letter-spacing:0.5px; }
  .ps-head .sub { color:#5B6577; font-size:13px; margin-top:4px; }
  .ps-meta { text-align:right; font-size:13px; color:#5B6577; }
  .ps-emp { display:grid; grid-template-columns:1fr 1fr; gap:14px 30px; margin-bottom:28px; font-size:13.5px; }
  .ps-emp .k { color:#5B6577; font-size:11.5px; }
  .ps-emp .v { font-weight:600; margin-top:2px; text-transform:capitalize; }
  table { width:100%; border-collapse:collapse; font-size:13.5px; margin-bottom:24px; }
  th, td { text-align:left; padding:10px 12px; border-bottom:1px solid #E9F1FA; }
  th { background:#F2F6FC; color:#0E1B3D; font-size:12px; }
  tr.total td { font-weight:700; border-top:2px solid #0E1B3D; }
  .net-box { background:#E4F5E7; border-radius:8px; padding:16px 18px; margin-top:6px; }
  .net-box .k { color:#256E31; font-size:11.5px; }
  .net-box .v { font-size:22px; font-weight:700; color:#256E31; margin-top:2px; }
  .ps-foot { font-size:11.5px; color:#93A0B4; margin-top:30px; }
  @media print { body{ padding:20px; } }
</style>
</head>
<body>
  <div class="ps-head">
    <div><img src="${XCELTECH_LOGO_DATA_URI}" alt="XCELTECH" style="height:44px; display:block;"><div class="sub" style="margin-top:8px;">Employee Payslip</div></div>
    <div class="ps-meta">Issued ${issued}<br>Pay period: ${escapeHtml(periodMonth)} ${periodYear}</div>
  </div>
  <div class="ps-emp">
    <div><div class="k">Employee Name</div><div class="v">${escapeHtml(u.name)}</div></div>
    <div><div class="k">Employee ID</div><div class="v">${escapeHtml(u.id)}</div></div>
    <div><div class="k">Department</div><div class="v">${escapeHtml(u.department || "—")}</div></div>
    <div><div class="k">Job Title</div><div class="v">${escapeHtml(u.title || "—")}</div></div>
  </div>
  <table>
    <thead><tr><th>Earnings</th><th>Amount</th><th>Deductions</th><th>Amount</th></tr></thead>
    <tbody>
      ${payslipBodyRows}
    </tbody>
  </table>
  <div class="net-box"><div class="k">Net Pay</div><div class="v">${fmtMoney(p.netPay)}</div></div>
  <div class="ps-foot">This is a system-generated payslip from XCELTECH HR. Use your browser's "Save as PDF" option in the print dialog to keep a copy.</div>
</body>
</html>
    `);
    win.document.close();
    win.onload = () => {
      win.focus();
      win.print();
    };
  }

  function renderPayroll() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const previousYear = currentYear - 1;
    const currentMonth = PAYSLIP_MONTHS[now.getMonth()];

    empMain.innerHTML = `
      <div class="page-head"><span class="picto">&#128179;</span><h1>Payroll</h1></div>
      <div class="panel">
        <div class="panel-head">
          <h2>Pay slip breakdown</h2>
          <div class="payroll-period-controls">
            <select id="payslipMonthSelect" aria-label="Pay period month">
              ${PAYSLIP_MONTHS.map(
                (m) =>
                  `<option value="${m}" ${m === currentMonth ? "selected" : ""}>${m}</option>`,
              ).join("")}
            </select>
            <select id="payslipYearSelect" aria-label="Pay period year">
              <option value="${currentYear}" selected>${currentYear}</option>
              <option value="${previousYear}">${previousYear}</option>
            </select>
            <button class="btn blue small" id="downloadPayslipBtn">&#11015; Download Payslip</button>
          </div>
        </div>
        <div class="panel-body" style="padding-top:16px;">${payslipTableHtml()}</div>
      </div>
    `;
    document
      .getElementById("downloadPayslipBtn")
      .addEventListener("click", () => {
        const month = document.getElementById("payslipMonthSelect").value;
        const year = parseInt(
          document.getElementById("payslipYearSelect").value,
          10,
        );
        downloadPayslip(month, year);
      });
  }

  // ================= COMPANY =================
  function renderCompany() {
    const anns = DataManager.getAnnouncements();
    const openJobs = DataManager.getJobs().filter((j) => j.status === "Open");
    empMain.innerHTML = `
      <div class="page-head"><span class="picto">&#127970;</span><h1>Company</h1></div>
      <div class="panel">
        <div class="panel-head"><h2>Announcement(s)</h2></div>
        <div class="panel-body" style="padding-top:16px;">
          ${
            anns.length
              ? anns
                  .map(
                    (a) => `
            <details class="dd-list-item"><summary>${escapeHtml(a.title)}<span class="chev">&#9662;</span></summary><div class="dd-body">${escapeHtml(a.body)} — <span class="muted">${formatDate(a.date)}</span></div></details>
          `,
                  )
                  .join("")
              : `<div class="empty-row">No announcements yet.</div>`
          }
        </div>
      </div>

      <div class="panel">
        <div class="panel-head"><h2>Open Positions</h2><div class="desc">Roles currently hiring at XCELTECH</div></div>
        <div class="panel-body" style="padding-top:16px;">
          ${
            openJobs.length
              ? openJobs
                  .map(
                    (j) => `
            <details class="dd-list-item">
              <summary>${escapeHtml(j.title)} — ${escapeHtml(j.department)}<span class="chev">&#9662;</span></summary>
              <div class="dd-body">${escapeHtml(j.description)}<br><span class="muted">${escapeHtml(j.type)} · Posted ${formatDate(j.posted)}</span></div>
            </details>
          `,
                  )
                  .join("")
              : `<div class="empty-row">No open positions right now.</div>`
          }
        </div>
      </div>

      <div class="placeholder-card"><span class="picto">&#127970;</span><h3>Company directory coming soon</h3><p>Org chart and policies will live here.</p></div>
    `;
  }

  // ================= EXTRAS (attendance + birthdays) =================
  function renderExtras() {
    const u = freshUser();
    const today = DataManager.getTodayRecord(u.id);
    const history = DataManager.getAttendanceForUser(u.id);

    empMain.innerHTML = `
      <div class="page-head"><span class="picto">&#9202;</span><h1>Extras</h1></div>

      <div class="panel">
        <div class="panel-head"><h2>Attendance</h2></div>
        <div class="panel-body" style="padding-top:16px;">
          <div class="section-note" id="clockStatus" style="margin-bottom:14px; color:var(--ink-soft); font-size:13px;"></div>
          <div class="row-actions">
            <button class="btn primary" id="clockInBtn">Clock in</button>
            <button class="btn" id="clockOutBtn">Clock out</button>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head"><h2>Attendance history</h2></div>
        <div class="panel-body pad0">
          <table>
            <thead><tr><th>Date</th><th>Clock in</th><th>Clock out</th></tr></thead>
            <tbody>
              ${history.length ? history.map((r) => `<tr><td>${formatDate(r.date)}</td><td>${r.timeIn || "—"}</td><td>${r.timeOut || "—"}</td></tr>`).join("") : `<tr><td colspan="3" class="empty-row">No attendance recorded yet.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head"><h2>Birthdays</h2></div>
        <div class="panel-body" style="padding-top:16px;">${birthdaysHtml()}</div>
      </div>
    `;

    const statusEl = document.getElementById("clockStatus");
    const inBtn = document.getElementById("clockInBtn");
    const outBtn = document.getElementById("clockOutBtn");
    if (!today) {
      statusEl.textContent = "You haven't clocked in today.";
      inBtn.disabled = false;
      outBtn.disabled = true;
    } else if (today.timeIn && !today.timeOut) {
      statusEl.textContent = `Clocked in today at ${today.timeIn}.`;
      inBtn.disabled = true;
      outBtn.disabled = false;
    } else {
      statusEl.textContent = `Today: in at ${today.timeIn}, out at ${today.timeOut}.`;
      inBtn.disabled = true;
      outBtn.disabled = true;
    }

    inBtn.addEventListener("click", () => {
      DataManager.clockIn(u.id);
      renderExtras();
    });
    outBtn.addEventListener("click", () => {
      DataManager.clockOut(u.id);
      renderExtras();
    });
    empMain
      .querySelectorAll("[data-send-wish]")
      .forEach((b) =>
        b.addEventListener("click", () =>
          UI.info("Birthday wish", "Birthday wish sent!"),
        ),
      );
    updateTopbarBadges();
  }

  // ================= PROFILE (Update Profile) =================

  const PROFILE_SECTIONS = [
    ["personal", "Personal Details"],
    ["contact", "Contact Details"],
    ["nextOfKin", "Next of kin Details"],
    ["education", "Education Qualifications"],
    ["guarantors", "Guarantor Details"],
    ["family", "Family Details"],
    ["job", "Job Details"],
    ["financial", "Financial Details"],
  ];

  // Row layouts (array of rows; each row is 1 or 2 fields) for the
  // list-backed sections. Shared by both the add/edit form and the save
  // handler (which just flattens every field key in order).
  const NEXT_OF_KIN_ROWS = [
    [{ key: "name", label: "Full Name" }],
    [
      { key: "relationship", label: "Relationship" },
      { key: "phone", label: "Phone No" },
    ],
    [{ key: "address", label: "Address", type: "textarea" }],
  ];
  const FAMILY_ROWS = NEXT_OF_KIN_ROWS;
  const GUARANTOR_ROWS = [
    [{ key: "name", label: "Guarantor's Name" }],
    [{ key: "occupation", label: "Job title / Occupation" }],
    [{ key: "phone", label: "Phone No" }],
  ];
  const EDUCATION_ROWS = [
    [
      { key: "institution", label: "Name of Institution" },
      { key: "department", label: "Department" },
    ],
    [
      { key: "course", label: "Course" },
      { key: "location", label: "Location" },
    ],
    [
      { key: "startDate", label: "Start Date", type: "date" },
      { key: "endDate", label: "End Date", type: "date" },
    ],
    [{ key: "description", label: "Description", type: "textarea" }],
  ];
  const FINANCIAL_ROWS = [
    [
      { key: "accountNumber", label: "Account Number" },
      { key: "accountName", label: "Account Name" },
    ],
    [
      { key: "bank", label: "Bank Name" },
      { key: "accountType", label: "Account Type" },
    ],
  ];

  function fieldHtml(f, editing) {
    const val = editing ? editing[f.key] || "" : "";
    if (f.type === "textarea") {
      return `<div class="field"><label>${f.label}</label><textarea id="uprof_${f.key}">${escapeHtml(val)}</textarea></div>`;
    }
    const type = f.type === "date" ? "date" : "text";
    return `<div class="field"><label>${f.label}</label><input type="${type}" id="uprof_${f.key}" value="${escapeHtml(val)}"></div>`;
  }

  function fieldRowsHtml(rows, editing) {
    return rows
      .map((row) =>
        row.length === 1
          ? fieldHtml(row[0], editing)
          : `<div class="field-row">${row.map((f) => fieldHtml(f, editing)).join("")}</div>`,
      )
      .join("");
  }

  function renderListSection(panel, u, section, title, rows, cardMetaFn) {
    const flatFields = rows.flat();
    const mode = route.profileMode || "list";

    if (mode === "form") {
      const editing = route.profileEditId
        ? DataManager.getProfileList(u, section).find(
            (i) => i.id === route.profileEditId,
          )
        : null;

      panel.innerHTML = `
        <h2>${editing ? "Edit" : "Add"} ${title}</h2>
        ${fieldRowsHtml(rows, editing)}
        <div style="display:flex; gap:10px; margin-top:6px;">
          <button class="btn primary" id="uprofSaveBtn">Update</button>
          <button class="btn ghost" id="uprofCancelBtn">Cancel</button>
          ${editing ? `<button class="btn danger" id="uprofDeleteBtn" style="margin-left:auto;">Delete</button>` : ""}
        </div>
      `;

      document
        .getElementById("uprofCancelBtn")
        .addEventListener("click", () => {
          route.profileMode = "list";
          route.profileEditId = null;
          renderProfile();
        });
      document.getElementById("uprofSaveBtn").addEventListener("click", () => {
        const data = {};
        flatFields.forEach((f) => {
          data[f.key] = document.getElementById("uprof_" + f.key).value.trim();
        });
        if (editing)
          DataManager.updateProfileListItem(u.id, section, editing.id, data);
        else DataManager.addProfileListItem(u.id, section, data);
        route.profileMode = "list";
        route.profileEditId = null;
        renderProfile();
      });
      if (editing) {
        document
          .getElementById("uprofDeleteBtn")
          .addEventListener("click", () => {
            UI.confirm(
              "Delete entry",
              "Remove this entry from your profile? This can't be undone.",
              "Delete",
              () => {
                DataManager.deleteProfileListItem(u.id, section, editing.id);
                route.profileMode = "list";
                route.profileEditId = null;
                renderProfile();
              },
            );
          });
      }
      return;
    }

    const items = DataManager.getProfileList(u, section);
    panel.innerHTML = `
      <h2>${title}</h2>
      ${
        items.length
          ? items
              .map((item) => {
                const meta = cardMetaFn(item);
                return `<div class="uprof-list-card" data-id="${item.id}">
                  <div class="name">${escapeHtml(meta.title)}</div>
                  <div class="meta">${meta.meta.map((m) => `<span>${escapeHtml(m)}</span>`).join("")}</div>
                  ${meta.sub ? `<div class="meta" style="margin-top:4px;">${escapeHtml(meta.sub)}</div>` : ""}
                </div>`;
              })
              .join("")
          : `<div class="uprof-empty">No entries yet — add one below.</div>`
      }
      <button class="uprof-add-btn" id="uprofAddBtn">+ Add ${title.replace(" Details", "").replace("Qualifications", "qualification")}</button>
    `;

    panel.querySelectorAll(".uprof-list-card").forEach((el) =>
      el.addEventListener("click", () => {
        route.profileMode = "form";
        route.profileEditId = el.dataset.id;
        renderProfile();
      }),
    );
    document.getElementById("uprofAddBtn").addEventListener("click", () => {
      route.profileMode = "form";
      route.profileEditId = null;
      renderProfile();
    });
  }

  function renderPersonalSection(panel, u) {
    const p = DataManager.getProfileSection(u, "personal");

    if (route.profileMode === "edit") {
      panel.innerHTML = `
        <h2>Personal Details</h2>
        <div class="field"><label>Employee Name</label><input type="text" id="pd_name" value="${escapeHtml(u.name)}"></div>
        <div class="field-row">
          <div class="field"><label>Department</label><input type="text" id="pd_dept" value="${escapeHtml(u.department || "")}"></div>
          <div class="field"><label>Job Title</label><input type="text" id="pd_title" value="${escapeHtml(u.title || "")}"></div>
        </div>
        <div class="field"><label>Job Category</label><input type="text" id="pd_cat" value="${escapeHtml(p.jobCategory || "Full time")}"></div>
        <div style="display:flex; gap:10px;">
          <button class="btn primary" id="pdSaveBtn">Update</button>
          <button class="btn ghost" id="pdCancelBtn">Cancel</button>
        </div>
      `;
      document.getElementById("pdCancelBtn").addEventListener("click", () => {
        route.profileMode = "view";
        renderProfile();
      });
      document.getElementById("pdSaveBtn").addEventListener("click", () => {
        const newName =
          document.getElementById("pd_name").value.trim() || u.name;
        DataManager.updateUser(u.id, {
          name: newName,
          department: document.getElementById("pd_dept").value.trim(),
          title: document.getElementById("pd_title").value.trim(),
        });
        DataManager.setProfileSection(u.id, "personal", {
          jobCategory: document.getElementById("pd_cat").value.trim(),
        });
        document.getElementById("profileBtn").textContent = initials(newName);
        route.profileMode = "view";
        renderProfile();
      });
      return;
    }

    panel.innerHTML = `
      <div class="uprof-personal-card">
        <button class="uprof-edit-btn" id="pdEditBtn" title="Edit">
          <img src="media/Vector (1).png" alt="">
        <span>Edit</span></button>
        <div class="avatar big-avatar">${initials(u.name)}</div>
        <div class="k" style="margin-top:0;">Employee Name</div>
        <div class="v">${escapeHtml(u.name)}</div>
        <div class="k">Department</div>
        <div class="v">${escapeHtml(u.department || "—")}</div>
        <div class="uprof-personal-grid">
          <div><div class="k" style="margin-top:0;">Job Title</div><div class="v">${escapeHtml(u.title || "—")}</div></div>
          <div><div class="k" style="margin-top:0;">Job Category</div><div class="v">${escapeHtml(p.jobCategory || "Full time")}</div></div>
        </div>
      </div>
    `;
    document.getElementById("pdEditBtn").addEventListener("click", () => {
      route.profileMode = "edit";
      renderProfile();
    });
  }

  function renderContactSection(panel, u) {
    const c = DataManager.getProfileSection(u, "contact");
    panel.innerHTML = `
      <h2>Contact Details</h2>
      <div class="field-row">
        <div class="field"><label>Phone Number 1</label><input type="text" id="ct_phone1" value="${escapeHtml(c.phone1 || "")}"></div>
        <div class="field"><label>Phone Number 2</label><input type="text" id="ct_phone2" value="${escapeHtml(c.phone2 || "")}"></div>
      </div>
      <div class="field"><label>E-mail Address</label><input type="email" id="ct_email" value="${escapeHtml(c.email || u.email || "")}"></div>
      <div class="field"><label>City of residence</label><input type="text" id="ct_city" value="${escapeHtml(c.city || "")}"></div>
      <div class="field"><label>Residential Address</label><textarea id="ct_address">${escapeHtml(c.address || "")}</textarea></div>
      <button class="btn primary" id="ctSaveBtn">Update</button>
    `;
    document.getElementById("ctSaveBtn").addEventListener("click", () => {
      DataManager.setProfileSection(u.id, "contact", {
        phone1: document.getElementById("ct_phone1").value.trim(),
        phone2: document.getElementById("ct_phone2").value.trim(),
        email: document.getElementById("ct_email").value.trim(),
        city: document.getElementById("ct_city").value.trim(),
        address: document.getElementById("ct_address").value.trim(),
      });
      UI.info(
        "Contact details updated",
        "Your contact information has been saved.",
      );
    });
  }

  function renderJobSection(panel, u) {
    const docs = DataManager.getProfileSection(u, "documents");
    const rows = [
      ["offerLetter", "Upload Offer Letter"],
      ["birthCertificate", "Upload Birth Certificate"],
      ["guarantorForm", "Upload Guarantor's Form"],
      ["degreeCertificate", "Upload Degree Certificate"],
    ];
    panel.innerHTML = `
      <h2>Job Details / Upload Documents</h2>
      ${rows
        .map(
          ([key, label]) => `
        <div class="uprof-upload-row">
          <div class="lbl">${label}</div>
          <div class="row">
            <input type="text" id="doc_${key}_name" value="${escapeHtml(docs[key] || "")}" placeholder="No file selected" readonly>
            <button type="button" class="btn gold" data-doc="${key}">Upload</button>
            <input type="file" id="doc_${key}_file" style="display:none;">
          </div>
        </div>
      `,
        )
        .join("")}
      <button class="btn blue" id="uploadDocsBtn" style="width:100%; justify-content:center; padding:14px; font-size:14.5px; margin-top:6px;">Upload Documents</button>
    `;
    rows.forEach(([key]) => {
      const btn = panel.querySelector(`[data-doc="${key}"]`);
      const fileInput = document.getElementById(`doc_${key}_file`);
      const nameInput = document.getElementById(`doc_${key}_name`);
      btn.addEventListener("click", () => fileInput.click());
      fileInput.addEventListener("change", () => {
        if (fileInput.files[0]) nameInput.value = fileInput.files[0].name;
      });
    });
    document.getElementById("uploadDocsBtn").addEventListener("click", () => {
      const patch = {};
      rows.forEach(([key]) => {
        patch[key] = document.getElementById(`doc_${key}_name`).value;
      });
      DataManager.setProfileSection(u.id, "documents", patch);
      UI.info(
        "Documents saved",
        "Your documents have been recorded on your profile.",
      );
    });
  }

  function renderProfile() {
    if (!route.profileSection) route.profileSection = "personal";
    const u = freshUser();

    empMain.innerHTML = `
      <div class="crumb-bar"><b>Dashboard</b> <span class="sep">&#8250;</span> Update Profile</div>
      <div class="uprof-shell">
        <div class="uprof-nav">
          ${PROFILE_SECTIONS.map(
            ([key, label]) =>
              `<button data-sec="${key}" class="${route.profileSection === key ? "active" : ""}">${label}</button>`,
          ).join("")}
        </div>
        <div class="uprof-panel" id="uprofPanel"></div>
      </div>
    `;

    empMain.querySelectorAll(".uprof-nav button").forEach((b) =>
      b.addEventListener("click", () => {
        if (b.dataset.sec === route.profileSection) return;
        route.profileSection = b.dataset.sec;
        route.profileMode = null;
        route.profileEditId = null;
        renderProfile();
      }),
    );

    const panel = document.getElementById("uprofPanel");
    switch (route.profileSection) {
      case "personal":
        renderPersonalSection(panel, u);
        break;
      case "contact":
        renderContactSection(panel, u);
        break;
      case "nextOfKin":
        renderListSection(
          panel,
          u,
          "nextOfKin",
          "Next of kin Details",
          NEXT_OF_KIN_ROWS,
          (i) => ({
            title: i.name,
            meta: [`Relationship: ${i.relationship}`, `Phone No: ${i.phone}`],
            sub: `Address: ${i.address}`,
          }),
        );
        break;
      case "education":
        renderListSection(
          panel,
          u,
          "education",
          "Education Qualifications",
          EDUCATION_ROWS,
          (i) => ({
            title: i.institution,
            meta: [i.course, i.location],
            sub: `${formatDate(i.startDate)} – ${formatDate(i.endDate)}`,
          }),
        );
        break;
      case "guarantors":
        renderListSection(
          panel,
          u,
          "guarantors",
          "Guarantor Details",
          GUARANTOR_ROWS,
          (i) => ({
            title: `MR ${i.name}`,
            meta: [`${i.occupation}`, `${i.phone}`],
          }),
        );
        break;
      case "family":
        renderListSection(
          panel,
          u,
          "family",
          "Family Details",
          FAMILY_ROWS,
          (i) => ({
            title: `MR ${i.name}`,
            meta: [`Relationship : ${i.relationship}`, `Phone No : ${i.phone}`],
            sub: `Address: ${i.address}`,
          }),
        );
        break;
      case "job":
        renderJobSection(panel, u);
        break;
      case "financial":
        renderListSection(
          panel,
          u,
          "financial",
          "Financial Details",
          FINANCIAL_ROWS,
          (i) => ({
            title: `${i.accountNumber} | ${i.accountName}`,
            meta: [i.bank, i.accountType],
          }),
        );
        break;
    }
  }

  // ---------- go ----------
  navigate("overview", "dashboard");
})();
