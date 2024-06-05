import { Alert, Box, Button, Container, SxProps, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ActivityRegisterInstance } from "../../types/activityRegisterInstance";
import { UserContextReturn, useUserContext } from "../../context/userContext";
import ActivityTagView from "./views/activityTag/activityTagView";
import ActivityRegisterView from "./views/activityRegister/activityRegisterView";
import MainNavbar from "../../components/navbar/mainNavbar";

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
    },[userContext])
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

export interface ActivityRegisterInstanceViewProps {
    instance: ActivityRegisterInstance,
    userContext: UserContextReturn
}

interface Section {
    component : React.ComponentType<ActivityRegisterInstanceViewProps>
    name : string
}

const sections : Record<string,Section>= {
    "Registro de actividades" : {name : "Registro de actividades",component : ActivityRegisterView},
    "Actividades" : {name : "Actividades",component : ActivityTagView}
}

function ARInstanceInterface(props: { instance: ActivityRegisterInstance, userContext: UserContextReturn }) {
    const [currentSection,setCurrentSection] = useState<Section | null>(sections["Registro de actividades"] || null)
   
    const navigate = useNavigate()
    const sxStyles: Record<string, SxProps> = {
        "MUI-container": {
            paddingBottom: 8,
            paddingTop: 3
        },
        "container": {
            display: "flex",
            flexDirection: "column",
            gap: 4
        },
        "sections" : {
            maxWidth : "100%",
            overflowX : "auto",
        },
        "sections-button" : {
            fontWeight : "bold",
            textTransform : "none",
            borderBottomWidth : 1,
            borderBottomStyle : "solid",
            borderRadius : 0
        }
    }

    return (
        <>
            <MainNavbar onBack={()=>{navigate("/")}}/>
            <Container sx={sxStyles["MUI-container"]} maxWidth="xl">
                <Box sx={sxStyles["container"]}>
                    <Box>
                        <Typography variant="h4">{props.instance.name}</Typography>
                    </Box>
                    <Box sx={sxStyles["sections"]}>
                        {Object.keys(sections).map((key,index)=>(
                            <Button
                            sx={
                                currentSection && currentSection.name === sections[key].name
                                  ? {
                                      ...sxStyles["sections-button"],
                                      color: "primary.main",
                                      borderColor: "primary.main"
                                    }
                                  : {
                                      ...sxStyles["sections-button"],
                                      color: "text.secondary",
                                      borderColor: "text.secondary" 
                                    }
                              }
                            onClick={()=>{setCurrentSection(sections[key])}}
                            key={index}
                            color="primary"
                            >{key}</Button>
                        ))}
                    </Box>
                    {
                        currentSection ?
                        React.createElement(currentSection.component,{
                            instance : props.instance,
                            userContext : props.userContext
                        })
                        : <Alert severity="error">"ha ocurrido un problema al intentar cargar el componente"</Alert>
                    }
                </Box>
            </Container>
        </>
    )
}

