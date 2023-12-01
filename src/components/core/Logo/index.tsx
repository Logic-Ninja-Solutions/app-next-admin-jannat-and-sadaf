'use client';

import { Image } from '@mantine/core';
import Link from 'next/link';
import * as React from 'react';
import cx from 'clsx';
import classes from './Logo.module.scss';

const logoWhite = 'logo-cropped-white-no-bg.png';
const logoBlack = 'logo-cropped-no-bg.png';

export function Logo() {
  return (
    <Link href="/">
      <Image
        w={100}
        className={cx(classes.icon, classes.light)}
        src={logoWhite}
        alt="Jannat & Sadaf"
      />
      <Image
        w={100}
        className={cx(classes.icon, classes.dark)}
        src={logoBlack}
        alt="Jannat & Sadaf"
      />
    </Link>
  );
}
