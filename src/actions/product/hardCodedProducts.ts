import { Prisma } from '@prisma/client';
import { prisma } from '@/server';

const hardCodedDescription =
  '<p>This Nimr is crafted from jamawar and embroidered using age-old craftsmanship, combining resham, and zardozi work. Paired with a crafted izaar, and a contrasting gossamer organza dupatta, as shown here: </br></br> </p><ul><li>Crimson jamawar</li><li>Rose bud organza</li><li>Dry clean only</li></ul></br> <p>Lead time: 10 to 12 weeks from the time of purchase. A measurement form will be sent upon order.</p>';
const imageSet1 = [
  'https://www.mishalakhani.com/cdn/shop/files/10-B_21824d2f-46e5-48ee-934a-c9c261517e0f.jpg?v=1683652977&width=1400',
  'https://www.mishalakhani.com/cdn/shop/files/10-C_968594e3-31d9-4fdf-8e3f-1b2c77ae1755.jpg?v=1683647643&width=1400',
  'https://www.mishalakhani.com/cdn/shop/files/10-D_842b2a95-b8e1-4c86-a002-0e658b056a15.jpg?v=1683647644&width=1400',
  'https://www.mishalakhani.com/cdn/shop/files/10-E_b487621c-7956-4292-bf24-b1d4fe6a38ab.jpg?v=1683647644&width=1400',
];
const imageSet2 = [
  'https://pk.saniamaskatiya.com/cdn/shop/files/051A4824_6d1e4621-958b-47b9-a5a2-b15f8b8b5eb0.jpg?v=1696848913',
  'https://pk.saniamaskatiya.com/cdn/shop/files/051A4818_f3cb4c58-5ea8-4c60-9765-a6d4e689263c_1024x1024.jpg?v=1696848913',
  'https://pk.saniamaskatiya.com/cdn/shop/files/051A4838_078d407f-dfee-416d-bcf5-1be70ee7c772.jpg?v=1696848913',
];
const imageSet3 = [
  'https://www.mishalakhani.com/cdn/shop/files/4-A_536b64c8-a984-42f0-80d3-3d109563f18d.jpg?v=1701156656&width=1400',
  'https://www.mishalakhani.com/cdn/shop/files/4-B_e27cae96-b802-4c64-902e-d220ec2a66d8.jpg?v=1701156656&width=1400',
  'https://www.mishalakhani.com/cdn/shop/files/4-C_5ad7e83a-e805-4260-a2d0-9001079894b4.jpg?v=1701156656&width=1400',
  'https://www.mishalakhani.com/cdn/shop/files/4-D_b55fe397-446a-4f5c-94f2-e24b9084570f.jpg?v=1701156656&width=1400',
];

type ProdudctCreatePayload = Prisma.Args<typeof prisma.product, 'create'>['data'];

