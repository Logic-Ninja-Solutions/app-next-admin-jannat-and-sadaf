import { Button, Card, Checkbox, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import {
  createInInfiniteQuery,
  updateInInfiniteQuery,
} from '@/src/utils/api/pagination';
import serverInstance from '../../../actions/api';
import { CollectionActionType } from '../../../actions/collection/enums';
import { Collection } from '../../../types/collection';
import FileUploadField from '../UploadFileField/UploadFileField';

interface CollectionFormValues {
  title: string;
  image: string;
  isAvailable: boolean;
}

type FormProps = {
  onSuccess: () => void;
  editData?: Collection;
};

export default function CollectionForm({ editData, onSuccess }: FormProps) {
  const form = useForm<CollectionFormValues>({
    initialValues: {
      title: '',
      image: '',
      isAvailable: true,
    },
  });

  async function createCollection(values: CollectionFormValues) {
    try {
      const response = await serverInstance.post('collection', values);
      return response.data;
    } catch (error) {
      throw new Error('Failed to create collection');
    }
  }
  async function updateCollection(values: CollectionFormValues) {
    try {
      const response = await serverInstance.patch(
        `collection/${editData?.id}`,
        values
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to update collection');
    }
  }

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationKey: ['create-collection'],
    mutationFn: createCollection,
    onSuccess(data: Collection) {
      createInInfiniteQuery(
        queryClient,
        [CollectionActionType.fetchCollections],
        data
      );
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

  const updateMutation = useMutation({
    mutationKey: ['update-collection'],
    mutationFn: updateCollection,
    onSuccess(data: Collection) {
      updateInInfiniteQuery(
        queryClient,
        [CollectionActionType.fetchCollections],
        data
      );
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

  async function onSubmit(values: CollectionFormValues) {
    if (editData) {
      await updateMutation.mutateAsync(values);
    } else {
      await createMutation.mutateAsync(values);
    }
  }

  useEffect(() => {
    if (editData) {
      form.setValues({
        title: editData.title,
        image: editData.image,
      });
    }
  }, [editData]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap={10}>
          <Card withBorder shadow="sm" radius="md">
            <TextInput
              mb={15}
              withAsterisk
              label="Title"
              placeholder="Collection Title"
              {...form.getInputProps('title')}
            />

            <FileUploadField
              form={form}
              entity="collection"
              onDelete={() => {
                form.setFieldValue('image', '');
              }}
              showDelete={!!form.values.image && form.values.image !== ''}
              formFieldName="image"
              formFieldValue={form.values.image}
            />

            <TextInput
              mb={15}
              disabled
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
            loading={createMutation.isPending || updateMutation.isPending}
            type="submit"
            variant="light"
          >
            {editData ? 'Update' : 'Create'} Collection
          </Button>
        </Stack>
      </form>
    </>
  );
}
