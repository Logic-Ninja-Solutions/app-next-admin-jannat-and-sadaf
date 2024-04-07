import { NextResponse } from 'next/server';
import serverInstance from '..';

export default async function getPaginatedEntity(
    reqUrl: string,
    entity: string,
) {
    try {
        const url = new URL(reqUrl);

        const take = url.searchParams.get('take');
        const skip = url.searchParams.get('skip');

        const queryParams: Record<string, string> = {
            skip: skip || '0',
            take: take || '10',
        };

        const q = new URLSearchParams(queryParams).toString();
        const response = await serverInstance.get(`${entity}?${q}`);

        return NextResponse.json(response.data, { status: 200 });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json(
            {
                error: error.message,
            },
            { status: 500 },
        );
    }
}
