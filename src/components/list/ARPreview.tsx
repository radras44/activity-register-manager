import { Box, IconButton, SxProps, Typography } from "@mui/material"
import { formatDate } from "../../utils/logic/dateUtils"
import { ActivityRegister } from "../../types/activityRegisterInstance"
import { Edit, StickyNote2 } from "@mui/icons-material"
import useModal from "../../hook/useModal"
import ARAnnotationsModal from "../modals/ARAnnotationsModal"
import { styleTheme } from "../../main"
import {  milisToStringedClockHour, sumActivityRegisterTimes } from "../../utils/logic/timeUtils"

interface ARPreviewProps {
    activityRegister: ActivityRegister
    onEditClick: () => void
}

export default function ARPreview(props: ARPreviewProps) {
    const seeAnnotations = useModal()
    const sxStyles: Record<string, SxProps> = {
        "container": {
            maxWidth: 650,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            height: "auto",
            gap: 2,
            padding: 1,
            border: `1px solid ${styleTheme.palette.grey[300]}`,
        },
        "label": {
            fontWeight: "bold",
            fontSize: 16
        },
        "otherData-list": {
            display: "flex",
            flexDirection: "column"
        },
        "otherData-list-item": {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "nowrap",
            gap: 1
        },
        "left-box": {
            display: "flex",
            flexDirection: "column",
            gap: 1
        },
        "right-box": {
            alignItems: "stretch",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 1,
        },
        "date-text": {
            color: "text.secondary"
        },
        "date": {
            display: "flex",
            flexDirection: "row-reverse"
        },
        "panel": {
            display: "flex",
            flexDirection: "row-reverse",
            gap: 1,
        }

    }
    return (
        <Box sx={sxStyles["container"]} >
            <Box sx={sxStyles["left-box"]}>
                <Typography sx={sxStyles["label"]}>{props.activityRegister.name}</Typography>
                <Box sx={sxStyles["otherData-list"]} >
                    <Box sx={sxStyles["otherData-list-item"]} >
                        <Typography variant="subtitle2" component={"span"}>Tiempo total registrado</Typography>
                        <Typography variant="subtitle2" component={"span"}>
                            {milisToStringedClockHour(sumActivityRegisterTimes(props.activityRegister))}
                            </Typography>
                    </Box>
                    {props.activityRegister.activities.map((activity, index) => (
                        <Box sx={sxStyles["otherData-list-item"]} key={index}>
                            <Typography variant="subtitle2" component={"span"}>{activity.tag ? activity.tag.name : "Default"}</Typography>
                            <Typography variant="subtitle2" component={"span"}>{activity.time}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box sx={{
                backgroundColor: "#000",
                height: "100%",
                width: 20
            }}></Box>
            <Box sx={sxStyles["right-box"]}>
                <Box sx={sxStyles["date"]}>
                    <Typography sx={sxStyles["date-text"]}>Creada el {formatDate(props.activityRegister.creationDate)}</Typography>
                </Box>
                <Box sx={sxStyles["panel"]}>
                    <IconButton color="primary" onClick={props.onEditClick}><Edit /></IconButton>
                    {
                        props.activityRegister.activities.length > 0 &&
                        <IconButton color="default" onClick={seeAnnotations.open}><StickyNote2 /></IconButton>
                    }
                </Box>
            </Box>
            {
                seeAnnotations.show &&
                <ARAnnotationsModal
                    open={seeAnnotations.show}
                    onClose={seeAnnotations.close}
                    activities={props.activityRegister.activities}
                />
            }
        </Box>
    )
}