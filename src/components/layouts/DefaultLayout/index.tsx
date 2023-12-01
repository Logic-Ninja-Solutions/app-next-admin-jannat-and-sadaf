'use client';

import { AppShell, Burger, Group, ScrollArea, useMantineTheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Navbar } from '../../Navbar';
import { UserButton } from '../../UserButton';
import { Logo } from '../../core/Logo';
import ThemeSwitch from '../../core/ThemeSwitch';

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const theme = useMantineTheme();

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Group justify="space-between" align="center" w="100%" ml="md" mr="md">
              <Logo />
              <ThemeSwitch />
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <AppShell.Section grow my="md" component={ScrollArea}>
            <Navbar />
          </AppShell.Section>
          <AppShell.Section>
            <UserButton />
          </AppShell.Section>
        </AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </>
  );
}
