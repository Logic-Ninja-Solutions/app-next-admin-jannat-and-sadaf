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
import classes from './Signin.module.scss';

interface SignInForm {
  email: string;
  password: string;
}

export default function SignIn() {
  const form = useForm<SignInForm>({
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value.length >= 6 ? null : 'Password should be at least 6 characters long',
    },
  });

  async function login(data: SignInForm) {
    const response = await signIn('credentials', { ...data, redirect: false });
    if (!response?.ok) throw new Error(response?.error ?? 'Unknown error');
    return response;
  }

  const signInMutation = useMutation({
    mutationKey: ['sign-in'],
    mutationFn: (values: SignInForm) => login(values),
    onSuccess: () => {
      console.log('success');
    },
    onError: () => {
      console.log('error');
    },
  });

  return (
    <Center h="100%">
      <Card radius="md" shadow="md" p="xl">
        <form onSubmit={form.onSubmit((values) => signInMutation.mutate(values))}>
          <Stack w={450} p="xl">
            <Title ta="center" className={classes.title}>
              Sign In
            </Title>
            <Text className={classes.subtitle}>Enter your email and password to sign in:</Text>

            <TextInput
              leftSection={<IconAt style={{ width: rem(16), height: rem(16) }} />}
              placeholder="Your email"
              {...form.getInputProps('email')}
            />
            <PasswordInput placeholder="Your password" {...form.getInputProps('password')} />

            <Button loading={signInMutation.isPending} fullWidth type="submit">
              Sign In
            </Button>

            {signInMutation.isError && (
              <Text c="red" ta="center">
                User name or password is incorrect
              </Text>
            )}

            <Text className={classes.signupText} ta="center">
              Don&apos;t have an account?
              <Text className={classes.signupLink} component={Link} href="signup">
                {' '}
                Sign up
              </Text>
            </Text>
          </Stack>
        </form>
      </Card>
    </Center>
  );
}
