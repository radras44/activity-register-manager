import { Box, Button, Card, Container, IconButton, SxProps, Typography } from "@mui/material";
import { useUserContext } from "../../../../context/userContext";
import { Activity, ActivityRegister, ActivityRegisterInstance, ActivityTag } from "../../../../types/activityRegisterInstance";
import { useEffect, useMemo, useRef, useState } from "react";
import { Stopwatch, StopwatchRef } from "../../../../components/time/stopwatch";
import { v4 } from "uuid";
import useModal from "../../../../hook/useModal";
import EditActivityModal from "../../../../components/modals/editActivityModal";
import ModalFormSectionLabel from "../../../../components/text/modalFormSectionLabel";
import TextButton from "../../../../components/button/textButton";
import { Add, Delete, DeleteForever, Edit } from "@mui/icons-material";
import DeleteModal from "../../../../components/modals/deleteModal";
import MainNavbar from "../../../../components/navbar/mainNavbar";
import { window as appWindow } from "@tauri-apps/api"
import { TauriEvent } from "@tauri-apps/api/event";
import { exit } from "@tauri-apps/api/process";
import EditActivityRegisterModal from "../../../../components/modals/editActivityRegisterModal";
import { milisToStringedClockHour } from "../../../../utils/logic/timeUtils";
import { useNavigate, useParams } from "react-router-dom";
import TagCount from "../../../../components/list/tagCount";
import { darkTheme, styleTheme } from "../../../../main";
import { writeActivityRegisterInstances } from "../../../../utils/fs/activityRegisterInstance";

