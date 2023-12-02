'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';
import PaginatedTable from '@/src/components/core/PaginatedTable';
import { DEFAULT_PAGE_SIZE } from '@/src/constants';

interface PaginatedData<T> {
  data: T[];
  lastCursor: string | null;
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
  async function fetchPaginatedData({ pageParam }: { pageParam: string | null }) {
    const response = await axios.get<PaginatedData<T>>(fetchApi, {
      params: {
        lastCursor: pageParam,
        take: DEFAULT_PAGE_SIZE,
      },
    });
    const responseData = response.data;
    const { lastCursor, hasNextPage } = responseData;

    return {
      items: responseData.data,
      nextToken: hasNextPage ? lastCursor : null,
    };
  }

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchPaginatedData,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextToken,
    staleTime: Infinity,
  });

  function getPage(page: number) {
    return {
      items: data?.pages[page]?.items,
      nextToken: data?.pages[page]?.nextToken ?? null,
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
          nextToken: currentPageData.nextToken,
        }}
        columns={columns}
        render={render}
      />
    </>
  );
}
