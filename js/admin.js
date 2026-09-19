(function () {
  // ---------- auth guard ----------
  const currentUser = DataManager.getSession();
  if (
    !currentUser ||
    (currentUser.role !== "admin" && currentUser.role !== "subadmin")
  ) {
    window.location.href = "index.html";
    return;
  }

  const isSubAdmin = currentUser.role === "subadmin";
  const RESTRICTED_SECTIONS = ["employees", "payroll"];

  const roleLabelEl = document.getElementById("adminRoleLabel");
  if (roleLabelEl) roleLabelEl.textContent = isSubAdmin ? "Sub-admin" : "Admin";

  if (isSubAdmin) {
    RESTRICTED_SECTIONS.forEach((sec) => {
      const item = document.querySelector(`.nav-item[data-section="${sec}"]`);
      if (!item) return;
      item.classList.add("locked");
      item.setAttribute("title", "Admins only");
      item.insertAdjacentHTML(
        "beforeend",
        '<span class="lock-ico" aria-hidden="true">&#128274;</span>',
      );
    });
  }

  const ADMIN_AVATAR_DATA_URI =
    "data:image/png;base64,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";

  document.getElementById("adminName").textContent = currentUser.name;
  document.getElementById("adminAvatar").innerHTML =
    `<img src="${ADMIN_AVATAR_DATA_URI}" alt="${initials(currentUser.name)}">`;
  document.getElementById("signOutBtn").addEventListener("click", () => {
    DataManager.clearSession();
    window.location.href = "index.html";
  });

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
  function daysRemaining(endIso) {
    const ms =
      new Date(endIso + "T00:00:00") -
      new Date(new Date().toISOString().slice(0, 10) + "T00:00:00");
    return Math.max(0, Math.round(ms / 86400000));
  }

  // ---------- top-level section navigation ----------
  const topSections = [
    "dashboard",
    "employees",
    "leave",
    "performance",
    "messages",
    "jobs",
    "candidates",
    "resumes",
    "payroll",
  ];
  const navButtons = document.querySelectorAll(".sidebar-nav .nav-item");

  function showSection(name) {
    if (isSubAdmin && RESTRICTED_SECTIONS.includes(name)) {
      UI.info(
        "Admins only",
        "This section is only available to full admins. Ask an admin for access if you need it.",
      );
      return;
    }
    topSections.forEach((s) => {
      document.getElementById("section-" + s).style.display =
        s === name ? "" : "none";
    });
    document.getElementById("section-employeeProfile").style.display = "none";
    navButtons.forEach((b) =>
      b.classList.toggle("active", b.dataset.section === name),
    );
    closeSidebar();
    renderSection(name);
  }
  document
    .querySelectorAll("[data-section]")
    .forEach((el) =>
      el.addEventListener("click", () => showSection(el.dataset.section)),
    );

  const sidebarEl = document.getElementById("sidebar");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");

  function openSidebar() {
    sidebarEl.classList.add("open");
    sidebarBackdrop.classList.add("show");
    document.body.style.overflow = "hidden";
  }
  function closeSidebar() {
    sidebarEl.classList.remove("open");
    sidebarBackdrop.classList.remove("show");
    document.body.style.overflow = "";
  }
  document.getElementById("menuToggle").addEventListener("click", () => {
    if (sidebarEl.classList.contains("open")) closeSidebar();
    else openSidebar();
  });
  sidebarBackdrop.addEventListener("click", closeSidebar);

  function renderSection(name) {
    if (name === "dashboard") renderDashboard();
    if (name === "employees") renderEmployees();
    if (name === "leave") {
      /* leave tab renders on its own tab clicks */
    }
    if (name === "performance") {
      /* perf tab renders on its own tab clicks */
    }
    if (name === "messages") {
      renderMessagesAnnouncements();
      renderAllUsers();
    }
    if (name === "jobs") renderJobs();
    if (name === "candidates") renderCandidates();
    if (name === "payroll") renderPayrollAdmin();
    refreshTopbarBadges();
  }

  // ================= DASHBOARD =================
  function renderDashboard() {
    const users = DataManager.getUsers();
    const leave = DataManager.getLeaveRequests();
    const today = new Date().toISOString().slice(0, 10);
    const attendanceToday = DataManager.getAttendance().filter(
      (r) => r.date === today,
    );

    document.getElementById("statHeadcount").textContent = users.filter(
      (u) => u.status === "active",
    ).length;
    document.getElementById("statPending").textContent = leave.filter(
      (l) => l.status === "pending",
    ).length;
    document.getElementById("statOnLeaveToday").textContent = leave.filter(
      (l) =>
        l.status === "approved" && l.startDate <= today && l.endDate >= today,
    ).length;
    document.getElementById("statClockedIn").textContent =
      attendanceToday.filter((r) => r.timeIn && !r.timeOut).length;

    const recentLeave = [...leave]
      .sort((a, b) => new Date(b.submitted) - new Date(a.submitted))
      .slice(0, 5);
    document.getElementById("dashLeaveBody").innerHTML = recentLeave.length
      ? recentLeave
          .map((l) => {
            const u = DataManager.getUser(l.userId);
            return `<tr>
        <td class="who-cell"><div class="avatar">${initials(u ? u.name : "?")}</div>${escapeHtml(u ? u.name : "Unknown")}</td>
        <td>${l.type}</td><td>${formatDate(l.startDate)} – ${formatDate(l.endDate)}</td>
        <td><span class="badge ${l.status}">${l.status}</span></td>
      </tr>`;
          })
          .join("")
      : `<tr><td colspan="4" class="empty-row">No leave requests yet.</td></tr>`;

    const anns = DataManager.getAnnouncements().slice(0, 3);
    document.getElementById("dashAnnouncements").innerHTML = anns.length
      ? anns
          .map(
            (a) => `
      <div class="announce-item"><div class="a-head"><h4>${escapeHtml(a.title)}</h4><span class="a-date">${formatDate(a.date)}</span></div><p>${escapeHtml(a.body)}</p></div>
    `,
          )
          .join("")
      : `<div class="empty-row">No announcements posted yet.</div>`;
  }

  // ================= EMPLOYEES =================
  function roleLabel(role) {
    return role === "subadmin" ? "Sub-admin" : "Employee";
  }

  function renderEmployees() {
    const users = DataManager.getUsers().filter(
      (u) => u.role === "employee" || u.role === "subadmin",
    );
    const tbody = document.getElementById("employeesBody");
    tbody.innerHTML = users.length
      ? users
          .map(
            (u) => `
      <tr>
        <td class="who-cell"><div class="avatar">${initials(u.name)}</div>
          <div><div style="font-weight:600;">${escapeHtml(u.name)}</div><div class="muted" style="font-size:12px;">${escapeHtml(u.email)}</div></div>
        </td>
        <td>${escapeHtml(u.department || "—")}</td>
        <td>${escapeHtml(u.title || "—")}</td>
        <td>${u.role === "subadmin" ? '<span class="badge admin">Sub-admin</span>' : "Employee"}</td>
        <td>${formatDate(u.joined)}</td>
        <td><span class="badge ${u.status}">${u.status}</span></td>
        <td class="row-actions">
          <div class="actions-dd">
            <button class="btn blue small" data-toggle-emp-dd="${u.id}">Actions &#8964;</button>
            <div class="actions-dd-menu" id="emp-dd-${u.id}">
              <button data-view-profile="${u.id}">View Profile</button>
              <button data-edit="${u.id}">Edit Profile</button>
              <button data-delete="${u.id}" class="warn">Remove</button>
            </div>
          </div>
        </td>
      </tr>
    `,
          )
          .join("")
      : `<tr><td colspan="7" class="empty-row">No employees yet — add your first one.</td></tr>`;

    tbody.querySelectorAll("[data-toggle-emp-dd]").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        const menu = document.getElementById("emp-dd-" + b.dataset.toggleEmpDd);
        const isOpen = menu.classList.contains("open");
        tbody
          .querySelectorAll(".actions-dd-menu.open")
          .forEach((m) => m.classList.remove("open"));
        if (!isOpen) menu.classList.add("open");
      }),
    );
    document.addEventListener("click", () =>
      tbody
        .querySelectorAll(".actions-dd-menu.open")
        .forEach((m) => m.classList.remove("open")),
    );

    tbody
      .querySelectorAll("[data-view-profile]")
      .forEach((b) =>
        b.addEventListener("click", () =>
          showEmployeeProfile(b.dataset.viewProfile),
        ),
      );
    tbody
      .querySelectorAll("[data-edit]")
      .forEach((b) =>
        b.addEventListener("click", () => openEmployeeModal(b.dataset.edit)),
      );
    tbody.querySelectorAll("[data-delete]").forEach((b) =>
      b.addEventListener("click", () => {
        const u = DataManager.getUser(b.dataset.delete);
        UI.confirm(
          "Remove employee?",
          `Remove ${escapeHtml(u.name)} from XCELTECH? This can't be undone.`,
          "Remove",
          () => {
            DataManager.deleteUser(b.dataset.delete);
            renderEmployees();
          },
        );
      }),
    );
  }

  const employeeModalVeil = document.getElementById("employeeModalVeil");
  const employeeForm = document.getElementById("employeeForm");
  const employeeFormMsg = document.getElementById("employeeFormMsg");

  function openEmployeeModal(id) {
    employeeForm.reset();
    employeeFormMsg.classList.remove("show");
    const isEdit = !!id;
    document.getElementById("employeeModalTitle").textContent = isEdit
      ? "Edit employee"
      : "Add employee";
    document.getElementById("empPasswordField").style.display = isEdit
      ? "none"
      : "";
    document.getElementById("empId").value = id || "";
    if (isEdit) {
      const u = DataManager.getUser(id);
      document.getElementById("empName").value = u.name;
      document.getElementById("empEmail").value = u.email;
      document.getElementById("empDept").value = u.department || "";
      document.getElementById("empTitle").value = u.title || "";
      document.getElementById("empJoined").value = u.joined || "";
      document.getElementById("empStatus").value = u.status || "active";
      document.getElementById("empRole").value =
        u.role === "subadmin" ? "subadmin" : "employee";
    } else {
      document.getElementById("empJoined").value = new Date()
        .toISOString()
        .slice(0, 10);
      document.getElementById("empStatus").value = "active";
      document.getElementById("empRole").value = "employee";
    }
    employeeModalVeil.classList.add("show");
  }
  function closeEmployeeModal() {
    employeeModalVeil.classList.remove("show");
  }

  document
    .getElementById("addEmployeeBtn")
    .addEventListener("click", () => openEmployeeModal(null));
  document
    .getElementById("employeeModalClose")
    .addEventListener("click", closeEmployeeModal);
  document
    .getElementById("employeeCancelBtn")
    .addEventListener("click", closeEmployeeModal);
  employeeModalVeil.addEventListener("click", (e) => {
    if (e.target === employeeModalVeil) closeEmployeeModal();
  });

  document.getElementById("employeeSaveBtn").addEventListener("click", () => {
    if (!employeeForm.reportValidity()) return;
    const id = document.getElementById("empId").value;
    const email = document.getElementById("empEmail").value.trim();
    const existing = DataManager.findByEmail(email);
    if (existing && existing.id !== id) {
      employeeFormMsg.textContent = "Another account already uses this email.";
      employeeFormMsg.classList.add("show");
      return;
    }
    const role =
      document.getElementById("empRole").value === "subadmin"
        ? "subadmin"
        : "employee";
    const payload = {
      name: document.getElementById("empName").value.trim(),
      email,
      department: document.getElementById("empDept").value.trim(),
      title: document.getElementById("empTitle").value.trim(),
      joined: document.getElementById("empJoined").value,
      status: document.getElementById("empStatus").value,
      role,
    };
    if (id) {
      DataManager.updateUser(id, payload);
    } else {
      const pw =
        document.getElementById("empPassword").value.trim() || "welcome123";
      DataManager.addUser(Object.assign({ password: pw }, payload));
    }
    closeEmployeeModal();
    renderEmployees();
  });

  // ================= LEAVE MANAGEMENT =================
  const leaveTabs = ["settings", "recall", "history", "officers"];
  const leaveTabButtons = document.querySelectorAll("[data-leave-tab]");
  let leaveHeroShown = true;

  function showLeaveTab(tab) {
    document.getElementById("leaveHero").style.display = "none";
    leaveTabs.forEach(
      (t) =>
        (document.getElementById("leaveTab-" + t).style.display =
          t === tab ? "" : "none"),
    );
    leaveTabButtons.forEach((b) =>
      b.classList.toggle("active", b.dataset.leaveTab === tab),
    );
    if (tab === "settings") renderLeaveTypes();
    if (tab === "recall") renderRecall();
    if (tab === "history") renderHistory();
    if (tab === "officers") renderOfficers();
    refreshTopbarBadges();
  }
  leaveTabButtons.forEach((b) =>
    b.addEventListener("click", () => showLeaveTab(b.dataset.leaveTab)),
  );

  // ---- Leave Settings ----
  function renderLeaveTypes() {
    const types = DataManager.getLeaveTypes();
    document.getElementById("leaveTypesBody").innerHTML = types.length
      ? types
          .map(
            (t) => `
      <tr>
        <td>${escapeHtml(t.name)}</td><td>${t.duration}</td>
        <td>${t.recall ? "Yes" : "No"} / ${t.autorenew ? "Yes" : "No"}</td>
        <td class="row-actions"><button class="btn small danger" data-del-lt="${t.id}">Delete</button></td>
      </tr>
    `,
          )
          .join("")
      : `<tr><td colspan="4" class="empty-row">No leave plans defined yet.</td></tr>`;

    document.querySelectorAll("[data-del-lt]").forEach((b) =>
      b.addEventListener("click", () => {
        DataManager.deleteLeaveType(b.dataset.delLt);
        renderLeaveTypes();
      }),
    );
  }
  document.getElementById("ltSaveBtn").addEventListener("click", () => {
    const form = document.getElementById("leaveTypeForm");
    const msg = document.getElementById("leaveTypeMsg");
    if (!form.reportValidity()) return;
    const name = document.getElementById("ltName").value.trim();
    if (!name) {
      msg.textContent = "Leave plan name is required.";
      msg.classList.add("show");
      return;
    }
    msg.classList.remove("show");
    DataManager.addLeaveType({
      name,
      duration: parseInt(document.getElementById("ltDuration").value, 10) || 0,
      recall: document.getElementById("ltRecall").value === "true",
      autorenew: document.getElementById("ltAutorenew").value === "true",
    });
    form.reset();
    renderLeaveTypes();
  });

  // ---- Leave Recall (ongoing applications) ----
  function renderRecall() {
    const list = DataManager.getLeaveRequests().filter(
      (l) => l.status === "pending" || l.status === "approved",
    );
    document.getElementById("recallBody").innerHTML = list.length
      ? list
          .map((l) => {
            const u = DataManager.getUser(l.userId);
            return `<tr>
        <td>${escapeHtml(u ? u.name : "Unknown")}</td><td>${l.days}</td>
        <td>${formatDate(l.startDate)}</td><td>${formatDate(l.endDate)}</td>
        <td>${escapeHtml(l.type)}</td><td>${escapeHtml(l.category || l.reason || "—")}</td>
        <td><button class="btn recall small" data-recall="${l.id}">Recall</button></td>
      </tr>`;
          })
          .join("")
      : `<tr><td colspan="7" class="empty-row">No ongoing leave applications.</td></tr>`;

    document
      .querySelectorAll("[data-recall]")
      .forEach((b) =>
        b.addEventListener("click", () => openRecallModal(b.dataset.recall)),
      );
  }

  const recallModalVeil = document.getElementById("recallModalVeil");
  function openRecallModal(leaveId) {
    const req = DataManager.getLeaveRequests().find((l) => l.id === leaveId);
    const user = DataManager.getUser(req.userId);
    document.getElementById("rcLeaveId").value = leaveId;
    document.getElementById("rcEmployeeName").value = user
      ? user.name
      : "Unknown";
    document.getElementById("rcDepartment").value = user
      ? user.department || "—"
      : "—";
    document.getElementById("rcStartDate").value = formatDate(req.startDate);
    document.getElementById("rcEndDate").value = formatDate(req.endDate);
    document.getElementById("rcDaysRemaining").value = daysRemaining(
      req.endDate,
    );
    document.getElementById("rcResumptionDate").value = "";
    document.getElementById("rcReason").value = "";

    const officers = DataManager.getReliefOfficers();
    document.getElementById("rcOfficer").innerHTML = officers.length
      ? officers
          .map(
            (o) =>
              `<option value="${o.id}">${escapeHtml(o.name)} — ${escapeHtml(o.department)}</option>`,
          )
          .join("")
      : `<option value="">No relief officers on file</option>`;

    recallModalVeil.classList.add("show");
  }
  function closeRecallModal() {
    recallModalVeil.classList.remove("show");
  }
  document
    .getElementById("recallModalClose")
    .addEventListener("click", closeRecallModal);
  document
    .getElementById("recallCancelBtn")
    .addEventListener("click", closeRecallModal);
  recallModalVeil.addEventListener("click", (e) => {
    if (e.target === recallModalVeil) closeRecallModal();
  });

  document.getElementById("recallSubmitBtn").addEventListener("click", () => {
    const leaveId = document.getElementById("rcLeaveId").value;
    const officerSelect = document.getElementById("rcOfficer");
    const officerName = officerSelect.options[officerSelect.selectedIndex]
      ? officerSelect.options[officerSelect.selectedIndex].text
      : "";
    DataManager.recallLeave(leaveId, {
      daysRemaining: document.getElementById("rcDaysRemaining").value,
      newResumptionDate: document.getElementById("rcResumptionDate").value,
      reliefOfficer: officerName,
      reason: document.getElementById("rcReason").value.trim(),
      initiatedBy: currentUser.name,
    });
    closeRecallModal();
    renderRecall();
  });

  // ---- Leave History ----
  function renderHistory() {
    const list = [...DataManager.getLeaveRequests()].sort(
      (a, b) => new Date(b.submitted) - new Date(a.submitted),
    );
    document.getElementById("historyBody").innerHTML = list.length
      ? list
          .map((l) => {
            const u = DataManager.getUser(l.userId);
            return `<tr>
        <td>${escapeHtml(u ? u.name : "Unknown")}</td><td>${l.days}</td>
        <td>${formatDate(l.startDate)}</td><td>${formatDate(l.endDate)}</td>
        <td>${escapeHtml(l.type)}</td><td>${escapeHtml(l.category || l.reason || "—")}</td>
        <td>
          <div class="actions-dd">
            <button class="btn blue small" data-toggle-dd="${l.id}">Actions &#8964;</button>
            <div class="actions-dd-menu" id="dd-${l.id}">
              <button data-approve="${l.id}">Approve</button>
              <button data-decline="${l.id}" class="warn">Decline</button>
              <button data-view="${l.id}">View Details</button>
              <button data-extend="${l.id}">Extension</button>
            </div>
          </div>
        </td>
      </tr>`;
          })
          .join("")
      : `<tr><td colspan="7" class="empty-row">No leave history yet.</td></tr>`;

    document.querySelectorAll("[data-toggle-dd]").forEach((b) =>
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        const menu = document.getElementById("dd-" + b.dataset.toggleDd);
        const isOpen = menu.classList.contains("open");
        document
          .querySelectorAll(".actions-dd-menu.open")
          .forEach((m) => m.classList.remove("open"));
        if (!isOpen) menu.classList.add("open");
      }),
    );
    document.querySelectorAll("[data-approve]").forEach((b) =>
      b.addEventListener("click", () => {
        DataManager.setLeaveStatus(b.dataset.approve, "approved");
        renderHistory();
      }),
    );
    document.querySelectorAll("[data-decline]").forEach((b) =>
      b.addEventListener("click", () => {
        DataManager.setLeaveStatus(b.dataset.decline, "rejected");
        renderHistory();
      }),
    );
    document.querySelectorAll("[data-view]").forEach((b) =>
      b.addEventListener("click", () => {
        const l = DataManager.getLeaveRequests().find(
          (x) => x.id === b.dataset.view,
        );
        const u = DataManager.getUser(l.userId);
        UI.info(
          "Leave request details",
          `
        <div class="profile-grid">
          <div class="profile-field"><div class="k">Employee</div><div class="v">${escapeHtml(u ? u.name : "Unknown")}</div></div>
          <div class="profile-field"><div class="k">Type</div><div class="v">${escapeHtml(l.type)} Leave</div></div>
          <div class="profile-field"><div class="k">Dates</div><div class="v">${formatDate(l.startDate)} – ${formatDate(l.endDate)}</div></div>
          <div class="profile-field"><div class="k">Days</div><div class="v">${l.days}</div></div>
          <div class="profile-field"><div class="k">Reason</div><div class="v">${escapeHtml(l.reason || l.category || "—")}</div></div>
          <div class="profile-field"><div class="k">Status</div><div class="v" style="text-transform:capitalize;">${l.status}</div></div>
        </div>
      `,
        );
      }),
    );
    document.querySelectorAll("[data-extend]").forEach((b) =>
      b.addEventListener("click", () => {
        UI.promptNumber("Extend leave", "Extend by how many days?", 3, (n) => {
          DataManager.extendLeave(b.dataset.extend, n);
          renderHistory();
        });
      }),
    );
  }
  document.addEventListener("click", () =>
    document
      .querySelectorAll(".actions-dd-menu.open")
      .forEach((m) => m.classList.remove("open")),
  );
  document.getElementById("exportLeaveBtn").addEventListener("click", () => {
    const rows = DataManager.getLeaveRequests().map((l) => {
      const u = DataManager.getUser(l.userId);
      return [
        u ? u.name : "Unknown",
        l.days,
        l.startDate,
        l.endDate,
        l.type,
        l.category || l.reason || "",
        l.status,
      ].join(",");
    });
    const csv =
      "Name,Duration,Start,End,Type,Reason,Status\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "leave-history.csv";
    a.click();
  });

  // ---- Relief Officers ----
  function renderOfficers() {
    const list = DataManager.getReliefOfficers();
    document.getElementById("officersBody").innerHTML = list.length
      ? list
          .map(
            (o) => `
      <tr><td>${escapeHtml(o.name)}</td><td>${escapeHtml(o.department)}</td>
      <td><button class="btn small danger" data-del-ro="${o.id}">Remove</button></td></tr>
    `,
          )
          .join("")
      : `<tr><td colspan="3" class="empty-row">No relief officers on file.</td></tr>`;

    document.querySelectorAll("[data-del-ro]").forEach((b) =>
      b.addEventListener("click", () => {
        DataManager.deleteReliefOfficer(b.dataset.delRo);
        renderOfficers();
      }),
    );
  }
  const officerModalVeil = document.getElementById("officerModalVeil");
  const officerForm = document.getElementById("officerForm");
  document.getElementById("addOfficerBtn").addEventListener("click", () => {
    officerForm.reset();
    document.getElementById("officerFormMsg").classList.remove("show");
    officerModalVeil.classList.add("show");
  });
  document
    .getElementById("officerModalClose")
    .addEventListener("click", () => officerModalVeil.classList.remove("show"));
  document
    .getElementById("officerCancelBtn")
    .addEventListener("click", () => officerModalVeil.classList.remove("show"));
  officerModalVeil.addEventListener("click", (e) => {
    if (e.target === officerModalVeil)
      officerModalVeil.classList.remove("show");
  });
  document.getElementById("officerSaveBtn").addEventListener("click", () => {
    if (!officerForm.reportValidity()) return;
    DataManager.addReliefOfficer({
      name: document.getElementById("roName").value.trim(),
      department: document.getElementById("roDept").value.trim(),
    });
    officerModalVeil.classList.remove("show");
    renderOfficers();
  });

  // ================= PERFORMANCE MANAGEMENT =================
  const perfTabs = ["target", "targets", "appraisals", "settings", "reports"];
  const perfTabButtons = document.querySelectorAll("[data-perf-tab]");

  function showPerfTab(tab) {
    document.getElementById("perfHero").style.display = "none";
    perfTabs.forEach(
      (t) =>
        (document.getElementById("perfTab-" + t).style.display =
          t === tab ? "" : "none"),
    );
    perfTabButtons.forEach((b) =>
      b.classList.toggle("active", b.dataset.perfTab === tab),
    );
    if (tab === "target") renderTargetSetup();
    if (tab === "targets") renderAssignedTargets();
    if (tab === "appraisals") renderAppraisals();
    if (tab === "settings") renderPerfSettings();
    if (tab === "reports") renderPerfReports();
  }
  perfTabButtons.forEach((b) =>
    b.addEventListener("click", () => showPerfTab(b.dataset.perfTab)),
  );

  /* ---------- shared performance helpers ---------- */

  function employeeList() {
    return DataManager.getUsers().filter((u) => u.role === "employee");
  }
  function meterClass(pct) {
    if (pct >= 75) return "good";
    if (pct >= 40) return "warn";
    return "bad";
  }
  function meterHtml(pct) {
    return `<div class="perf-meter-row">
      <div class="perf-meter"><div class="fill ${meterClass(pct)}" style="width:${pct}%"></div></div>
      <span class="pct">${pct}%</span>
    </div>`;
  }
  function userName(id) {
    const u = DataManager.getUser(id);
    return u ? u.name : "Unknown";
  }

  /* ---------- Tab 1: Target Setup ---------- */

  function renderTargetSetup() {
    const employees = employeeList();
    document.getElementById("tgEmployees").innerHTML = employees
      .map((e) => `<option value="${e.id}">${escapeHtml(e.name)}</option>`)
      .join("");
    renderTargetsList();
  }

  function renderTargetsList() {
    const targets = DataManager.getTargets();
    document.getElementById("targetsBody").innerHTML = targets.length
      ? targets
          .map((t) => {
            const names = (t.employeeIds || []).map(userName).join(", ");
            return `<tr>
        <td>${escapeHtml(t.title)}</td><td>${escapeHtml(t.kpiWeight)}</td><td>${escapeHtml(names || "—")}</td>
        <td>${formatDate(t.startDate)} – ${formatDate(t.endDate)}</td>
        <td><button class="btn small danger" data-del-tg="${t.id}">Delete</button></td>
      </tr>`;
          })
          .join("")
      : `<tr><td colspan="5" class="empty-row">No targets created yet.</td></tr>`;

    document.querySelectorAll("[data-del-tg]").forEach((b) =>
      b.addEventListener("click", () => {
        UI.confirm(
          "Delete target",
          "Deleting removes this target and every employee's reported progress on it.",
          "Delete",
          () => {
            DataManager.deleteTarget(b.dataset.delTg);
            renderTargetsList();
          },
        );
      }),
    );
  }

  function saveTarget() {
    const form = document.getElementById("targetForm");
    const msg = document.getElementById("targetMsg");
    if (!form.reportValidity()) return false;
    const employeeIds = Array.from(
      document.getElementById("tgEmployees").selectedOptions,
    ).map((o) => o.value);
    if (employeeIds.length === 0) {
      msg.textContent = "Select at least one employee for this target.";
      msg.classList.add("show");
      return false;
    }
    const start = document.getElementById("tgStart").value;
    const end = document.getElementById("tgEnd").value;
    if (end < start) {
      msg.textContent = "The end date can't be before the start date.";
      msg.classList.add("show");
      return false;
    }
    msg.classList.remove("show");
    DataManager.addTarget({
      title: document.getElementById("tgTitle").value.trim(),
      kpiWeight: document.getElementById("tgWeight").value,
      description: document.getElementById("tgDesc").value.trim(),
      employeeIds,
      startDate: start,
      endDate: end,
    });
    form.reset();
    renderTargetsList();
    return true;
  }
  document
    .getElementById("tgSubmitBtn")
    .addEventListener("click", () => saveTarget());
  document
    .getElementById("tgAddMoreBtn")
    .addEventListener("click", () => saveTarget());

  /* ---------- Tab 2: Assigned targets (org-wide progress) ---------- */

  function renderAssignedTargets() {
    const empSelect = document.getElementById("tgFilterEmployee");
    if (empSelect.options.length <= 1) {
      empSelect.innerHTML =
        `<option value="">All employees</option>` +
        employeeList()
          .map((e) => `<option value="${e.id}">${escapeHtml(e.name)}</option>`)
          .join("");
    }
    const empFilter = empSelect.value;
    const statusFilter = document.getElementById("tgFilterStatus").value;

    // One row per employee-on-target, so progress is always per person.
    const rows = [];
    DataManager.getTargets().forEach((t) => {
      if (statusFilter && (t.status || "active") !== statusFilter) return;
      (t.employeeIds || []).forEach((uid) => {
        if (empFilter && uid !== empFilter) return;
        rows.push({ target: t, userId: uid });
      });
    });

    document.getElementById("assignedTargetsBody").innerHTML = rows.length
      ? rows
          .map(({ target: t, userId }) => {
            const prog = DataManager.getTargetProgress(t, userId);
            const status = t.status || "active";
            return `<tr>
        <td class="who-cell"><div class="avatar">${initials(userName(userId))}</div>${escapeHtml(userName(userId))}</td>
        <td>${escapeHtml(t.title)}${prog.note ? `<div class="desc">${escapeHtml(prog.note)}</div>` : ""}</td>
        <td>${escapeHtml(t.kpiWeight)}</td>
        <td style="min-width:150px;">${meterHtml(prog.percent)}<div class="desc">${prog.updated ? "Updated " + formatDate(prog.updated) : "No update yet"}</div></td>
        <td>${formatDate(t.startDate)} – ${formatDate(t.endDate)}</td>
        <td><span class="badge ${status}">${status}</span></td>
        <td>
          <button class="btn small blue" data-edit-progress="${t.id}" data-uid="${userId}">Progress</button>
          <button class="btn small" data-toggle-tg="${t.id}">${status === "active" ? "Close" : "Reopen"}</button>
        </td>
      </tr>`;
          })
          .join("")
      : `<tr><td colspan="7" class="empty-row">No targets match this filter.</td></tr>`;

    document
      .querySelectorAll("[data-edit-progress]")
      .forEach((b) =>
        b.addEventListener("click", () =>
          openProgressModal(b.dataset.editProgress, b.dataset.uid),
        ),
      );
    document.querySelectorAll("[data-toggle-tg]").forEach((b) =>
      b.addEventListener("click", () => {
        const t = DataManager.getTarget(b.dataset.toggleTg);
        if (!t) return;
        DataManager.updateTarget(t.id, {
          status: (t.status || "active") === "active" ? "closed" : "active",
        });
        renderAssignedTargets();
      }),
    );
  }

  document
    .getElementById("tgFilterEmployee")
    .addEventListener("change", renderAssignedTargets);
  document
    .getElementById("tgFilterStatus")
    .addEventListener("change", renderAssignedTargets);
  document
    .getElementById("tgRefreshBtn")
    .addEventListener("click", renderAssignedTargets);

  /* ---------- progress modal (admin override) ---------- */

  const progressModalVeil = document.getElementById("progressModalVeil");

  function openProgressModal(targetId, userId) {
    const t = DataManager.getTarget(targetId);
    if (!t) return;
    const prog = DataManager.getTargetProgress(t, userId);
    document.getElementById("prTargetId").value = targetId;
    document.getElementById("prUserId").value = userId;
    document.getElementById("prPercent").value = prog.percent;
    document.getElementById("prNote").value = prog.note || "";
    document.getElementById("progressModalSub").textContent =
      `${userName(userId)} — ${t.title}`;
    progressModalVeil.classList.add("show");
  }
  function closeProgressModal() {
    progressModalVeil.classList.remove("show");
  }
  document
    .getElementById("progressModalClose")
    .addEventListener("click", closeProgressModal);
  document
    .getElementById("progressCancelBtn")
    .addEventListener("click", closeProgressModal);
  progressModalVeil.addEventListener("click", (e) => {
    if (e.target === progressModalVeil) closeProgressModal();
  });
  document.getElementById("progressSaveBtn").addEventListener("click", () => {
    DataManager.setTargetProgress(
      document.getElementById("prTargetId").value,
      document.getElementById("prUserId").value,
      document.getElementById("prPercent").value,
      document.getElementById("prNote").value.trim(),
    );
    closeProgressModal();
    renderAssignedTargets();
  });

  /* ---------- Tab 3: Appraisals ---------- */

  const APPRAISAL_STATUS_LABEL = {
    "self-pending": "Awaiting self-appraisal",
    "review-pending": "Awaiting review",
    completed: "Completed",
  };

  function renderAppraisals() {
    const statusFilter = document.getElementById("apFilterStatus").value;
    const list = DataManager.getAppraisals().filter(
      (a) => !statusFilter || a.status === statusFilter,
    );

    document.getElementById("appraisalsBody").innerHTML = list.length
      ? list
          .map(
            (a) => `<tr>
        <td class="who-cell"><div class="avatar">${initials(userName(a.userId))}</div>${escapeHtml(userName(a.userId))}</td>
        <td>${escapeHtml(a.cycle)}</td>
        <td>${formatDate(a.periodStart)} – ${formatDate(a.periodEnd)}</td>
        <td>${a.self ? a.self.score + "%" : "—"}</td>
        <td>${a.status === "completed" ? `<strong>${a.finalScore}%</strong><div class="desc">${escapeHtml(a.rating || "")}</div>` : "—"}</td>
        <td><span class="badge ${a.status}">${APPRAISAL_STATUS_LABEL[a.status] || a.status}</span></td>
        <td class="actions-cells">
          <button class="btn small blue" data-review-ap="${a.id}">${a.status === "completed" ? "View" : "Review"}</button>
          <button class="btn small danger" data-del-ap="${a.id}">Delete</button>
        </td>
      </tr>`,
          )
          .join("")
      : `<tr><td colspan="7" class="empty-row">No appraisals match this filter.</td></tr>`;

    document
      .querySelectorAll("[data-review-ap]")
      .forEach((b) =>
        b.addEventListener("click", () => openReviewModal(b.dataset.reviewAp)),
      );
    document.querySelectorAll("[data-del-ap]").forEach((b) =>
      b.addEventListener("click", () =>
        UI.confirm(
          "Delete appraisal",
          "This removes the appraisal and any self-assessment attached to it.",
          "Delete",
          () => {
            DataManager.deleteAppraisal(b.dataset.delAp);
            renderAppraisals();
          },
        ),
      ),
    );
  }

  document
    .getElementById("apFilterStatus")
    .addEventListener("change", renderAppraisals);

  /* ---------- new appraisal cycle modal ---------- */

  const appraisalModalVeil = document.getElementById("appraisalModalVeil");

  function openAppraisalModal() {
    document.getElementById("appraisalForm").reset();
    document.getElementById("appraisalFormMsg").classList.remove("show");
    document.getElementById("apEmployees").innerHTML = employeeList()
      .map((e) => `<option value="${e.id}">${escapeHtml(e.name)}</option>`)
      .join("");
    appraisalModalVeil.classList.add("show");
  }
  function closeAppraisalModal() {
    appraisalModalVeil.classList.remove("show");
  }
  document
    .getElementById("newAppraisalBtn")
    .addEventListener("click", openAppraisalModal);
  document
    .getElementById("appraisalModalClose")
    .addEventListener("click", closeAppraisalModal);
  document
    .getElementById("appraisalCancelBtn")
    .addEventListener("click", closeAppraisalModal);
  appraisalModalVeil.addEventListener("click", (e) => {
    if (e.target === appraisalModalVeil) closeAppraisalModal();
  });

  document.getElementById("appraisalSaveBtn").addEventListener("click", () => {
    const form = document.getElementById("appraisalForm");
    const msg = document.getElementById("appraisalFormMsg");
    if (!form.reportValidity()) return;
    const employeeIds = Array.from(
      document.getElementById("apEmployees").selectedOptions,
    ).map((o) => o.value);
    if (!employeeIds.length) {
      msg.textContent = "Select at least one employee for this cycle.";
      msg.classList.add("show");
      return;
    }
    const start = document.getElementById("apStart").value;
    const end = document.getElementById("apEnd").value;
    if (end < start) {
      msg.textContent = "The period end can't be before the period start.";
      msg.classList.add("show");
      return;
    }
    const settings = DataManager.getPerfSettings();
    const created = DataManager.addAppraisalCycle({
      cycle: document.getElementById("apCycle").value.trim(),
      periodStart: start,
      periodEnd: end,
      dueDate: document.getElementById("apDue").value,
      employeeIds,
      requireSelf: settings.requireSelfAppraisal,
    });
    closeAppraisalModal();
    renderAppraisals();
    UI.info(
      "Cycle created",
      `${created.length} appraisal${created.length === 1 ? "" : "s"} created. ${
        settings.requireSelfAppraisal
          ? "Employees can now fill their self-assessment."
          : "They're queued for your review."
      }`,
    );
  });

  /* ---------- appraisal review modal ---------- */

  const reviewModalVeil = document.getElementById("reviewModalVeil");

  function openReviewModal(id) {
    const a = DataManager.getAppraisal(id);
    if (!a) return;
    const readOnly = a.status === "completed";
    const perfScore = DataManager.getPerformanceScore(a.userId);

    document.getElementById("rvAppraisalId").value = id;
    document.getElementById("reviewFormMsg").classList.remove("show");
    document.getElementById("reviewModalTitle").textContent = readOnly
      ? "Appraisal result"
      : "Review appraisal";
    document.getElementById("reviewModalSub").textContent =
      `${userName(a.userId)} — ${a.cycle}`;

    const selfHtml = a.self
      ? `<div class="perf-review-block" style="border-top:none; padding-top:0;">
          <div class="k">Self score</div><div class="v">${a.self.score}% — submitted ${formatDate(a.self.submitted)}</div>
          <div class="k">Strengths</div><div class="v">${escapeHtml(a.self.strengths || "—")}</div>
          <div class="k">Challenges</div><div class="v">${escapeHtml(a.self.challenges || "—")}</div>
          <div class="k">Comments</div><div class="v">${escapeHtml(a.self.comments || "—")}</div>
        </div>`
      : `<div class="perf-note">No self-assessment submitted yet — you can still score this appraisal directly.</div>`;

    document.getElementById("reviewSelfBlock").innerHTML =
      selfHtml +
      `<div class="perf-note" style="margin-bottom:14px;">Weighted target score for this employee: <strong>${perfScore.score}%</strong> across ${perfScore.breakdown.length} target(s).</div>`;

    document.getElementById("rvRating").innerHTML =
      DataManager.getPerfSettings()
        .ratingBands.slice()
        .sort((x, y) => y.min - x.min)
        .map(
          (b) =>
            `<option value="${escapeHtml(b.label)}" ${a.rating === b.label ? "selected" : ""}>${escapeHtml(b.label)} (${b.min}%+)</option>`,
        )
        .join("");

    document.getElementById("rvScore").value = a.review
      ? a.review.score
      : a.self
        ? a.self.score
        : perfScore.score;
    document.getElementById("rvComments").value = a.review
      ? a.review.comments
      : "";

    ["rvScore", "rvRating", "rvComments"].forEach((elId) => {
      document.getElementById(elId).disabled = readOnly;
    });
    document.getElementById("reviewSaveBtn").style.display = readOnly
      ? "none"
      : "";
    reviewModalVeil.classList.add("show");
  }
  function closeReviewModal() {
    reviewModalVeil.classList.remove("show");
  }
  document
    .getElementById("reviewModalClose")
    .addEventListener("click", closeReviewModal);
  document
    .getElementById("reviewCancelBtn")
    .addEventListener("click", closeReviewModal);
  reviewModalVeil.addEventListener("click", (e) => {
    if (e.target === reviewModalVeil) closeReviewModal();
  });

  document.getElementById("reviewSaveBtn").addEventListener("click", () => {
    const msg = document.getElementById("reviewFormMsg");
    const score = parseInt(document.getElementById("rvScore").value, 10);
    if (isNaN(score) || score < 0 || score > 100) {
      msg.textContent = "Enter a final score between 0 and 100.";
      msg.classList.add("show");
      return;
    }
    const comments = document.getElementById("rvComments").value.trim();
    if (!comments) {
      msg.textContent = "Add a short comment before publishing the result.";
      msg.classList.add("show");
      return;
    }
    msg.classList.remove("show");
    DataManager.submitAppraisalReview(
      document.getElementById("rvAppraisalId").value,
      {
        score,
        rating: document.getElementById("rvRating").value,
        comments,
        reviewer: currentUser.name,
      },
    );
    closeReviewModal();
    renderAppraisals();
  });

  /* ---------- Tab 4: Settings ---------- */

  function renderPerfSettings() {
    const s = DataManager.getPerfSettings();
    document.getElementById("psReviewPeriod").value = s.reviewPeriod;
    document.getElementById("psRequireSelf").value = s.requireSelfAppraisal
      ? "yes"
      : "no";
    document.getElementById("psAllowEdits").value = s.allowProgressEdits
      ? "yes"
      : "no";
    renderBands(s.ratingBands);
  }

  function renderBands(bands) {
    document.getElementById("perfBandsList").innerHTML = bands
      .slice()
      .sort((a, b) => b.min - a.min)
      .map(
        (b, i) => `
      <div class="perf-band-row" data-band-row="${i}">
        <input type="number" min="0" max="100" value="${b.min}" data-band-min>
        <input type="text" value="${escapeHtml(b.label)}" data-band-label>
        <button class="btn small danger" data-remove-band="${i}">Remove</button>
      </div>`,
      )
      .join("");

    document.querySelectorAll("[data-remove-band]").forEach((b) =>
      b.addEventListener("click", () => {
        const rows = collectBands();
        if (rows.length <= 1) {
          UI.info("Rating bands", "Keep at least one rating band.");
          return;
        }
        rows.splice(parseInt(b.dataset.removeBand, 10), 1);
        renderBands(rows);
      }),
    );
  }

  function collectBands() {
    return Array.from(document.querySelectorAll("[data-band-row]")).map(
      (row) => ({
        min: parseInt(row.querySelector("[data-band-min]").value, 10) || 0,
        label: row.querySelector("[data-band-label]").value.trim() || "Unrated",
      }),
    );
  }

  document.getElementById("addBandBtn").addEventListener("click", () => {
    const bands = collectBands();
    bands.push({ min: 0, label: "New band" });
    renderBands(bands);
  });

  document
    .getElementById("savePerfSettingsBtn")
    .addEventListener("click", () => {
      DataManager.savePerfSettings({
        reviewPeriod: document.getElementById("psReviewPeriod").value,
        requireSelfAppraisal:
          document.getElementById("psRequireSelf").value === "yes",
        allowProgressEdits:
          document.getElementById("psAllowEdits").value === "yes",
        ratingBands: collectBands(),
      });
      const msg = document.getElementById("perfSettingsMsg");
      msg.textContent = "Settings saved.";
      msg.classList.add("show");
      setTimeout(() => msg.classList.remove("show"), 2500);
      renderPerfSettings();
    });

  /* ---------- Tab 5: Reports ---------- */

  function buildScorecard() {
    return employeeList().map((u) => {
      const perf = DataManager.getPerformanceScore(u.id);
      const appraisals = DataManager.getAppraisalsForUser(u.id).filter(
        (a) => a.status === "completed",
      );
      const last = appraisals[0] || null;
      return {
        user: u,
        targetCount: perf.breakdown.length,
        score: perf.score,
        hasTargets: perf.hasTargets,
        lastAppraisal: last,
      };
    });
  }

  function renderPerfReports() {
    const rows = buildScorecard();
    const scored = rows.filter((r) => r.hasTargets);
    const avg = scored.length
      ? Math.round(scored.reduce((s, r) => s + r.score, 0) / scored.length)
      : 0;
    const appraisals = DataManager.getAppraisals();
    const activeTargets = DataManager.getTargets().filter(
      (t) => (t.status || "active") === "active",
    ).length;

    document.getElementById("perfReportStats").innerHTML = `
      <div class="perf-report-card"><div class="n">${avg}%</div><div class="l">Average target score</div></div>
      <div class="perf-report-card"><div class="n">${activeTargets}</div><div class="l">Active targets</div></div>
      <div class="perf-report-card"><div class="n">${appraisals.filter((a) => a.status === "completed").length}</div><div class="l">Appraisals completed</div></div>
      <div class="perf-report-card"><div class="n">${appraisals.filter((a) => a.status !== "completed").length}</div><div class="l">Appraisals outstanding</div></div>
    `;

    document.getElementById("perfScorecardBody").innerHTML = rows.length
      ? rows
          .sort((a, b) => b.score - a.score)
          .map(
            (r) => `<tr>
        <td class="who-cell"><div class="avatar">${initials(r.user.name)}</div>${escapeHtml(r.user.name)}</td>
        <td>${escapeHtml(r.user.department || "—")}</td>
        <td>${r.targetCount}</td>
        <td style="min-width:150px;">${r.hasTargets ? meterHtml(r.score) : `<span class="muted">No targets</span>`}</td>
        <td>${r.lastAppraisal ? `${r.lastAppraisal.finalScore}% <div class="desc">${escapeHtml(r.lastAppraisal.cycle)}</div>` : "—"}</td>
        <td>${r.hasTargets ? `<span class="badge rating">${escapeHtml(DataManager.getRatingForScore(r.score))}</span>` : "—"}</td>
      </tr>`,
          )
          .join("")
      : `<tr><td colspan="6" class="empty-row">No employees on record yet.</td></tr>`;

    const byDept = {};
    rows.forEach((r) => {
      if (!r.hasTargets) return;
      const d = r.user.department || "Unassigned";
      byDept[d] = byDept[d] || [];
      byDept[d].push(r.score);
    });
    const deptKeys = Object.keys(byDept);
    document.getElementById("perfDeptAverages").innerHTML = deptKeys.length
      ? deptKeys
          .map((d) => {
            const list = byDept[d];
            const dAvg = Math.round(
              list.reduce((s, n) => s + n, 0) / list.length,
            );
            return `<div class="perf-dept-row">
          <div class="name">${escapeHtml(d)}</div>
          <div class="perf-meter"><div class="fill ${meterClass(dAvg)}" style="width:${dAvg}%"></div></div>
          <div class="pct" style="min-width:44px; text-align:right; font-weight:700;">${dAvg}%</div>
        </div>`;
          })
          .join("")
      : `<div class="empty-row">No scored departments yet.</div>`;
  }

  document.getElementById("exportPerfBtn").addEventListener("click", () => {
    const rows = buildScorecard();
    const header = [
      "Employee",
      "Department",
      "Targets",
      "Target score (%)",
      "Rating",
      "Last appraisal cycle",
      "Last appraisal score (%)",
    ];
    const csvRows = rows.map((r) => [
      r.user.name,
      r.user.department || "",
      r.targetCount,
      r.hasTargets ? r.score : "",
      r.hasTargets ? DataManager.getRatingForScore(r.score) : "",
      r.lastAppraisal ? r.lastAppraisal.cycle : "",
      r.lastAppraisal ? r.lastAppraisal.finalScore : "",
    ]);
    const csv = [header]
      .concat(csvRows)
      .map((line) =>
        line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `xceltech-performance-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });

  // ================= MESSAGES (announcements) =================
  function renderMessagesAnnouncements() {
    const anns = DataManager.getAnnouncements();
    document.getElementById("messagesAnnouncementsList").innerHTML = anns.length
      ? anns
          .map(
            (a) => `
      <div class="announce-item">
        <div class="a-head"><h4>${escapeHtml(a.title)}</h4><span class="a-date">${formatDate(a.date)}</span></div>
        <p>${escapeHtml(a.body)}</p>
        <div style="margin-top:8px;"><button class="btn small danger" data-del-ann="${a.id}">Delete</button></div>
      </div>
    `,
          )
          .join("")
      : `<div class="empty-row">No announcements sent yet.</div>`;

    document.querySelectorAll("[data-del-ann]").forEach((b) =>
      b.addEventListener("click", () => {
        DataManager.deleteAnnouncement(b.dataset.delAnn);
        renderMessagesAnnouncements();
        refreshTopbarBadges();
      }),
    );
  }

  const announceModalVeil = document.getElementById("announceModalVeil");
  const announceForm = document.getElementById("announceForm");
  function openAnnounceModal() {
    announceForm.reset();
    document.getElementById("announceFormMsg").classList.remove("show");
    announceModalVeil.classList.add("show");
  }
  document
    .getElementById("addAnnouncementBtn")
    .addEventListener("click", openAnnounceModal);
  document
    .getElementById("announceModalClose")
    .addEventListener("click", () =>
      announceModalVeil.classList.remove("show"),
    );
  document
    .getElementById("announceCancelBtn")
    .addEventListener("click", () =>
      announceModalVeil.classList.remove("show"),
    );
  announceModalVeil.addEventListener("click", (e) => {
    if (e.target === announceModalVeil)
      announceModalVeil.classList.remove("show");
  });
  document.getElementById("announceSaveBtn").addEventListener("click", () => {
    if (!announceForm.reportValidity()) return;
    DataManager.addAnnouncement({
      title: document.getElementById("anTitle").value.trim(),
      body: document.getElementById("anBody").value.trim(),
      author: currentUser.name,
    });
    announceModalVeil.classList.remove("show");
    renderMessagesAnnouncements();
    refreshTopbarBadges();
  });

  // ================= TOP BAR: notifications / mail / settings =================
  function refreshTopbarBadges() {
    const pendingCount = DataManager.getLeaveRequests().filter(
      (l) => l.status === "pending",
    ).length;
    document.getElementById("notifBadge").textContent = pendingCount;
    document.getElementById("notifBadge").style.display = pendingCount
      ? ""
      : "none";

    const mailCount = DataManager.getAnnouncements().length;
    document.getElementById("mailBadge").textContent = mailCount;
    document.getElementById("mailBadge").style.display = mailCount
      ? ""
      : "none";
  }

  UI.bindDropdown("notifBtn", "notifPanel", (panel) => {
    const pending = DataManager.getLeaveRequests()
      .filter((l) => l.status === "pending")
      .sort((a, b) => new Date(b.submitted) - new Date(a.submitted))
      .slice(0, 6);
    panel.innerHTML = `
      <div class="td-head">Notifications <a id="notifViewAll">View all &#8594;</a></div>
      ${
        pending.length
          ? pending
              .map((l) => {
                const u = DataManager.getUser(l.userId);
                return `<div class="td-item"><div class="td-title">${escapeHtml(u ? u.name : "Unknown")} requested ${escapeHtml(l.type)} leave</div><div class="td-sub">${formatDate(l.startDate)} – ${formatDate(l.endDate)} · ${l.days} day(s)</div></div>`;
              })
              .join("")
          : `<div class="td-empty">No pending requests right now.</div>`
      }
    `;
    const link = document.getElementById("notifViewAll");
    if (link)
      link.addEventListener("click", () => {
        showSection("leave");
        showLeaveTab("history");
        panel.classList.remove("open");
      });
  });

  UI.bindDropdown("mailBtn", "mailPanel", (panel) => {
    const anns = DataManager.getAnnouncements().slice(0, 6);
    panel.innerHTML = `
      <div class="td-head">Messages <a id="mailViewAll">Manage &#8594;</a></div>
      ${anns.length ? anns.map((a) => `<div class="td-item"><div class="td-title">${escapeHtml(a.title)}</div><div class="td-sub">${formatDate(a.date)}</div></div>`).join("") : `<div class="td-empty">No announcements sent yet.</div>`}
    `;
    const link = document.getElementById("mailViewAll");
    if (link)
      link.addEventListener("click", () => {
        showSection("messages");
        panel.classList.remove("open");
      });
  });

  UI.bindDropdown("settingsBtn", "settingsPanel", (panel) => {
    panel.innerHTML = `
      <div class="td-head">Settings</div>
      <div class="td-item"><div class="td-title">Account</div><div class="td-sub">Signed in as ${escapeHtml(currentUser.name)} (${escapeHtml(currentUser.email)})</div></div>
      <div class="td-item"><div class="td-title">Preferences</div><div class="td-sub">General app settings aren't configurable in this demo yet.</div></div>
    `;
  });

  // ================= MESSAGES: all platform users =================
  function renderAllUsers() {
    const users = DataManager.getUsers();
    document.getElementById("allUsersBody").innerHTML = users.length
      ? users
          .map(
            (u) => `
      <tr>
        <td class="who-cell"><div class="avatar">${initials(u.name)}</div>
          <div><div style="font-weight:600;">${escapeHtml(u.name)}</div><div class="muted" style="font-size:12px;">${escapeHtml(u.email)}</div></div>
        </td>
        <td style="text-transform:capitalize;">${escapeHtml(u.role)}</td>
        <td>${escapeHtml(u.department || "—")}</td>
        <td><span class="badge ${u.status}">${u.status}</span></td>
      </tr>
    `,
          )
          .join("")
      : `<tr><td colspan="4" class="empty-row">No users yet.</td></tr>`;
  }

  // ================= JOBS =================
  function renderJobs() {
    const jobs = DataManager.getJobs();
    document.getElementById("jobsBody").innerHTML = jobs.length
      ? jobs
          .map(
            (j) => `
      <tr>
        <td style="font-weight:600;">${escapeHtml(j.title)}</td>
        <td>${escapeHtml(j.department)}</td>
        <td>${escapeHtml(j.type)}</td>
        <td>${formatDate(j.posted)}</td>
        <td><span class="badge ${j.status === "Open" ? "active" : "inactive"}">${j.status}</span></td>
        <td class="row-actions">
          <button class="btn small ghost" data-toggle-job="${j.id}">${j.status === "Open" ? "Close" : "Reopen"}</button>
          <button class="btn small danger" data-del-job="${j.id}">Delete</button>
        </td>
      </tr>
    `,
          )
          .join("")
      : `<tr><td colspan="6" class="empty-row">No open roles yet — post your first one.</td></tr>`;

    document.querySelectorAll("[data-toggle-job]").forEach((b) =>
      b.addEventListener("click", () => {
        const j = DataManager.getJobs().find(
          (x) => x.id === b.dataset.toggleJob,
        );
        DataManager.updateJob(j.id, {
          status: j.status === "Open" ? "Closed" : "Open",
        });
        renderJobs();
      }),
    );
    document.querySelectorAll("[data-del-job]").forEach((b) =>
      b.addEventListener("click", () => {
        UI.confirm(
          "Delete job posting?",
          "This can't be undone.",
          "Delete",
          () => {
            DataManager.deleteJob(b.dataset.delJob);
            renderJobs();
          },
        );
      }),
    );
  }

  const jobModalVeil = document.getElementById("jobModalVeil");
  const jobForm = document.getElementById("jobForm");
  document.getElementById("addJobBtn").addEventListener("click", () => {
    jobForm.reset();
    document.getElementById("jobFormMsg").classList.remove("show");
    jobModalVeil.classList.add("show");
  });
  document
    .getElementById("jobModalClose")
    .addEventListener("click", () => jobModalVeil.classList.remove("show"));
  document
    .getElementById("jobCancelBtn")
    .addEventListener("click", () => jobModalVeil.classList.remove("show"));
  jobModalVeil.addEventListener("click", (e) => {
    if (e.target === jobModalVeil) jobModalVeil.classList.remove("show");
  });
  document.getElementById("jobSaveBtn").addEventListener("click", () => {
    if (!jobForm.reportValidity()) return;
    DataManager.addJob({
      title: document.getElementById("jobTitle").value.trim(),
      department: document.getElementById("jobDept").value.trim(),
      type: document.getElementById("jobType").value,
      status: document.getElementById("jobStatus").value,
      description: document.getElementById("jobDesc").value.trim(),
    });
    jobModalVeil.classList.remove("show");
    renderJobs();
  });

  // ================= CANDIDATES =================
  function renderCandidates() {
    const candidates = DataManager.getCandidates();
    const jobs = DataManager.getJobs();

    // Keep the "applying for" filter in sync with current jobs, without
    // losing whatever the admin already had selected.
    const jobFilterSelect = document.getElementById("candJobFilter");
    const prevJobFilter = jobFilterSelect.value;
    jobFilterSelect.innerHTML =
      '<option value="">All roles</option>' +
      jobs
        .map((j) => `<option value="${j.id}">${escapeHtml(j.title)}</option>`)
        .join("");
    jobFilterSelect.value = jobs.some((j) => j.id === prevJobFilter)
      ? prevJobFilter
      : "";

    const q = (document.getElementById("candSearchInput").value || "")
      .trim()
      .toLowerCase();
    const statusFilter = document.getElementById("candStatusFilter").value;
    const jobFilter = jobFilterSelect.value;

    const filtered = candidates.filter((c) => {
      if (statusFilter && c.status !== statusFilter) return false;
      if (jobFilter && c.jobId !== jobFilter) return false;
      if (q) {
        const job = jobs.find((j) => j.id === c.jobId);
        const haystack =
          `${c.name} ${c.email} ${job ? job.title : ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    document.getElementById("candidatesBody").innerHTML = filtered.length
      ? filtered
          .map((c) => {
            const job = jobs.find((j) => j.id === c.jobId);
            return `<tr>
        <td class="who-cell"><div class="avatar">${initials(c.name)}</div>
          <div><div style="font-weight:600;">${escapeHtml(c.name)}</div><div class="muted" style="font-size:12px;">${escapeHtml(c.email)}</div></div>
        </td>
        <td>${escapeHtml(job ? job.title : "—")}</td>
        <td>${formatDate(c.applied)}</td>
        <td><span class="badge ${c.status === "Rejected" ? "rejected" : c.status === "Offer" ? "approved" : "pending"}">${escapeHtml(c.status)}</span></td>
        <td class="row-actions"><button class="btn small danger" data-del-cand="${c.id}">Remove</button></td>
      </tr>`;
          })
          .join("")
      : `<tr><td colspan="5" class="empty-row">${candidates.length ? "No candidates match your search or filters." : "No candidates yet."}</td></tr>`;

    document.querySelectorAll("[data-del-cand]").forEach((b) =>
      b.addEventListener("click", () => {
        UI.confirm(
          "Remove candidate?",
          "This can't be undone.",
          "Remove",
          () => {
            DataManager.deleteCandidate(b.dataset.delCand);
            renderCandidates();
          },
        );
      }),
    );
  }

  document
    .getElementById("candSearchInput")
    .addEventListener("input", renderCandidates);
  document
    .getElementById("candStatusFilter")
    .addEventListener("change", renderCandidates);
  document
    .getElementById("candJobFilter")
    .addEventListener("change", renderCandidates);

  const candidateModalVeil = document.getElementById("candidateModalVeil");
  const candidateForm = document.getElementById("candidateForm");
  document.getElementById("addCandidateBtn").addEventListener("click", () => {
    candidateForm.reset();
    document.getElementById("candidateFormMsg").classList.remove("show");
    const jobs = DataManager.getJobs();
    document.getElementById("candJob").innerHTML = jobs.length
      ? jobs
          .map((j) => `<option value="${j.id}">${escapeHtml(j.title)}</option>`)
          .join("")
      : `<option value="">No open roles — post one first</option>`;
    candidateModalVeil.classList.add("show");
  });
  document
    .getElementById("candidateModalClose")
    .addEventListener("click", () =>
      candidateModalVeil.classList.remove("show"),
    );
  document
    .getElementById("candidateCancelBtn")
    .addEventListener("click", () =>
      candidateModalVeil.classList.remove("show"),
    );
  candidateModalVeil.addEventListener("click", (e) => {
    if (e.target === candidateModalVeil)
      candidateModalVeil.classList.remove("show");
  });
  document.getElementById("candidateSaveBtn").addEventListener("click", () => {
    if (!candidateForm.reportValidity()) return;
    DataManager.addCandidate({
      name: document.getElementById("candName").value.trim(),
      email: document.getElementById("candEmail").value.trim(),
      jobId: document.getElementById("candJob").value,
      status: document.getElementById("candStatus").value,
      note: document.getElementById("candNote").value.trim(),
    });
    candidateModalVeil.classList.remove("show");
    renderCandidates();
  });

  // ================= PAYROLL MANAGEMENT =================
  function renderPayrollAdmin() {
    const employees = DataManager.getUsers().filter(
      (u) => u.status === "active",
    );
    let totalNet = 0;
    const rows = employees.map((u) => {
      const p = DataManager.getPayrollForUser(u);
      totalNet += p.netPay;
      return `<tr>
        <td class="who-cell"><div class="avatar">${initials(u.name)}</div>${escapeHtml(u.name)}</td>
        <td>${escapeHtml(u.department || "—")}</td>
        <td>${p.basicWage.toLocaleString()}</td>
        <td>${p.earningsTotal ? "+" + p.earningsTotal.toLocaleString() : "—"}</td>
        <td>${p.tax.toLocaleString()}</td>
        <td>${p.pension.toLocaleString()}</td>
        <td style="font-weight:700;">${p.netPay.toLocaleString()}</td>
        <td><button class="btn small ghost" data-edit-wage="${u.id}">Edit</button></td>
      </tr>`;
    });
    document.getElementById("payrollBody").innerHTML = rows.length
      ? rows.join("")
      : `<tr><td colspan="8" class="empty-row">No active employees on payroll.</td></tr>`;

    document.getElementById("payrollStats").innerHTML = `
      <div class="stat"><div class="num">${employees.length}</div><div class="label">Employees on payroll</div></div>
      <div class="stat"><div class="num">${totalNet.toLocaleString()}</div><div class="label">Total net pay / month</div></div>
    `;

    document.querySelectorAll("[data-edit-wage]").forEach((b) =>
      b.addEventListener("click", () => {
        openWageModal(b.dataset.editWage);
      }),
    );
  }

  const wageModalVeil = document.getElementById("wageModalVeil");
  const earningsListEl = document.getElementById("earningsList");

  function renderEarningsList(userId) {
    const u = DataManager.getUser(userId);
    const p = DataManager.getPayrollForUser(u);
    earningsListEl.innerHTML = p.earnings.length
      ? p.earnings
          .map(
            (e) => `
        <div class="birthday-item" data-earning-id="${e.id}">
          <div class="bd-name">${escapeHtml(e.label)} — ${e.amount.toLocaleString()}</div>
          <button class="btn small danger" data-remove-earning="${e.id}" type="button">Remove</button>
        </div>`,
          )
          .join("")
      : `<div class="muted" style="font-size:12.5px; padding:6px 0;">No earnings added yet.</div>`;

    earningsListEl.querySelectorAll("[data-remove-earning]").forEach((b) =>
      b.addEventListener("click", () => {
        DataManager.removeEarning(userId, b.dataset.removeEarning);
        renderEarningsList(userId);
      }),
    );
  }

  function openWageModal(userId) {
    const u = DataManager.getUser(userId);
    document.getElementById("wageUserId").value = u.id;
    document.getElementById("wageInput").value =
      DataManager.getPayrollForUser(u).basicWage;
    document.getElementById("earningLabelInput").value = "";
    document.getElementById("earningAmountInput").value = "";
    renderEarningsList(userId);
    wageModalVeil.classList.add("show");
  }

  document
    .getElementById("wageModalClose")
    .addEventListener("click", () => wageModalVeil.classList.remove("show"));
  document
    .getElementById("wageCancelBtn")
    .addEventListener("click", () => wageModalVeil.classList.remove("show"));
  wageModalVeil.addEventListener("click", (e) => {
    if (e.target === wageModalVeil) wageModalVeil.classList.remove("show");
  });
  document.getElementById("addEarningBtn").addEventListener("click", () => {
    const userId = document.getElementById("wageUserId").value;
    const label = document.getElementById("earningLabelInput").value.trim();
    const amount = parseInt(
      document.getElementById("earningAmountInput").value,
      10,
    );
    if (!label || !(amount >= 0)) {
      UI.info(
        "Missing details",
        "Enter a label and an amount of 0 or more for the earning.",
      );
      return;
    }
    DataManager.addEarning(userId, { label, amount });
    document.getElementById("earningLabelInput").value = "";
    document.getElementById("earningAmountInput").value = "";
    renderEarningsList(userId);
  });
  document.getElementById("wageSaveBtn").addEventListener("click", () => {
    const userId = document.getElementById("wageUserId").value;
    const amount = parseInt(document.getElementById("wageInput").value, 10);
    if (amount >= 0) DataManager.setBasicWage(userId, amount);
    wageModalVeil.classList.remove("show");
    renderPayrollAdmin();
  });

  // ================= EMPLOYEE PROFILE (tabbed detail view) =================
  const PROFILE_TABS = [
    {
      key: "personal",
      label: "Personal Details",
      fields: [
        { key: "employeeName", label: "Employee Name" },
        { key: "department", label: "Department" },
        { key: "jobTitle", label: "Job Title" },
        { key: "jobCategory", label: "Job Category" },
      ],
    },
    {
      key: "contact",
      label: "Contact Details",
      fields: [
        { key: "phone1", label: "Phone Number 1" },
        { key: "phone2", label: "Phone Number 2" },
        { key: "email", label: "E-mail Address" },
        { key: "city", label: "City of residence" },
        { key: "address", label: "Residential Address", type: "textarea" },
      ],
    },
    {
      key: "nextOfKin",
      label: "Next of kin Details",
      fields: [
        { key: "name", label: "Next of kin name" },
        { key: "occupation", label: "Job / Occupation" },
        { key: "phone", label: "Phone Number" },
        { key: "relationship", label: "Relationship" },
        { key: "address", label: "Residential Address", type: "textarea" },
      ],
    },
    {
      key: "education",
      label: "Education Qualifications",
      fields: [
        { key: "institution", label: "Name of Institution" },
        { key: "degree", label: "Degree" },
        { key: "field", label: "Field of Study" },
        { key: "startDate", label: "Start Date", type: "date" },
        { key: "endDate", label: "End Date", type: "date" },
      ],
    },
    {
      key: "guarantor",
      label: "Guarantor Details",
      fields: [
        { key: "name", label: "Guarantor's Name" },
        { key: "occupation", label: "Job title / Occupation" },
        { key: "phone", label: "Phone No" },
      ],
    },
    {
      key: "family",
      label: "Family Details",
      fields: [
        { key: "name", label: "Full Name" },
        { key: "relationship", label: "Relationship" },
        { key: "phone", label: "Phone No" },
        { key: "address", label: "Address", type: "textarea" },
      ],
    },
    {
      key: "job",
      label: "Job Details",
      fields: [
        { key: "role", label: "Job Role" },
        { key: "department", label: "Department" },
        { key: "description", label: "Job Description", type: "textarea" },
      ],
    },
    {
      key: "financial",
      label: "Financial Details",
      fields: [
        { key: "bankName", label: "Bank Name" },
        { key: "accountNo", label: "Account No" },
        { key: "accountName", label: "Account Name" },
      ],
    },
  ];

  function showEmployeeProfile(userId) {
    topSections.forEach(
      (s) => (document.getElementById("section-" + s).style.display = "none"),
    );
    document.getElementById("section-employeeProfile").style.display = "";
    navButtons.forEach((b) =>
      b.classList.toggle("active", b.dataset.section === "employees"),
    );
    closeSidebar();

    const u = DataManager.getUser(userId);
    document.getElementById("empProfileCrumbName").textContent = u.name;
    renderProfileTabsList(userId, PROFILE_TABS[0].key);
    refreshTopbarBadges();
  }

  function renderProfileTabsList(userId, activeKey) {
    const wrap = document.getElementById("empProfileTabs");
    wrap.innerHTML = PROFILE_TABS.map(
      (t) =>
        `<button class="profile-tab-btn ${t.key === activeKey ? "active" : ""}" data-profile-tab="${t.key}">${t.label}</button>`,
    ).join("");
    wrap.querySelectorAll("[data-profile-tab]").forEach((b) =>
      b.addEventListener("click", () => {
        renderProfileTabsList(userId, b.dataset.profileTab);
        renderProfileTabContent(userId, b.dataset.profileTab);
      }),
    );
    renderProfileTabContent(userId, activeKey);
  }

  function renderProfileTabContent(userId, tabKey) {
    const u = DataManager.getUser(userId);
    const tab = PROFILE_TABS.find((t) => t.key === tabKey);
    const data = DataManager.getProfileSection(u, tabKey);
    const content = document.getElementById("empProfileContent");
    content.innerHTML = `
      <h2 style="margin-bottom:6px;">${tab.label}</h2>
      <div class="form-msg ok" id="profileTabMsg">Saved.</div>
      <form id="profileTabForm" style="margin-top:14px;">
        <div class="field-row">
          ${tab.fields
            .map(
              (f) => `
            <div class="field" style="${f.type === "textarea" ? "grid-column:1 / -1;" : ""}">
              <label>${f.label}</label>
              ${
                f.type === "textarea"
                  ? `<textarea data-field="${f.key}">${escapeHtml(data[f.key] || "")}</textarea>`
                  : `<input type="${f.type || "text"}" data-field="${f.key}" value="${escapeHtml(data[f.key] || "")}">`
              }
            </div>
          `,
            )
            .join("")}
        </div>
      </form>
      <button class="btn primary" id="profileTabSaveBtn">Save changes</button>
    `;
    document
      .getElementById("profileTabSaveBtn")
      .addEventListener("click", () => {
        const fields = {};
        content.querySelectorAll("[data-field]").forEach((el) => {
          fields[el.dataset.field] = el.value.trim();
        });
        DataManager.setProfileSection(userId, tabKey, fields);
        const msg = document.getElementById("profileTabMsg");
        msg.classList.add("show");
        setTimeout(() => msg.classList.remove("show"), 1500);
      });
  }

  // ---- go ----
  renderDashboard();
  refreshTopbarBadges();
})();
