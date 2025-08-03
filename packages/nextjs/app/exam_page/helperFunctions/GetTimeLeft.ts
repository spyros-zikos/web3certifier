export default function getTimeLeft(now: number, deadline: bigint) {
    const deadlineDate = new Date(Number(deadline) * 1000);
    const diffMs = deadlineDate.getTime() - now > 0 ? deadlineDate.getTime() - now : 0;
    const timeLeft = Math.floor(diffMs / 1000);

    const days = Math.floor(timeLeft / (3600 * 24));
    const hours = Math.floor((timeLeft % (3600 * 24)) / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    return `${days > 0 ? days + "d ":""}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}