import {
  Box,
  Card,
  Center,
  Chip,
  Divider,
  Flex,
  Group,
  Image,
  Loader,
  Modal,
  Stack,
  Table,
  Text,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { getOrder } from '@/src/actions/order';
import { OrderActionType } from '@/src/actions/order/enums';
import { domain } from '@/src/constants';
import { Order } from '../../types/order';

interface ViweOrderInfoProps {
  opened: boolean;
  onClose: () => void;

  order?: Order;
}

export default function ViewOrderInfoModal({
  opened,
  onClose,
  order,
}: ViweOrderInfoProps) {
  const { data, isLoading } = useQuery({
    queryKey: [OrderActionType.getOrder, order?.id],
    queryFn: () => getOrder(order?.id),
    enabled: !!order?.id,
  });

  const user = data?.user;
  const address = data?.address;
  const items = data?.items;

  return (
    <>
      <Modal opened={opened} onClose={onClose} title="Order Info">
        {isLoading ? (
          <Center>
            <Loader />
          </Center>
        ) : (
          <>
            <Card withBorder shadow="md" radius="md" p="md">
              <Card.Section withBorder inheritPadding py="xs">
                <Text fw={500}>User Info</Text>
              </Card.Section>
              <Stack gap={10}>
                <Group justify="space-between">
                  <Text>First Name</Text>
                  <Text>{user?.firstName}</Text>
                </Group>
                <Group justify="space-between">
                  <Text>Last Name</Text>
                  <Text>{user?.lastName}</Text>
                </Group>

                <Group justify="space-between">
                  <Text>Email</Text>
                  <Text>{user?.email}</Text>
                </Group>

                <Group justify="space-between">
                  <Text>Phone</Text>
                  <Text>{user?.phone}</Text>
                </Group>
              </Stack>
            </Card>

            <Divider my={10} />

            <Card withBorder shadow="md" radius="md" p="md">
              <Card.Section withBorder inheritPadding py="xs">
                <Text fw={500}>Address</Text>
              </Card.Section>
              <Stack gap={10}>
                <Group>
                  <Text>First Name</Text>
                  <Text>{address?.firstName}</Text>
                </Group>
                <Group>
                  <Text>Last Name</Text>
                  <Text>{address?.lastName}</Text>
                </Group>

                <Group>
                  <Text>Address Line 1</Text>
                  <Text>{address?.addressLine1}</Text>
                </Group>

                <Group>
                  <Text>Address Line 2</Text>
                  <Text>{address?.addressLine2}</Text>
                </Group>

                <Group>
                  <Text>City</Text>
                  <Text>{address?.city}</Text>
                </Group>

                <Group>
                  <Text>Zip Code</Text>
                  <Text>{address?.zipCode}</Text>
                </Group>
              </Stack>
            </Card>

            <Divider my={10} />

            <Card withBorder shadow="md" radius="md" p="md">
              <Card.Section withBorder inheritPadding py="xs">
                <Text fw={500}>Items</Text>
              </Card.Section>

              <Divider my={10} />
              {items?.map((item, idx) => (
                <Box key={idx}>
                  <Card>
                    <Flex gap={20} p="md">
                      <Box pos="relative">
                        <Image
                          w={64}
                          h={80}
                          src={item.image}
                          alt="Product Image"
                        />
                        <Chip
                          pos="absolute"
                          style={{
                            top: 0,
                            left: 0,
                            zIndex: 10,
                            marginLeft: '-1rem',
                            marginTop: '-1rem',
                          }}
                        >
                          {item.quantity}
                        </Chip>
                      </Box>

                      <Stack gap={1}>
                        <span>{item.title}</span>
                        <span>{item.variant.size}</span>
                        <Link
                          target="_blank"
                          href={`${domain}/product/${item.slug}`}
                        >
                          View Product
                        </Link>
                      </Stack>
                    </Flex>
                    {item.customSizePreference && (
                      <>
                        Size Preference:{' '}
                        {item.customSizePreference === 'custom'
                          ? 'Custom'
                          : item.customSizePreference === 'callback'
                          ? 'Requested Callback'
                          : ''}
                      </>
                    )}
                    {item.customSizePreference === 'custom' && (
                      <Table>
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Measurement</Table.Th>
                            <Table.Th>Value</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {
                            Object.entries(item.customSizeData).map(([key, value]) => (
                              <Table.Tr key={key}>
                                <Table.Td>{key}</Table.Td>
                                <Table.Td>{value}</Table.Td>
                              </Table.Tr>
                            ))
                          }
                        </Table.Tbody>
                      </Table>
                    )}
                  </Card>
                </Box>
              ))}
            </Card>
          </>
        )}
      </Modal>
    </>
  );
}
