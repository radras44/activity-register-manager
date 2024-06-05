import { Delete, Edit } from "@mui/icons-material";
import { Box, IconButton, SxProps, Typography } from "@mui/material";

interface AnnotationCountProps {
    handleDelete?: (annotation: string) => void
    annotations: string[]
    handleEdit?: (annotation: string) => void
}

export default function AnnotationCount(props: AnnotationCountProps) {
    const sxStyles: Record<string, SxProps> = {
        "container": {
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxHeight: 300,
            overflowY: "auto",
            whiteSpace: "wrap",
            minWidth: 600
        },
        "list-item": {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            backgroundColor: "grey.200"
        },
        "list-item-text": {
            lineHeight: 1.5,
            wordBreak: "break-all",
            whiteSpace: "pre-wrap",
            padding: 1,
            width: "100%",
            minHeight : 50,
            fontWeight : 600
        },
        "list-item-panel": {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            backgroundColor: "grey.600",
            width: "100%",
            paddingRight: 1,
        },
        "list-item-panel-icon": {
            color: "primary.contrastText",
        }
    }
    return (
        <Box sx={sxStyles["container"]}>
            {
                props.annotations.map((annotation, index) => (
                    <Box sx={sxStyles["list-item"]} key={index}>
                        <Box sx={sxStyles["list-item-panel"]}>
                            {
                                props.handleDelete &&
                                <IconButton sx={sxStyles["list-item-panel-icon"]} onClick={() => {
                                    if (props.handleDelete) {
                                        props.handleDelete(annotation)
                                    }
                                }}>
                                    <Delete />
                                </IconButton>
                            }
                            {
                                props.handleEdit &&
                                <IconButton sx={sxStyles["list-item-panel-icon"]} onClick={() => {
                                    if (props.handleEdit) {
                                        props.handleEdit(annotation)
                                    }
                                }}>
                                    <Edit />
                                </IconButton>
                            }
                        </Box>
                        <Typography
                            sx={sxStyles["list-item-text"]}
                            component={"p"}
                            variant="caption"
                        >{annotation}</Typography>
                    </Box>
                ))
            }
        </Box>
    )
}