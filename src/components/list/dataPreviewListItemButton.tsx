import { Box, Card, ListItemButton, SxProps, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { formatDate } from "../../utils/logic/dateUtils"

interface DataPreviewListItemButtonProps {
    label: string
    link?: string
    otherData?: { label: string, value: string }[]
    date?: string
    onClick?: () => void
}

export default function DataPreviewListItemButton(props: DataPreviewListItemButtonProps) {
    function handleClick() {
        if (props.onClick) {
            props.onClick()
        }
    }
    const sxStyles: Record<string, SxProps> = {
        "container": {
            maxWidth : 650
        },
        "button" : {
            display: "flex",
            flexDirection: "row",
            justifyContent : "space-between",
            alignItems : "flex-start",
            gap: 2,
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
        "profile-box": {
            display: "flex",
            flexDirection: "column",
            gap: 1,
        },
        "date-box": {
            alignItems: "flex-end",
            display: "flex",
            flexDirection: "column",
            gap: 1
        },
        "date-text": {
            color : "text.secondary"
        }

    }
    return (
        <Link to={props.link ? props.link : "#"}>
            <Card sx={sxStyles["container"]} elevation={5}>
                <ListItemButton sx={sxStyles["button"]} onClick={handleClick}>
                    <Box sx={sxStyles["profile-box"]}>
                        <Typography sx={sxStyles["label"]}>{props.label}</Typography>
                        {
                            props.otherData &&
                            <Box sx={sxStyles["otherData-list"]} >
                                {props.otherData.map((el, index) => (
                                    <Box sx={sxStyles["otherData-list-item"]} key={index}>
                                        <Typography variant="subtitle2" component={"span"}>{el.label}</Typography>
                                        <Typography variant="subtitle2" component={"span"}>{el.value}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        }
                    </Box>
                    {
                        props.date &&
                        <Box sx={sxStyles["date-box"]}>
                            <Typography sx={sxStyles["date-text"]}>Creada el {formatDate(props.date)}</Typography>
                        </Box>
                    }
                </ListItemButton>
            </Card>
        </Link>
    )
}