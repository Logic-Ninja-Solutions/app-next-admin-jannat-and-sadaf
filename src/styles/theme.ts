'use client';

import { Button, Chip, Input, TextInput, createTheme } from '@mantine/core';
import { fontStyle } from './font';
import classes from './theme.module.scss';

const extendedInput = {
  classNames: {
    input: classes.input,
  },
  defaultProps: {
    radius: 'md',
    variant: 'filled',
  },
};

export const theme = createTheme({
  fontFamily: fontStyle,

  components: {
    Button: Button.extend({
      defaultProps: {
        radius: 'md',
        variant: 'filled',
      },
    }),
    Chip: Chip.extend({
      defaultProps: {
        checked: false,
        radius: 'md',
        variant: 'filled',
      },
    }),

    Input: Input.extend(extendedInput),
    TextInput: TextInput.extend(extendedInput),
  },
});