export default function ActivityRegisterEditor() {
    const userContext = useUserContext()
    const { instanceId, registerId } = useParams()
    const navigate = useNavigate()

    const [instance, setInstance] = useState<ActivityRegisterInstance | null>(null)
    const [activityRegister, setActivityRegister] = useState<ActivityRegister | null>(null)
    const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
    const editActivity = useModal()
    const deleteActivity = useModal()
    const deleteRegister = useModal()
    const exitRequestModalHandler = useModal()
    const editRegister = useModal()
    const stopWatchRefs = useRef<Record<string, StopwatchRef>>({})

    function loadData() {
        const instance = userContext.state.instances.find(el => el.id === instanceId)
        if (!instance) return null
        setInstance(instance)
        const register = instance.registers.find(el => el.id === registerId)
        if (!register) return null
        setActivityRegister(register)
    }

    const activityTags = useMemo(()=>{
        if(!instance) return null
        const obj : Record<string,ActivityTag> = {}
        instance.activityTags.forEach(tag => {
            obj[tag.id] = tag
        })
        return obj
    },[instance])

    const activitySets = useMemo(() => {
        if (!activityRegister || !activityTags) return
        const result: Record<string, Activity[]> = {
            "default": []
        }
        for (const activity of activityRegister.activities) {
            if (!activity.tag_id) {
                result["default"].push(activity)
                continue
            }
            if (activityTags[activity.tag_id] && result[activityTags[activity.tag_id].name]) {
                result[activityTags[activity.tag_id].name].push(activity)
            } else {
                result[activityTags[activity.tag_id].name] = [activity]
            }
        }
        if (result["default"].length <= 0) {
            delete result["default"]
        }
        console.log("recalculando sets desde:\n",activityRegister,"\n result: \n",result)
        return result
    }, [activityRegister])


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
            gap: 1,
            width: "100%"
        },
        "register-head": {
            display: "flex",
            flexDirection: "row",
            gap: 1,
            alignItems: "center",
            width: "100%",
            borderBottom: `5px solid ${styleTheme.palette.text.disabled}`
        },
        "register-head-options": {
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            paddingRight: 1
        },
        "register-body": {
            display: "flex",
            flexDirection: "column",
        },
        "activities-box": {
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 2
        },
        "activities-box-head": {
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 1
        },
        "activities-box-body": {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 2
        },
        "activitySet": {
            display: "flex",
            flexDirection: "column"
        },
        "activitySet-head": {
            backgroundColor: "primary.main",
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            paddingRight: 1,
            paddingLeft: 2,
            justifyContent: "space-between"

        },
        "activity": {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
            borderTop: `1px solid ${darkTheme.palette.primary.main}`,
            height : 80
        },
        "activitySet-body": {
            display: "flex",
            flexDirection: "column"
        },
        "activity-buttons": {
            backgroundColor: "primary.dark",
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            paddingRight: 1,
            paddingLeft: 2,
            justifyContent: "space-between",
            height: "100%"
        },
        "activity-title": {
            color: "primary.contrastText"
        },
        "activity-icon": {
            color: "primary.contrastText"
        },
        "activity-panel": {
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "center"
        },
        "activity-body": {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            padding: "1em",
            height: "100%"
        },
        "activity-tags": {
            minHeight: 60,
            maxHeight: 80,
            width: 300
        }
    }

    //fs functions
    function saveActivityRegister(registerToUpdate?: ActivityRegister) {
        if (!instance || !activityRegister) return null
        userContext.dispatch({
            type: "UPDATE_ACTIVITY_REGISTER",
            payload: {
                instance: instance,
                register: registerToUpdate ? registerToUpdate : activityRegister
            }
        })
    }

    async function saveStopwatchData() {
        if (!instance || !activityRegister) return null
        const updated = { ...activityRegister }
        console.log(updated)
        updated.activities.forEach((activity, index) => {
            const stopwatchRef = stopWatchRefs.current[activity.id]
            console.log(stopwatchRef)
            if (stopwatchRef) {
                stopwatchRef.stop()
                const time = stopwatchRef.getCurrentTime()
                updated.activities[index].time = milisToStringedClockHour(time)
                updated.activities[index].timeMilis = time
            }
        })
        const updatedActivityRegisters = [...instance.registers]
        const registerIndex = updatedActivityRegisters.findIndex(el => el.id === activityRegister.id)
        if (registerIndex === -1) return false
        updatedActivityRegisters[registerIndex] = updated

        const updatedInstances = [...userContext.state.instances]
        const instanceIndex = updatedInstances.findIndex(el => el.id === instance.id)
        if (instanceIndex === -1) return false
        updatedInstances[instanceIndex] = { ...instance, registers: updatedActivityRegisters }

        await writeActivityRegisterInstances(userContext.state.profile.username, updatedInstances)
        return true
    }

    //navigate control functions

    async function back() {
        saveStopwatchData()
        navigate(-1)
    }

    async function handleNavigation() {
        saveStopwatchData()
    }

    async function handleExit() {
        await saveStopwatchData()
        await exit(0)
    }

    //modal submit handlers
    function handleDeleteActivity() {
        if (!selectedActivity) return
        setActivityRegister(prev => {
            if (!prev) return prev
            const updated = [...prev.activities].filter(el => el.id !== selectedActivity.id)
            return { ...prev, activities: updated }
        })
    }

    function handleDeleteRegister() {
        if (!instance || !activityRegister) return null
        const updated: ActivityRegister[] = [...instance.registers].filter(el => el.id !== activityRegister.id)
        userContext.dispatch({
            type: "UPDATE_INSTANCE",
            payload: {
                instance: { ...instance, registers: updated },
            }
        })
        navigate(-1)
    }


    function handleEditRegister(register: ActivityRegister) {
        setActivityRegister(register)
    }
    //state control functions

    function setActivity(activity: Activity) {
        setActivityRegister(prev => {
            if (!prev) return prev
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
            tag_id: null,
            anotations: [],
            contextTags: [],
            time: "00:00:00.0",
            timeMilis: 0
        }
        setActivityRegister(prev => {
            if (!prev) return prev
            return {
                ...prev,
                activities: [...prev.activities, defaultActivity]
            }
        })
    }

    useEffect(() => {
        const unListen = appWindow.getCurrent().listen(TauriEvent.WINDOW_CLOSE_REQUESTED, () => {
            exitRequestModalHandler.open()
        })
        return () => {
            console.log("unlisten....")
            unListen.then(f => f())
        }
    }, [instance])

    useEffect(() => {
        saveActivityRegister()
    }, [activityRegister])

    useEffect(() => {
        loadData()
    }, [userContext])

    if (!activityRegister || !instance) {
        return <Button onClick={() => navigate(-1)}>Volver</Button>
    }

    return (
        <>
            <MainNavbar onNavigation={handleNavigation} onBack={back} />
            <Container sx={sxStyles["container"]} maxWidth="xl">
                <Box sx={sxStyles["register"]}>
                    <Box sx={sxStyles["register-head"]}>
                        <Typography noWrap variant="h5">{activityRegister.name}</Typography>
                        <Box sx={sxStyles["register-head-options"]}>
                            <IconButton color="primary" onClick={editRegister.open}><Edit /></IconButton>
                            <IconButton color="error" onClick={deleteRegister.open}><DeleteForever /></IconButton>
                        </Box>
                    </Box>
                </Box>
                <Box sx={sxStyles["activities-box"]}>
                    <Box sx={sxStyles["activities-box-head"]}>
                        <ModalFormSectionLabel label={"Actividades"} />
                        <TextButton startIcon={<Add />} onClick={addActivity}>Agregar actividad</TextButton>
                    </Box>
                    <Box sx={sxStyles["activities-box-body"]}>
                        {activitySets &&
                            Object.keys(activitySets).map((activityKey) => (
                                <Card key={activityKey} sx={sxStyles["activitySe"]}>
                                    <Box sx={sxStyles["activitySet-head"]}>
                                        <Typography sx={sxStyles["activity-title"]}>
                                            {activityKey}
                                        </Typography>
                                    </Box>
                                    <Box sx={sxStyles["activitySet-body"]}>{
                                        activitySets[activityKey].map((activity) => (
                                            <Card key={activity.id} sx={sxStyles["activity"]} elevation={4}>
                                                <Box sx={sxStyles["activity-body"]}>
                                                    <Box sx={sxStyles["activity-tags"]}>
                                                        {
                                                            activity.contextTags.length > 0 ?
                                                                <TagCount
                                                                    tags={activity.contextTags}
                                                                />
                                                                :
                                                                <Typography textAlign="center" variant="subtitle2">No se han seleccionado tags</Typography>
                                                        }
                                                    </Box>
                                                    <Stopwatch
                                                        ref={(ref: StopwatchRef) => {
                                                            stopWatchRefs.current[activity.id] = ref
                                                        }}
                                                        startTime={activity.timeMilis}
                                                    />
                                                </Box>
                                                <Box sx={sxStyles["activity-buttons"]}>
                                                    <IconButton
                                                        sx={sxStyles["activity-icon"]}
                                                        onClick={() => selectActivity(activity)}
                                                    ><Edit /></IconButton>
                                                    <IconButton
                                                        sx={sxStyles["activity-icon"]}
                                                        onClick={() => {
                                                            deleteActivity.open()
                                                            setSelectedActivity(activity)
                                                        }}><Delete /></IconButton>

                                                </Box>
                                            </Card>

                                        ))
                                    }
                                    </Box>

                                </Card>
                            ))
                        }

                    </Box>
                </Box>
                {
                    (selectedActivity && editActivity.show) &&
                    <EditActivityModal
                        open={editActivity.show}
                        onClose={editActivity.close}
                        instance={instance}
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
                        onSubmit={handleExit}
                        submitText="Cerrar"
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