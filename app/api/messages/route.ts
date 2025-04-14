import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

/**
 * API route to create a new message
 * Method: POST
 * @param request HTTP request containing the message content and the conversation ID
 * @returns The created message with a 201 status or an error
 */
export async function POST(request: Request) {
  try {
    // Extract and verify the required request data
    const { content, conversationId } = await request.json();
    if (!content || !conversationId) {
      return NextResponse.json(
        { error: 'Message content and conversation ID are required' },
        { status: 400 }
      );
    }

    // Directly try to create the message
    const message = await prisma.message.create({
      data: {
        content,
        conversationId,
        isUserMessage: true,
      },
    });

    // Return the created message with a status of 201 (Created)
    return NextResponse.json(message, { status: 201 });

  } catch (error) {

    console.error('[messages:POST]', error);

    // Check if the error is a known Prisma error
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Prisma error code for foreign key constraint violation
      if (error.code === 'P2003') {
        return NextResponse.json(
          { error: 'Conversation not found' },
          { status: 404 }
        );
      }
    }

    // Return a 500 error on failure
    return NextResponse.json(
      { error: 'Error creating message' },
      { status: 500 }
    );
  }
}
