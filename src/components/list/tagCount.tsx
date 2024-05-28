import { Box, Button, IconButton, SxProps, Typography } from "@mui/material";
import { ActivityTag, ContextTag } from "../../types/activityRegisterInstance";
import { useMemo } from "react";
import { Cancel } from "@mui/icons-material";

interface TagCountProps {
    tags: ActivityTag[] | ContextTag[]
    onTagClick: (tag: ActivityTag | ContextTag) => void
    highlight?: ActivityTag[] | ContextTag[]
    variant?: "delete" | "add"
}

export default function TagCount(props: TagCountProps) {
    const highLightIds = useMemo(() => {
        if (!props.highlight) return []
        return props.highlight.map(tag => tag.id)
    }, [props.highlight])

    const variant: "delete" | "add" = props.variant ? props.variant : "add"

    const sxStyles: Record<string, SxProps> = {
        container: {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 1
        },
        "tag-button": {
            border: "none"
        },
        "tag-button-highligh": {


        },
        "tag-text": {
            color: "text.secondary",
            fontSize: 12,
            fontWeight: "bold",
            textTransform: "none"
        },
        "tag-text-highlight": {
            color: "grey.50",
            fontSize: 12,
            fontWeight: "bold",
            textTransform: "none"
        },
        "deleteBox": {
            display: "flex",
            flexDirection: "row",
            alignItems : "center",
            backgroundColor : "gray.300"
        },
        "deleteBox-icon" : {
            width : 20,
            height : "auto",
            color : "grey.600"
        }
    }
    return (
        <Box sx={sxStyles.container}>
            {props.tags.map((tag, index) => (
                variant === "add" ?
                    <Button
                        key={index}
                        color="success"
                        variant={highLightIds.includes(tag.id) ? "contained" : "outlined"}
                        sx={highLightIds.includes(tag.id) ? sxStyles["tag-button-highligh"] : sxStyles["tag-button"]}
                        onClick={() => props.onTagClick(tag)}>
                        <Typography
                            key={index}
                            sx={highLightIds.includes(tag.id) ? sxStyles["tag-text-highlight"] : sxStyles["tag-text"]}
                            variant="subtitle1"
                            component="span"
                        >{tag.name}</Typography>
                    </Button>
                    :
                    <Box sx={sxStyles["deleteBox"]}>
                        <Typography
                            key={index}
                            sx={highLightIds.includes(tag.id) ? sxStyles["tag-text-highlight"] : sxStyles["tag-text"]}
                            variant="subtitle1"
                            component="span"
                        >{tag.name}</Typography>
                        <IconButton
                            color="error"
                            onClick={() => props.onTagClick(tag)}>
                            <Cancel sx={sxStyles["deleteBox-icon"]} />
                        </IconButton>
                    </Box>
            ))
            }
        </Box>
    )
}