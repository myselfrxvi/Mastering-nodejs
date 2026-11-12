export function CalculateAge(birthYear) {
    const curryear = new Date().getFullYear()
    return curryear - birthYear
}