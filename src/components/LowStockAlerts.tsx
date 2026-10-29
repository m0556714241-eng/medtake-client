import { useQuery } from "@tanstack/react-query"
import { getLowStockAlerts } from "../api/alerts"
import { useEffect, useRef, useState } from "react"
import IconButton from "@mui/material/IconButton"
import Badge from "@mui/material/Badge"
import Menu from "@mui/material/Menu"
import Tooltip from "@mui/material/Tooltip"
import MenuItem from "@mui/material/MenuItem"
import { useAuth } from "../context/useAuth"
import NotificationsIcon from "@mui/icons-material/Notifications"
import { enqueueSnackbar } from "notistack"


const LowStockAlerts = () => {
    const [openList, setOpenList] = useState<HTMLElement | null>(null)
    const { user } = useAuth()
    const alreadyShown = useRef(false)
    const isCaregiver = user?.role === 'caregiver'
    const { data } = useQuery({
        queryKey: ['alerts'],
        queryFn: getLowStockAlerts,
        refetchInterval: 5 * 60 * 1000,
    })
    const alerts = data ?? []
    useEffect(() => {
        if (isCaregiver || alreadyShown.current || !data || data.length === 0) return
        data.forEach(alert =>
            enqueueSnackbar(`המלאי של ${alert.drugName} עומד להיגמר (נשארו ${alert.stockQuantity})`, { variant: 'warning' })
        )
        alreadyShown.current = true
    }, [data, isCaregiver])
    return (
        <>
            {/* הנפשה: הסבר בריחוף, הגדלה בעכבר, והפעמון "מצלצל" כשיש התראות */}
            <Tooltip title="התראות מלאי">
            <IconButton aria-label="התראות מלאי" onClick={(e) => setOpenList(e.currentTarget)}
                className={`header-icon ${alerts.length > 0 ? 'has-news-bell' : ''}`}
                sx={{ bgcolor: "#F2F6F4", borderRadius: "14px", color: "primary.dark" }}>
                <Badge badgeContent={alerts.length} color="warning">
                    <NotificationsIcon /> 
                </Badge>
            </IconButton>
            </Tooltip>
            <Menu anchorEl={openList} onClose={() => setOpenList(null)} open={!!openList}>
                {alerts.length === 0 ? ( 
                    <MenuItem disabled>אין התראות מלאי</MenuItem>
                ) : (
                    alerts.map(alert =>
                        <MenuItem key={alert.prescriptionId}> 
                            {alert.drugName}{isCaregiver && ` · ${alert.patientName}`} · נשארו {alert.stockQuantity}                        </MenuItem>
                    )
                )
                }

            </Menu>

        </>
    )
}



export default LowStockAlerts