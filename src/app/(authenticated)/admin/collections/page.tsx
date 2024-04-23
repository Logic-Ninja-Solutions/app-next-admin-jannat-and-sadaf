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
import { deleteInInfinteQuery } from '@/src/utils/api/pagination';
import InfiniteTable from '@/src/components/InfiniteTable';
import serverInstance from '../../../../actions/api';
import { CollectionActionType } from '../../../../actions/collection/enums';
import CollectionForm from '../../../../components/forms/collection/CollectionForm';
import { Collection } from '../../../../types/collection';

export default function CollectionPage() {
    const columns = ['Image', 'Title', 'Available', 'Actions'];
    const [editData, setEditData] = useState<Collection | undefined>(
        undefined,
    );

    const [activeTab, setActiveTab] = useState<'list' | 'create' | 'update'>(
        'list',
    );

    function onEditClick(data: Collection) {
        setEditData(undefined);
        setActiveTab('update');
        setEditData(data);
    }

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationKey: [CollectionActionType.deleteCollection],
        mutationFn: async (id: string) => {
            const response = await serverInstance.delete(`collection/${id}`);
            const { data } = response;
            return data;
        },
        onSuccess: (data) => {
            if (data) {
                deleteInInfinteQuery(
                    queryClient,
                    [CollectionActionType.fetchCollections],
                    data?.id ?? '',
                );
                notifications.show({
                    title: 'Success',
                    message: 'Collection deleted successfully',
                });
            }
        },
    });

    async function onDeleteClick(collection: Collection) {
        if (confirm('Are you sure you want to delete this collection?')) {
            await deleteMutation.mutateAsync(collection.id);
        }
    }

    function render(collection: Collection) {
        const { image } = collection;
        return (
            <Table.Tr key={collection.id}>
                <Table.Td>
                    <Center>
                        <Image
                          src={image ?? ''}
                          w={50}
                          fallbackSrc="https://placehold.co/600x400?text=No+Image"
                        />
                    </Center>
                </Table.Td>
                <Table.Td>{collection.title}</Table.Td>
                <Table.Td>
                    {collection.isAvailable ? <IconCheck /> : <IconX />}
                </Table.Td>
                <Table.Td>
                    <Flex gap="md">
                        <ActionIcon
                          onClick={() => {
                                onEditClick(collection);
                            }}
                        >
                            <IconEdit />
                        </ActionIcon>

                        <ActionIcon
                          color="red"
                          onClick={() => {
                                onDeleteClick(collection);
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
                        List Collections
                    </Tabs.Tab>
                    <Tabs.Tab leftSection={<IconCubePlus />} value="create">
                        Create Collection
                    </Tabs.Tab>
                    <Tabs.Tab
                      disabled={editData === undefined}
                      leftSection={<IconEdit />}
                      value="update"
                    >
                        Update Collection
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="list">
                    <InfiniteTable
                      fetchApi="/admin/api/collection"
                      queryKey={[CollectionActionType.fetchCollections]}
                      columns={columns}
                      render={render}
                    />
                </Tabs.Panel>

                <Tabs.Panel value="create">
                    <CollectionForm
                      onSuccess={() => {
                            setEditData(undefined);
                            notifications.show({
                                title: 'Success',
                                message: 'Collection created successfully',
                            });
                            setActiveTab('list');
                        }}
                    />
                </Tabs.Panel>

                <Tabs.Panel value="update">
                    <Box>
                        {editData && (
                            <CollectionForm
                              onSuccess={() => {
                                    setEditData(undefined);
                                    notifications.show({
                                        title: 'Success',
                                        message:
                                            'Collection updated successfully',
                                    });
                                    setActiveTab('list');
                                }}
                              editData={editData}
                            />
                        )}
                    </Box>
                </Tabs.Panel>
            </Tabs>
        </>
    );
}
