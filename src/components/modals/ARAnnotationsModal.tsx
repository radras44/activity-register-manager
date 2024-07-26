import { AppBar, Box, Card, IconButton, Modal, SxProps, Toolbar } from "@mui/material"
import modalStyles from "./modalStyles"
import { Activity, ActivityRegisterInstance, ActivityTag } from "../../types/activityRegisterInstance"
import AnnotationCount from "../list/annotationCount"
import ModalFormSectionLabel from "../text/modalFormSectionLabel"
import { Close } from "@mui/icons-material"
import { useMemo } from "react"
interface ARannotationsModalProps {
    activities: Activity[]
    instance : ActivityRegisterInstance
    open: boolean
    onClose: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
}

export default function ARAnnotationsModal(props: ARannotationsModalProps) {
    const activityTags = useMemo(()=>{
        const obj : Record<string,ActivityTag> = {}
        props.instance.activityTags.forEach(tag => {
            obj[tag.id] = tag
        })
        return obj
    },[props.activities])
    const sxStyles: Record<string, SxProps> = {
        "appBar" : {
            height : 50,
            backgroundColor : "grey.300",
            display : "flex",
            flexDirection : "row-reverse",
            alignItems : "center"
        },
        "container": {
            ...modalStyles["container"],
            display: "flex",
            flexDirection: "column",
            padding : 0
        },
        "content": {
            padding: 2,
            display: "flex",
            flexDirection: "column",
            gap: 4
        },
        "activity": {
            display: "flex",
            flexDirection: "column",
            gap: 2,
        }
    }
    return (
        <Modal open={props.open} onClose={props.onClose}>
            <Card sx={sxStyles["container"]} elevation={4}>
                <AppBar elevation={0} sx={sxStyles["appBar"]} position="sticky">
                    <Toolbar>
                        <IconButton onClick={()=>{props.onClose({},"backdropClick")}}>
                            <Close/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Box sx={sxStyles["content"]}>
                    {props.activities.map((activity, index) => (
                        <Box sx={sxStyles["activity"]} key={index}>
                            <ModalFormSectionLabel label={activity.tag_id && activityTags[activity.tag_id] ? activityTags[activity.tag_id].name : "Default"} />
                            {
                                activity.anotations.length > 0 ?
                                    <AnnotationCount
                                        annotations={activity.anotations}
                                    />
                                    :
                                    <AnnotationCount
                                        annotations={["Esta actividad no tiene ninguna nota"]}
                                    />
                            }
                        </Box>
                    ))}
                </Box>
            </Card>
        </Modal>
    )
}