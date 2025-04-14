import { PrismaClient } from '@prisma/client';

/**
 * Déclaration globale pour le client Prisma
 * Permet d'éviter de multiples instances du client en développement
 */
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

/**
 * Initialisation du client Prisma
 * Réutilise l'instance globale en développement pour éviter trop de connexions
 */
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Attache le client au scope global en développement
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
