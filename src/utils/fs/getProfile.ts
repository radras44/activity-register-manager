import { invoke } from "@tauri-apps/api"
import { exit } from "@tauri-apps/api/process"

export default async function isDev () {
    try {
        const is_dev = await invoke("is_dev")
        console.log("is_dev result",is_dev)
        return is_dev
    } catch (error) {
        console.log(error)
        exit()
    }
}