import { joiResolver } from "@hookform/resolvers/joi"
import { Box, Button, SxProps, TextField } from "@mui/material"
import Joi from "joi"
import { useForm } from "react-hook-form"
import ErrorLabel from "../text/errorLabel"
import { ContextTag } from "../../types/activityRegisterInstance"
import { v4 } from "uuid"
interface Data {
    name: string
}

const schema = Joi.object({
    name: Joi.string().min(1).max(30).required()
})

interface AddActivityRegisterInputProps {
    onSubmit: (data: ContextTag) => void
}
export default function AddContextTagInput(props: AddActivityRegisterInputProps) {
    const { register, handleSubmit, setValue,formState: { errors } } = useForm<Data>({
        resolver: joiResolver(schema)
    })

    const sxStyles :Record<string,SxProps> = {
        "container" : {
            display : "flex",
            flexDirection :"column",
            gap :1
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
        props.onSubmit({
            name: data.name,
            id: v4()
        })
        setValue("name","")
    }

    return (
        <Box sx={sxStyles["container"]}>
            <Box sx={sxStyles["input-box"]}>
                <TextField
                size="small"
                autoComplete="-"
                sx={sxStyles["input"]}
                variant="filled"
                    label="subActividad o contexto"
                    {...register("name")}
                />
                <Button sx={sxStyles["input-button"]} onClick={handleSubmit((data) => handleEmit(data))}>Añadir</Button>
            </Box>
            {errors.name && <ErrorLabel>{errors.name.message}</ErrorLabel>}
        </Box>
    )
}