import { Box, Button, Card, Container, IconButton, SxProps, Typography } from "@mui/material";
import { UserContextReturn } from "../../../context/userContext";
import { Activity, ActivityRegister, ActivityRegisterInstance } from "../../../types/activityRegisterInstance";
import { useEffect, useState } from "react";
import { Stopwatch } from "../../../components/time/stopwatch";
import { v4 } from "uuid";
import useModal from "../../../hook/useModal";
import EditActivityModal from "../../../components/modals/editActivityModal";
import ModalFormSectionLabel from "../../../components/text/modalFormSectionLabel";
import TextButton from "../../../components/button/textButton";
import { Add, Delete, Edit } from "@mui/icons-material";
import DeleteModal from "../../../components/modals/deleteModal";
import MainNavbar from "../../../components/navbar/mainNavbar";
import { window as appWindow } from "@tauri-apps/api"
import { TauriEvent } from "@tauri-apps/api/event";
import { exit } from "@tauri-apps/api/process";
import EditActivityRegisterModal from "../../../components/modals/editActivityRegisterModal";
import { formatDate } from "../../../utils/logic/dateUtils";

interface ActivityRegisterViewProps {
    instance: ActivityRegisterInstance,
    userContext: UserContextReturn
    selectActivityRegister: (activityRegister: ActivityRegister | null) => void
    activityRegister: ActivityRegister
}


