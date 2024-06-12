export function formatDate (date : string) : string | null {
    const splited = date.split("T")[0].split("-")
    if(splited.length >=3){
        return `${splited[2]}-${splited[1]}-${splited[0]}`
    }
    return null
}