import {
    AppShell,
    Center,
    Flex,
    Loader,
    MantineProvider,
    Paper,
    Text,
} from '@mantine/core';

export default function LoadingAuth(props: { text: string }) {
    return (
        <MantineProvider>
            <AppShell>
                <Center style={{ minHeight: '100vh' }}>
                    <Paper>
                        <Flex align="center" gap={7}>
                            <Text fw={500}>{props.text}</Text>
                            <Loader color="yellow" type="dots" />
                        </Flex>
                    </Paper>
                </Center>
            </AppShell>
        </MantineProvider>
    );
}
