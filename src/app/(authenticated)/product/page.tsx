'use client';

import { Box, Table } from '@mantine/core';
import * as Types from '@prisma/client';
import InfiniteTable from '@/src/components/InfiniteTable';
import ProductForm from '@/src/components/forms/product';

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
      <Box>
        <ProductForm />
      </Box>
      {/* <InfiniteTable
        fetchApi="api/product"
        queryKey={['product']}
        columns={columns}
        render={render}
      /> */}
    </>
  );
}
