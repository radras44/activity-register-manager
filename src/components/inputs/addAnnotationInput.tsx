import { SxProps, Box, TextField, Button } from "@mui/material"
import Joi from "joi"
import ErrorLabel from "../text/errorLabel"
import { joiResolver } from "@hookform/resolvers/joi"
import { useForm } from "react-hook-form"

interface AddAnnotationInputProps {
    onSubmit: (annotation : string) => void
}

interface Data {
    annotation: string
}

const schema = Joi.object({
    annotation: Joi.string().min(1).max(1000).required()
})


export default function AddAnnotationInput(props : AddAnnotationInputProps) {
    const { register, handleSubmit, setValue,formState: { errors } } = useForm<Data>({
        resolver: joiResolver(schema)
    })
    const sxStyles :Record<string,SxProps> = {
        "container" : {
            display : "flex",
            flexDirection :"column",
            gap :1,
        },
        "input-box" : {
            display : "flex",
            flexDirection :"row",
            alignItems : "center",
            gap : 1
        },
        "input" : {
            padding : 0
        },
        "input-button" : {
            display : "block",
            textTransform : "none",
            fontWeight : "bold"
        }
    }
    function handleEmit(data: Data) {
        props.onSubmit(data.annotation)
        setValue("annotation","")
    }
    return (
        <Box sx={sxStyles["container"]}>
        <Box sx={sxStyles["input-box"]}>
            <TextField
            size="small"
            autoComplete="-"
            sx={sxStyles["input"]}
            variant="outlined"
            placeholder="Añadir nota"
                {...register("annotation")}
            />
            <Button sx={sxStyles["input-button"]} onClick={handleSubmit((data) => handleEmit(data))}>Añadir</Button>
        </Box>
        {errors.annotation && <ErrorLabel>{errors.annotation.message}</ErrorLabel>}
    </Box>
    )
}