import { Box, Button, IconButton, InputAdornment, SxProps, TextField, Typography } from "@mui/material";
import { ActivityTag, ContextTag } from "../../types/activityRegisterInstance";
import { useEffect, useMemo, useState } from "react";
import { Cancel, Search } from "@mui/icons-material";
import { useDebouncedCallback } from "use-debounce";

interface TagCountProps {
    tags: ActivityTag[] | ContextTag[]
    onTagClick?: (tag: ActivityTag | ContextTag) => void
    highlight?: ActivityTag[] | ContextTag[]
    variant?: "delete" | "add"
    search?: boolean
}

export default function TagCount(props: TagCountProps) {
    const [filteredTags, setFilteredTags] = useState<ContextTag[] | ActivityTag[]>(props.tags)
    const highLightIds = useMemo(() => {
        if (!props.highlight) return []
        return props.highlight.map(tag => tag.id)
    }, [props.highlight])

    const variant: "delete" | "add" = props.variant ? props.variant : "add"

    const sxStyles: Record<string, SxProps> = {
        "container": {
            display: "flex",
            flexDirection: "column",
            gap: 2
        },
        "tags": {
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 1,
            overflowY: "auto",
            maxHeight: 200
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
            alignItems: "center",
            backgroundColor: "gray.300"
        },
        "deleteBox-icon": {
            width: 20,
            height: "auto",
            color: "grey.600"
        }
    }

    const handleDebouncedSearch = useDebouncedCallback((value: string) => {
        if (props.search) {
            search(value)
        }
    }, 300)

    function search(value: string) {
        if (value.length === 0) {
            setFilteredTags(props.tags)
            return
        }
        const filtered = props.tags.filter(tag => tag.name.toLowerCase().includes(value.toLowerCase()))
        setFilteredTags(filtered)
    }

    useEffect(() => {
        setFilteredTags(props.tags)
    }, [props.tags])
    return (
        <Box sx={sxStyles["container"]}>
            {
                props.search &&
                <TextField
                    placeholder="Buscar"
                    size="small"
                    defaultValue={""}
                    onChange={(e) => handleDebouncedSearch(e.target.value)}
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            }

            <Box sx={sxStyles["tags"]}>
                {filteredTags.map((tag, index) => (
                    variant === "add" ?
                        <Button
                            disabled={props.onTagClick ? undefined : true}
                            key={index}
                            color="success"
                            variant={highLightIds.includes(tag.id) ? "contained" : "outlined"}
                            sx={highLightIds.includes(tag.id) ? sxStyles["tag-button-highligh"] : sxStyles["tag-button"]}
                            onClick={() => props.onTagClick && props.onTagClick(tag)}>
                            <Typography
                                key={index}
                                sx={highLightIds.includes(tag.id) ? sxStyles["tag-text-highlight"] : sxStyles["tag-text"]}
                                variant="subtitle1"
                                component="span"
                            >{tag.name}</Typography>
                        </Button>
                        :
                        <Box
                            key={index}
                            sx={sxStyles["deleteBox"]}>
                            <Typography
                                sx={highLightIds.includes(tag.id) ? sxStyles["tag-text-highlight"] : sxStyles["tag-text"]}
                                variant="subtitle1"
                                component="span"
                            >{tag.name}</Typography>
                            <IconButton
                                disabled={props.onTagClick ? undefined : true}
                                color="error"
                                onClick={() => props.onTagClick && props.onTagClick(tag)}>
                                <Cancel sx={sxStyles["deleteBox-icon"]} />
                            </IconButton>
                        </Box>
                ))
                }
            </Box>
        </Box>
    )
}