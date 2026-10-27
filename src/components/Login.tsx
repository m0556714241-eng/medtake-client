import { useState } from "react"
import { useAuth } from "../context/useAuth"
import type { LoginRequest } from "../types"
import { Controller, useForm } from "react-hook-form"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import CircularProgress from "@mui/material/CircularProgress"
import { useNavigate } from 'react-router-dom'
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"

const Login = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [serverError, setServerError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginRequest>({
        mode: 'onTouched',
        defaultValues: { email: '', password: '' },
    })
    const onSubmit = async (data: LoginRequest) => {
        setServerError(null)
        try {
            const user = await login(data.email, data.password)
            navigate(user.role === 'caregiver' ? '/manager' : '/my-medicines', { replace: true })

        } catch {
            setServerError('ההתחברות נכשלה. בדקו את המייל והסיסמה')
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
                        autoComplete="email"
                        type="email"
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
                rules={{ required: 'יש להזין סיסמה' }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="סיסמה"
                        autoComplete="current-password"
                        type={showPassword ? "text" : "password"}
                        error={!!errors.password}
                        helperText={errors.password?.message}
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

            {serverError && <p className="text-error">{serverError}</p>}

            <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
                {isSubmitting ? 'מתחבר...' : 'התחברות'}
            </Button>
        </form>
    )
}
export default Login