import { Box } from "@chakra-ui/react"

const QuestionTimer = (
    {
        startTime, questionNumber, timePerQuestion, currentTimestamp
    }: {
        startTime: number, questionNumber: number, timePerQuestion: number, currentTimestamp: number
    }) => {
    return (startTime > 0) &&
        (<Box>Time left: &nbsp;
            {Math.max(0, startTime + (questionNumber * timePerQuestion) - currentTimestamp)}
        </Box>)
}

export default QuestionTimer