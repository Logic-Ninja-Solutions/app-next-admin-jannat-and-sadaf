import { Box, Button, Center, Flex, Skeleton, Table, Text } from '@mantine/core';
import { ReactNode } from 'react';

interface TableSkeletonProps {
  visible: boolean;
  children?: ReactNode;
  numCols: number;
}

function TableSkeleton({ visible, children, numCols }: TableSkeletonProps) {
  const numRows = 15;

  if (visible) {
    const skeletonRows = Array.from({ length: numRows }, (_, rowIndex) => (
      <Table.Tr key={rowIndex}>
        {Array.from({ length: numCols }, (num, colIndex) => (
          <Table.Td key={colIndex}>
            <Skeleton height={8} mt={6} width="70%" radius="xl" />
          </Table.Td>
        ))}
      </Table.Tr>
    ));

    return <Table.Tbody>{skeletonRows}</Table.Tbody>;
  }

  return <>{children}</>;
}

export type PaginatedTableProps<T> = {
  columns: string[];
  data?: { items?: T[]; nextToken: string | null | undefined };
  render: (item: T) => JSX.Element;
  loading?: boolean;
  onNext: () => Promise<void>;
  onPrev: () => Promise<void>;
  currentPage: number;
};

export default function PaginatedTable<T>({
  columns,
  data,
  render,
  loading = false,
  onNext,
  onPrev,
  currentPage,
}: PaginatedTableProps<T>): JSX.Element {
  const { items, nextToken } = data ?? {};

  const rows = items?.map(render);

  return (
    <>
      {items?.length === 0 ? (
        <Center mt={20}>
          <Text>Empty Table</Text>
        </Center>
      ) : (
        <>
          <Box mx="auto">
            <Table.ScrollContainer minWidth={500} type="native">
              <Table withRowBorders highlightOnHover striped>
                <Table.Thead>
                  <Table.Tr>
                    {columns.map((column) => (
                      <Table.Th key={column}>{column}</Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <TableSkeleton numCols={columns.length} visible={loading || !data}>
                  <Table.Tbody>{rows}</Table.Tbody>
                </TableSkeleton>
              </Table>
            </Table.ScrollContainer>
          </Box>

          <Center mt={20}>
            <Flex align="center" justify="center" gap={20}>
              <Button onClick={onPrev} disabled={loading || currentPage === 0}>
                Prev
              </Button>
              <Text>{currentPage + 1}</Text>
              <Button onClick={onNext} disabled={!nextToken || loading}>
                Next
              </Button>
            </Flex>
          </Center>
        </>
      )}
    </>
  );
}
