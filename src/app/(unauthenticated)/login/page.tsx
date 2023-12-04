'use client';

import {
  Button,
  Card,
  Center,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  rem,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAt } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import classes from './Signin.module.scss';
import { authenticate } from '@/src/actions/auth';

interface SignInForm {
  email: string;
  password: string;
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button loading={pending} fullWidth type="submit">
      Sign In
    </Button>
  );
}

export default function SignIn() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    <Center h="100%">
      <Card radius="md" shadow="md" p="xl">
        <form action={dispatch}>
          <Stack w={450} p="xl">
            <Title ta="center" className={classes.title}>
              Sign In
            </Title>
            <Text className={classes.subtitle}>Enter your email and password to sign in:</Text>

            <TextInput
              name="email"
              leftSection={<IconAt style={{ width: rem(16), height: rem(16) }} />}
              placeholder="Your email"
            />
            <PasswordInput placeholder="Your password" name="password" />

            {errorMessage && (
              <Text c="red" ta="center">
                {errorMessage}
              </Text>
            )}

            <LoginButton />

            {/* <Text className={classes.signupText} ta="center">
              Don&apos;t have an account?
              <Text className={classes.signupLink} component={Link} href="signup">
                {' '}

              </Text>
            </Text> */}
          </Stack>
        </form>
      </Card>
    </Center>
  );
}
