'use client';
import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
  Code,
} from "@chakra-ui/react";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Box mb={6}>
    <Heading size="md" mb={2}>
      {title}
    </Heading>
    <Text>{children}</Text>
  </Box>
);

export default function ExamDocsPage() {
  return (
    <Container maxW="4xl" py={10}>
      <VStack align="start" gap={6}>
        <Heading size="xl">📚 How to Make an Exam</Heading>

        <Section title="Name">
          Input the exam name. Avoid adding "<Code>Exam</Code>" at the end. For example, prefer{" "}
          <Code>Basic Algebra</Code> over <Code>Basic Algebra Exam</Code>.
        </Section>

        <Section title="Description">
          Input the exam description. This field supports newlines for better readability.
        </Section>

        <Section title="Date">
          Specify the deadline for the exam. After this date, users cannot submit answers. A good
          practice is to set this a week after creation.
        </Section>

        <Section title="Exam Questions">
          Add the questions and four possible answers for each. Avoid prefixes like{" "}
          <Code>Question 1:</Code> or <Code>A)</Code>—these are already handled by the UI.
        </Section>

        <Section title="Image">
          Upload a square image via drag-and-drop or file selection. This image will appear on the
          exam page and on the NFT certificate.
        </Section>

        <Box flex="1" textAlign="left">
            ⚙️ Advanced Options
        </Box>

        <Section title="Price">
            Set a price per submission in USD. It will be charged in equivalent Celo. Set to{" "}
            <Code>0</Code> for a free exam.
        </Section>

        <Section title="Base Score">
            Define the minimum correct answers required to pass. E.g., for 20 questions, set{" "}
            <Code>12</Code> to reward only those who score 12 or more. By default, it’s 50% of
            total questions.
        </Section>

        <Section title="Max Submissions">
            Set a limit on how many users can submit. Default is <Code>0</Code> (infinite).
        </Section>

        <Section title="Exam Creation Fee">
          A small native currency fee (Eth or Celo) is required to prevent spam when creating an
          exam.
        </Section>
      </VStack>
    </Container>
  );
}
