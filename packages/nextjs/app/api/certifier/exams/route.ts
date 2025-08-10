import { NextResponse } from "next/server";
import { connectToDatabase } from "~~/services/mongodb";
import { defaultQuestionTime } from "~~/constants";

/* API endpoint that the organize_exams page calls to save an exam and its questions */

// Expected structure of a question from the frontend
interface IQuestionInput {
    // More fields can be added
    completionTime: number; // In seconds
}

// Expected structure of the request body
interface IExamRequestBody {
    examId: number;
    chainId: number;
    questions: IQuestionInput[];
}

export async function POST(request: Request) {
    let client;
    try {
        const { db, client: connectedClient } = await connectToDatabase();
        client = connectedClient;

        const body: IExamRequestBody = await request.json();
        const {examId, chainId, questions } = body;

        if (examId === undefined || !chainId || !questions || questions.length === 0) {
            return NextResponse.json({ error: "Invalid request. The 'examId', 'chainId', and a non-empty 'questions' array are required." }, { status: 400 });
        }

        // Validate that completion times are positive
        for (const [index, q] of questions.entries()) {
            const time = Number(q.completionTime) || defaultQuestionTime;
            if (time <= 0) {
                return NextResponse.json({ message: `Invalid completion time for question ${index + 1}. Time must be greater than 0.` }, { status: 400 });
            }
        }

        // Prepare the array of question objects to be embedded
        const inputQuestions = questions.map((question, index) => ({
            questionIndex: index,
            completionTime: Number(question.completionTime) || defaultQuestionTime,
        }))

        // Insert the document into the 'exams' collection
        const result = await db.collection("exams").insertOne({
            examId,
            chainId,
            questions: inputQuestions,
        })

        return NextResponse.json(
            { message: "Exam created successfully", documentId: result.insertedId },
            { status: 201 }
        );
    }
    catch (error: any) {
        console.error("Failed to create exam:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}