import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const search = searchParams.get('search');
        const options = await prisma.location.findMany({
            where: {
                ...(type && { type }),
                ...(search && {
                    name: { contains: search },
                }),
            },
        });
        return NextResponse.json(options);
    }
    catch (error) {
        console.error('Error fetching locations', error);
        return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
    }
};
