import { Box, SxProps } from "@mui/material"
import { UserContextReturn } from "../../../../context/userContext"
import { ActivityRegisterInstance, ActivityRegister } from "../../../../types/activityRegisterInstance"
import { formatDate } from "../../../../utils/logic/dateUtils"
import { v4 } from "uuid"
import ModalFormSectionLabel from "../../../../components/text/modalFormSectionLabel"
import { Add } from "@mui/icons-material"
import TextButton from "../../../../components/button/textButton"
import { useMemo} from "react"
import ARPreview from "../../../../components/list/ARPreview"
import { useNavigate } from "react-router-dom"

interface ActivityRegisterViewProps {
    instance: ActivityRegisterInstance,
    userContext: UserContextReturn
}
export default function ActivityRegisterView(props: ActivityRegisterViewProps) {
    const navigate = useNavigate()
    const registers = useMemo(() => {
        return props.instance.registers.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime())
    }, [props.instance.registers])
    const sxStyles: Record<string, SxProps> = {
        "container": {
            display: "flex",
            flexDirection: "column",
            gap: 2
        },
        "activityList" : {
            maxHeight : 400,
            overflowY : "auto",
            display : "flex",
            flexDirection : "column",
            gap : 2
        }
    }

    function createActivityRegister() {
        const id = v4()
        const date = new Date().toISOString()
        const activityRegister: ActivityRegister = {
            id: id,
            name: `Registro-${formatDate(date)}-${props.instance.registers.length + 1}`,
            creationDate: date,
            activities: []
        }
        props.userContext.dispatch({
            type: "UPDATE_ACTIVITY_REGISTER",
            payload: {
                instance: props.instance,
                register: activityRegister
            }
        }),
        navigate(`/instance/activityRegister/${props.instance.id}/${activityRegister.id}`)
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
            <Box sx={sxStyles["activityList"]}>
                {registers.map((register, index) => (
                    <Box key={index}>
                        <ARPreview
                        activityRegister={register}
                        onEditClick={()=>{
                            navigate(`/instance/activityRegister/${props.instance.id}/${register.id}`)
                        }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    )
}