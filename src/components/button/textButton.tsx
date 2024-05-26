import { Button, ButtonProps, SxProps } from "@mui/material";

export default function TextButton (props : ButtonProps) {
    const sxStyles : Record<string,SxProps> = {
        "container" : {
            textTransform : "none",
            fontWeight : "bold"
        }
    }
    return <Button 
    sx={sxStyles["container"]}
    {...props}
    />
}