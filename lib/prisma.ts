import { PrismaClient } from "@prisma/client";

let prismaInstance: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prismaInstance = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prismaInstance = (global as any).prisma;
}

export default prismaInstance;
