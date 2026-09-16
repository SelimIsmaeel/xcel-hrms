const DB_KEYS = {
  users: "xt_users",
  leave: "xt_leave_requests",
  leaveTypes: "xt_leave_types",
  reliefOfficers: "xt_relief_officers",
  announcements: "xt_announcements",
  attendance: "xt_attendance",
  targets: "xt_targets",
  jobs: "xt_jobs",
  candidates: "xt_candidates",
  session: "xt_session",
  seeded: "xt_seeded_v5",
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
        password: "pass123",
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

  /* ---------- leave types (policy/settings) ---------- */

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

  /* ---------- leave balances (per user, keyed by leave-type name) ---------- */

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

  /** Employee's response to a recall notice. approved=true confirms the
   *  recall; approved=false declines it (with a reason) and reverts the
   *  request back to 'approved' standing leave. */
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

  /* ---------- announcements ---------- */

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

  /* ---------- attendance ---------- */

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

  /* ---------- performance targets ---------- */

  getTargets() {
    return this._get(DB_KEYS.targets);
  },
  addTarget(t) {
    const list = this.getTargets();
    const newT = Object.assign({ id: this._uid("tg") }, t);
    list.push(newT);
    this._set(DB_KEYS.targets, list);
    return newT;
  },
  deleteTarget(id) {
    this._set(
      DB_KEYS.targets,
      this.getTargets().filter((t) => t.id !== id),
    );
  },

  /* ---------- jobs (recruitment) ---------- */

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

  /* ---------- candidates (recruitment) ---------- */

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

  /** Derives a full payslip from the user's stored basic wage and any
   *  admin-added earnings (allowances, bonuses, etc.), so admin and
   *  employee views stay in sync. */
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
  /** Adds a named earning (e.g. "Housing Allowance") with an amount to a
   *  user's payroll. Returns the updated user. */
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

  /* ---------- extended employee profile (personal/contact/etc.) ---------- */

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

  /* ---------- profile list sections (family, guarantors, education, etc.) ----------
     Same `user.profile` bucket as above, but the section holds an array of
     records instead of a flat object — used anywhere the profile page needs
     more than one entry (family members, guarantors, education history,
     bank accounts, uploaded documents). */

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
