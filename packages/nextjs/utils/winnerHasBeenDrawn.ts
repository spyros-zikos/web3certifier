export const winnerHasBeenDrawn = (usersThatClaimed: string[]) => {
    if (!usersThatClaimed || usersThatClaimed.length === 0) return false;
    
    for (let i = 0; i < usersThatClaimed.length -1; i++) {
        if (usersThatClaimed[i] === usersThatClaimed[usersThatClaimed.length -1]) {
            return true;
        }
    }
    return false;
};