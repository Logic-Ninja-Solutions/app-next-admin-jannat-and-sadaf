'use client';

import {
    ActionIcon,
    Box,
    Center,
    Flex,
    Image,
    Table,
    Tabs,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    IconCheck,
    IconCubePlus,
    IconEdit,
    IconList,
    IconTrash,
    IconX,
} from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { deleteProduct } from '@/src/actions/product';
import { ProductActionType } from '@/src/actions/product/enums';
import InfiniteTable from '@/src/components/InfiniteTable';
import ProductForm from '@/src/components/forms/ProductForm/ProductForm';
import { deleteInInfinteQuery } from '@/src/utils/api/pagination';
import { Product } from '../../../../types/product';

export default function ProductPage() {
    const columns = ['Image', 'Title', 'Available', 'Actions'];
    const [editProduct, setEditProduct] = useState<Product | undefined>(
        undefined,
    );

    const [activeTab, setActiveTab] = useState<'list' | 'create' | 'update'>(
        'list',
    );

    function onEditClick(product: Product) {
        setEditProduct(undefined);
        setActiveTab('update');
        setEditProduct(product);
    }

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationKey: [ProductActionType.deleteProduct],
        mutationFn: deleteProduct,
        onSuccess: (data) => {
            if (data) {
                deleteInInfinteQuery(
                    queryClient,
                    [ProductActionType.fetchProducts],
                    data?.id ?? '',
                );
                notifications.show({
                    title: 'Success',
                    message: 'Product deleted successfully',
                });
            }
        },
    });

    async function onDeleteClick(product: Product) {
        if (confirm('Are you sure you want to delete this product?')) {
            await deleteMutation.mutateAsync(product.id);
        }
    }

    function render(product: Product) {
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
                <Table.Td>
                    {product.isAvailable ? <IconCheck /> : <IconX />}
                </Table.Td>
                <Table.Td>
                    <Flex gap="md">
                        <ActionIcon
                          onClick={() => {
                                onEditClick(product);
                            }}
                        >
                            <IconEdit />
                        </ActionIcon>

                        <ActionIcon
                          color="red"
                          onClick={() => {
                                onDeleteClick(product);
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
                        List Products
                    </Tabs.Tab>
                    <Tabs.Tab leftSection={<IconCubePlus />} value="create">
                        Create Product
                    </Tabs.Tab>
                    <Tabs.Tab
                      disabled={editProduct === undefined}
                      leftSection={<IconEdit />}
                      value="update"
                    >
                        Update Product
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="list">
                    <InfiniteTable
                      fetchApi="/admin/api/product"
                      queryKey={[ProductActionType.fetchProducts]}
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
