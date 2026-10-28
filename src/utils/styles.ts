// עיצוב: סגנונות משותפים לשורות הסינון (עמוד הניהול ועמוד המטופל) – כדי לא לכתוב אותם פעמיים

// צל רך לגלולות הלבנות
export const pillShadow = '0 10px 24px -18px rgba(33,78,72,.45)'

// שדה לבן ועגול לגמרי ("גלולה"), בלי מסגרת – לחיפוש ולרשימות הנפתחות
export const pillFieldSx = {
    "& .MuiOutlinedInput-root": { borderRadius: 999, bgcolor: "#FFFFFF", boxShadow: pillShadow, "& fieldset": { border: 0 } },
}
