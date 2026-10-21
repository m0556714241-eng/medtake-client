# אפיון שרת – מערכת מעקב נטילת תרופות

## א. תיאור הפרויקט

**שם:** MedTake – מעקב נטילת תרופות

**מטרה:** לעזור לאנשים שנוטלים תרופות באופן קבוע לא לשכוח מה לקחו ומה לא, ולאפשר לאדם שאחראי עליהם (בן משפחה, מטפל) לפקח: לראות אם המנות נלקחו, לקבל התראה כשהמלאי נגמר ולנהל את המרשמים.

**משתמשים:**
| תפקיד | מי זה | איך נוצר |
|---|---|---|
| מטפל (caregiver) | האחראי, מנהל מטופלים ומרשמים | נרשם בעצמו באתר |
| מטופל (patient) | מי שנוטל את התרופות | המטפל יוצר לו חשבון (מייל + סיסמה) |

למטפל כמה מטופלים. למטופל מטפל אחד בלבד.

---

## ב. רשימת מסכים

| מסך | מי רואה | מה מוצג | פעולות |
|---|---|---|---|
| כניסה | כולם | טופס התחברות, טופס הרשמה (כמטפל) | התחברות, הרשמה |
| ניהול | מטפל | כרטיסי מטופלים עם סיכום היום (X/Y נלקחו, פוספס, מלאי נמוך) | חיפוש, סינון, מיון, הוספה, עריכה, מחיקת מטופל |
| מטופל בודד | מטפל | פרופיל, מנות היום, כרטיסי מרשמים | הוספה ועריכה של מרשם, חידוש מלאי, שינוי סטטוס, מחיקה, חיפוש, סינון, מיון |
| התרופות שלי | מטופל | תצוגה יומית (מנות היום + סרגל התקדמות), תצוגה שבועית (סיכום לכל יום) | סימון "נלקח", ביטול סימון |
| התראות (בכל המסכים) | שניהם | מרשמים במלאי נמוך | – |

---

## ג. הרשאות

| פעולה | מטפל | מטופל |
|---|---|---|
| הרשמה | ✅ (כל נרשם הוא מטפל) | ❌ |
| התחברות, פרטי המשתמש המחובר | ✅ | ✅ |
| צפייה ברשימת המטופלים | ✅ רק שלו | ❌ |
| הוספה, עריכה, מחיקה של מטופל | ✅ רק שלו | ❌ |
| צפייה במרשמים | ✅ של המטופלים שלו | ✅ רק שלו |
| הוספה, עריכה, שינוי סטטוס, מחיקה של מרשם | ✅ של המטופלים שלו | ❌ |
| חידוש מלאי | ✅ של המטופלים שלו | ❌ |
| צפייה במנות (יומי / שבועי) | ✅ של המטופלים שלו | ✅ רק שלו |
| סימון "נלקח" וביטול סימון | ❌ | ✅ רק שלו |
| התראות מלאי נמוך | ✅ של כל המטופלים שלו | ✅ רק שלו |

**כללי אבטחה:** המשתמש המחובר מזוהה תמיד לפי ה־Token, לא לפי ID שנשלח מהלקוח. גישה למטופל או למרשם של מטפל אחר מחזירה 404 (כדי לא לחשוף שהרשומה קיימת). פעולה שהתפקיד לא מורשה לה מחזירה 403.

---

## ד. מסד הנתונים (PostgreSQL + Prisma)

### טבלה 1: User – משתמשים
**מטרה:** מטפלים ומטופלים בטבלה אחת, עם שדה תפקיד.

| שדה | טיפוס | חובה | הערות |
|---|---|---|---|
| id | UUID | ✅ | PK |
| fullName | טקסט (2–100) | ✅ | |
| email | טקסט | ✅ | ייחודי, נשמר באותיות קטנות |
| passwordHash | טקסט | ✅ | bcrypt, לעולם לא מוחזר ב־API |
| role | enum: caregiver / patient | ✅ | |
| caregiverId | UUID | רק למטופל | FK → User.id, ריק אצל מטפל |
| birthDate | תאריך | רק למטופל | הגיל מחושב ממנו |
| createdAt | תאריך ושעה | ✅ | תאריך הצטרפות |

