'use client';

import { ActionIcon, Box, Button, Center, Image, Table, Tabs } from '@mantine/core';
import * as Types from '@prisma/client';
import { IconCheck, IconCross, IconCubePlus, IconEdit, IconList } from '@tabler/icons-react';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import ProductForm from '@/src/components/forms/product';
import InfiniteTable from '@/src/components/InfiniteTable';

export default function Product() {
  const columns = ['Image', 'Title', 'Available', 'Actions'];
  const [editProduct, setEditProduct] = useState<Types.Product | undefined>(undefined);

  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'update'>('list');

  function onEditClick(product: Types.Product) {
    setEditProduct(undefined);
    setActiveTab('update');
    setEditProduct(product);
  }

  function render(product: Types.Product) {
    const image = product.images?.[0];
    return (
      <Table.Tr key={product.id}>
        <Table.Td>
          <Center>
            <Image
              src={image ?? ''}
              w={50}
              fallbackSrc="https://placehold.co/600x400?text=No+Image"
            />
          </Center>
        </Table.Td>
        <Table.Td>{product.title}</Table.Td>
        <Table.Td>{product.isAvailable ? <IconCheck /> : <IconCross />}</Table.Td>
        <Table.Td>
          <ActionIcon
            onClick={() => {
              onEditClick(product);
            }}
          >
            <IconEdit />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    );
  }

  return (
    <>
      <Tabs value={activeTab} onChange={setActiveTab as any}>
        <Tabs.List>
          <Tabs.Tab leftSection={<IconList />} value="list">
            List Products
          </Tabs.Tab>
          <Tabs.Tab leftSection={<IconCubePlus />} value="create">
            Create Product
          </Tabs.Tab>
          <Tabs.Tab disabled={editProduct === undefined} leftSection={<IconEdit />} value="update">
            Update Product
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="list">
          <InfiniteTable
            fetchApi="api/product"
            queryKey={['product']}
            columns={columns}
            render={render}
          />
        </Tabs.Panel>

        <Tabs.Panel value="create">
          <ProductForm
            onSuccess={() => {
              setEditProduct(undefined);
              notifications.show({
                title: 'Success',
                message: 'Product created successfully',
              });
              setActiveTab('list');
            }}
          />
        </Tabs.Panel>

        <Tabs.Panel value="update">
          <Box>
            {editProduct && (
              <ProductForm
                onSuccess={() => {
                  setEditProduct(undefined);
                  notifications.show({
                    title: 'Success',
                    message: 'Product updated successfully',
                  });
                  setActiveTab('list');
                }}
                editData={editProduct}
              />
            )}
          </Box>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
