export async function getFeaturedExams(chainId: number, db: any) {
    const collectionName = "featured_exams";
    const examIdsRecord = await db.collection(collectionName).findOne({ chainId });
    const examIds = examIdsRecord ? examIdsRecord.examIds : "";
    return examIds;
}