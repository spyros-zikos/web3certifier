import { Box } from '@chakra-ui/react'
import React from 'react'

const ProgressBar = ({questions, questionNumber}: {questions: readonly string[] | undefined, questionNumber: number}) => {
  return (
    <Box mt="12">
        <Box className="flex justify-between mb-1">
            <Box fontSize="md" color="lightGreen">Progress</Box>
            <Box fontSize="md" color="lightGreen">Question {questionNumber} of {questions ? questions.length : 1}</Box>
        </Box>
        <Box className="w-full bg-gray-700 rounded-full h-2.5">
            <Box bgColor="lightGreen" h="2.5" rounded={"full"} w={`${(questionNumber / (questions ? questions.length : 1)) * 100}%`}></Box>
        </Box>
    </Box>
  )
}

export default ProgressBar