import { Box, Button, Modal, SxProps, Typography } from "@mui/material";
import modalStyles from "./modalStyles";
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { clockHourToMilis, milisToClockHour } from "../../utils/logic/timeUtils";
import { CSSProperties } from "react";
import { styleTheme } from "../../main";
import ErrorLabel from "../text/errorLabel";

interface editStopWatchModalProps {
    open: boolean
    onClose: ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
    onSubmit: (time: number) => void
    defaultTime : number
}

interface Data {
    hours: string,
    minutes: string,
    seconds: string,
    miliSeconds: string
}

const schema = Joi.object({
    hours: Joi.number().min(0).max(99).required(),
    minutes: Joi.number().min(0).max(99).required(),
    seconds: Joi.number().min(0).max(99).required(),
    miliSeconds: Joi.number().min(0).max(9).required()
})

export default function EditStopWatchModal(props: editStopWatchModalProps) {
    const defaultTime = milisToClockHour(props.defaultTime)
   
    const { handleSubmit, setValue, register, getValues, formState: { errors } } = useForm<Data>({
        resolver: joiResolver(schema),
        defaultValues: {
            hours: defaultTime.hours,
            minutes: defaultTime.minutes,
            seconds: defaultTime.seconds,
            miliSeconds: defaultTime.miliseconds
        }
    })
    const sxStyles: Record<string, SxProps> = {
        "container": {
            ...modalStyles["container"],
            display: "flex",
            flexDirection: "column",
            gap: 2
        },
        "form": {
            display: "flex",
            flexDirection: "column",
            gap: 30
        },
        "form-body": {
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            justifyContent: "center",
            alignItems: "center",
            borderBottom : `1px solid ${styleTheme.palette.text.secondary}`
        },
        "form-body-input": {
            width: 40,
            fontSize: 30,
            textAlign: "center",
            border: "none",
            outline: "none"
        },
        "form-body-input-last": {
            width: 20,
            fontSize: 30,
            textAlign: "center",
            border: "none",
            outline: "none"
        },
        "form-body-span" : {
            fontSize : 30,
            fontWeight : "bold"
        },
        "form-panel" : {
            display : "flex",
            flexDirection : "row",
            gap : 1,
            justifyContent : "center"
        }
    }

    function submit(data: Data) {
        console.log(data)
        const timeInMilis: number = clockHourToMilis({
            hours: parseInt(data.hours),
            minutes: parseInt(data.minutes),
            seconds: parseInt(data.seconds),
            miliSeconds: parseInt(data.miliSeconds)
        })
        props.onSubmit(timeInMilis)
        props.onClose({}, "backdropClick")
    }

    function formatField(name: "hours" | "minutes" | "seconds" | "miliSeconds", length: number) {
        setValue(name, getValues(name).padStart(length, "0"))
    }

    return (
        <Modal open={props.open} onClose={props.onClose}>
            <Box sx={sxStyles["container"]}>
                <Box sx={sxStyles["container-head"]}>
                    <Typography textAlign={"center"} variant="h5">Modificar cronometro</Typography>
                    <Typography textAlign={"center"} variant="body2">formato : h:m:s:ms</Typography>
                </Box>
                <form style={sxStyles["form"] as CSSProperties} onSubmit={handleSubmit((data)=>submit(data))}>
                    <Box sx={sxStyles["form-body"]}>
                        <input
                            style={sxStyles["form-body-input"] as CSSProperties}
                            maxLength={2}
                            placeholder="00"
                            type="text"
                            {...register("hours")}
                            onBlur={() => formatField("hours", 2)}
                        />
                        <span style={sxStyles["form-body-span"] as CSSProperties}>:</span>
                        <input
                            style={sxStyles["form-body-input"] as CSSProperties}
                            maxLength={2}
                            placeholder="00"
                            type="text"
                            {...register("minutes")}
                            onBlur={() => formatField("minutes", 2)}
                        />
                          <span style={sxStyles["form-body-span"] as CSSProperties}>:</span>
                        <input
                            style={sxStyles["form-body-input"] as CSSProperties}
                            maxLength={2}
                            placeholder="00"
                            type="text"
                            {...register("seconds")}
                            onBlur={() => formatField("seconds", 2)}
                        />
                          <span style={sxStyles["form-body-span"] as CSSProperties}>.</span>
                        <input
                            style={sxStyles["form-body-input-last"] as CSSProperties}
                            maxLength={1}
                            placeholder="0"
                            type="text"
                            {...register("miliSeconds")}
                            onBlur={() => formatField("miliSeconds", 1)}
                        />
                    </Box>
          
                        {errors.hours && <ErrorLabel>{errors.hours.message}</ErrorLabel>}
                        {errors.minutes && <ErrorLabel>{errors.minutes.message}</ErrorLabel>}
                        {errors.seconds && <ErrorLabel>{errors.seconds.message}</ErrorLabel>}
                        {errors.miliSeconds && <ErrorLabel>{errors.miliSeconds.message}</ErrorLabel>}
                    <Box sx={sxStyles["form-panel"]}>
                        <Button variant="contained" type="submit">Guardar</Button>
                        <Button variant="outlined" onClick={() => props.onClose({}, "backdropClick")}>Cancel</Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    )
}