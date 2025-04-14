import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Route API pour créer une nouvelle conversation
 * Méthode: POST
 * @returns La conversation créée avec un statut 201
 */
export async function POST() {
  try {
    // Créer une nouvelle conversation dans la base de données
    const conversation = await prisma.conversation.create({
      data: {},
    });

    // Retourner la conversation créée avec un statut 201 (Created)
    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la conversation:', error);

    // Retourner une erreur 500 en cas d'échec
    return NextResponse.json(
      { error: 'Erreur lors de la création de la conversation' },
      { status: 500 }
    );
  }
}
