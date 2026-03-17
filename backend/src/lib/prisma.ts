import { PrismaClient } from '@prisma/client';
import { PrismaMssql } from '@prisma/adapter-mssql';

const adapter = new PrismaMssql({
  server: process.env.DB_HOST!,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    instanceName: process.env.DB_INSTANCE,
  },
  authentication: {
    type: 'default',      // <-- this is SQL Server Auth
    options: {
      userName: process.env.DB_USER!,
      password: process.env.DB_PASSWORD!,
    },
  },
});

export const prisma = new PrismaClient({ adapter });