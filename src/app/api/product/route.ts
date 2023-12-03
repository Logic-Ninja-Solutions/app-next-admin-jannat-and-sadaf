import * as Types from '@prisma/client';
import { NextResponse } from 'next/server';

import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { getPaginatedData } from '@src/utils/api/pagination';
import slugify from 'slugify';
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

function generateSlug(title: string) {
  return slugify(title, {
    lower: true,
  });
}

function validateSlug(slug: string, productID?: string) {
  const query = productID
    ? {
        id: {
          not: productID,
        },
      }
    : {};

  return prisma.product.findMany({
    where: {
      slug,
      ...query,
    },
  });
}

export async function PATCH(req: Request) {
  try {
    const body: Types.Product = await req.json();
    const productID = body.id;
    if (!productID) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const slug = generateSlug(body.title);
    const existingProduct = await validateSlug(slug, productID);
    if (existingProduct.length > 0) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const data = {
      ...body,
      slug,
      id: undefined,
    };
    const newProduct = await prisma.product.update({
      where: {
        id: productID,
      },
      data,
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

export async function POST(req: Request) {
  try {
    const body: Types.Product = await req.json();
    const slug = generateSlug(body.title);
    const existingProduct = await validateSlug(slug);
    if (existingProduct.length > 0) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }
    const newProduct = await prisma.product.create({
      data: {
        ...body,
        slug,
      },
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
