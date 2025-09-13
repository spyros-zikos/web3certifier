'use client';
import React from "react";
import { Box, Heading, VStack, Code } from "@chakra-ui/react";
import { Button } from "~~/components";
import Link from "next/link";
import { Section } from "./Section";

export default function ExamDocsPage() {
  return (
      <VStack align="start" gap={6}>
        <Heading fontSize="2xl" fontWeight="bold">📚 How to Make an Exam</Heading>

        <Section title="Image">
          Upload a square image via drag-and-drop or file selection. This image will appear on the
          exam page and on the NFT certificate.
        </Section>

        <Section title="Name">
          Input the exam name. Avoid adding &quot;<Code>Exam</Code>&quot; at the end. For example, prefer{" "}
          <Code>Basic Algebra</Code> over <Code>Basic Algebra Exam</Code>.
        </Section>

        <Section title="Description">
          Input the exam description. This field supports newlines for better readability. Make sure you include information about the total reward amount and how they will be distributed!
        </Section>

        <Section title="End time">
          Specify the deadline for the exam. After this date, users cannot submit answers. A good practice is to set it a week after the date that you create the exam.
        </Section>

        <Box w="full" borderTop="1px solid" borderColor="lighterLighterBlack"></Box>

        <Box flex="1" textAlign="left">
            ⚙️ Advanced Options (Best left to default values)
        </Box>

        <Section title="Price">
            Set a price per submission in USD. It will be charged in equivalent Celo. Default value is{" "}
            <Code>0</Code> so that the exam is free.
        </Section>

        <Section title="Base Score">
            Define the minimum correct answers required to pass. E.g., for 20 questions, set{" "}
            <Code>12</Code> to reward only those who score 12 or more. By default, it’s 50% of
            total questions.
        </Section>

        <Section title="Max Submissions">
            Set a limit on how many users can submit. Default is <Code>0</Code> (unlimited).
        </Section>

        <Box w="full" borderTop="1px solid" borderColor="lighterLighterBlack"></Box>

        <Section title="Exam Questions">
            Add the questions and four possible answers for each. Avoid prefixes like{" "}
            <Code>Question 1:</Code> or <Code>A)</Code>—these are already handled by the UI.
        </Section>

        <Section title="Exam Creation Fee">
            A small native currency fee (Eth or Celo) is required to prevent spam when creating an
            exam.
        </Section>

        <Link href="/organize_exams">
            <Button className="bg-base-100" onClick={undefined}>
                Create an exam
            </Button>
        </Link>
        
      </VStack>
  );
}
