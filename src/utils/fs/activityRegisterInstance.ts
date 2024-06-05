import { BaseDirectory, exists, readTextFile, writeTextFile } from "@tauri-apps/api/fs"
import { ActivityRegisterInstance } from "../../types/activityRegisterInstance"
import isDev from "./getProfile"

async function getFilename () {
    const devEnv = await isDev()
    if(devEnv){
        return "activityRegisterInstances-dev.json"
    }else{
        return "activityRegisterInstances-production.json"
    }
}

const directory = BaseDirectory.AppData

export async function existsActivityRegisterInstances(username: string) {
    const filename = await getFilename()
    return await exists(
        `${username}-${filename}`,
        { dir: directory }
    )
}

export async function readActivityRegisterInstances(username: string) {
    const filename = await getFilename()
    const file = await readTextFile(
        `${username}-${filename}`,
        { dir: directory }
    )
    const instances : ActivityRegisterInstance[] = JSON.parse(file)
    return instances
}


export async function writeActivityRegisterInstances(username: string, instances: ActivityRegisterInstance[]) {
    const filename = await getFilename()
    console.log(filename)
    await writeTextFile(
        `${username}-${filename}`,
        JSON.stringify(instances,null,2),
        { dir: directory}
    )
    return true
}