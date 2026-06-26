import bcrypt from "bcryptjs";
import { ensureSchema, getSql, isDatabaseConfigured } from "@/lib/db";

export type AdminAccount = {
  id: string;
  email: string;
  adminGroup: string;
  createdAt: string;
};

type AdminAccountRow = {
  id: string;
  email: string;
  password_hash: string;
  admin_group: string;
  created_at: string | Date;
};

function mapAdminRow(row: AdminAccountRow): AdminAccount {
  return {
    id: row.id,
    email: row.email,
    adminGroup: row.admin_group,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function findAdminByEmail(email: string): Promise<(AdminAccount & { passwordHash: string }) | null> {
  if (!isDatabaseConfigured()) return null;

  await ensureSchema();
  const sql = getSql();
  if (!sql) return null;

  const normalizedEmail = email.trim().toLowerCase();
  const rows = await sql`
    SELECT id, email, password_hash, admin_group, created_at
    FROM admin_accounts
    WHERE LOWER(email) = ${normalizedEmail}
    LIMIT 1
  `;

  if (rows.length === 0) return null;

  const row = rows[0] as AdminAccountRow;
  return {
    ...mapAdminRow(row),
    passwordHash: row.password_hash,
  };
}

export async function verifyAdminPassword(email: string, password: string): Promise<AdminAccount | null> {
  const admin = await findAdminByEmail(email);
  if (!admin) return null;

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) return null;

  const { passwordHash: _passwordHash, ...account } = admin;
  return account;
}

export async function listAdminAccounts(): Promise<AdminAccount[]> {
  if (!isDatabaseConfigured()) return [];

  await ensureSchema();
  const sql = getSql();
  if (!sql) return [];

  const rows = await sql`
    SELECT id, email, admin_group, created_at
    FROM admin_accounts
    ORDER BY created_at ASC
  `;

  return rows.map((row) => mapAdminRow(row as AdminAccountRow));
}

export async function createAdminAccount(input: {
  email: string;
  password: string;
  adminGroup: string;
}): Promise<AdminAccount> {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured");
  }

  await ensureSchema();
  const sql = getSql();
  if (!sql) {
    throw new Error("DATABASE_URL is not configured");
  }

  const email = input.email.trim().toLowerCase();
  const adminGroup = input.adminGroup.trim() || "admin";
  const passwordHash = await bcrypt.hash(input.password, 10);
  const id = crypto.randomUUID();

  await sql`
    INSERT INTO admin_accounts (id, email, password_hash, admin_group, created_at)
    VALUES (${id}, ${email}, ${passwordHash}, ${adminGroup}, NOW())
  `;

  return {
    id,
    email,
    adminGroup,
    createdAt: new Date().toISOString(),
  };
}

export async function deleteAdminAccount(adminId: string): Promise<boolean> {
  if (!isDatabaseConfigured()) return false;

  await ensureSchema();
  const sql = getSql();
  if (!sql) return false;

  const rows = await sql`
    DELETE FROM admin_accounts
    WHERE id = ${adminId}
    RETURNING id
  `;

  return rows.length > 0;
}

export async function ensureBootstrapAdmin(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const adminGroup = process.env.ADMIN_GROUP?.trim() || "admin";

  if (!email || !password) return;

  const existing = await findAdminByEmail(email);
  if (existing) return;

  await createAdminAccount({ email, password, adminGroup });
}
