import {
  Box,
  Button,
  Card,
  Checkbox,
  Flex,
  Grid,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import TextEditor from '../../core/RichTextEditor';

import classes from './styles.module.scss';

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
}

export default function ProductForm() {
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
      title: '',
      description: '',
      variants: [],
      images: [],
    },
  });
  function onSubmit(values: ProductFormValues) {
    console.log('here', values);
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
      quantity: 0,
      price: 0,
      isAvailable: false,
    });
  }

  function addImage() {
    form.insertListItem('images', '');
  }

  return (
    <>
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
            <Text size="sm">Description:</Text>
            <TextEditor editor={editor} />
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

          <Button type="submit" variant="light">
            Submit
          </Button>
        </Stack>
      </form>
    </>
  );
}
