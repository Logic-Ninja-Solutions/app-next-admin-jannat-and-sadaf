import * as Types from '@prisma/client';
import { NextResponse } from 'next/server';

import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { getPaginatedData } from '@src/utils/api/pagination';
import * as bcrypt from 'bcryptjs';
import { prisma } from '@/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const take = url.searchParams.get('take');
    const lastCursor = url.searchParams.get('lastCursor');

    const data = await getPaginatedData<Types.User>(
      prisma.user.findMany,
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

export async function PATCH(req: Request) {
  try {
    const body: Types.User = await req.json();
    const userID = body.id;
    const { password } = body;
    const encryptedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const data = {
      ...body,
      id: undefined,
      password: encryptedPassword,
    };
    const newUser = await prisma.user.update({
      where: {
        id: userID,
      },
      data,
    });

    return NextResponse.json(newUser);
  } catch (e) {
    if (e instanceof PrismaClientValidationError) {
      console.log(e);
      return NextResponse.json({ error: e.message?.trim() }, { status: 400 });
    }
    return NextResponse.json('error', {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const body: Types.User = await req.json();
    const { password } = body;
    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        ...body,
        password: encryptedPassword,
      },
    });
    return NextResponse.json(newUser);
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
  // await prisma.user.deleteMany({});
  // return NextResponse.json({ status: 'ok' });

  const query = new URL(req.url).searchParams;
  const id = query.get('id') as string;
  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(deletedUser);
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
