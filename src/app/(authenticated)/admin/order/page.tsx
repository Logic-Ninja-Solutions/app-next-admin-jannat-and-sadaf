'use client';

import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Stack,
  Text,
} from '@mantine/core';
import * as Types from '@prisma/client';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { OrderActionType, OrderStatus } from '@/src/actions/order/enums';
import InfiniteRender from '@/src/components/InfiniteRender';
import ViewOrderInfoModal from '@/src/components/ViewOrderModal';
import { updateStatus as updateOrderStatus } from '@/src/actions/order';
import { updateInInfiniteQuery } from '@/src/utils/api/pagination';

interface OrderInfoProps {
  order: Types.Order;
  onViewOrder: () => void;
}

function OrderInfo({ order, onViewOrder }: OrderInfoProps) {
  const queryClient = useQueryClient();

  const changeStatusMutation = useMutation({
    mutationKey: [OrderActionType.updateStatus, order.id],
    mutationFn: (status: OrderStatus) => updateOrderStatus(order.id, status),
    onSuccess: (updatedOrder: Types.Order) => {
      queryClient.setQueryData([OrderActionType.getOrder, order.id], updatedOrder);
      updateInInfiniteQuery(queryClient, [OrderActionType.fetchOrders], updatedOrder);
      notifications.show({
        title: 'Success',
        message: 'Order Status changed successfully',
      });
    },
  });

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>();

  return (
    <>
      <Card shadow="md" radius="md" mb="lg">
        <Card.Section>
          <Group mb={2} justify="space-between" align="center">
            <div>
              <Chip>Order# {order.orderNumber}</Chip>
            </div>
            <Chip>{order.status}</Chip>
          </Group>
        </Card.Section>

        <Box px={8}>
          <Grid>
            {order.items.map((item) => (
              <Grid.Col span={3} key={item.itemID} className="mb-2">
                <Card shadow="md" radius="md">
                  <Flex gap={5} p="md">
                    <Box pos="relative">
                      <Image w={64} h={80} src={item.image} alt="Product Image" />
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
                    </Stack>
                  </Flex>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Box>
        <Card.Section>
          <Flex justify="space-between" p="md">
            <Flex>
              <Button onClick={onViewOrder}>View Order</Button>
            </Flex>
            <Text>Total Price: ${order.totalPrice}</Text>
          </Flex>
        </Card.Section>

        <Card.Section>
          <Flex gap={20}>
            {Object.values(OrderStatus).map((status, index) => (
              <Button
                key={index}
                onClick={() => {
                  setSelectedStatus(status);
                  changeStatusMutation.mutate(status);
                }}
                loading={changeStatusMutation.isPending && selectedStatus === status}
                disabled={order.status === status}
                fullWidth
              >
                Mark as {status}
              </Button>
            ))}
          </Flex>
        </Card.Section>
      </Card>
      <Divider my={3} />
    </>
  );
}

export default function Order() {
  const [opened, { open, close }] = useDisclosure(false);

  const [viewedOrder, setViewedOrder] = useState<Types.Order | undefined>(undefined);

  function render(order: Types.Order) {
    return (
      <>
        <OrderInfo
          onViewOrder={() => {
            setViewedOrder(order);
            open();
          }}
          order={order}
        />
      </>
    );
  }

  return (
    <>
      <ViewOrderInfoModal opened={opened} onClose={close} order={viewedOrder} />
      <InfiniteRender
        fetchApi="/api/order"
        queryKey={[OrderActionType.fetchOrders]}
        render={render}
      />
    </>
  );
}
