XCELTECH — HR Management Platform

A client-side HR management web app: login/registration, an admin console
for running HR operations, and a self-service employee portal. No backend —
every read and write goes through a single `DataManager` object backed by
`localStorage`.

## Structure

```
index.html            Login
register.html          Employee self-registration
admin.html              Admin / sub-admin console (sidebar sections)
employee.html            Employee portal (top-tab SPA)

css/
  base.css               Design tokens, reset, typography — load first
  layout.css              Shared shell/table/panel/modal layout
  auth.css                Login & register screens
  employee.css             Employee portal layout
  performance.css           Performance Management UI + icon sizing

js/
  icons.js                Inline SVG icon set (Icon.hydrate / Icon.<name>())
  data.js                 DataManager — the only localStorage access point
  ui.js                   Shared modal helpers (UI.info/confirm/promptNumber)
  admin.js                 Admin console logic
  employee.js               Employee portal logic

media/                    Logo assets referenced by the HTML (not included here)
```

Every HTML file loads scripts in this order: `icons.js` → `data.js` →
`ui.js` → its own page script. Load `base.css` before the other stylesheets.

## Running it

No build step. Serve the folder with any static server (or open the files
directly) and go to `index.html`:

```
python3 -m http.server 8000
```

## Demo accounts

Seeded automatically on first load (see `DataManager.init()` in `data.js`).

| Role      | Email                        | Password    |
|-----------|-------------------------------|-------------|
| Admin     | admin@xceltech.com            | admin123    |
| Sub-admin | subadmin@xceltech.com         | subadmin123 |
| Employee  | daniel.okafor@xceltech.com    | pass123     |
| Employee  | grace.nwosu@xceltech.com      | pass123     |
| Employee  | tunde.bakare@xceltech.com     | pass123     |

Admin and sub-admin land on `admin.html`; employees land on `employee.html`.
Sub-admins see the same console with a few sections locked.

## Admin console sections

Dashboard · Messages · Jobs · Candidates · Resumes · Employee Management ·
Leave Management · Performance Management · Payroll Management

## Employee portal tabs

Dashboard · Requests · Payroll · Performance · Company · Extras

## Performance Management

- **Target Setup / Targets** — admin assigns weighted targets to employees;
  employees report progress (unless locked in Settings), admin can override.
- **Appraisals** — admin opens a review cycle for chosen employees; each
  employee submits a self-appraisal, admin scores and publishes the result.
- **Settings** — review cadence, whether self-appraisal is required, whether
  employees can edit their own progress, and the rating bands that turn a
  score into a label (e.g. 75%+ → "Exceeds expectations").
- **Reports** — org-wide averages, a per-employee scorecard, department
  averages, CSV export.

## Data layer

`DataManager` (`js/data.js`) owns every `localStorage` key, listed in
`DB_KEYS`: `users`, `leave`, `leaveTypes`, `reliefOfficers`, `announcements`,
`attendance`, `targets`, `appraisals`, `perfSettings`, `jobs`, `candidates`,
`session`, plus two `*seeded*` guards that make demo data seed once without
overwriting anything a user has already created. Add new features by adding
a key and a matching set of `get*/add*/update*/delete*` methods here rather
than touching `localStorage` directly from `admin.js`/`employee.js`.

## Icons

`js/icons.js` renders every UI glyph as an inline SVG (`stroke="currentColor"`,
sized at `1em`) — no icon font, no emoji, no external request.

- Static markup: `<span class="ico" data-icon="dashboard"></span>`,
  hydrated automatically on load.
- Dynamic/templated markup: `` `${Icon.download()} Export` ``.
- After injecting new markup containing `data-icon`, call
  `Icon.hydrate(container)`.
- `Icon.names()` lists everything available.

## Known gaps

- `media/` logo assets aren't included in this bundle — point the `<img>`
  tags at your own files or drop matching filenames into a `media/` folder.
- Exports are currently CSV; XLS/XLSX/PDF export is planned but not yet
  built.
- No backend: all data lives in the browser's `localStorage` and is wiped
  with site data / a different browser or device.