export interface ActivityRegisterInstance {
    id: string
    activityTags: ActivityTag[]
    registers: ActivityRegister[]
    name: string
}

export interface ActivityTag {
    id: string
    name: string
    contextTags: ContextTag[]
}

export interface ContextTag {
    id: string
    name: string
}

export interface ActivityRegister {
    id: string
    name: string
    creationDate: string
    activities: Activity[]
}

export interface Activity {
    id : string
    tag: ActivityTag | null,
    anotations: string[]
    contextTags: ContextTag[]
    time: string
    timeMilis: number
}


