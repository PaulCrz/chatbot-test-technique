import { prisma } from '@/lib/prisma';

import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const categories = await prisma.item.findMany({
            distinct: ['category'],
            select: { category: true },
        });
        const uniqueCategories = categories.map((item) => item.category);
        return NextResponse.json(uniqueCategories);
    }
    catch (error) {
        console.error('Error fetching filters:', error);
        return NextResponse.json({ error: 'Failed to fetch filters' }, { status: 500 });
    }
}
