'use client';

import { ActionIcon, Box, Table, Tabs, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import * as Types from '@prisma/client';
import { IconCubePlus, IconEdit, IconList } from '@tabler/icons-react';
import { useState } from 'react';
import UserForm from '@/src/components/forms/user';
import InfiniteTable from '@/src/components/InfiniteTable';
import { UserWithAddresses } from '@/src/types/prisma';

type User = UserWithAddresses;

export default function User() {
  const columns = ['First Name', 'Last Name', 'Email', 'Active', 'Phone Number', 'Actions'];
  const [editUser, setEditUser] = useState<User | undefined>(undefined);

  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'update'>('list');

  function onEditClick(user: User) {
    setEditUser(undefined);
    setActiveTab('update');
    setEditUser(user);
  }

  function render(user: User) {
    return (
      <Table.Tr key={user.id}>
        <Table.Td>
          <Text>{user.firstName}</Text>
        </Table.Td>
        <Table.Td>
          <Text>{user.lastName}</Text>
        </Table.Td>
        <Table.Td>
          <Text>{user.email}</Text>
        </Table.Td>
        <Table.Td>
          <Text>{user.isActive ? 'Active' : 'Inactive'}</Text>
        </Table.Td>
        <Table.Td>
          <Text>{user.phone}</Text>
        </Table.Td>

        <Table.Td>
          <ActionIcon onClick={() => onEditClick(user)}>
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
            List Users
          </Tabs.Tab>
          <Tabs.Tab leftSection={<IconCubePlus />} value="create">
            Create User
          </Tabs.Tab>
          <Tabs.Tab disabled={editUser === undefined} leftSection={<IconEdit />} value="update">
            Update User
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="list">
          <InfiniteTable
            fetchApi="/api/user"
            queryKey={['user']}
            columns={columns}
            render={render}
          />
        </Tabs.Panel>

        <Tabs.Panel value="create">
          <UserForm
            onSuccess={() => {
              setEditUser(undefined);
              notifications.show({
                title: 'Success',
                message: 'User created successfully',
              });
              setActiveTab('list');
            }}
          />
        </Tabs.Panel>

        <Tabs.Panel value="update">
          <Box>
            {editUser && (
              <UserForm
                onSuccess={() => {
                  setEditUser(undefined);
                  notifications.show({
                    title: 'Success',
                    message: 'User updated successfully',
                  });
                  setActiveTab('list');
                }}
                editData={editUser}
              />
            )}
          </Box>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
