import { Box,SxProps } from "@mui/material"
import { UserContextReturn } from "../../../context/userContext"
import { ActivityRegisterInstance, ActivityRegister } from "../../../types/activityRegisterInstance"
import { formatDate } from "../../../utils/logic/dateUtils"
import { v4 } from "uuid"
import ModalFormSectionLabel from "../../../components/text/modalFormSectionLabel"
import { Add } from "@mui/icons-material"
import TextButton from "../../../components/button/textButton"
import DataPreviewListItemButton from "../../../components/list/dataPreviewListItemButton"
import { milisToStringedClockHour, sumActivityRegisterTimes } from "../../../utils/logic/timeUtils"

interface ActivityRegisterViewProps {
    instance: ActivityRegisterInstance,
    userContext: UserContextReturn
    selectActivityRegister: (activityRegister: ActivityRegister | null) => void
}
export default function ActivityRegisterView(props: ActivityRegisterViewProps) {

    const sxStyles: Record<string, SxProps> = {
        "container": {
            display: "flex",
            flexDirection: "column",
            gap: 2
        }
    }

    function createActivityRegister() {
        const id = v4()
        const date = new Date()
        const activityRegister: ActivityRegister = {
            id: id,
            name: `Registro-${formatDate(date)}-${props.instance.registers.length + 1}`,
            creationDate: date.toISOString(),
            activities: []
        }
        props.selectActivityRegister(activityRegister)
        props.userContext.dispatch({
            type: "UPDATE_ACTIVITY_REGISTER",
            payload: {
                instance: props.instance,
                register: activityRegister
            }
        })
    }
    return (
        <Box sx={sxStyles["container"]}>
            <Box>
                <ModalFormSectionLabel label="Registros de actividad" />
                <TextButton
                    startIcon={<Add />}
                    onClick={createActivityRegister}
                >Crear nuevo registro</TextButton>
            </Box>
            {props.instance.registers.map((register, index) => (
                <DataPreviewListItemButton
                key={index}
                date={new Date(register.creationDate)}
                label={register.name}
                onClick={() => { props.selectActivityRegister(register) }}
                otherData={[
                    {label : "Tiempo total registrado",value : milisToStringedClockHour(sumActivityRegisterTimes(register))}
                ]}
                />
            ))}
        </Box>
    )
}