**קשרים:** מטפל 1 ← רבים מטופלים (קשר עצמי). מחיקת מטופל מוחקת את המרשמים והנטילות שלו (Cascade).

### טבלה 2: Prescription – מרשמים (האובייקט המרכזי)
| שדה | טיפוס | חובה | הערות |
|---|---|---|---|
| id | UUID | ✅ | PK |
| patientId | UUID | ✅ | FK → User.id (מטופל), Cascade |
| createdById | UUID | ✅ | FK → User.id (המטפל שיצר) |
| drugName | טקסט (1–100) | ✅ | |
| dosage | טקסט (1–50) | ✅ | למשל "500 מ"ג" |
| form | enum: tablet / capsule / syrup / drops / injection / cream / other | ✅ | שדה בחירה |
| unitsPerDose | מספר שלם ≥ 1 | ✅ | כמה יורד מהמלאי בכל נטילה |
| scheduleDays | מערך מספרים 0–6 | ✅ | לפחות יום אחד, 0 = ראשון |
| scheduleTimes | מערך "HH:mm" | ✅ | לפחות שעה אחת, ללא כפילויות |
| startDate | תאריך | ✅ | |
| endDate | תאריך | ❌ | אם קיים: לא לפני startDate |
| instructions | טקסט (עד 500) | ❌ | למשל "אחרי האוכל" |
| missedAfterMinutes | מספר 5–720 | ✅ | ברירת מחדל 60 |
| stockQuantity | מספר שלם ≥ 0 | ✅ | |
| lowStockThreshold | מספר שלם ≥ 0 | ✅ | |
| status | enum: active / paused / finished | ✅ | ברירת מחדל active |
| createdAt, updatedAt | תאריך ושעה | ✅ | |

### טבלה 3: IntakeLog – נטילות שסומנו
**מטרה:** שורה נוצרת **רק** כשהמטופל מסמן "נלקח". מנות שממתינות או שפוספסו לא נשמרות, אלא מחושבות.

| שדה | טיפוס | חובה | הערות |
|---|---|---|---|
| id | UUID | ✅ | PK |
| prescriptionId | UUID | ✅ | FK → Prescription.id, Cascade |
| patientId | UUID | ✅ | FK → User.id |
| scheduledAt | תאריך ושעה | ✅ | המנה המתוכננת |
| unitsDeducted | מספר שלם ≥ 0 | ✅ | כמה ירד מהמלאי בפועל (פנימי) |
| takenAt | תאריך ושעה | ✅ | מתי סומן |
| note | טקסט (עד 200) | ❌ | |

**אילוץ:** ייחודי לפי (prescriptionId, scheduledAt). אי אפשר לסמן את אותה מנה פעמיים.

### איך מחושבות המנות
- לכל מרשם פעיל, ולכל יום בטווח (בין startDate ל־endDate) שנמצא ב־scheduleDays, נוצרת מנה לכל שעה ב־scheduleTimes.
- **נלקח:** קיימת שורה ב־IntakeLog.
- **פוספס:** אין שורה, ועברו יותר מ־missedAfterMinutes מהשעה המתוכננת.
- **ממתין:** כל השאר.
- כל החישובים לפי שעון ישראל (Asia/Jerusalem).
- מרשם מושהה או שהסתיים לא מייצר מנות חדשות. מנות שכבר סומנו בעבר עדיין מוצגות.

### מלאי
- סימון "נלקח" מוריד unitsPerDose מהמלאי, וביטול הסימון מחזיר. שתי הפעולות מתבצעות בטרנזקציה אחת.
- אם המלאי קטן מ־unitsPerDose, הסימון מתקבל והמלאי יורד ל־0. בשורת הנטילה נשמר כמה יחידות ירדו בפועל (unitsDeducted), וביטול סימון מחזיר בדיוק את הכמות הזו.
- **מלאי נמוך:** stockQuantity ≤ lowStockThreshold. זה שדה מחושב, isLowStock.

