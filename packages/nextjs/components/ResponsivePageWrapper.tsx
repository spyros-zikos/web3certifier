import { Box } from "@chakra-ui/react";

function ResponsivePageWrapper({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
        <Box paddingX={4} paddingY={8} sm={{ paddingX: 10 }}>
            <Box bg="lighterBlack" padding={4} sm={{ padding: 10}} borderRadius="2xl" maxWidth="600px" margin="auto">
                {children}
            </Box>
        </Box>
    );
  }
  export default ResponsivePageWrapper;