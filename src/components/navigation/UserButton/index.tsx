'use client';

import { ActionIcon, Avatar, Card, Group, Text, rem } from '@mantine/core';
import { signOut, useSession } from 'next-auth/react';

import { IconLogout } from '@tabler/icons-react';
import classes from './UserButton.module.scss';

export function UserButton() {
  const { data } = useSession();
  return (
    <Card className={classes.user}>
      <Group>
        <Avatar radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {data?.user?.name}
          </Text>

          <Text c="dimmed" size="xs">
            {data?.user?.email}
          </Text>
        </div>

        <ActionIcon onClick={() => signOut()}>
          <IconLogout style={{ width: rem(14), height: rem(14) }} stroke={1.5} />
        </ActionIcon>
      </Group>
    </Card>
  );
}
