import { gql, request } from 'graphql-request';

// GRAPH QUERIES
export async function getExamsStringFromGraph() {
    // Get open certificate names and ids
    const query = gql`{
        createExams(where: {
            endTime_gt: "${Math.floor(Date.now()/1000)}"
        }) {
            internal_id
            name
        }
    }`;
    const response: any = await request(process.env.NEXT_PUBLIC_THE_GRAPH_URL!, query);
    const data = await response;
    const examsList = data.createExams;
    const exams = examsList
        .map((examObject: any) => `${examObject["internal_id"]}: ${examObject["name"]}`);
    const examsString = exams.join("\n");
    console.log("\nexams:\n", examsString);
    return examsString;
}