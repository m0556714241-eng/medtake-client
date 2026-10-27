import { Controller, useFieldArray, useForm, type Path } from "react-hook-form"
import type { ApiError, Prescription, PrescriptionFormValues } from "../types"
import TextField from "@mui/material/TextField"
import MenuItem from "@mui/material/MenuItem"
import { dayLabels, prescriptionStatusShapes } from "../utils/labels"
import Button from "@mui/material/Button"
import FormHelperText from "@mui/material/FormHelperText"
import FormControlLabel from "@mui/material/FormControlLabel"
import Checkbox from "@mui/material/Checkbox"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import DeleteIcon from "@mui/icons-material/Delete"
import AddIcon from "@mui/icons-material/Add"
import { useMutation, useQueryClient } from "@tanstack/react-query" // תוקן: הוסר useQuery שכבר לא בשימוש
import { useState } from "react"
import { createPrescription, updatePrescription } from "../api/prescriptions" // תוקן: הוסר getPrescription שכבר לא בשימוש
import axios from "axios"
type amountFieldsName = 'unitsPerDose' | 'stockQuantity' | 'lowStockThreshold' | 'missedAfterMinutes'
interface amountFieldsConfig {
    name: amountFieldsName
    label: string
    helper: string
    min: number
    max: number
}
const amountFields: amountFieldsConfig[] = [
    { name: 'unitsPerDose', label: 'יחידות למנה', helper: 'כמה יורד מהמלאי בכל נטילה', min: 1, max: 100 },
    { name: 'missedAfterMinutes', label: 'דקות עד "פוספס"', helper: 'אחרי כמה דקות משעת נטילת המנה נחשבת כפוספסה', min: 5, max: 720 },
    { name: 'stockQuantity', label: 'מלאי נוכחי', helper: 'כמה יחידות יש עכשיו', min: 0, max: 100000 },
    { name: 'lowStockThreshold', label: 'התראה כשהמלאי יורד ל־', helper: 'מתחת למספר הזה תופיע התראת מלאי נמוך', min: 0, max: 100000 },
]
type MedicineFormValues = Omit<PrescriptionFormValues, 'schedule'> & {
    schedule: {
        days: number[]
        times: { value: string }[]
    }
}

interface AddMedicineProps {
    onClose: () => void
    prescription?: Prescription
    patientId: string

}

