import { Box, Button, SxProps, Typography } from "@mui/material";
import { ActivityTag, ContextTag } from "../../types/activityRegisterInstance";
import { useMemo } from "react";

interface TagCountProps {
    tags : ActivityTag[] | ContextTag[]
    onTagClick : (tag : ActivityTag | ContextTag) => void
    highlight? : ActivityTag[] | ContextTag[]
}

export default function TagCount (props : TagCountProps) {
    const highLightIds = useMemo(()=>{
        if(!props.highlight) return []
        return props.highlight.map(tag => tag.id)
    },[props.highlight])
    const sxStyles : Record<string,SxProps> = {
        container : {
            display : "flex",
            flexDirection : "row",
            flexWrap : "wrap",
            gap : 1
        },
        "tag-button" : {
            border : "none"
        },
        "tag-button-highligh" : {
         
        
        },
        "tag-text" : {
            color : "text.secondary",
            fontSize : 12,
            fontWeight : "bold",
            textTransform : "none"
        },
        "tag-text-highlight" : {
            color : "grey.50",
            fontSize : 12,
            fontWeight : "bold",
            textTransform : "none"
        },
        
    }
    return (
        <Box sx={sxStyles.container}>
            {props.tags.map((tag,index)=>{
                return (
                    <Button
                    color="success"
                    variant={highLightIds.includes(tag.id) ? "contained" : "outlined"}
                    sx={highLightIds.includes(tag.id) ? sxStyles["tag-button-highligh"] : sxStyles["tag-button"]}
                    onClick={()=>props.onTagClick(tag)}>
                        <Typography
                        key={index}
                        sx={highLightIds.includes(tag.id) ? sxStyles["tag-text-highlight"] : sxStyles["tag-text"]}
                        variant="subtitle1"
                        component="span"
                        >{tag.name}</Typography>
                    </Button>
                )
            })}
        </Box>
    )
}