import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

let prismaInstance = globalThis.prismaGlobal;
if (!prismaInstance || !("documentSuite" in (prismaInstance as any))) {
  prismaInstance = prismaClientSingleton();
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}

export default prisma;