export default function ActivityRegisterEditor(props: ActivityRegisterViewProps) {
    const [activityRegister, setActivityRegister] = useState<ActivityRegister>(props.activityRegister)
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
    const editActivity = useModal()
    const deleteActivity = useModal()
    const deleteRegister = useModal()
    const exitRequestModalHandler = useModal()
    const editRegister = useModal()

    const sxStyles: Record<string, SxProps> = {
        "container": {
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            alignItems: "flex-start",
            paddingBottom: 4,
            paddingTop: 3
        },
        "register": {
            display: "flex",
            flexDirection: "column",
            gap: 1
        },
        "register-head": {
            display: "flex",
            flexDirection: "row",
            gap: 1,
            alignItems: "center"
        },
        "register-body": {
            display: "flex",
            flexDirection: "column"
        },
        "activities-box": {
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 1
        },
        "activities-box-head": {
            width: "100%",
        },
        "activities-box-body": {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 4
        },
        "activity-box": {
            padding: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1
        },
        "activity-panel": {
            display: "flex",
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%"
        },
        "activity-panel-button-box": {
            display: "flex",
            flexDirection: "row"
        }
    }
    function back() {
        updateActivityRegister()
        props.selectActivityRegister(null)
    }

    function setActivity(activity: Activity) {
        setActivityRegister(prev => {
            const index = prev.activities.findIndex(el => el.id === activity.id)
            if (index === -1) return prev
            const updated = [...prev.activities]
            updated[index] = activity
            return { ...prev, activities: updated }
        })
    }

    function selectActivity(activity: Activity) {
        editActivity.open()
        setSelectedActivity(activity)
    }
    function addActivity() {
        const defaultActivity: Activity = {
            id: v4(),
            tag: null,
            anotations: [],
            contextTags: [],
            time: "00:00:00.0",
            timeMilis: 0
        }
        setActivityRegister(prev => ({
            ...prev,
            activities: [...prev.activities, defaultActivity]
        }))
    }

    function updateActivityRegister() {
        props.userContext.dispatch({
            type: "UPDATE_ACTIVITY_REGISTER",
            payload: {
                instance: props.instance,
                register: activityRegister
            }
        })
    }

    function handleDeleteActivity() {
        if (!selectedActivity) return
        setActivityRegister(prev => {
            const updated = [...prev.activities].filter(el => el.id !== selectedActivity.id)
            return { ...prev, activities: updated }
        })
    }

    function handleDeleteRegister() {
        const updated: ActivityRegister[] = [...props.instance.registers].filter(el => el.id !== props.activityRegister.id)
        props.userContext.dispatch({
            type: "UPDATE_INSTANCE",
            payload: {
                instance: { ...props.instance, registers: updated },
            }
        })
        props.selectActivityRegister(null)
    }

    async function saveAndExit() {
        try {
            await exit(0)
        } catch (error) {
            console.log(error)
        }
    }

    function handleEditRegister(register: ActivityRegister) {
        console.log("updated register:", register)
        setActivityRegister(register)
    }

    useEffect(() => {
        updateActivityRegister()
    }, [activityRegister.activities])

    useEffect(() => {
        appWindow.getCurrent().listen(TauriEvent.WINDOW_CLOSE_REQUESTED, () => {
            exitRequestModalHandler.open()
        })
    }, [])

    return (
        <>
            <MainNavbar onBack={back} />
            <Container sx={sxStyles["container"]} maxWidth="xl">
                <Box sx={sxStyles["register"]}>
                    <Box sx={sxStyles["register-head"]}>
                        <Typography variant="h5">{activityRegister.name}</Typography>
                        <IconButton onClick={editRegister.open}><Edit /></IconButton>
                    </Box>
                    <Box sx={sxStyles["register-body"]}>
                        <Typography variant="subtitle1">{formatDate(activityRegister.creationDate)}</Typography>
                    </Box>
                </Box>
                <Box sx={sxStyles["activities-box"]}>
                    <Box sx={sxStyles["activities-box-head"]}>
                        <ModalFormSectionLabel label={"Actividades"} />
                        <TextButton startIcon={<Add />} onClick={addActivity}>Agregar actividad</TextButton>
                    </Box>
                    <Box sx={sxStyles["activities-box-body"]}>
                        {activityRegister.activities.map((activity, index) => (
                            <Card sx={sxStyles["activity-box"]} elevation={4} key={index}>
                                <Stopwatch
                                    activity={{
                                        activity: activity,
                                        onPause: setActivity,
                                        stopDependency: exitRequestModalHandler.show
                                    }}
                                    startTime={activity.timeMilis}
                                />
                                <Box sx={sxStyles["activity-panel"]}>
                                    <Typography sx={sxStyles["activity-box-title"]}>
                                        {activity.tag ? activity.tag.name : "Default"}
                                    </Typography>
                                    <Box sx={sxStyles["activity-panel-button-box"]}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => selectActivity(activity)}
                                        ><Edit /></IconButton>
                                        <IconButton
                                            color="error"
                                            onClick={() => {
                                                deleteActivity.open()
                                                setSelectedActivity(activity)
                                            }}><Delete /></IconButton>
                                    </Box>
                                </Box>

                            </Card>
                        ))}
                    </Box>
                </Box>
                <Box>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={deleteRegister.open}
                    >Eliminar registro de actividad</Button>
                </Box>
                {
                    (selectedActivity && editActivity.show) &&
                    <EditActivityModal
                        open={editActivity.show}
                        onClose={editActivity.close}
                        instance={props.instance}
                        activity={selectedActivity}
                        onSubmit={setActivity}
                    />
                }
                {
                    (deleteActivity.show && selectedActivity) &&
                    <DeleteModal
                        open={deleteActivity.show}
                        onClose={deleteActivity.close}
                        description="¿Quieres eliminar esta actividad?"
                        onSubmit={handleDeleteActivity}
                    />
                }
                {
                    deleteRegister.show &&
                    <DeleteModal
                        open={deleteRegister.show}
                        onClose={deleteRegister.close}
                        description="¿Estas seguro de eliminar este registro de actividad?"
                        onSubmit={handleDeleteRegister}
                    />
                }
                {
                    exitRequestModalHandler.show &&
                    <DeleteModal
                        open={exitRequestModalHandler.show}
                        onClose={exitRequestModalHandler.close}
                        description="¿Estas seguro de que quieres salir de la aplicación??"
                        onSubmit={saveAndExit}
                    />
                }
                {
                    editRegister.show &&
                    <EditActivityRegisterModal
                        open={editRegister.show}
                        onClose={editRegister.close}
                        onSubmit={handleEditRegister}
                        activityRegister={activityRegister}
                    />
                }
            </Container>
        </>

    )
}