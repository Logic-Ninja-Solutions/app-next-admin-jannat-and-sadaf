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
import { IconAt } from '@tabler/icons-react';
import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authenticate } from '@/src/actions/auth';
import classes from './Signin.module.scss';

export interface SignInForm {
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

interface LoginFormState {
  message: string;
}

export default function SignIn() {
  const initialState: LoginFormState | null = {
    message: '',
  };

  const [formState, formAction] = useFormState(authenticate, initialState);
  const router = useRouter();

  useEffect(() => {
    if (formState == null) {
      router.replace('/admin');
    }
  }, [formState]);

  return (
    <Center h="100%">
      <Card radius="md" shadow="md" p="xl">
        <form action={formAction}>
          <Stack w={450} p="xl">
            <Title ta="center" className={classes.title}>
              Sign In
            </Title>
            <Text className={classes.subtitle}>
              Enter your email and password to sign in:
            </Text>

            <TextInput
              name="email"
              leftSection={
                <IconAt style={{ width: rem(16), height: rem(16) }} />
              }
              placeholder="Your email"
            />
            <PasswordInput placeholder="Your password" name="password" />

            {formState && (
              <Text c="red" ta="center">
                {formState?.message}
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
