import { downloadListAsTxt } from "~~/utils/downloadListAsTxt";

const downloadQuestionsTemplate = () => {
    downloadListAsTxt(
        [
            "How much is 2 + 2?",
            "2",
            "3",
            "4",
            "5",
            " ",
            "What is the capital of France?",
            "Paris",
            "London",
            "Berlin",
            "Rome",
            " ",
            "Who is the president of the United States?",
            "Joe Biden",
            "Donald Trump",
            "Barack Obama",
            "George Washington",
        ],
        "questions"
    );
}

export default downloadQuestionsTemplate
