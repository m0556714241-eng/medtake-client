import { useState } from "react"
import type { Prescription } from "../types"
import { Controller, useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { refillStock } from "../api/prescriptions"
import Typography from "@mui/material/Typography"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"

interface RefillStockProps {
    prescription: Prescription
    onClose: () => void
}
interface RefillFormValues {
    quantity: number
}

const RefillStock = ({ prescription, onClose }: RefillStockProps) => {
    const [serverError, setServerError] = useState<string | null>(null)
    const queryClient = useQueryClient()
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RefillFormValues>({
        mode: 'onTouched',
        defaultValues: { quantity: 1 },
    })
    const refillMutation = useMutation({
        mutationFn: (quantity: number) =>
            refillStock(prescription.id, quantity)
    })
    const onSubmit = async (data: RefillFormValues) => {
        setServerError(null)
        try {
            await refillMutation.mutateAsync(data.quantity)
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['prescriptions'] }),
                queryClient.invalidateQueries({ queryKey: ['doses'] }),
                queryClient.invalidateQueries({ queryKey: ['patient', prescription.patientId] }),
                queryClient.invalidateQueries({ queryKey: ['patients'] }),
                queryClient.invalidateQueries({ queryKey: ['alerts'] }),
            ])
            onClose()
        }
        catch {
            setServerError('חידוש המלאי נכשל. נסו שוב')

        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-4">
            <Typography color="text.secondary">
                מלאי נוכחי: {prescription.stockQuantity}
            </Typography>
            <Controller
                name="quantity"
                control={control}
                rules={{
                    min: { value: 1, message: 'מינימום 1' },
                    max: { value: 10000, message: 'מקסימום 10,000' },
                    validate: value =>
                        Number.isNaN(value) ? 'יש להזין מספר'
                            : Number.isInteger(value) || 'מספר שלם בלבד',
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        value={Number.isNaN(field.value) ? '' : field.value}
                        onChange={e =>
                            field.onChange(
                                e.target.value === '' ? NaN : Number(e.target.value)
                            )
                        }
                        type="number"
                        label="כמה יחידות להוסיף?"
                        error={!!errors.quantity}
                        helperText={errors.quantity?.message}
                        fullWidth
                        disabled={isSubmitting}
                        slotProps={{ htmlInput: { min: 1, max: 10000, step: 1 } }}
                    />
                )}
            />

            {serverError && <p className="text-error">{serverError}</p>}
            <div className="flex justify-end gap-2">
                <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
                    ביטול
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting} >
                     {isSubmitting ? 'מוסיף...' : 'הוספה'}
                </Button>
            </div>

        </form>
    )

}
export default RefillStock