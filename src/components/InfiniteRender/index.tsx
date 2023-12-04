'use client';

import { Button, Center, Flex, Loader, Text } from '@mantine/core';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '@/src/constants';

interface PaginatedData<T> {
  data: T[];
  lastCursor: string | null;
  hasNextPage: boolean;
}

type InfiniteTableProps = {
  fetchApi: string;
  queryKey: string[];

  render: (item: any) => JSX.Element;
};

export default function InfiniteRender<T>({
  fetchApi,
  queryKey,

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
    queryKey,
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

  const loading = isFetching || isFetchingNextPage;
  return (
    <>
      {loading ? (
        <Center>
          <Loader />
        </Center>
      ) : (
        <>
          {currentPageData.items?.length === 0 ? (
            <Center>
              <Text>No data</Text>
            </Center>
          ) : (
            <>
              {currentPageData.items?.map((item, index) => (
                <div key={index}>{render(item)}</div>
              ))}
            </>
          )}
          <Center mt={20}>
            <Flex align="center" justify="center" gap={20}>
              <Button onClick={handlePrevPage} disabled={loading || page === 0}>
                Prev
              </Button>
              <Text>{page + 1}</Text>
              <Button onClick={handleNextPage} disabled={!currentPageData.nextToken || loading}>
                Next
              </Button>
            </Flex>
          </Center>
        </>
      )}
    </>
  );
}
