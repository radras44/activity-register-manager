import { Typography } from "@mui/material";

interface ErrorLabelprops {
    children : React.ReactNode
}

export default function ErrorLabel (props : ErrorLabelprops) {
    return (
        <Typography variant="body2" color={"error.main"}>{props.children}</Typography>
    )
}