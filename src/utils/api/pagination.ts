import { InfiniteData, QueryClient } from '@tanstack/react-query';

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

// ------
export function updateInInfiniteQuery<T extends { id: string }>(
  queryClient: QueryClient,
  keys: string[],
  updatedData: T
) {
  queryClient.setQueryData<InfiniteData<{ items: T[]; nextToken: string }, unknown>>(
    keys,
    (oldData: InfiniteData<{ items: T[]; nextToken: string }, unknown> | undefined) => {
      if (oldData) {
        const updatedPage = oldData.pages.map((page) => ({
          ...page,
          items: page.items.map((item) =>
            item.id === updatedData.id ? { ...item, ...updatedData } : item
          ),
        }));

        return {
          ...oldData,
          pages: updatedPage,
        };
      }
      return oldData;
    }
  );
}

export function createInInfiniteQuery<T extends { id: string }>(
  queryClient: QueryClient,
  keys: string[],
  data: T
) {
  queryClient.setQueryData(
    keys,
    (oldData: InfiniteData<{ items: T[]; nextToken: string }, unknown> | undefined) => {
      if (oldData) {
        const firstPage = oldData.pages[0];
        firstPage.items.unshift(data);
        return {
          ...oldData,
          pages: [firstPage, ...oldData.pages],
        };
      }
      return oldData;
    }
  );
}
