'use client';

import { Table } from '@mantine/core';
import * as Types from '@prisma/client';
import InfiniteTable from '@/src/components/InfiniteTable';

export default function Product() {
  const columns = ['Title'];

  function render(product: Types.Product) {
    return (
      <Table.Tr key={product.id}>
        <Table.Td>{product.title}</Table.Td>
      </Table.Tr>
    );
  }

  return (
    <>
      <InfiniteTable
        fetchApi="api/product"
        queryKey={['product']}
        columns={columns}
        render={render}
      />
    </>
  );
}
