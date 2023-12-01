import { Box, Divider, NavLink } from '@mantine/core';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import classes from './LinksGroup.module.scss';
import linkStyles from './link.module.scss';

export interface LinkGroup {
  icon: React.FC<any>;
  link: string;
  iconColor?: string;
  label: string;

  subLinks?: {
    link: string;
    label: string;
  }[];
}

interface Props {
  links: LinkGroup[];
}

export function LinksGroup({ links }: Props) {
  const [active, setActive] = useState<undefined | number>(undefined);
  const [activeSub, setActiveSub] = useState<number | undefined>(undefined);

  const pathname = usePathname();

  return (
    <>
      {links.map((link, index) => {
        const isActive = pathname === link.link || active === index;
        return (
          <Box>
            <NavLink
              key={index}
              childrenOffset={30}
              className={clsx(isActive && classes.activeLink)}
              defaultOpened
              active={isActive}
              onClick={() => {
                if (!link?.subLinks?.length) {
                  setActive(index);
                  setActiveSub(undefined);
                }
              }}
              leftSection={<link.icon />}
              label={link.label}
              component={Link}
              href={link.subLinks ? '#' : link.link}
              classNames={linkStyles}
            >
              {link.subLinks?.map((item, subIndex) => {
                const isSubActive = pathname === item.link || activeSub === subIndex;

                return (
                  <Box pl="md" key={item.label} className={classes.subLinkContainer}>
                    <NavLink
                      active={isSubActive}
                      key={item.label}
                      onClick={() => {
                        setActiveSub(subIndex);
                        setActive(undefined);
                      }}
                      className={clsx(isSubActive && classes.activeLink)}
                      component={Link}
                      href={item.link}
                      label={item.label}
                      classNames={linkStyles}
                    />
                  </Box>
                );
              })}
            </NavLink>
            <Divider />
          </Box>
        );
      })}
    </>
  );
}
