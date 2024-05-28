import { Box, Container, SxProps, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActivityRegister, ActivityRegisterInstance } from "../../../types/activityRegisterInstance";
import { UserContextReturn, useUserContext } from "../../../context/userContext";
import ActivityTagView from "./activityTagView";
import ActivityRegisterEditor from "./activityRegisterEditor";
import ActivityRegisterView from "./activityRegisterView";
import MainNavbar from "../../../components/navbar/mainNavbar";

export default function ActivityRegisterInstanceScreen() {
    const userContext = useUserContext()
    const [instance, setinstance] = useState<ActivityRegisterInstance | null>(null)
    const { id } = useParams()

    useEffect(() => {
        if (!userContext) return
        const finded = userContext.state.instances.find(instance => instance.id == id) || null
        if (!finded) {
            setinstance({
                name: "Instancia no encontrada",
                activityTags: [],
                registers: [],
                id: "No encontrado"
            })
        }
        setinstance(finded)
    })
    if (!instance) {
        return <h1>cargando...</h1>
    }
    return (
        <>
            <ARInstanceInterface
                instance={instance}
                userContext={userContext}
            />
        </>
    )


}

function ARInstanceInterface(props: { instance: ActivityRegisterInstance, userContext: UserContextReturn }) {
    const [selectedActivityRegister, setSelectedActivityRegister] = useState<ActivityRegister | null>(null)
    const navigate = useNavigate()
    const sxStyles: Record<string, SxProps> = {
        "MUI-container": {
            paddingBottom: 4,
            paddingTop: 3
        },
        "container": {
            display: "flex",
            flexDirection: "column",
            gap: 4
        }
    }

    function selectActivityRegister(activityRegister: ActivityRegister | null) {
        setSelectedActivityRegister(activityRegister)
    }

    if (selectedActivityRegister) {
        return (
        
                    <ActivityRegisterEditor
                        selectActivityRegister={selectActivityRegister}
                        instance={props.instance}
                        userContext={props.userContext}
                        activityRegister={selectedActivityRegister}
                    />
        )
    }
    return (
        <>
            <MainNavbar onBack={()=>{navigate("/")}}/>
            <Container sx={sxStyles["MUI-container"]} maxWidth="xl">
                <Box sx={sxStyles["container"]}>
                    <Box>
                        <Typography variant="h4">{props.instance.name}</Typography>
                    </Box>
                    <ActivityTagView instance={props.instance} userContext={props.userContext} />
                    <ActivityRegisterView
                        instance={props.instance}
                        userContext={props.userContext}
                        selectActivityRegister={selectActivityRegister}
                    />

                </Box>
            </Container>
        </>
    )
}

