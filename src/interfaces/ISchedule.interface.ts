export type IWeeklyScheduleElement = {
    start: number,
    end: number,
    isActive: boolean
}

export interface IWeeklySchedule {
    id: string;
    name: string,
    author: string;
    schedule: IWeeklyScheduleElement[]
}