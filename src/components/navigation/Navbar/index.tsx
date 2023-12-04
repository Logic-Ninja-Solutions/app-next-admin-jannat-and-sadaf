import { ScrollArea } from '@mantine/core';
import { IconClothesRack, IconHome, IconManualGearbox, IconUser } from '@tabler/icons-react';

import { LinkGroup, LinksGroup } from '@/src/components/navigation/LinksGroup';

const menu: LinkGroup[] = [
  { label: 'Home', link: '/admin', icon: IconHome },
  { label: 'User', link: '/admin/user', icon: IconUser },
  { label: 'Product', link: '/admin/product', icon: IconClothesRack },
  { label: 'Order', link: '/admin/order', icon: IconManualGearbox },
];

export function Navbar() {
  return (
    <ScrollArea>
      <LinksGroup links={menu} />
    </ScrollArea>
  );
}
