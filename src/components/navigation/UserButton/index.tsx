'use client';

import { ActionIcon, Avatar, Card, Group, Text, rem } from '@mantine/core';
import { signOut } from 'next-auth/react';

import { IconLogout } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { getUserData, isAuthenticated, unauthenticate } from '@/src/actions/auth';
import { AuthAction } from '@/src/actions/auth/enum';
import classes from './UserButton.module.scss';

export function UserButton() {
  const { data: authData, isSuccess } = useQuery({
    queryKey: [AuthAction.auth],
    queryFn: () => isAuthenticated(),
  });

  const { data: userData } = useQuery({
    queryKey: [AuthAction.userData],
    queryFn: () => getUserData(authData?.user?.email),
    enabled: !!authData && isSuccess,
  });

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

        <ActionIcon onClick={async () => unauthenticate()}>
          <IconLogout style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
        </ActionIcon>
      </Group>
    </Card>
  );
}
