import { getLocalStorageAnswersKey } from "~~/constants";

export const handleLocalStorage = {
    save: function(key: any, value: any) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Failed to save to local storage:', e);
        }
    },
    
    load: function(key: any, defaultValue: any = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Failed to load from local storage:', e);
            return defaultValue;
        }
    }
};

export function getUserAnswersFromLocalStorage(chain: any, exam: any) {
    const emptyAnswers: number[] = Array(exam?.questions.length).fill(0);
    const answers: number[] = handleLocalStorage.load(getLocalStorageAnswersKey(chain, exam?.id || BigInt(-1)));
    if (!answers) {
        handleLocalStorage.save(getLocalStorageAnswersKey(chain, exam?.id || BigInt(-1)), emptyAnswers);
        return emptyAnswers;
    }
    return answers;
}

export function saveUserAnswersToLocalStorage(chain: any, exam: any, answers: any) {
    handleLocalStorage.save(
        getLocalStorageAnswersKey(chain, exam?.id || BigInt(-1)), 
        answers
    );
}