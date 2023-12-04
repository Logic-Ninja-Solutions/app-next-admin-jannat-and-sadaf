import * as Types from '@prisma/client';
import { NextResponse } from 'next/server';

import { getPaginatedData } from '@src/utils/api/pagination';
import { prisma } from '@/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const take = url.searchParams.get('take');
    const lastCursor = url.searchParams.get('lastCursor');
    const data = await getPaginatedData<Types.Order>(
      prisma.order.findMany,
      take as string,
      lastCursor as string
    );

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }
}
