import { ScrollArea } from '@mantine/core';
import { IconHome } from '@tabler/icons-react';

import { LinkGroup, LinksGroup } from '@/src/components/LinksGroup';

const menu: LinkGroup[] = [{ label: 'Home', link: '/admin', icon: IconHome }];

export function Navbar() {
  return (
    <ScrollArea>
      <LinksGroup links={menu} />
    </ScrollArea>
  );
}
