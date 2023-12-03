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
import Types from '@/src/types/prisma';
import { createInInfiniteQuery, updateInInfiniteQuery } from '@/src/utils/api/pagination';

interface UserFormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  addresses: Types.Address[];
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
      addresses: [],
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
        addresses: editUser.addresses,
        emailVerified: editUser.emailVerified,
        isStaff: editUser.isStaff,
        isActive: editUser.isActive,
      });
    }
  }, [editUser]);

  const addressFields = form.values.addresses.map((item, index) => (
    <Card.Section key={index} p="sm">
      <Flex justify="center" align="center" wrap="wrap" gap={10}>
        <Card w="1000px" withBorder shadow="xl" radius="md">
          <Stack gap={10} p="sm">
            <TextInput
              label="Address Line 1"
              placeholder="123 Main St"
              withAsterisk
              {...form.getInputProps(`addresses.${index}.addressLine1`)}
            />
            <TextInput
              label="Address Line 2"
              placeholder="Apt 456"
              {...form.getInputProps(`addresses.${index}.addressLine2`)}
            />
            <TextInput
              label="Area"
              placeholder="Downtown"
              withAsterisk
              {...form.getInputProps(`addresses.${index}.area`)}
            />
            <TextInput
              label="City"
              placeholder="City"
              withAsterisk
              {...form.getInputProps(`addresses.${index}.city`)}
            />
            <TextInput
              label="First Name"
              placeholder="John"
              withAsterisk
              {...form.getInputProps(`addresses.${index}.firstName`)}
            />
            <TextInput
              label="Last Name"
              placeholder="Doe"
              withAsterisk
              {...form.getInputProps(`addresses.${index}.lastName`)}
            />
            <TextInput
              label="Contact Number"
              placeholder="123-456-7890"
              withAsterisk
              {...form.getInputProps(`addresses.${index}.contactNumber`)}
            />
            <TextInput
              label="ZIP Code"
              placeholder="12345"
              withAsterisk
              {...form.getInputProps(`addresses.${index}.zipCode`)}
            />
            <TextInput
              label="Landmark"
              placeholder="Nearby Park"
              {...form.getInputProps(`addresses.${index}.landmark`)}
            />
          </Stack>
        </Card>
        <Box maw={30}>
          <IconTrash
            onClick={() => form.removeListItem('addresses', index)}
            className="clickable"
            color={theme.colors.red[3]}
          />
        </Box>
      </Flex>
    </Card.Section>
  ));

  function addAddress() {
    form.insertListItem('addresses', {
      addressLine1: '',
      addressLine2: '',
      area: '',
      city: '',
      firstName: '',
      lastName: '',
      contactNumber: '',
      zipCode: '',
      landmark: '',
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

            <Card withBorder shadow="sm" radius="md" mt="xs" mb="xs">
              <Card.Section withBorder inheritPadding py="xs">
                Addresses
              </Card.Section>
              <Card.Section>
                <Flex p="sm" className="clickable" onClick={addAddress}>
                  <IconPlus />
                  <Text>Add Address </Text>
                </Flex>
              </Card.Section>
              {addressFields}
            </Card>

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
