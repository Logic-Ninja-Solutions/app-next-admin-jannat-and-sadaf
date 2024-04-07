import { InfiniteData, QueryClient } from '@tanstack/react-query';

// ------
export function updateInInfiniteQuery<T extends { id: string }>(
    queryClient: QueryClient,
    keys: string[],
    updatedData: T,
) {
    queryClient.setQueryData<
        InfiniteData<{ items: T[]; nextToken: string }, unknown>
    >(
        keys,
        (
            oldData:
                | InfiniteData<{ items: T[]; nextToken: string }, unknown>
                | undefined,
        ) => {
            if (oldData) {
                const updatedPage = oldData.pages.map((page) => ({
                    ...page,
                    items: page.items.map((item) =>
                        item.id === updatedData.id
                            ? { ...item, ...updatedData }
                            : item,
                    ),
                }));

                return {
                    ...oldData,
                    pages: updatedPage,
                };
            }
            return oldData;
        },
    );
}

export function createInInfiniteQuery<T extends { id: string }>(
    queryClient: QueryClient,
    keys: string[],
    data: T,
) {
    queryClient.setQueryData(
        keys,
        (
            oldData:
                | InfiniteData<{ items: T[]; nextToken: string }, unknown>
                | undefined,
        ) => {
            if (oldData) {
                const firstPage = oldData.pages[0];
                firstPage.items.unshift(data);
                return {
                    ...oldData,
                    pages: [firstPage, ...oldData.pages],
                };
            }
            return oldData;
        },
    );
}

export function deleteInInfinteQuery<T extends { id: string }>(
    queryClient: QueryClient,
    keys: string[],
    id: string,
) {
    queryClient.setQueryData(
        keys,
        (
            oldData:
                | InfiniteData<{ items: T[]; nextToken: string }, unknown>
                | undefined,
        ) => {
            if (oldData) {
                const updatedPage = oldData.pages.map((page) => ({
                    ...page,
                    items: page.items.filter((item) => item.id !== id),
                }));

                return {
                    ...oldData,
                    pages: updatedPage,
                };
            }
            return oldData;
        },
    );
}
