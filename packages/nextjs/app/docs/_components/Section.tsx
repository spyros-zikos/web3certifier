import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

export const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box mt={4}>
    <Heading size="xl" fontWeight={"bold"} mb={2}>
      {title}
    </Heading>
    <Text>{children}</Text>
  </Box>
);