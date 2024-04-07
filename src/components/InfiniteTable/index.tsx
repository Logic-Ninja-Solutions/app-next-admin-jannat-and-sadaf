'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PaginatedTable from '@/src/components/core/PaginatedTable';
import { DEFAULT_PAGE_SIZE } from '@/src/constants';

interface PaginatedData<T> {
    data: T[];
    total: number;
    hasNextPage: boolean;
}

type InfiniteTableProps = {
    fetchApi: string;
    queryKey: string[];
    columns: string[];
    render: (item: any) => JSX.Element;
};

export default function InfiniteTable<T>({
    fetchApi,
    queryKey,
    columns,
    render,
}: InfiniteTableProps) {
    async function fetchPaginatedData({
        pageParam,
    }: {
        pageParam: string | null;
    }) {
        const response = await axios.get<PaginatedData<T>>(fetchApi, {
            params: {
                skip: pageParam,
                take: DEFAULT_PAGE_SIZE,
            },
        });

        const { data, total, hasNextPage } = response.data;

        return {
            items: data,
            total,
            hasNextPage,
        };
    }

    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
        useInfiniteQuery({
            queryKey,
            queryFn: fetchPaginatedData,
            initialPageParam: '0',
            getNextPageParam: (lastPage, pages) => {
                const itemsFetchedSoFar = pages.reduce(
                    (acc, page) => acc + page.items.length,
                    0,
                );
                if (itemsFetchedSoFar >= lastPage.total) {
                    return null;
                }
                return itemsFetchedSoFar.toString();
            },
            staleTime: Infinity,
        });

    function getPage(page: number) {
        return {
            items: data?.pages[page]?.items,
            hasNextPage: data?.pages[page]?.hasNextPage,
        };
    }

    const [page, setPage] = useState(0);
    const currentPageData = getPage(page);

    const fetchMore = async () => {
        if (hasNextPage) {
            await fetchNextPage();
        }
    };

    const handleNextPage = async () => {
        const nextItems = getPage(page + 1).items;
        if (nextItems?.length === 0 || !nextItems) {
            await fetchMore();
        }
        setPage((oldPage) => oldPage + 1);
    };

    const handlePrevPage = async () => {
        setPage((oldPage) => oldPage - 1);
    };

    return (
        <>
            <PaginatedTable
              currentPage={page}
              onPrev={() => handlePrevPage()}
              onNext={() => handleNextPage()}
              loading={isFetching || isFetchingNextPage}
              data={{
                    items: currentPageData.items,
                    hasNextPage: currentPageData.hasNextPage,
                }}
              columns={columns}
              render={render}
            />
        </>
    );
}
