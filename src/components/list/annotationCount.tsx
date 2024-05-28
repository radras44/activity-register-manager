import { Delete } from "@mui/icons-material";
import { Box, IconButton, SxProps, Typography } from "@mui/material";

interface AnnotationCountProps {
    handleDelete: (annotation: string) => void
    annotations: string[]
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
            alignItems : "flex-end",
            backgroundColor: "grey.200"
        },
        "list-item-text": {
            lineHeight: 1.5,
            wordBreak: "break-all",
            whiteSpace: "pre-wrap",
            padding : 1,
            width : "100%"
        },
        "list-item-panel" : {
            display: "flex",
            flexDirection: "row",
            justifyContent : "flex-end",
            gap : 1
        }
    }
    return (
        <Box sx={sxStyles["container"]}>
            {
                props.annotations.map((annotation, index) => (
                    <Box sx={sxStyles["list-item"]} key={index}>
                        <Typography
                            sx={sxStyles["list-item-text"]}
                            component={"p"}
                            variant="caption"
                        >{annotation}</Typography>
                        <Box sx={sxStyles["list-item-panel"]}>
                            <IconButton color="error" sx={sxStyles["delete-button"]} onClick={() => { props.handleDelete(annotation) }}>
                                <Delete />
                            </IconButton>
                        </Box>
                    </Box>
                ))
            }
        </Box>
    )
}