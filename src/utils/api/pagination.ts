export async function getPaginatedData<T extends { id: string }>(
  fetch: Function,
  take: string,
  lastCursor: string
) {
  const data: T[] = await fetch({
    take: take ? Number(take) : 10,
    ...(lastCursor && {
      skip: 1,
      cursor: {
        id: lastCursor as string,
      },
    }),
    orderBy: [
      {
        createdAt: 'desc',
      },
      {
        id: 'asc',
      },
    ],
  });

  if (data.length === 0) {
    return {
      data,
      lastCursor: null,
      hasNextPage: false,
    };
  }

  const cursor = data[data.length - 1].id;

  const results = await fetch({
    take: take ? Number(take as string) : 7,
    skip: 1,
    cursor: {
      id: cursor,
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
      {
        id: 'asc',
      },
    ],
  });

  const hasNextPage = results.length > 0;

  return {
    data,
    lastCursor: cursor,
    hasNextPage,
  };
}