---

## ה. Endpoints

כל הכתובות מתחילות ב־`/api`. כל ה־Endpoints חוץ מ־health, login ו־register דורשים `Authorization: Bearer <token>`.

### בריאות
| Method | URL | הרשאה | תיאור |
|---|---|---|---|
| GET | /health | ציבורי | `{ "status": "ok" }` |

### התחברות
| Method | URL | הרשאה | Request | Response |
|---|---|---|---|---|
| POST | /auth/register | ציבורי | `{ fullName, email, password }` | 201 `{ token, user }`. נוצר תמיד כמטפל |
| POST | /auth/login | ציבורי | `{ email, password }` | 200 `{ token, user }`, ו־401 אם הפרטים שגויים |
| GET | /auth/me | מחובר | – | 200 `user` |

הסיסמה: לפחות 8 תווים, עם אות ומספר. תוקף ה־Token: 7 ימים.

### מטופלים (מטפל בלבד)
| Method | URL | תיאור | Request | Response |
|---|---|---|---|---|
| GET | /patients | רשימת המטופלים שלי עם סיכום היום | Query: `search`, `sortBy` (fullName / createdAt), `sortOrder`, `lowStock` (true), `missedToday` (true) | 200 `PatientSummary[]` |
| GET | /patients/:id | מטופל אחד עם סיכום | – | 200 `PatientSummary` |
| POST | /patients | יצירת מטופל | `{ fullName, email, password, birthDate }` | 201 `User`, ו־409 אם המייל קיים |
| PUT | /patients/:id | עריכה | `{ fullName, email, birthDate, password? }` (סיסמה ריקה = ללא שינוי) | 200 `User` |
| DELETE | /patients/:id | מחיקה, כולל המרשמים וההיסטוריה | – | 204 |

`PatientSummary` = פרטי המשתמש + `age`, `activePrescriptions`, `todayTotal`, `todayTaken`, `todayMissed`, `hasLowStock`.

### מרשמים
| Method | URL | הרשאה | תיאור | Request | Response |
|---|---|---|---|---|---|
| GET | /prescriptions | שניהם | רשימה | Query: `patientId` (חובה למטפל), `search`, `status`, `form`, `sortBy` (drugName / startDate / stockQuantity), `sortOrder` | 200 `Prescription[]` (כולל `isLowStock`) |
| GET | /prescriptions/:id | שניהם | מרשם אחד | – | 200 `Prescription` |
| POST | /prescriptions | מטפל | יצירה | כל שדות המרשם + `patientId` | 201 `Prescription` |
| PUT | /prescriptions/:id | מטפל | עריכה | כל השדות (ללא `patientId`) | 200 `Prescription` |
| PATCH | /prescriptions/:id/status | מטפל | שינוי סטטוס | `{ status }` | 200 `Prescription` |
| POST | /prescriptions/:id/refill | מטפל | חידוש מלאי | `{ quantity }` (1–10000) | 200 `Prescription` |
| DELETE | /prescriptions/:id | מטפל | מחיקה (למרשם שנוצר בטעות) | – | 204 |

### מנות ונטילות
| Method | URL | הרשאה | תיאור | Request | Response |
|---|---|---|---|---|---|
| GET | /doses | שניהם | מנות מחושבות לטווח תאריכים (תצוגה יומית) | Query: `from`, `to` (YYYY-MM-DD, עד 31 יום), `patientId` (חובה למטפל), `status` | 200 `Dose[]` |
| GET | /doses/summary | שניהם | סיכום לכל יום (תצוגה שבועית) | אותם פרמטרים | 200 `DaySummary[]` |
| POST | /intakes | מטופל | סימון "נלקח" | `{ prescriptionId, scheduledAt, note? }` | 201 `IntakeLog`, ו־409 אם כבר סומן |
| DELETE | /intakes/:id | מטופל | ביטול סימון | – | 204 |

