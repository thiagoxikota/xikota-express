const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, 'data.sqlite');
const db = new Database(dbPath);

db.exec(`
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  form_data TEXT NOT NULL,
  design_tokens TEXT,
  figma_file_url TEXT,
  figma_nodes TEXT,
  price_cents INTEGER,
  stripe_payment_id TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
`);

const insertProject = db.prepare(`INSERT INTO projects (id, user_id, status, form_data, price_cents, created_at, updated_at) VALUES (@id,@user_id,@status,@form_data,@price_cents, datetime('now'), datetime('now'))`);
const getProjectById = db.prepare(`SELECT * FROM projects WHERE id = ?`);
const updateProject = db.prepare(`UPDATE projects SET status=@status, design_tokens=@design_tokens, figma_file_url=@figma_file_url, figma_nodes=@figma_nodes, stripe_payment_id=@stripe_payment_id, price_cents=@price_cents, updated_at=datetime('now') WHERE id=@id`);
const listProjectsByStatus = db.prepare(`SELECT * FROM projects WHERE status = ? LIMIT 10`);

module.exports = {
  insertProject: (row) => insertProject.run(row),
  getProjectById: (id) => getProjectById.get(id),
  updateProject: (row) => updateProject.run(row),
  listProjectsByStatus: (status) => listProjectsByStatus.all(status),
  raw: db
};
