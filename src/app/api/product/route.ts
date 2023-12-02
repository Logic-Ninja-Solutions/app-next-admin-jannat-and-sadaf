import * as Types from '@prisma/client';
import { NextResponse } from 'next/server';

import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { getPaginatedData } from '@src/utils/api/pagination';
import { prisma } from '@/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const take = url.searchParams.get('take');
    const lastCursor = url.searchParams.get('lastCursor');
    const data = await getPaginatedData<Types.Product>(
      prisma.product.findMany,
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

export async function POST(req: Request) {
  try {
    const body: Types.Product = await req.json();

    const newProduct = await prisma.product.create({
      data: body,
    });
    return NextResponse.json(newProduct);
  } catch (e) {
    if (e instanceof PrismaClientValidationError) {
      return NextResponse.json({ error: e.message?.trim() }, { status: 400 });
    }
    return NextResponse.json('error', {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  // await prisma.product.deleteMany({});
  // return NextResponse.json({ status: 'ok' });

  const query = new URL(req.url).searchParams;
  const id = query.get('id') as string;
  try {
    const deletedProduct = await prisma.product.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(deletedProduct);
  } catch {
    return NextResponse.json(
      {
        error: 'Failed to remove post',
      },
      {
        status: 500,
      }
    );
  }
}
