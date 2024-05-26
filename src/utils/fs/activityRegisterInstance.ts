import { BaseDirectory, exists, readTextFile, writeTextFile } from "@tauri-apps/api/fs"
import { ActivityRegisterInstance } from "../../types/activityRegisterInstance"

const filename = `activityRegisterInstances.json`
const directory = BaseDirectory.AppData

export async function existsActivityRegisterInstances(username: string) {
    return await exists(
        `${username}-${filename}`,
        { dir: directory }
    )
}

export async function readActivityRegisterInstances(username: string) {
    const file = await readTextFile(
        `${username}-${filename}`,
        { dir: directory }
    )
    const instances : ActivityRegisterInstance[] = JSON.parse(file)
    return instances
}

export async function writeActivityRegisterInstances(username: string, instances: ActivityRegisterInstance[]) {
    await writeTextFile(
        `${username}-${filename}`,
        JSON.stringify(instances,null,2),
        { dir: directory}
    )
}