import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const options = await prisma.item.findMany({
            where: {
                ...(category && { category }),
                ...(search && {
                    name: { contains: search },
                }),
            },
        });
        return NextResponse.json(options);
    }
    catch (error) {
        console.error('Error fetching items', error);
        return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
    }
}