- `Dose` = `{ prescriptionId, drugName, dosage, form, unitsPerDose, scheduledAt, status, takenAt, intakeId, isLowStock }`
- `DaySummary` = `{ date, total, taken, missed, pending }`

השרת בודק ש־scheduledAt הוא באמת מנה שקיימת בלוח הזמנים של המרשם. מותר לסמן מנה שעברה וגם מנה עתידית.

### התראות
| Method | URL | הרשאה | תיאור | Response |
|---|---|---|---|---|
| GET | /alerts/low-stock | שניהם | מרשמים פעילים במלאי נמוך: אצל מטפל של כל המטופלים שלו, אצל מטופל רק שלו | 200 `[{ prescriptionId, drugName, patientId, patientName, stockQuantity, lowStockThreshold }]` |

בצד הלקוח אפשר לבקש את ההתראות מחדש כל כמה דקות (`refetchInterval`).

### פורמט שגיאה אחיד
```json
{ "message": "תיאור השגיאה בעברית", "statusCode": 400, "errors": { "email": "כתובת מייל לא תקינה" } }
```
קודים: 400 ולידציה, 401 אין Token או שהוא לא תקין, 403 אין הרשאה לתפקיד, 404 לא נמצא או לא שלך, 409 התנגשות, 500 שגיאת שרת.

---

## ו. התאמה לדרישות המורה

| דרישה | איך מתקיים |
|---|---|
| התחברות | JWT + bcrypt, `/auth/login`, `/auth/me` |
| שני סוגי משתמשים עם הרשאות שונות | מטפל ומטופל, ראו טבלת הרשאות |
| אובייקט מרכזי | מרשם (Prescription) |
| לפחות 5 שדות משמעותיים | 14 שדות: שם תרופה, מינון, צורה, לוח זמנים, מלאי ועוד |
| רשימת רשומות | `GET /prescriptions`, `GET /patients` |
| הוספה ועריכה | `POST` / `PUT /prescriptions`, `POST` / `PUT /patients` |
| קטגוריה / סטטוס | צורה (form) וסטטוס (status) |
| חיפוש, סינון, מיון | חיפוש לפי שם, סינון לפי סטטוס וצורה, מיון לפי 3 שדות. גם במטופלים |
| מידע מהשרת שנשמר במסד | PostgreSQL + Prisma |

---

## ז. טכנולוגיות ופריסה
- Node.js LTS, Express, TypeScript strict, Prisma, Zod, JWT, bcrypt, Swagger ב־`/api-docs`, Vitest.
- **נתוני הדגמה:** 2–3 מטפלים, לכל אחד כמה מטופלים, מרשמים בסטטוסים ובצורות שונים, היסטוריית נטילה של שבועיים (נלקחו ופוספסו), ולפחות מרשם אחד במלאי נמוך. הכול מומצא.
- **פריסה:** השרת וגם המסד ב־Render. המסד החינמי של Render נמחק 30 יום אחרי שנוצר – יש ליצור אותו קרוב למועד ההגשה (או לעבור ל־Neon, ההוראות ב־START-HERE).
- **הערה:** NetFree חסם בעבר אתר שהעלית ל־Render. ייתכן שתצטרכי לבקש מהם לפתוח את הכתובת.

## ח. השלכות על הטיפוסים בצד הלקוח (לאחר אישור)
- `Schedule`: ללא שינוי. השרת מקבל ומחזיר `schedule: { days, times }` בדיוק כמו בטיפוס שלך (במסד הוא נשמר כשני עמודות).
- `IntakeLog` לא יכיל `status`. הסטטוס שייך ל־`Dose`, שהוא טיפוס חדש.
- טיפוסים חדשים: `Dose`, `DaySummary`, `PatientSummary`, `CreatePatientRequest`, `LowStockAlert`.
- הוספת `patientId` לפילטרים.
