import {
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useEffect } from 'react';
import Types, { UserWithAddresses } from '@/src/types/prisma';
import { createInInfiniteQuery, updateInInfiniteQuery } from '@/src/utils/api/pagination';

interface UserFormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  emailVerified: boolean;
  isStaff: boolean;
  isActive: boolean;
}

type UserFormProps = {
  onSuccess: () => void;
  editData?: Types.User;
};

export default function UserForm({ editData: editUser, onSuccess }: UserFormProps) {
  const theme = useMantineTheme();

  const form = useForm<UserFormValues>({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      emailVerified: false,
      isStaff: true,
      isActive: true,
    },
  });

  async function createUser(values: UserFormValues) {
    try {
      const response = await axios.post('/api/user', values);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create user');
    }
  }
  async function updateUser(values: UserFormValues) {
    try {
      const response = await axios.patch('/api/user', {
        ...values,
        id: editUser?.id,
        password: undefined,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update user');
    }
  }

  const queryClient = useQueryClient();

  const userCreateMutation = useMutation({
    mutationKey: ['create-user'],
    mutationFn: createUser,
    onSuccess(data: Types.User) {
      createInInfiniteQuery(queryClient, ['user'], data);
      form.reset();
      onSuccess();
    },
    onError() {
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    },
  });

  const userUpdateMutation = useMutation({
    mutationKey: ['update-user'],
    mutationFn: updateUser,
    onSuccess(data: Types.User) {
      updateInInfiniteQuery(queryClient, ['user'], data);
      form.reset();
      onSuccess();
    },
    onError() {
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
      });
    },
  });

  async function onSubmit(values: UserFormValues) {
    if (editUser) {
      await userUpdateMutation.mutateAsync(values);
    } else {
      await userCreateMutation.mutateAsync(values);
    }
  }

  useEffect(() => {
    if (editUser) {
      form.setValues({
        email: editUser.email,
        password: '',
        firstName: editUser.firstName,
        lastName: editUser.lastName,
        phone: editUser.phone,
        emailVerified: editUser.emailVerified,
        isStaff: editUser.isStaff,
        isActive: editUser.isActive,
      });
    }
  }, [editUser]);

  function addAddress() {
    form.insertListItem('addresses', {
      addressLine1: '',
      addressLine2: '',
      city: '',
      firstName: '',
      lastName: '',
      contactNumber: '',
      zipCode: '',
    });
  }

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap={10}>
          <Card withBorder shadow="sm" radius="md">
            <TextInput
              mb={15}
              withAsterisk
              label="Email"
              placeholder="john.doe@example.com"
              {...form.getInputProps('email')}
            />
            <PasswordInput
              mb={15}
              withAsterisk
              disabled={editUser !== undefined}
              type="password"
              label="Password"
              placeholder={editUser ? 'Cannot change password' : 'Password for new user'}
              {...form.getInputProps('password')}
            />
            <TextInput
              mb={15}
              withAsterisk
              label="First Name"
              placeholder="John"
              {...form.getInputProps('firstName')}
            />
            <TextInput
              mb={15}
              withAsterisk
              label="Last Name"
              placeholder="Doe"
              {...form.getInputProps('lastName')}
            />
            <TextInput
              mb={15}
              label="Phone"
              placeholder="123-456-7890"
              {...form.getInputProps('phone')}
            />

            <Stack gap={10}>
              <Checkbox
                mt={10}
                style={{ cursor: 'pointer' }}
                label="Email Verified"
                checked={form.values.emailVerified}
                {...form.getInputProps('emailVerified')}
              />
              <Checkbox
                mt={10}
                style={{ cursor: 'pointer' }}
                label="Staff"
                checked={form.values.isStaff}
                {...form.getInputProps('isStaff')}
              />
              <Checkbox
                mt={10}
                style={{ cursor: 'pointer' }}
                label="Active"
                checked={form.values.isActive}
                {...form.getInputProps('isActive')}
              />
            </Stack>
          </Card>

          <Button
            loading={userCreateMutation.isPending || userUpdateMutation.isPending}
            type="submit"
            variant="light"
          >
            {editUser ? 'Update' : 'Create'} User
          </Button>
        </Stack>
      </form>
    </>
  );
}
