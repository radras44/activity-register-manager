import { Box, Typography } from "@mui/material"
import { useState } from "react"
import EditActivityTagModal from "../../../components/modals/editActivityTagModal"
import TagCount from "../../../components/text/tagCount"
import { UserContextReturn } from "../../../context/userContext"
import useModal from "../../../hook/useModal"
import { ActivityRegisterInstance, ActivityTag, ContextTag } from "../../../types/activityRegisterInstance"

export default function ActivityTagView(props : {instance : ActivityRegisterInstance,userContext : UserContextReturn}) {
    const editActivityTag = useModal()
    const [selectedActivityTag, setSelectedActivityTag] = useState<ActivityTag | null>(null)
    function handleActivityTagClick(activityTag: ActivityTag | ContextTag) {
        setSelectedActivityTag(activityTag as ActivityTag)
        editActivityTag.open()
    }
    function onEditModalSubmit (activityTag : ActivityTag) {
        props.userContext.dispatch({
            type : "UPDATE_ACTIVITY_TAG",
            payload : {instance : props.instance,activityTag : activityTag}
        })
    }
    return (
        <Box>
            <Typography variant="h6">Tags de actividades</Typography>
            <TagCount
                tags={props.instance.activityTags}
                onTagClick={handleActivityTagClick}
            />
            {
                (selectedActivityTag && editActivityTag.show) &&
                <EditActivityTagModal
                    onSubmit={onEditModalSubmit}
                    open={editActivityTag.show}
                    onClose={editActivityTag.close}
                    activityTag={selectedActivityTag}
                />
            }
        </Box>
    )
}