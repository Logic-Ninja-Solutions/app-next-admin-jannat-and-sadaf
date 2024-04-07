import { Text, Title } from '@mantine/core';
import classes from './Welcome.module.scss';

export function Welcome({ text }: { text: string }) {
  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Admin Panel <br />
        <Text
          inherit
          variant="gradient"
          component="span"
          gradient={{ from: 'pink', to: 'yellow' }}
        >
          {text}
        </Text>
      </Title>
      <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="xl">
        Manage the website content with ease
      </Text>
    </>
  );
}
