import { Montserrat } from 'next/font/google';

export const font = Montserrat({
  subsets: ['latin'],
  display: 'swap',
});

export const fontStyle = font.style.fontFamily;
export const fontClass = font.className;
