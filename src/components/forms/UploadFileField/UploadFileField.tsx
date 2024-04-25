import {
  useMantineTheme,
  Card,
  Flex,
  FileButton,
  Button,
  TextInput,
  Box,
  Loader,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconTrash } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import serverInstance from '../../../actions/api';

type FormType<T> = UseFormReturnType<T, (values: T) => T>;

export default function FileUploadField<T>({
  form,
  entity,
  formFieldName,
  formFieldValue,
  onDelete,
  showDelete = true,
}: {
  form: any;
  entity: string;
  formFieldName: string;
  formFieldValue: string;
  showDelete: boolean;
  onDelete: () => void;
}) {
  const [isCompressing, setIsCompressing] = useState(false);
  const { mutate: uploadImage, isPending: isUploading } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await serverInstance.post<{ url: string }>(
        'storage/upload',
        formData
      );
      return {
        url: response.data.url,
      };
    },
    onSuccess({ url }: { url: string }) {
      form.setFieldValue(formFieldName, url);
    },
    onError() {
      notifications.show({
        title: 'Error',
        message: 'Failed to upload image',
        color: 'red',
      });
    },
  });

  const { mutateAsync: deleteImage, isPending: isDeleting } = useMutation({
    mutationFn: async (url: string) => {
      await serverInstance.delete<void>(
        `storage/delete/${url.split('/').pop()}`
      );
    },
    onSuccess() {
      notifications.show({
        title: 'Image Delete',
        message: 'Image deleted successfully',
      });
    },
    onError() {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete image',
        color: 'red',
      });
    },
  });

  const theme = useMantineTheme();

  return (
    <Card.Section p="sm">
      <Flex justify="center" align="center" wrap="wrap" gap={10}>
        <Card w="1000px" withBorder shadow="xl" radius="md">
          <FileButton
            accept="image/png,image/jpeg"
            onChange={async (uploadedFile: File | null) => {
              if (!uploadedFile) return;
              const originalFileName = `${entity}-${uploadedFile.name}`;
              console.log('Uploaded file', originalFileName);
              const options = {
                maxSizeMB: 1,
              };
              setIsCompressing(true);
              await imageCompression(uploadedFile, options)
                .then(async (file) => {
                  const compressedFile = new File([file], originalFileName, {
                    type: file.type,
                  });
                  const fileSize = file.size / 1024 / 1024;
                  setIsCompressing(false);
                  console.log(`compressedFile size ${fileSize} MB`);
                  notifications.show({
                    title: 'Image Upload',
                    message: `Image size reduced to ${fileSize.toFixed(2)} MB`,
                  });
                  if (compressedFile) {
                    uploadImage(compressedFile);
                  }
                })
                .catch((e) => {
                  notifications.show({
                    title: 'Error',
                    message: 'Failed to compress image',
                    color: 'red',
                  });
                  console.error(e);
                })
                .finally(() => {
                  setIsCompressing(false);
                });
            }}
          >
            {(props) => (
              <Button
                {...props}
                loading={isUploading || isCompressing}
                disabled={isUploading || isCompressing}
              >
                Upload image
              </Button>
            )}
          </FileButton>
          <TextInput
            disabled
            label="image"
            placeholder="Inage Url"
            withAsterisk
            {...form.getInputProps(formFieldName)}
          />
        </Card>

        {showDelete && (
          <Box maw={30}>
            {isDeleting ? (
              <Loader size="xs" color="red" />
            ) : (
              <IconTrash
                onClick={async () => {
                  await deleteImage(formFieldValue);
                  onDelete();
                }}
                className="clickable"
                color={theme.colors.red[3]}
              />
            )}
          </Box>
        )}
      </Flex>
    </Card.Section>
  );
}
