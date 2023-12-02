import { ScrollArea } from '@mantine/core';
import { IconBrandProducthunt, IconHome } from '@tabler/icons-react';

import { LinkGroup, LinksGroup } from '@/src/components/navigation/LinksGroup';

const menu: LinkGroup[] = [
  { label: 'Home', link: '/admin', icon: IconHome },
  { label: 'Product', link: '/product', icon: IconBrandProducthunt },
];

export function Navbar() {
  return (
    <ScrollArea>
      <LinksGroup links={menu} />
    </ScrollArea>
  );
}