import { Text, Button, Center, PasswordInput, Stack, TextInput, Title, rem } from '@mantine/core';
import { IconAt } from '@tabler/icons-react';
import Link from 'next/link';
import classes from './Signup.module.scss';

export default function Signup() {
  return (
    <Center h="100%">
      <Stack w={450}>
        <Title ta="center" className={classes.title}>
          Signup
        </Title>
        <Text className={classes.subtitle}>Enter your email and password to login:</Text>

        <TextInput placeholder="Admin Secret Key" />
        <TextInput placeholder="First Name" />
        <TextInput placeholder="Last Name" />
        <TextInput
          leftSection={<IconAt style={{ width: rem(16), height: rem(16) }} />}
          placeholder="Your email"
        />
        <PasswordInput placeholder="Your password" />
        <PasswordInput placeholder="Confirm password" />

        <Button fullWidth>Create an Account</Button>

        <Text className={classes.signupText} ta="center">
          Already have an account?
          <Text className={classes.signupLink} component={Link} href="login">
            {' '}
            Login
          </Text>
        </Text>
      </Stack>
    </Center>
  );
}
