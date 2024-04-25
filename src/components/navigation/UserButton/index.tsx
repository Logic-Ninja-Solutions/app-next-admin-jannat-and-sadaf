'use client';

import { ActionIcon, Avatar, Card, Group, Text, rem } from '@mantine/core';

import { IconLogout } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AuthAction } from '@/src/actions/auth/enum';
import {
    getUserData,
    unauthenticate,
} from '@/src/actions/auth';
import { GetAuth } from '../../../api/user';
import classes from './UserButton.module.scss';

export function UserButton() {
  const { data: authData, isSuccess } = GetAuth();

  const client = useQueryClient();
  const router = useRouter();

  const { data: user } = useQuery({
    queryKey: [AuthAction.userData],
    queryFn: () => getUserData(authData?.user?.email),
    enabled: !!authData && isSuccess,
  });

  const userData = user?.user;

  return (
    <Card className={classes.user}>
      <Group>
        <Avatar radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {`${userData?.firstName} ${userData?.lastName}`}
          </Text>

          <Text c="dimmed" size="xs">
            {userData?.email}
          </Text>
        </div>

        <ActionIcon
          onClick={async () => {
            await unauthenticate();
            client.invalidateQueries();
            window.location.reload();
          }}
        >
          <IconLogout
            style={{ width: rem(14), height: rem(14) }}
            stroke={1.5}
          />
        </ActionIcon>
      </Group>
    </Card>
  );
}
