import * as Types from '@prisma/client';
import { NextResponse } from 'next/server';

import { PrismaClientValidationError } from '@prisma/client/runtime/library';

import { prisma } from '@/server';

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products.reverse());
  } catch {
    return NextResponse.json('error', {
      status: 500,
    });
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