export const hardCodedProducts: ProdudctCreatePayload[] = [
  {
    title: 'Testing Product 1',
    description: hardCodedDescription,
    slug: 'testing-product-1',
    code: '123456',
    isAvailable: true,
    images: imageSet1,
    variants: [
      {
        size: 'S',
        quantity: 0,
        price: 1000,
        isAvailable: true,
      },
      {
        size: 'M',
        quantity: 6,
        price: 1000,
        isAvailable: false,
      },
      {
        size: 'L',
        quantity: 7,
        price: 1200,
        isAvailable: true,
      },
      {
        size: 'Custom',
        quantity: 7,
        price: 1300,
        isAvailable: true,
      },
    ],
  },

  {
    title: 'Testing Product 2',
    description: hardCodedDescription,
    slug: 'testing-product-2',
    code: '123456',
    isAvailable: true,
    images: imageSet2,
    variants: [
      {
        size: 'S',
        quantity: 4,
        price: 1000,
        isAvailable: true,
      },
      {
        size: 'M',
        quantity: 6,
        price: 1000,
        isAvailable: true,
      },
      {
        size: 'L',
        quantity: 7,
        price: 1200,
        isAvailable: true,
      },
      {
        size: 'Custom',
        quantity: 7,
        price: 1300,
        isAvailable: true,
      },
    ],
  },

  {
    title: 'Testing Product 3',
    description: hardCodedDescription,
    slug: 'testing-product-3',
    code: '123456',
    isAvailable: true,
    images: imageSet3,
    variants: [
      {
        size: 'S',
        quantity: 4,
        price: 1000,
        isAvailable: true,
      },
      {
        size: 'M',
        quantity: 6,
        price: 1000,
        isAvailable: true,
      },
      {
        size: 'L',
        quantity: 7,
        price: 1200,
        isAvailable: true,
      },
      {
        size: 'Custom',
        quantity: 7,
        price: 1300,
        isAvailable: true,
      },
    ],
  },

  {
    title: 'Testing Product 4',
    description: hardCodedDescription,
    slug: 'testing-product-4',
    code: '123456',
    isAvailable: true,
    images: imageSet1,
    variants: [
      {
        size: 'S',
        quantity: 4,
        price: 1000,
        isAvailable: true,
      },
      {
        size: 'M',
        quantity: 6,
        price: 1000,
        isAvailable: true,
      },
      {
        size: 'L',
        quantity: 7,
        price: 1200,
        isAvailable: true,
      },
      {
        size: 'Custom',
        quantity: 7,
        price: 1300,
        isAvailable: true,
      },
    ],
  },

  {
    title: 'Testing Product 5',
    description: hardCodedDescription,
    slug: 'testing-product-5',
    code: '123456',
    isAvailable: true,
    images: imageSet2,
    variants: [
      {
        size: 'S',
        quantity: 4,
        price: 1000,
        isAvailable: true,
      },
      {
        size: 'M',
        quantity: 6,
        price: 1000,
        isAvailable: true,
      },
      {
        size: 'L',
        quantity: 7,
        price: 1200,
        isAvailable: true,
      },
      {
        size: 'Custom',
        quantity: 7,
        price: 1300,
        isAvailable: true,
      },
    ],
  },

  {
    title: 'Testing Product 6',
    description: hardCodedDescription,
    slug: 'testing-product-6',
    code: '123456',
    isAvailable: true,
    images: imageSet3,
    variants: [
      {
        size: 'S',
        quantity: 4,
        price: 1000,
        isAvailable: true,
      },
      {
        size: 'M',
        quantity: 6,
        price: 1000,
        isAvailable: true,
      },
      {
        size: 'L',
        quantity: 7,
        price: 1200,
        isAvailable: true,
      },
      {
        size: 'Custom',
        quantity: 7,
        price: 1300,
        isAvailable: true,
      },
    ],
  },

  {
    title: 'Testing Product 7',
    description: hardCodedDescription,
    slug: 'testing-product-7',
    code: '123456',
    isAvailable: true,
    images: imageSet1,
    variants: [
      {
        size: 'S',
        quantity: 0,
        price: 1000,
        isAvailable: false,
      },
      {
        size: 'M',
        quantity: 6,
        price: 1000,
        isAvailable: true,
      },
      {
        size: 'L',
        quantity: 7,
        price: 1200,
        isAvailable: true,
      },
      {
        size: 'Custom',
        quantity: 7,
        price: 1300,
        isAvailable: true,
      },
    ],
  },

  {
    title: 'Testing Product 8',
    description: hardCodedDescription,
    slug: 'testing-product-8',
    code: '123456',
    isAvailable: true,
    images: imageSet2,
    variants: [
      {
        size: 'XS',
        quantity: 4,
        price: 1000,
        isAvailable: true,
      },
      {
        size: 'L',
        quantity: 7,
        price: 1200,
        isAvailable: true,
      },
      {
        size: 'Custom',
        quantity: 7,
        price: 1300,
        isAvailable: true,
      },
    ],
  },

  {
    title: 'Testing Product 9',
    description: hardCodedDescription,
    slug: 'testing-product-9',
    code: '123456',
    isAvailable: true,
    images: imageSet3,
    variants: [
      {
        size: 'S',
        quantity: 4,
        price: 1000,
        isAvailable: true,
      },
      {
        size: 'L',
        quantity: 7,
        price: 1200,
        isAvailable: true,
      },
      {
        size: 'Custom',
        quantity: 7,
        price: 1300,
        isAvailable: true,
      },
    ],
  },

  {
    title: 'Testing Product 10',
    description: hardCodedDescription,
    slug: 'testing-product-10',
    code: '123456',
    isAvailable: true,
    images: imageSet1,
    variants: [
      {
        size: 'S',
        quantity: 4,
        price: 1000,
        isAvailable: true,
      },
      {
        size: 'M',
        quantity: 6,
        price: 1000,
        isAvailable: true,
      },
      {
        size: 'L',
        quantity: 7,
        price: 1200,
        isAvailable: true,
      },
      {
        size: 'Custom',
        quantity: 7,
        price: 1300,
        isAvailable: true,
      },
    ],
  },

  {
    title: 'Testing Product 11',
    description: hardCodedDescription,
    slug: 'testing-product-11',
    code: '123456',
    isAvailable: true,
    images: imageSet2,
    variants: [
      {
        size: 'S',
        quantity: 20,
        price: 1000,
        isAvailable: true,
      },
    ],
  },

  {
    title: 'Testing Product 12',
    description: hardCodedDescription,
    slug: 'testing-product-12',
    code: '123456',
    isAvailable: true,
    images: imageSet3,
    variants: [
      {
        size: 'Custom',
        quantity: 7,
        price: 1500,
        isAvailable: true,
      },
    ],
  },
];
