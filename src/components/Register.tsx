import { useState } from "react"
import axios from "axios"
import { useAuth } from "../context/useAuth"
import type { RegisterRequest } from "../types"
import { Controller, useForm } from "react-hook-form"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import { useNavigate } from "react-router-dom"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"


const Register = () => {
    const { register } = useAuth()
    const navigate = useNavigate()

    const [serverError, setServerError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterRequest>({
        mode: 'onTouched',
        defaultValues: { email: '', password: '', fullName: '', role: 'caregiver' },
    })
    const onSubmit = async (data: RegisterRequest) => {
        setServerError(null)
        try {
            await register(data)
            navigate('/manager', { replace: true })

        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                setServerError('כבר קיים משתמש עם המייל הזה')
            } else {
                setServerError('ההרשמה נכשלה. נסו שוב')
            }
        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
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
                    required: 'יש להזין סיסמה',
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

            {serverError && <p className="text-error">{serverError}</p>}

            <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
                {isSubmitting ? 'נרשם...' : 'הרשמה'}
            </Button>
        </form>
    )
}
export default Register