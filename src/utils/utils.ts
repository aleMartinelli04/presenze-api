export function getCurrentYear(): number {
    const currentDate = new Date();

    let currentYear;

    if (currentDate.getMonth() < 9) {
        currentYear = currentDate.getFullYear() - 1;
    } else {
        currentYear = currentDate.getFullYear();
    }

    return currentYear;
}