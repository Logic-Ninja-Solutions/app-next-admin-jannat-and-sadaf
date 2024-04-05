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
    const data = await getPaginatedData<Types.Category>(
      prisma.category.findMany,
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

function validateSlug(slug: string, categoryID?: string) {
  const query = categoryID
    ? {
        id: {
          not: categoryID,
        },
      }
    : {};

  return prisma.category.findMany({
    where: {
      slug,
      ...query,
    },
  });
}

export async function PATCH(req: Request) {
  try {
    const body: Types.Category = await req.json();
    const categoryID = body.id;
    if (!categoryID) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const slug = generateSlug(body.title);
    const existing = await validateSlug(slug, categoryID);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const data = {
      ...body,
      slug,
      id: undefined,
    };
    const newData = await prisma.category.update({
      where: {
        id: categoryID,
      },
      data,
    });

    return NextResponse.json(newData);
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
    const body: Types.Category = await req.json();
    const slug = generateSlug(body.title);
    const existing = await validateSlug(slug);
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }
    const newData = await prisma.category.create({
      data: {
        ...body,
        slug,
      },
    });
    return NextResponse.json(newData);
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
  // await prisma.category.deleteMany({});
  // return NextResponse.json({ status: 'ok' });

  const query = new URL(req.url).searchParams;
  const id = query.get('id') as string;

  try {
    const deletedData = await prisma.category.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(deletedData);
  } catch (e) {
    return NextResponse.json(
      {
        error: 'Failed to remove post',
      },
      {
        status: 400,
      }
    );
  }
}
