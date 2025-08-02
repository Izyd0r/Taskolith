export const Priority = {
    Critical: 1,
    High: 2,
    Medium: 3,
    Low: 4,
    Lowest: 5,
} as const;

export type PriorityValue = typeof Priority[keyof typeof Priority]
export type PriorityName = keyof typeof Priority

export const priorityNames = Object.keys(Priority) as PriorityName[]
export const priorityValues = Object.values(Priority)

export const priorityOptions = [
    { name: 'Critical', value: Priority.Critical },
    { name: 'High', value: Priority.High },
    { name: 'Medium', value: Priority.Medium },
    { name: 'Low', value: Priority.Low },
    { name: 'Lowest', value: Priority.Lowest },
] as const;
