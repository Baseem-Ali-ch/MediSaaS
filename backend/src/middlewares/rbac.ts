import { NextFunction, Response } from "express";
import { prisma } from "../lib/prisma";

let cache: Record<string, Set<string>> = {};
let cacheTime = 0;

async function getRolePermissions(): Promise<Record<string, Set<string>>> {
  const now = Date.now();
  if (now - cacheTime < 5 * 60 * 1000 && Object.keys(cache).length)
    return cache;

  const rows = await prisma.rolePermission.findMany({
    include: { permission: true },
  });

  cache = {};
  for (const row of rows) {
    if (!cache[row.role]) cache[row.role] = new Set();
    cache[row.role].add(row.permission.name);
  }
  cacheTime = now;
  return cache;
}

export function bustPermissionCache() {
  cache = {};
  cacheTime = 0;
}

export const requirePermission = (permission: string) => {
  return async (req: any, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (role === "owner") return next();

    const rolePerms = await getRolePermissions();
    const perms = rolePerms[role] ?? new Set();

    if (!perms.has(permission)) {
      return res
        .status(403)
        .json({ error: `Access denied: missing '${permission}'` });
    }

    next();
  };
};
