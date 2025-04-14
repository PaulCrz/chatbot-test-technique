import { prisma } from '@/lib/prisma';

import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const options = await prisma.option.findMany();
        return NextResponse.json(options);
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Failed to fetch options' }, { status: 500 });
    }
};
