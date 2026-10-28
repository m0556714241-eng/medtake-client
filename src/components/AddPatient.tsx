import { useEffect, useState } from "react"
import type { ApiError, CreatePatientRequest } from "../types"
import { Controller, useForm } from "react-hook-form"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createPatient, getPatient, updatePatient } from "../api/patients"
import axios from "axios"
import { useSnackbar } from "notistack"
interface AddPatientProps {
    onClose: () => void
    patientId?: string
}

const AddPatient = ({ onClose, patientId }: AddPatientProps) => {
    const isEdit = !!patientId
    const [serverError, setServerError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const {
        control,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<CreatePatientRequest>({
        mode: 'onTouched',
        defaultValues: { email: '', password: '', fullName: '', birthDate: '' },
    })
    const { enqueueSnackbar } = useSnackbar()
    const { data, isPending } = useQuery({
        queryKey: ['patient', patientId],
        queryFn: () => getPatient(patientId!),
        enabled: isEdit


    })
    useEffect(
        () => {
            if (data) {
                reset({
                    fullName: data.fullName,
                    email: data.email,
                    password: '',
                    birthDate: data.birthDate ?? '',

                })
            }
        }
        , [data, reset])
    const queryClient = useQueryClient();
    const addMutation = useMutation({

        mutationFn: (data: CreatePatientRequest) =>
            isEdit ? updatePatient(patientId!, data) : createPatient(data)
    })
    const onSubmit = async (data: CreatePatientRequest) => {
        setServerError(null)
        try {
            await addMutation.mutateAsync(data)
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['patients'] }),
                ...(isEdit ? [queryClient.invalidateQueries({ queryKey: ['patient', patientId] })] : []),
            ])
            if (isEdit) enqueueSnackbar('פרטי המטופל עודכנו', { variant: 'success' })
            onClose()
        } catch (error) {
            if (axios.isAxiosError<ApiError>(error)) {
                const status = error.response?.status
                const serverErrors = error.response?.data?.errors
                if (status == 409) {
                    setError('email', { message: 'כבר קיים משתמש עם המייל הזה' })
                    return
                }
                if (status == 400 && serverErrors) {
                    for (const [field, message] of Object.entries(serverErrors))
                        setError(field as keyof CreatePatientRequest, { message })
                    return
                }

            }
           
                setServerError(
                    isEdit
                        ? 'השמירה נכשלה. נסו שוב'
                        : 'ההוספה נכשלה. נסו שוב'
                )
            

        }
    }
    if (isEdit && isPending) {
        return <p>טוען...</p>
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <Controller
                name="fullName"
                control={control}
                rules={{
                    required: 'יש להזין שם',
                    minLength: { value: 2, message: 'לפחות 2 תווים' },
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="שם מלא"
                        type="text"
                        autoComplete="name"
                        error={!!errors.fullName}
                        helperText={errors.fullName?.message ?? 'לדוגמה: שלום שרה'}
                        fullWidth

                        disabled={isSubmitting}
                    />
                )}


            />

            <Controller
                name="email"
                control={control}
                rules={{
                    required: 'יש להזין כתובת מייל',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'כתובת המייל אינה תקינה',
                    },
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="מייל"
                        type="email"
                        autoComplete="email"
                        error={!!errors.email}
                        helperText={errors.email?.message ?? 'לדוגמה: name@example.com'}
                        fullWidth
                        disabled={isSubmitting}
                    />
                )}
            />

            <Controller
                name="password"
                control={control}
                rules={{
                    required: isEdit ? false : 'יש להזין סיסמה',
                    minLength: { value: 8, message: 'לפחות 8 תווים' },
                    pattern: {
                        value: /^(?=.*[A-Za-z\u0590-\u05FF])(?=.*\d).+$/,
                        message: 'הסיסמה חייבת לכלול לפחות אות אחת וספרה אחת',
                    },
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="סיסמה"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        error={!!errors.password}
                        helperText={errors.password?.message ?? 'לפחות 8 תווים, עם אות וספרה'}
                        disabled={isSubmitting}
                        fullWidth
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(prev => !prev)}
                                            aria-label={showPassword ? "הסתרת הסיסמה" : "הצגת הסיסמה"}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                )}
            />

            <Controller
                name="birthDate"
                control={control}
                rules={{
                    required: 'יש לבחור תאריך',

                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="תאריך לידה"
                        type="date"
                        autoComplete="bday"
                        error={!!errors.birthDate}
                        helperText={errors.birthDate?.message}
                        fullWidth
                        slotProps={{
                            inputLabel: { shrink: true },
                        }}

                        disabled={isSubmitting}
                    />
                )}


            />

            {serverError && <p className="text-error">{serverError}</p>}

            {/* עיצוב: הכפתורים בשורה אחת אחרי קו מפריד – כמו בהדמיה */}
            <div className="mt-2 flex flex-wrap gap-3 border-0 border-t border-solid border-[#EDF2EF] pt-5">
            <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ minHeight: 52, px: 4 }}
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
               {isSubmitting ? 'שומר...' : isEdit ? 'שמירה' : 'הוספה'}
            </Button>
            <Button
                type="button"
                variant="soft" // עיצוב: "ביטול" כגלולה אפורה-בהירה
                size="large"
                sx={{ minHeight: 52, px: 3 }}
                onClick={onClose}
                disabled={isSubmitting}
            >
                ביטול
            </Button>
            </div>
        </form>
    )
}
export default AddPatient