const DB_KEYS = {
  users: "xt_users",
  leave: "xt_leave_requests",
  leaveTypes: "xt_leave_types",
  reliefOfficers: "xt_relief_officers",
  announcements: "xt_announcements",
  attendance: "xt_attendance",
  targets: "xt_targets",
  appraisals: "xt_appraisals",
  perfSettings: "xt_perf_settings",
  jobs: "xt_jobs",
  candidates: "xt_candidates",
  session: "xt_session",
  seeded: "xt_seeded_v5",
  perfSeeded: "xt_perf_seeded_v1",
};

const DEFAULT_PERF_SETTINGS = {
  reviewPeriod: "Bi-annual",
  requireSelfAppraisal: true,
  allowProgressEdits: true,
  ratingBands: [
    { min: 90, label: "Outstanding" },
    { min: 75, label: "Exceeds expectations" },
    { min: 60, label: "Meets expectations" },
    { min: 40, label: "Needs improvement" },
    { min: 0, label: "Unsatisfactory" },
  ],
};

const DataManager = {
  init() {
    if (localStorage.getItem(DB_KEYS.seeded)) return;

    const users = [
      {
        id: "u-admin",
        name: "Aman Admin",
        email: "admin@xceltech.com",
        password: "admin123",
        role: "admin",
        title: "Director",
        department: "People Operations",
        status: "active",
        joined: "2021-03-01",
        leaveBalance: {},
        payroll: { basicWage: 220000 },
      },
      {
        id: "u-subadmin",
        name: "Sade Adeyemi",
        email: "subadmin@xceltech.com",
        password: "subadmin123",
        role: "subadmin",
        title: "HR Coordinator",
        department: "People Operations",
        status: "active",
        joined: "2024-02-10",
        leaveBalance: {},
        payroll: { basicWage: 160000 },
      },
      {
        id: "u-1",
        name: "Daniel Okafor",
        email: "daniel.okafor@xceltech.com",
        password: "user123",
        role: "employee",
        title: "Frontend Engineer",
        department: "Engineering",
        status: "active",
        joined: "2023-06-12",
        leaveBalance: {
          Annual: 60,
          Sick: 20,
          Maternity: 60,
          Compassionate: 30,
          Casual: 0,
        },
        payroll: { basicWage: 180000 },
      },
      {
        id: "u-2",
        name: "Grace Nwosu",
        email: "grace.nwosu@xceltech.com",
        password: "pass123",
        role: "employee",
        title: "Product Designer",
        department: "Design",
        status: "active",
        joined: "2022-11-04",
        leaveBalance: {
          Annual: 45,
          Sick: 20,
          Maternity: 60,
          Compassionate: 30,
          Casual: 6,
        },
        payroll: { basicWage: 165000 },
      },
      {
        id: "u-3",
        name: "Tunde Bakare",
        email: "tunde.bakare@xceltech.com",
        password: "pass123",
        role: "employee",
        title: "Sales Associate",
        department: "Sales and Marketing",
        status: "active",
        joined: "2020-01-20",
        leaveBalance: {
          Annual: 60,
          Sick: 20,
          Maternity: 60,
          Compassionate: 30,
          Casual: 10,
        },
        payroll: { basicWage: 120000 },
      },
    ];

    const leaveTypes = [
      {
        id: "lt-1",
        name: "Annual",
        duration: 60,
        recall: false,
        autorenew: false,
      },
      {
        id: "lt-2",
        name: "Sick",
        duration: 20,
        recall: false,
        autorenew: true,
      },
      {
        id: "lt-3",
        name: "Maternity",
        duration: 60,
        recall: false,
        autorenew: false,
      },
      {
        id: "lt-4",
        name: "Compassionate",
        duration: 30,
        recall: false,
        autorenew: false,
      },
      {
        id: "lt-5",
        name: "Casual",
        duration: 10,
        recall: true,
        autorenew: false,
      },
    ];

    const reliefOfficers = [
      { id: "ro-1", name: "HR Bethel", department: "People Operations" },
      { id: "ro-2", name: "Grace Nwosu", department: "Design" },
      { id: "ro-3", name: "Tunde Bakare", department: "Sales and Marketing" },
    ];

    const leave = [
      {
        id: "lv-1",
        userId: "u-1",
        type: "Casual",
        category: "Personal",
        startDate: "2026-08-10",
        endDate: "2026-08-19",
        days: 10,
        reason: "Family event out of town.",
        status: "recalled",
        submitted: "2026-08-01",
        recall: {
          reliefOfficer: "HR Bethel — People Operations",
          newResumptionDate: "2026-08-16",
          reason: "Urgent client escalation needs your sign-off.",
          initiatedBy: "Aman Admin",
        },
      },
      {
        id: "lv-2",
        userId: "u-2",
        type: "Sick",
        category: "Personal",
        startDate: "2026-08-20",
        endDate: "2026-08-21",
        days: 2,
        reason: "Recovering from flu.",
        status: "approved",
        submitted: "2026-08-19",
      },
      {
        id: "lv-3",
        userId: "u-1",
        type: "Sick",
        category: "Personal",
        startDate: "2026-09-10",
        endDate: "2026-09-11",
        days: 2,
        reason: "Migraine, resting at home.",
        status: "pending",
        submitted: "2026-09-05",
      },
    ];

    const announcements = [
      {
        id: "an-1",
        title: "Q3 all-hands moved to Thursday",
        body: "The quarterly all-hands is now Thursday 10am in the main hall, same agenda.",
        author: "Aman Admin",
        date: "2026-08-28",
      },
      {
        id: "an-2",
        title: "New health insurance provider",
        body: "Starting next month, coverage moves to Reliance HMO. Cards ship to your registered address.",
        author: "Aman Admin",
        date: "2026-08-15",
      },
    ];

    localStorage.setItem(DB_KEYS.users, JSON.stringify(users));
    localStorage.setItem(DB_KEYS.leave, JSON.stringify(leave));
    localStorage.setItem(DB_KEYS.leaveTypes, JSON.stringify(leaveTypes));
    localStorage.setItem(
      DB_KEYS.reliefOfficers,
      JSON.stringify(reliefOfficers),
    );
    localStorage.setItem(DB_KEYS.announcements, JSON.stringify(announcements));
    localStorage.setItem(DB_KEYS.attendance, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.targets, JSON.stringify([]));

    const jobs = [
      {
        id: "job-1",
        title: "Backend Engineer",
        department: "Engineering",
        type: "Full-time",
        status: "Open",
        posted: "2026-08-20",
        description:
          "Own our Node/Postgres services and help scale the platform.",
      },
      {
        id: "job-2",
        title: "UI/UX Designer",
        department: "Design",
        type: "Full-time",
        status: "Open",
        posted: "2026-08-25",
        description: "Design end-to-end flows for the HR product line.",
      },
      {
        id: "job-3",
        title: "Sales Associate",
        department: "Sales and Marketing",
        type: "Contract",
        status: "Closed",
        posted: "2026-07-10",
        description: "Support outbound sales for the West Africa region.",
      },
    ];

    const candidates = [
      {
        id: "cand-1",
        name: "Selam Girma",
        email: "selam.girma@example.com",
        jobId: "job-1",
        status: "Interview",
        applied: "2026-08-29",
        note: "Strong take-home exercise, scheduling final round.",
      },
      {
        id: "cand-2",
        name: "Michael Tesfaye",
        email: "michael.tesfaye@example.com",
        jobId: "job-2",
        status: "New",
        applied: "2026-09-01",
        note: "",
      },
      {
        id: "cand-3",
        name: "Fatima Musa",
        email: "fatima.musa@example.com",
        jobId: "job-1",
        status: "Screening",
        applied: "2026-08-27",
        note: "Phone screen booked for Thursday.",
      },
    ];

    localStorage.setItem(DB_KEYS.jobs, JSON.stringify(jobs));
    localStorage.setItem(DB_KEYS.candidates, JSON.stringify(candidates));
    localStorage.setItem(DB_KEYS.seeded, "true");
  },

  _get(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
  },
  _set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  _uid(prefix) {
    return (
      prefix +
      "-" +
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 6)
    );
  },

  /* ---------- users ---------- */

  getUsers() {
    return this._get(DB_KEYS.users);
  },
  getUser(id) {
    return this.getUsers().find((u) => u.id === id) || null;
  },
  findByEmail(email) {
    return (
      this.getUsers().find(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      ) || null
    );
  },
  addUser(user) {
    const users = this.getUsers();
    const newUser = Object.assign(
      { id: this._uid("u"), status: "active", leaveBalance: {} },
      user,
    );
    users.push(newUser);
    this._set(DB_KEYS.users, users);
    return newUser;
  },
  updateUser(id, patch) {
    const users = this.getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    users[idx] = Object.assign({}, users[idx], patch);
    this._set(DB_KEYS.users, users);
    return users[idx];
  },
  deleteUser(id) {
    this._set(
      DB_KEYS.users,
      this.getUsers().filter((u) => u.id !== id),
    );
  },

  /* leave types (policy/settings)  */

  getLeaveTypes() {
    return this._get(DB_KEYS.leaveTypes);
  },
  getLeaveTypeByName(name) {
    return this.getLeaveTypes().find((t) => t.name === name) || null;
  },
  addLeaveType(lt) {
    const list = this.getLeaveTypes();
    const newLt = Object.assign({ id: this._uid("lt") }, lt);
    list.push(newLt);
    this._set(DB_KEYS.leaveTypes, list);
    return newLt;
  },
  updateLeaveType(id, patch) {
    const list = this.getLeaveTypes();
    const idx = list.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    list[idx] = Object.assign({}, list[idx], patch);
    this._set(DB_KEYS.leaveTypes, list);
    return list[idx];
  },
  deleteLeaveType(id) {
    this._set(
      DB_KEYS.leaveTypes,
      this.getLeaveTypes().filter((l) => l.id !== id),
    );
  },

  /* leave balance */

  getLeaveBalance(user, typeName) {
    if (user.leaveBalance && user.leaveBalance[typeName] !== undefined)
      return user.leaveBalance[typeName];
    const t = this.getLeaveTypeByName(typeName);
    return t ? t.duration : 0;
  },

  /* ---------- relief officers ---------- */

  getReliefOfficers() {
    return this._get(DB_KEYS.reliefOfficers);
  },
  addReliefOfficer(ro) {
    const list = this.getReliefOfficers();
    const newRo = Object.assign({ id: this._uid("ro") }, ro);
    list.push(newRo);
    this._set(DB_KEYS.reliefOfficers, list);
    return newRo;
  },
  deleteReliefOfficer(id) {
    this._set(
      DB_KEYS.reliefOfficers,
      this.getReliefOfficers().filter((r) => r.id !== id),
    );
  },

  /* ---------- leave requests ---------- */

  getLeaveRequests() {
    return this._get(DB_KEYS.leave);
  },

  getLeaveForUser(userId) {
    return this.getLeaveRequests()
      .filter((l) => l.userId === userId)
      .sort((a, b) => new Date(b.submitted) - new Date(a.submitted));
  },

  addLeaveRequest(req) {
    const list = this.getLeaveRequests();
    const newReq = Object.assign(
      {
        id: this._uid("lv"),
        status: "pending",
        submitted: new Date().toISOString().slice(0, 10),
      },
      req,
    );
    list.push(newReq);
    this._set(DB_KEYS.leave, list);
    return newReq;
  },

  deleteLeaveRequest(id) {
    this._set(
      DB_KEYS.leave,
      this.getLeaveRequests().filter((l) => l.id !== id),
    );
  },

  setLeaveStatus(id, status) {
    const list = this.getLeaveRequests();
    const idx = list.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    list[idx].status = status;
    this._set(DB_KEYS.leave, list);

    if (status === "approved") {
      const req = list[idx];
      const user = this.getUser(req.userId);
      if (user) {
        const current = this.getLeaveBalance(user, req.type);
        const newBal = Math.max(0, current - req.days);
        this.updateUser(user.id, {
          leaveBalance: Object.assign({}, user.leaveBalance, {
            [req.type]: newBal,
          }),
        });
      }
    }
    return list[idx];
  },

  extendLeave(id, extraDays) {
    const list = this.getLeaveRequests();
    const idx = list.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    const d = new Date(list[idx].endDate + "T00:00:00");
    d.setDate(d.getDate() + extraDays);
    list[idx].endDate = d.toISOString().slice(0, 10);
    list[idx].days = list[idx].days + extraDays;
    this._set(DB_KEYS.leave, list);
    return list[idx];
  },

  recallLeave(id, recallInfo) {
    const list = this.getLeaveRequests();
    const idx = list.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    list[idx].status = "recalled";
    list[idx].recall = recallInfo;
    this._set(DB_KEYS.leave, list);
    return list[idx];
  },

  respondToRecall(id, approved, declineReason) {
    const list = this.getLeaveRequests();
    const idx = list.findIndex((l) => l.id === id);
    if (idx === -1 || !list[idx].recall) return null;
    list[idx].recall.response = approved ? "approved" : "declined";
    if (!approved) {
      list[idx].recall.declineReason = declineReason || "";
      list[idx].status = "approved";
    }
    this._set(DB_KEYS.leave, list);
    return list[idx];
  },

  getPendingRecallForUser(userId) {
    return (
      this.getLeaveRequests().find(
        (l) =>
          l.userId === userId &&
          l.status === "recalled" &&
          l.recall &&
          !l.recall.response,
      ) || null
    );
  },

  /* announcements  */

  getAnnouncements() {
    return this._get(DB_KEYS.announcements).sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
  },
  addAnnouncement(a) {
    const list = this._get(DB_KEYS.announcements);
    const newA = Object.assign(
      { id: this._uid("an"), date: new Date().toISOString().slice(0, 10) },
      a,
    );
    list.push(newA);
    this._set(DB_KEYS.announcements, list);
    return newA;
  },
  deleteAnnouncement(id) {
    this._set(
      DB_KEYS.announcements,
      this._get(DB_KEYS.announcements).filter((a) => a.id !== id),
    );
  },

  /*attendance -*/

  getAttendance() {
    return this._get(DB_KEYS.attendance);
  },
  getAttendanceForUser(userId) {
    return this.getAttendance()
      .filter((r) => r.userId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },
  getTodayRecord(userId) {
    const today = new Date().toISOString().slice(0, 10);
    return (
      this.getAttendance().find(
        (r) => r.userId === userId && r.date === today,
      ) || null
    );
  },
  clockIn(userId) {
    const list = this.getAttendance();
    const today = new Date().toISOString().slice(0, 10);
    if (list.find((r) => r.userId === userId && r.date === today)) return null;
    const rec = {
      id: this._uid("att"),
      userId,
      date: today,
      timeIn: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timeOut: null,
    };
    list.push(rec);
    this._set(DB_KEYS.attendance, list);
    return rec;
  },
  clockOut(userId) {
    const list = this.getAttendance();
    const today = new Date().toISOString().slice(0, 10);
    const idx = list.findIndex((r) => r.userId === userId && r.date === today);
    if (idx === -1) return null;
    list[idx].timeOut = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    this._set(DB_KEYS.attendance, list);
    return list[idx];
  },

  seedPerformance() {
    if (localStorage.getItem(DB_KEYS.perfSeeded)) return;

    const existing = this._get(DB_KEYS.targets);
    if (!existing.length) {
      const targets = [
        {
          id: "tg-1",
          title: "Ship the employee self-service portal",
          kpiWeight: "40%",
          description:
            "Deliver the new self-service portal to production with sign-off from HR.",
          employeeIds: ["u-1", "u-2"],
          startDate: "2026-07-01",
          endDate: "2026-12-31",
          status: "active",
          created: "2026-07-01",
          progress: {
            "u-1": {
              percent: 65,
              note: "Auth and payroll screens done.",
              updated: "2026-09-08",
            },
            "u-2": {
              percent: 40,
              note: "Design system in review.",
              updated: "2026-09-05",
            },
          },
        },
        {
          id: "tg-2",
          title: "Reduce support response time to under 4 hours",
          kpiWeight: "30%",
          description:
            "Average first-response time on internal HR tickets across the quarter.",
          employeeIds: ["u-2", "u-3"],
          startDate: "2026-07-01",
          endDate: "2026-09-30",
          status: "active",
          created: "2026-07-01",
          progress: {
            "u-3": {
              percent: 80,
              note: "Averaging 3h 20m this month.",
              updated: "2026-09-10",
            },
          },
        },
        {
          id: "tg-3",
          title: "Close 15 new accounts in Q3",
          kpiWeight: "30%",
          description: "New signed accounts in the West Africa region.",
          employeeIds: ["u-3"],
          startDate: "2026-07-01",
          endDate: "2026-09-30",
          status: "active",
          created: "2026-07-01",
          progress: {
            "u-3": {
              percent: 55,
              note: "8 of 15 closed.",
              updated: "2026-09-12",
            },
          },
        },
      ];
      this._set(DB_KEYS.targets, targets);
    }

    if (!this._get(DB_KEYS.appraisals).length) {
      const appraisals = [
        {
          id: "ap-1",
          userId: "u-1",
          cycle: "H1 2026",
          periodStart: "2026-01-01",
          periodEnd: "2026-06-30",
          dueDate: "2026-07-15",
          status: "completed",
          created: "2026-07-01",
          self: {
            score: 78,
            strengths:
              "Shipped every sprint commitment and mentored two interns.",
            challenges: "Spread thin across two squads mid-cycle.",
            comments: "Would like more ownership of architecture decisions.",
            submitted: "2026-07-05",
          },
          review: {
            score: 82,
            comments:
              "Consistent delivery and strong collaboration. Ready for more scope next cycle.",
            rating: "Exceeds expectations",
            reviewer: "Aman Admin",
            reviewed: "2026-07-12",
          },
          finalScore: 82,
          rating: "Exceeds expectations",
        },
        {
          id: "ap-2",
          userId: "u-2",
          cycle: "H2 2026",
          periodStart: "2026-07-01",
          periodEnd: "2026-12-31",
          dueDate: "2026-10-15",
          status: "self-pending",
          created: "2026-09-01",
          self: null,
          review: null,
        },
        {
          id: "ap-3",
          userId: "u-3",
          cycle: "H2 2026",
          periodStart: "2026-07-01",
          periodEnd: "2026-12-31",
          dueDate: "2026-10-15",
          status: "self-pending",
          created: "2026-09-01",
          self: null,
          review: null,
        },
      ];
      this._set(DB_KEYS.appraisals, appraisals);
    }

    localStorage.setItem(DB_KEYS.perfSeeded, "true");
  },

  /* ---------- performance: settings ---------- */
  getPerfSettings() {
    const raw = localStorage.getItem(DB_KEYS.perfSettings);
    if (!raw) return Object.assign({}, DEFAULT_PERF_SETTINGS);
    try {
      return Object.assign({}, DEFAULT_PERF_SETTINGS, JSON.parse(raw));
    } catch (e) {
      return Object.assign({}, DEFAULT_PERF_SETTINGS);
    }
  },
  savePerfSettings(patch) {
    const next = Object.assign({}, this.getPerfSettings(), patch);
    localStorage.setItem(DB_KEYS.perfSettings, JSON.stringify(next));
    return next;
  },

  getRatingForScore(score) {
    const bands = this.getPerfSettings()
      .ratingBands.slice()
      .sort((a, b) => b.min - a.min);
    const hit = bands.find((b) => score >= b.min);
    return hit ? hit.label : bands.length ? bands[bands.length - 1].label : "—";
  },

  /*  performance: targets  */

  getTargets() {
    return this._get(DB_KEYS.targets);
  },
  getTarget(id) {
    return this.getTargets().find((t) => t.id === id) || null;
  },
  getTargetsForUser(userId) {
    return this.getTargets()
      .filter((t) => (t.employeeIds || []).includes(userId))
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  },
  addTarget(t) {
    const list = this.getTargets();
    const newT = Object.assign(
      {
        id: this._uid("tg"),
        status: "active",
        progress: {},
        created: new Date().toISOString().slice(0, 10),
      },
      t,
    );
    list.push(newT);
    this._set(DB_KEYS.targets, list);
    return newT;
  },
  updateTarget(id, patch) {
    const list = this.getTargets();
    const idx = list.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    list[idx] = Object.assign({}, list[idx], patch);
    this._set(DB_KEYS.targets, list);
    return list[idx];
  },
  deleteTarget(id) {
    this._set(
      DB_KEYS.targets,
      this.getTargets().filter((t) => t.id !== id),
    );
  },
 
  getTargetProgress(target, userId) {
    const p = (target.progress || {})[userId];
    return p || { percent: 0, note: "", updated: null };
  },
  setTargetProgress(targetId, userId, percent, note) {
    const list = this.getTargets();
    const idx = list.findIndex((t) => t.id === targetId);
    if (idx === -1) return null;
    const progress = Object.assign({}, list[idx].progress);
    const pct = Math.max(0, Math.min(100, Math.round(Number(percent) || 0)));
    progress[userId] = {
      percent: pct,
      note: note || "",
      updated: new Date().toISOString().slice(0, 10),
    };
    list[idx].progress = progress;
    this._set(DB_KEYS.targets, list);
    return list[idx];
  },
 
  weightValue(kpiWeight) {
    return parseFloat(String(kpiWeight || "0").replace("%", "")) || 0;
  },

  getPerformanceScore(userId) {
    const targets = this.getTargetsForUser(userId);
    if (!targets.length) {
      return { score: 0, totalWeight: 0, breakdown: [], hasTargets: false };
    }
    let weighted = 0;
    let totalWeight = 0;
    const breakdown = targets.map((t) => {
      const w = this.weightValue(t.kpiWeight) || 1;
      const pct = this.getTargetProgress(t, userId).percent;
      weighted += (pct * w) / 100;
      totalWeight += w;
      return { target: t, weight: w, percent: pct };
    });
    const score = totalWeight ? Math.round((weighted / totalWeight) * 100) : 0;
    return { score, totalWeight, breakdown, hasTargets: true };
  },

  /* ---------- performance: appraisals ---------- */

  getAppraisals() {
    return this._get(DB_KEYS.appraisals).sort(
      (a, b) => new Date(b.created || 0) - new Date(a.created || 0),
    );
  },
  getAppraisal(id) {
    return this.getAppraisals().find((a) => a.id === id) || null;
  },
  getAppraisalsForUser(userId) {
    return this.getAppraisals().filter((a) => a.userId === userId);
  },
  /** Creates one appraisal record per selected employee for a cycle. */
  addAppraisalCycle(cycle) {
    const list = this._get(DB_KEYS.appraisals);
    const created = [];
    (cycle.employeeIds || []).forEach((userId) => {
      const rec = {
        id: this._uid("ap"),
        userId,
        cycle: cycle.cycle,
        periodStart: cycle.periodStart,
        periodEnd: cycle.periodEnd,
        dueDate: cycle.dueDate,
        status: cycle.requireSelf === false ? "review-pending" : "self-pending",
        self: null,
        review: null,
        created: new Date().toISOString().slice(0, 10),
      };
      list.push(rec);
      created.push(rec);
    });
    this._set(DB_KEYS.appraisals, list);
    return created;
  },
  updateAppraisal(id, patch) {
    const list = this._get(DB_KEYS.appraisals);
    const idx = list.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    list[idx] = Object.assign({}, list[idx], patch);
    this._set(DB_KEYS.appraisals, list);
    return list[idx];
  },
  deleteAppraisal(id) {
    this._set(
      DB_KEYS.appraisals,
      this._get(DB_KEYS.appraisals).filter((a) => a.id !== id),
    );
  },
  /** Employee side: submit the self-assessment and hand it to HR. */
  submitSelfAppraisal(id, self) {
    return this.updateAppraisal(id, {
      status: "review-pending",
      self: Object.assign(
        { submitted: new Date().toISOString().slice(0, 10) },
        self,
      ),
    });
  },
  /** Admin side: score the appraisal and publish the result to the employee. */
  submitAppraisalReview(id, review) {
    const score = Math.max(0, Math.min(100, Number(review.score) || 0));
    return this.updateAppraisal(id, {
      status: "completed",
      finalScore: score,
      rating: review.rating || this.getRatingForScore(score),
      review: Object.assign(
        { reviewed: new Date().toISOString().slice(0, 10) },
        review,
        { score },
      ),
    });
  },
  getPendingAppraisalForUser(userId) {
    return (
      this.getAppraisalsForUser(userId).find(
        (a) => a.status === "self-pending",
      ) || null
    );
  },

  /* jobs (recruitment)  */

  getJobs() {
    return this._get(DB_KEYS.jobs);
  },
  addJob(j) {
    const list = this.getJobs();
    const newJ = Object.assign(
      {
        id: this._uid("job"),
        status: "Open",
        posted: new Date().toISOString().slice(0, 10),
      },
      j,
    );
    list.push(newJ);
    this._set(DB_KEYS.jobs, list);
    return newJ;
  },
  updateJob(id, patch) {
    const list = this.getJobs();
    const idx = list.findIndex((j) => j.id === id);
    if (idx === -1) return null;
    list[idx] = Object.assign({}, list[idx], patch);
    this._set(DB_KEYS.jobs, list);
    return list[idx];
  },
  deleteJob(id) {
    this._set(
      DB_KEYS.jobs,
      this.getJobs().filter((j) => j.id !== id),
    );
  },

  /* candidates (recruitment)  */

  getCandidates() {
    return this._get(DB_KEYS.candidates);
  },
  addCandidate(c) {
    const list = this.getCandidates();
    const newC = Object.assign(
      {
        id: this._uid("cand"),
        status: "New",
        applied: new Date().toISOString().slice(0, 10),
      },
      c,
    );
    list.push(newC);
    this._set(DB_KEYS.candidates, list);
    return newC;
  },
  updateCandidate(id, patch) {
    const list = this.getCandidates();
    const idx = list.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    list[idx] = Object.assign({}, list[idx], patch);
    this._set(DB_KEYS.candidates, list);
    return list[idx];
  },
  deleteCandidate(id) {
    this._set(
      DB_KEYS.candidates,
      this.getCandidates().filter((c) => c.id !== id),
    );
  },

  /* ---------- payroll ---------- */

  getPayrollForUser(user) {
    const basicWage = (user.payroll && user.payroll.basicWage) || 150000;
    const earnings = (user.payroll && user.payroll.earnings) || [];
    const earningsTotal = earnings.reduce(
      (sum, e) => sum + (Number(e.amount) || 0),
      0,
    );
    const grossPay = basicWage + earningsTotal;
    const tax = Math.round(basicWage * 0.1);
    const pension = Math.round(basicWage * 0.1);
    const netPay = grossPay - tax - pension;
    return {
      basicWage,
      earnings,
      earningsTotal,
      grossPay,
      tax,
      pension,
      netPay,
    };
  },
  setBasicWage(userId, amount) {
    const user = this.getUser(userId);
    const payroll = Object.assign({}, user && user.payroll, {
      basicWage: amount,
    });
    return this.updateUser(userId, { payroll });
  },
  /* Adds a named earning  */
  addEarning(userId, earning) {
    const user = this.getUser(userId);
    if (!user) return null;
    const payroll = Object.assign({}, user.payroll);
    const earnings = (payroll.earnings || []).slice();
    earnings.push({
      id: this._uid("earn"),
      label: earning.label,
      amount: Number(earning.amount) || 0,
    });
    payroll.earnings = earnings;
    return this.updateUser(userId, { payroll });
  },
  removeEarning(userId, earningId) {
    const user = this.getUser(userId);
    if (!user) return null;
    const payroll = Object.assign({}, user.payroll);
    payroll.earnings = (payroll.earnings || []).filter(
      (e) => e.id !== earningId,
    );
    return this.updateUser(userId, { payroll });
  },

  /* extended employee profile (personal/contact/etc.) */

  getProfileSection(user, section) {
    return (user.profile && user.profile[section]) || {};
  },
  setProfileSection(userId, section, fields) {
    const user = this.getUser(userId);
    if (!user) return null;
    const profile = Object.assign({}, user.profile);
    profile[section] = Object.assign({}, profile[section], fields);
    return this.updateUser(userId, { profile });
  },

  /*  profile list sections . */

  getProfileList(user, section) {
    return (user.profile && user.profile[section]) || [];
  },
  addProfileListItem(userId, section, item) {
    const user = this.getUser(userId);
    if (!user) return null;
    const list = this.getProfileList(user, section).slice();
    const newItem = Object.assign({ id: this._uid("pl") }, item);
    list.push(newItem);
    const profile = Object.assign({}, user.profile);
    profile[section] = list;
    this.updateUser(userId, { profile });
    return newItem;
  },
  updateProfileListItem(userId, section, itemId, patch) {
    const user = this.getUser(userId);
    if (!user) return null;
    const list = this.getProfileList(user, section).slice();
    const idx = list.findIndex((i) => i.id === itemId);
    if (idx === -1) return null;
    list[idx] = Object.assign({}, list[idx], patch);
    const profile = Object.assign({}, user.profile);
    profile[section] = list;
    this.updateUser(userId, { profile });
    return list[idx];
  },
  deleteProfileListItem(userId, section, itemId) {
    const user = this.getUser(userId);
    if (!user) return null;
    const profile = Object.assign({}, user.profile);
    profile[section] = this.getProfileList(user, section).filter(
      (i) => i.id !== itemId,
    );
    return this.updateUser(userId, { profile });
  },

  /* ---------- session ---------- */

  setSession(userId) {
    sessionStorage.setItem(DB_KEYS.session, userId);
  },
  getSession() {
    const id = sessionStorage.getItem(DB_KEYS.session);
    return id ? this.getUser(id) : null;
  },
  clearSession() {
    sessionStorage.removeItem(DB_KEYS.session);
  },
};

DataManager.init();
DataManager.seedPerformance();