const AddMedicine = ({ onClose, patientId, prescription }: AddMedicineProps) => {
    const isEdit = !!prescription
    const {
        control,
        handleSubmit,
        getValues,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<MedicineFormValues>({
        mode: 'onTouched',
        defaultValues: {
            patientId,
            drugName: prescription?.drugName ?? '',
            dosage: prescription?.dosage ?? '',
            form: prescription?.form ?? 'tablet',
            unitsPerDose: prescription?.unitsPerDose ?? 1,
            schedule: {
                days: prescription?.schedule.days ?? [],
                times: prescription
                    ? prescription.schedule.times.map(value => ({ value }))
                    : [{ value: '' }],
            },
            startDate: prescription?.startDate ?? '',
            endDate: prescription?.endDate ?? null,
            instructions: prescription?.instructions ?? '',
            missedAfterMinutes: prescription?.missedAfterMinutes ?? 60,
            stockQuantity: prescription?.stockQuantity ?? 0,
            lowStockThreshold: prescription?.lowStockThreshold ?? 0,
            status: prescription?.status ?? 'active',
        },
    })
    const { fields, append, remove } = useFieldArray(
        {
            control,
            name: 'schedule.times',
        }
    )

    const queryClient = useQueryClient()
    const [serverError, setServerError] = useState<string | null>(null)
    const addMutation = useMutation({
        mutationFn: (data: PrescriptionFormValues) =>
            prescription ? updatePrescription(prescription.id, data)
                : createPrescription(data),
    })
    const onSubmit = async (data: MedicineFormValues) => {
        setServerError(null)
        const body: PrescriptionFormValues = {
            ...data,
            schedule: {
                days: data.schedule.days,
                times: data.schedule.times.map(t => t.value)
            },
            endDate: data.endDate || null,

        }
        try {
            await addMutation.mutateAsync(body)
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['prescriptions'] }),
                queryClient.invalidateQueries({ queryKey: ['doses'] }),
                queryClient.invalidateQueries({ queryKey: ['patient', patientId] }),
                queryClient.invalidateQueries({ queryKey: ['patients'] }),
                queryClient.invalidateQueries({ queryKey: ['alerts'] }),
            ])
            onClose()
        }
        catch (error) {
            if (axios.isAxiosError<ApiError>(error)) {
                const serverErrors = error.response?.data?.errors
                if (error.response?.status === 400 && serverErrors) { // תוקן: === במקום ==
                    for (const [field, message] of Object.entries(serverErrors)) {
                        setError(field as Path<MedicineFormValues>, { message })
                    }
                    return

                }
            }
            setServerError(isEdit ? 'העריכה נכשלה. נסו שוב' : 'ההוספה נכשלה. נסו שוב')
        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
            <Controller
                name="drugName"
                control={control}
                rules={{
                    required: 'יש להזין שם תרופה',
                    maxLength: { value: 100, message: 'עד 100 תווים' },
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="שם התרופה"
                        error={!!errors.drugName}
                        helperText={errors.drugName?.message}
                        fullWidth
                        disabled={isSubmitting}
                    />
                )}
            />

            <Controller
                name="dosage"
                control={control}
                rules={{
                    required: 'יש להזין מינון',
                    maxLength: { value: 50, message: 'עד 50 תווים' },
                }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="מינון"
                        error={!!errors.dosage}
                        helperText={errors.dosage?.message ?? 'לדוגמה: 500 מ"ג'}
                        fullWidth
                        disabled={isSubmitting}
                    />
                )}
            />
            <Controller
                name="form"
                control={control}
                rules={{ required: 'יש לבחור סוג תרופה' }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        select
                        label="סוג תרופה"
                        error={!!errors.form}
                        helperText={errors.form?.message}
                        fullWidth
                        disabled={isSubmitting}
                    >
                        {Object.entries(prescriptionStatusShapes).map(([value, label]) => (
                            <MenuItem key={value} value={value}>
                                {label}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
            />

            <div className="flex flex-wrap gap-4">
                <Controller
                    name="startDate"
                    control={control}
                    rules={{ required: 'יש לבחור תאריך התחלה' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="תאריך התחלה"
                            type="date"
                            error={!!errors.startDate}
                            helperText={errors.startDate?.message}
                            className="flex-1 min-w-40"
                            slotProps={{ inputLabel: { shrink: true } }}
                            disabled={isSubmitting}
                        />
                    )}
                />

                <Controller
                    name="endDate"
                    control={control}
                    rules={{
                        validate: value =>
                            !value || value >= getValues('startDate') || 'תאריך הסיום לא יכול להיות לפני תאריך ההתחלה',
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            value={field.value ?? ''}
                            label="תאריך סיום (לא חובה)"
                            type="date"
                            error={!!errors.endDate}
                            helperText={errors.endDate?.message}
                            className="flex-1 min-w-40"
                            slotProps={{ inputLabel: { shrink: true } }}
                            disabled={isSubmitting}
                        />
                    )}
                />
            </div>
            <Controller
                name="schedule.days"
                control={control}
                rules={{
                    validate: value => value.length > 0 || 'יש לבחור לפחות יום אחד',
                }}
                render={({ field }) => (
                    <div>
                        <Typography variant="body2" color="text.secondary">ימים בשבוע</Typography>
                        <Button type="button" size="small" onClick={() => field.onChange(field.value.length === 7 ? [] : [0, 1, 2, 3, 4, 5, 6])} disabled={isSubmitting}>{field.value.length === 7 ? 'ניקוי' : 'כל יום'}</Button>
                        <div className="flex flex-wrap gap-1">
                            {dayLabels.map((label, index) => (
                                <FormControlLabel
                                    key={index}
                                    label={label}
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={field.value.includes(index)}
                                            onChange={() =>
                                                field.onChange(
                                                    field.value.includes(index) ?
                                                        field.value.filter(d => d != index) :
                                                        [...field.value, index].sort((a, b) => a - b)
                                                )




                                            }
                                            disabled={isSubmitting}
                                        />
                                    }
                                />
                            ))}
                        </div>
                        {errors.schedule?.days && (
                            <FormHelperText error>{errors.schedule.days.message}</FormHelperText>
                        )}
                    </div>
                )}
            />
            <div className="flex flex-col gap-2">
                <Typography variant="body2" color="text.secondary">שעות</Typography>
                {
                    fields.map((item, index) => (
                        <div key={item.id} className="flex items-start gap-2">
                            <Controller
                                name={`schedule.times.${index}.value`}
                                control={control}
                                rules={{
                                    required: 'יש לבחור שעה',
                                    validate: value =>
                                        getValues('schedule.times').filter(t => t.value === value).length === 1
                                        || 'השעה הזו כבר קיימת',
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        type="time"
                                        size="small"
                                        label={`שעה ${index + 1}`}
                                        error={!!errors.schedule?.times?.[index]?.value}
                                        helperText={errors.schedule?.times?.[index]?.value?.message}
                                        slotProps={{ inputLabel: { shrink: true } }}
                                        className="min-w-40"
                                        disabled={isSubmitting}
                                    />
                                )}
                            />
                            <IconButton
                                aria-label="מחיקת שעה"
                                onClick={() => remove(index)}
                                disabled={fields.length == 1 || isSubmitting}>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    )

                    )
                }
                <Button
                    type="button"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => append({ value: '' })}
                    className="self-start"
                    disabled={isSubmitting}
                >
                    הוספת שעה
                </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                {amountFields.map(
                    config => (
                        <Controller
                            key={config.name}
                            name={config.name}
                            control={control}
                            rules={{
                                min: { value: config.min, message: `מינימום ${config.min}` },
                                max: { value: config.max, message: `מקסימום ${config.max}` },
                                validate: value =>
                                    Number.isNaN(value) ? ' יש להזין מספר'
                                        : Number.isInteger(value) || 'מספר שלם בלבד',

                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    value={Number.isNaN(field.value) ? '' : field.value}
                                    onChange={e =>
                                        field.onChange(e.target.value === "" ? NaN : Number(e.target.value))
                                    }
                                    type="number"
                                    label={config.label}
                                    error={!!errors[config.name]}
                                    helperText={errors[config.name]?.message ?? config.helper}
                                    slotProps={{ htmlInput: { min: config.min, max: config.max } }}
                                    fullWidth
                                    disabled={isSubmitting}
                                />
                            )}
                        />
                    )
                )}

            </div>

            <Controller
                name="instructions"
                control={control}
                rules={{ maxLength: { value: 500, message: 'עד 500 תווים' } }}
                render={({ field }) => (
                    <TextField
                        {...field}
                        label="הוראות (לא חובה)"
                        multiline
                        rows={2}
                        error={!!errors.instructions}
                        helperText={errors.instructions?.message ?? 'לדוגמה: אחרי האוכל'}
                        fullWidth
                        disabled={isSubmitting}
                    />
                )}
            />


            {serverError && <p className="text-error">{serverError}</p>}

            <div className="flex justify-end gap-2">
                <Button
                    type="button"
                    variant="outlined"
                    onClick={onClose}
                    disabled={isSubmitting}
                >
                    ביטול
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (isEdit ? 'שומר...' : 'מוסיף...') : (isEdit ? 'שמירה' : 'הוספה')}
                </Button>
            </div>
        </form>
    )
}
export default AddMedicine