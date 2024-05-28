import { ActivityRegister } from "../../types/activityRegisterInstance";

export interface ClockHour {
    hours: number,
    minutes: number,
    seconds: number
    miliSeconds: number
}

export function milisToClockHour(milis: number) {
    return {
        hours: Math.floor((milis / (60000 * 60))).toString().padStart(2, "0"),
        minutes: Math.floor((milis / 60000) % 60).toString().padStart(2, "0"),
        seconds: Math.floor((milis / 1000) % 60).toString().padStart(2, "0"),
        miliseconds: Math.floor((milis / 100) % 10)
    }
}

export function clockHourToMilis(clockHour: ClockHour) {
    return (clockHour.hours * 1000 * 60 * 60) +
        (clockHour.minutes * 1000 * 60) +
        (clockHour.seconds * 1000) +
        clockHour.miliSeconds
}
export function milisToStringedClockHour(milis: number) {
    const time = milisToClockHour(milis)
    return `${time.hours}:${time.minutes}:${time.seconds}.${time.miliseconds}`


}

export function sumActivityRegisterTimes(register: ActivityRegister) {
    const result = register.activities.reduce((acum, el) => {
        return acum + el.timeMilis
    }, 0)
    return result
}