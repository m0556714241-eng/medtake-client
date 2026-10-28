import { useSnackbar } from "notistack"
import { useState } from "react"
import type { ApiError, SendMessageRequest } from "../types"
import { Controller, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { sendMessage } from "../api/messages"
import axios from "axios"
import Button from "@mui/material/Button"
import AppDialog from "./AppDialog"
import MailOutlineIcon from "@mui/icons-material/EmailOutlined" // תוקן: ב-MUI 9 שם הקובץ הוא EmailOutlined
import TextField from "@mui/material/TextField"

const quickTexts = ['התרופה עומדת להיגמר', 'לא מרגיש טוב', 'שכחתי לקחת תרופה']
const SendMessage = () => {
    const [open, setOpen] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const { enqueueSnackbar } = useSnackbar()
    const {
        control,
        handleSubmit,
        setValue,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<SendMessageRequest>({
        mode: 'onTouched',
        defaultValues: { text: '' },
    })
    const sendMutation = useMutation({ mutationFn: sendMessage })
    const handleClose = () => {
        reset()
        setServerError(null)
        setOpen(false)

    }
    const onSubmit = async (data: SendMessageRequest) => {
        setServerError(null)
        try {
            await sendMutation.mutateAsync(data)
            handleClose()
            enqueueSnackbar('ההודעה נשלחה', { variant: 'success' })

        } catch (error) {
            if (axios.isAxiosError<ApiError>(error)) {
                const serverErrors = error.response?.data?.errors
                if (error.response?.status === 400 && serverErrors?.text) {
                    setError('text', { message: serverErrors.text })
                    return


                }



            }
            setServerError('השליחה נכשלה. נסו שוב')

        }


    }
    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                startIcon={<MailOutlineIcon />}
                sx={{ bgcolor: 'primary.light', color: 'primary.dark', fontWeight: 700 }}
            >
                הודעה למטפל
            </Button>
            <AppDialog open={open} onClose={handleClose} title="הודעה למטפל">
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                        {quickTexts.map(quick => (
                            <Button
                                key={quick}
                                type="button"
                                variant="soft"
                                size="small"
                                onClick={() => setValue('text', quick, { shouldValidate: true })}
                                disabled={isSubmitting}
                            >
                                {quick}
                            </Button>
                        ))}

                    </div>

                    <Controller
                        name="text"
                        control={control}
                        rules={{
                            validate: value => value.trim().length > 0 || 'יש לכתוב הודעה',
                            maxLength: { value: 500, message: 'עד 500 תווים' },
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="ההודעה"
                                multiline
                                minRows={3}
                                error={!!errors.text}
                                helperText={errors.text?.message}
                                fullWidth
                                disabled={isSubmitting}
                            />
                        )}
                    />
                    {serverError && <p className="m-0 text-error">{serverError}</p>}

                    <div className="mt-2 flex flex-wrap gap-3 border-0 border-t border-solid border-[#EDF2EF] pt-5">
                        <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ minHeight: 52, px: 4 }}>
                            {isSubmitting ? 'שולח...' : 'שליחה'}
                        </Button>
                        <Button type="button" variant="soft" onClick={handleClose} disabled={isSubmitting} sx={{ minHeight: 52, px: 3 }}>
                            ביטול
                        </Button>
                    </div>

                </form>


            </AppDialog>

        </>
    )
}
export default SendMessage