interface ExamFormData {
    name?: string;
    examDescription?: string;
    examResources?: string;
    rewardDescription?: string;
    endTime?: string;
    questionsWithAnswers?: QuestionWithAnswers[];
    baseScore?: number;
    imageUrl?: string;
    certifier?: string;
    maxSubmissions?: number;
}