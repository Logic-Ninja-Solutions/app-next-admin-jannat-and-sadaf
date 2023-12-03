import { ScrollArea } from '@mantine/core';
import { IconBrandProducthunt, IconHome, IconUser } from '@tabler/icons-react';

import { LinkGroup, LinksGroup } from '@/src/components/navigation/LinksGroup';

const menu: LinkGroup[] = [
  { label: 'Home', link: '/admin', icon: IconHome },
  { label: 'User', link: '/admin/user', icon: IconUser },
  { label: 'Product', link: '/admin/product', icon: IconBrandProducthunt },
];

export function Navbar() {
  return (
    <ScrollArea>
      <LinksGroup links={menu} />
    </ScrollArea>
  );
}
