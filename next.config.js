/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    prependData: `@import "./_mantine.scss";`,
  },
};

module.exports = nextConfig;
