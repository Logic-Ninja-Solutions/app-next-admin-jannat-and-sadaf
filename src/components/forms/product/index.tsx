import {
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  NumberInput,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link } from '@mantine/tiptap';
import Types from '@src/types/prisma';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Highlight from '@tiptap/extension-highlight';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import axios from 'axios';
import { notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { createInInfiniteQuery, updateInInfiniteQuery } from '@/src/utils/api/pagination';
import TextEditor from '../../core/RichTextEditor';
import { ProductActionType } from '@/src/actions/product/enums';
import { createSample } from '@/src/actions/product';

interface ProductVariant {
  size: string;
  quantity: number;
  price: number;
  isAvailable: boolean;
}

interface ProductFormValues {
  title: string;
  description: string;
  images: string[];
  variants: ProductVariant[];
  isAvailable: boolean;
  code: string;
}

type ProductFormProps = {
  editData?: Types.Product;
  onSuccess: () => void;
};

export default function ProductForm({ editData, onSuccess }: ProductFormProps) {
  const theme = useMantineTheme();
  const initialContent = '';
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: initialContent,
  });

  const form = useForm<ProductFormValues>({
    initialValues: {
      title: editData?.title || '',
      code: editData?.code || '',
      description: editData?.description || '',
      variants: editData?.variants || [],
      images: editData?.images || [],
      isAvailable: editData?.isAvailable || false,
    },
  });

  useEffect(() => {
    if (editData) {
      editor?.commands.setContent(editData.description);
      form.setValues({
        title: editData.title,
        code: editData.code,
        description: editData.description,
        variants: editData.variants,
        images: editData.images,
        isAvailable: editData.isAvailable,
      });
    }
  }, [editData, editor]);

  async function createProduct(values: ProductFormValues) {
    const response = await axios.post('/api/product', values);
    return response.data;
  }

  async function updateProduct(values: ProductFormValues) {
    const response = await axios.patch('/api/product', {
      ...values,
      id: editData?.id,
    });
    return response.data;
  }

  const queryClient = useQueryClient();

  const productCreateMutation = useMutation({
    mutationKey: [ProductActionType.createProduct],
    mutationFn: createProduct,
    onSuccess(data: Types.Product) {
      createInInfiniteQuery(queryClient, [ProductActionType.fetchProducts], data);
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

  const productUpdateMutation = useMutation({
    mutationKey: [ProductActionType.updateProduct],
    mutationFn: updateProduct,
    onSuccess(data: Types.Product) {
      updateInInfiniteQuery(queryClient, [ProductActionType.fetchProducts], data);
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

  async function onSubmit(values: ProductFormValues) {
    if (editData) {
      await productUpdateMutation.mutateAsync(values);
      return;
    }
    await productCreateMutation.mutateAsync(values);
  }

  form.values.description = editor?.getHTML() || '';

  const variantFields = form.values.variants.map((item, index) => (
    <Card.Section key={index} p="sm">
      <Flex justify="center" align="center" wrap="wrap" gap={10}>
        <Card w="1000px" withBorder shadow="xl" radius="md">
          <Stack gap={10} p="sm">
            <TextInput
              label="Size"
              placeholder="Size Name (e.g. S, M, or, Custom)"
              withAsterisk
              {...form.getInputProps(`variants.${index}.size`)}
            />
            <NumberInput
              label="Price"
              placeholder="Price (e.g. 1000)"
              withAsterisk
              {...form.getInputProps(`variants.${index}.price`)}
            />
            <NumberInput
              label="Quantity"
              placeholder="Quantity (e.g. 10)"
              withAsterisk
              {...form.getInputProps(`variants.${index}.quantity`)}
            />
            <Checkbox
              mt={5}
              style={{ cursor: 'pointer' }}
              label="Available"
              checked={form.values.variants[index].isAvailable}
              {...form.getInputProps(`variants.${index}.isAvailable`)}
            />
          </Stack>
        </Card>
        <Box maw={30}>
          <IconTrash
            onClick={() => form.removeListItem('variants', index)}
            className="clickable"
            color={theme.colors.red[3]}
          />
        </Box>
      </Flex>
    </Card.Section>
  ));

  const imageFields = form.values.images.map((item, index) => (
    <Card.Section key={index} p="sm">
      <Flex justify="center" align="center" wrap="wrap" gap={10}>
        <Card w="1000px" withBorder shadow="xl" radius="md">
          <TextInput
            label="image"
            placeholder="Inage Url"
            withAsterisk
            {...form.getInputProps(`images.${index}`)}
          />
        </Card>
        <Box maw={30}>
          <IconTrash
            onClick={() => form.removeListItem('images', index)}
            className="clickable"
            color={theme.colors.red[3]}
          />
        </Box>
      </Flex>
    </Card.Section>
  ));

  function addVariant() {
    form.insertListItem('variants', {
      size: '',
      quantity: null,
      price: null,
      isAvailable: true,
    });
  }

  function addImage() {
    form.insertListItem('images', '');
  }

  const mutation = useMutation({
    mutationKey: ['sample-products'],
    mutationFn: createSample,
  });

  async function createHardCodedProducts() {
    await mutation.mutateAsync();
  }

  return (
    <>
      {/* <Button loading={mutation.isPending} onClick={createHardCodedProducts}>
        Create Sample
      </Button> */}
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap={10}>
          <Card withBorder shadow="sm" radius="md">
            <TextInput
              mb={15}
              withAsterisk
              label="Title"
              placeholder="Stylish Kurta"
              {...form.getInputProps('title')}
            />
            <TextInput
              mb={15}
              withAsterisk
              label="Code"
              placeholder="Product Code (e.g. 1234)"
              {...form.getInputProps('code')}
            />
            <Text size="sm">Description:</Text>
            <TextEditor editor={editor} />

            <Checkbox
              mt={10}
              style={{ cursor: 'pointer' }}
              label="Available"
              checked={form.values.isAvailable}
              {...form.getInputProps('isAvailable')}
            />
          </Card>
          <Card withBorder shadow="sm" radius="md">
            <Card.Section withBorder inheritPadding py="xs">
              Variants
            </Card.Section>
            <Card.Section>
              <Flex p="sm" className="clickable" onClick={addVariant}>
                <IconPlus />
                <Text>Add options like size or color</Text>
              </Flex>
            </Card.Section>
            {variantFields}
          </Card>

          <Card withBorder shadow="sm" radius="md">
            <Card.Section withBorder inheritPadding py="xs">
              Media
            </Card.Section>
            <Card.Section>
              <Flex p="sm" className="clickable" onClick={addImage}>
                <IconPlus />
                <Text>Add Media</Text>
              </Flex>
            </Card.Section>
            {imageFields}
          </Card>

          <Button
            loading={productCreateMutation.isPending || productUpdateMutation.isPending}
            type="submit"
            variant="light"
          >
            Submit
          </Button>
        </Stack>
      </form>
    </>
  );
}
