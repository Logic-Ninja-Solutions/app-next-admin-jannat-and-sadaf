'use client';

import { ActionIcon, Box, Center, Flex, Image, Table, Tabs } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import * as Types from '@prisma/client';
import {
  IconCheck,
  IconCross,
  IconCubePlus,
  IconEdit,
  IconList,
  IconTrash,
} from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { deleteInInfinteQuery } from '@/src/utils/api/pagination';
import InfiniteTable from '@/src/components/InfiniteTable';
import { CategoryActionType } from '../../../../actions/category/enums';
import CategoryForm from '../../../../components/forms/category/CategoryForm';

export default function Category() {
  const columns = ['Image', 'Title', 'Available', 'Actions'];
  const [editCategory, setEditData] = useState<Types.Category | undefined>(undefined);

  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'update'>('list');

  function onEditClick(data: Types.Category) {
    setEditData(undefined);
    setActiveTab('update');
    setEditData(data);
  }

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationKey: [CategoryActionType.deleteCategory],
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/category?id=${id}`);
      const { data } = response;
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        deleteInInfinteQuery(queryClient, [CategoryActionType.fetchCategorys], data?.id ?? '');
        notifications.show({
          title: 'Success',
          message: 'Category deleted successfully',
        });
      }
    },
  });

  async function onDeleteClick(category: Types.Category) {
    if (confirm('Are you sure you want to delete this category?')) {
      await deleteMutation.mutateAsync(category.id);
    }
  }

  function render(category: Types.Category) {
    const { image } = category;
    return (
      <Table.Tr key={category.id}>
        <Table.Td>
          <Center>
            <Image
              src={image ?? ''}
              w={50}
              fallbackSrc="https://placehold.co/600x400?text=No+Image"
            />
          </Center>
        </Table.Td>
        <Table.Td>{category.title}</Table.Td>
        <Table.Td>{category.isAvailable ? <IconCheck /> : <IconCross />}</Table.Td>
        <Table.Td>
          <Flex gap="md">
            <ActionIcon
              onClick={() => {
                onEditClick(category);
              }}
            >
              <IconEdit />
            </ActionIcon>

            <ActionIcon
              color="red"
              onClick={() => {
                onDeleteClick(category);
              }}
            >
              <IconTrash />
            </ActionIcon>
          </Flex>
        </Table.Td>
      </Table.Tr>
    );
  }

  return (
    <>
      <Tabs value={activeTab} onChange={setActiveTab as any}>
        <Tabs.List>
          <Tabs.Tab leftSection={<IconList />} value="list">
            List Categories
          </Tabs.Tab>
          <Tabs.Tab leftSection={<IconCubePlus />} value="create">
            Create Category
          </Tabs.Tab>
          <Tabs.Tab disabled={editCategory === undefined} leftSection={<IconEdit />} value="update">
            Update Category
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="list">
          <InfiniteTable
            fetchApi="/api/category"
            queryKey={[CategoryActionType.fetchCategorys]}
            columns={columns}
            render={render}
          />
        </Tabs.Panel>

        <Tabs.Panel value="create">
          <CategoryForm
            onSuccess={() => {
              setEditData(undefined);
              notifications.show({
                title: 'Success',
                message: 'Category created successfully',
              });
              setActiveTab('list');
            }}
          />
        </Tabs.Panel>

        <Tabs.Panel value="update">
          <Box>
            {editCategory && (
              <CategoryForm
                onSuccess={() => {
                  setEditData(undefined);
                  notifications.show({
                    title: 'Success',
                    message: 'Category updated successfully',
                  });
                  setActiveTab('list');
                }}
                editData={editCategory}
              />
            )}
          </Box>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
