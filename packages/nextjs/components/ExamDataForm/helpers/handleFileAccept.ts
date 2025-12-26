import { FileAcceptDetails } from "@zag-js/file-upload";

const handleFileAccept = async (details: FileAcceptDetails, setQuestionNumber: any, examData: any, setExamData: any) => {
    const file = details.files[0];
    const listWithFileLines = (await file.text())?.split("\n");
    setQuestionNumber(1);
    
    const tempQuestionsWithAnswers: QuestionWithAnswers[] = [];
    try {
        if (listWithFileLines)
            for (let i = 0; i < listWithFileLines.length; i++) {
                if (i % 6 === 0)
                    tempQuestionsWithAnswers.push({question: listWithFileLines[i], answer1: listWithFileLines[i + 1], answer2: listWithFileLines[i + 2], answer3: listWithFileLines[i + 3], answer4: listWithFileLines[i + 4]});
            }
            setExamData({ ...examData, questionsWithAnswers: tempQuestionsWithAnswers });
    } catch (error) {
        console.log(error);
    }
}

export default handleFileAccept