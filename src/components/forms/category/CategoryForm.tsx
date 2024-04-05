import { Button, Card, Checkbox, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { createInInfiniteQuery, updateInInfiniteQuery } from '@/src/utils/api/pagination';
import Types from '@/src/types/prisma';
import { CategoryActionType } from '../../../actions/category/enums';

interface CategoryFormValues {
  title: string;
  image: string;
  isAvailable: boolean;
}

type CategoryFormProps = {
  onSuccess: () => void;
  editData?: Types.Category;
};

export default function CategoryForm({ editData: editCategory, onSuccess }: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    initialValues: {
      title: '',
      image: '',
      isAvailable: true,
    },
  });

  async function createCategory(values: CategoryFormValues) {
    try {
      const response = await axios.post('/api/category', values);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create category');
    }
  }
  async function updateCategory(values: CategoryFormValues) {
    try {
      const response = await axios.patch('/api/category', {
        ...values,
        id: editCategory?.id,
        password: undefined,
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to update category');
    }
  }

  const queryClient = useQueryClient();

  const categoryCreateMutation = useMutation({
    mutationKey: ['create-category'],
    mutationFn: createCategory,
    onSuccess(data: Types.Category) {
      createInInfiniteQuery(queryClient, [CategoryActionType.fetchCategorys], data);
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

  const categoryUpdateMutation = useMutation({
    mutationKey: ['update-category'],
    mutationFn: updateCategory,
    onSuccess(data: Types.Category) {
      updateInInfiniteQuery(queryClient, [CategoryActionType.fetchCategorys], data);
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

  async function onSubmit(values: CategoryFormValues) {
    if (editCategory) {
      await categoryUpdateMutation.mutateAsync(values);
    } else {
      await categoryCreateMutation.mutateAsync(values);
    }
  }

  useEffect(() => {
    if (editCategory) {
      form.setValues({
        title: editCategory.title,
        image: editCategory.image,
      });
    }
  }, [editCategory]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap={10}>
          <Card withBorder shadow="sm" radius="md">
            <TextInput
              mb={15}
              withAsterisk
              label="Title"
              placeholder="Category Title"
              {...form.getInputProps('title')}
            />
            <TextInput
              mb={15}
              withAsterisk
              label="Image"
              placeholder="Image"
              {...form.getInputProps('image')}
            />
            <Checkbox
              mt={5}
              style={{ cursor: 'pointer' }}
              label="Available"
              checked={form.values.isAvailable}
              {...form.getInputProps('isAvailable')}
            />
          </Card>

          <Button
            loading={categoryCreateMutation.isPending || categoryUpdateMutation.isPending}
            type="submit"
            variant="light"
          >
            {editCategory ? 'Update' : 'Create'} Category
          </Button>
        </Stack>
      </form>
    </>
  );
}
