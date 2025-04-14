import { prisma } from '@/lib/prisma';

import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const types = await prisma.location.findMany({
            distinct: ['type'],
            select: { type: true },
        });
        const uniqueCategories = types.map((location) => location.type);
        return NextResponse.json(uniqueCategories);
    }
    catch (error) {
        console.error('Error fetching filters:', error);
        return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 });
    }
}
