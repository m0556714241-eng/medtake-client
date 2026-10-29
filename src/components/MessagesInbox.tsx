import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { deleteMessage, getMessages } from "../api/messages"
import IconButton from "@mui/material/IconButton"
import Badge from "@mui/material/Badge"
import MailOutlineIcon from "@mui/icons-material/EmailOutlined"
import Menu from "@mui/material/Menu"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography" // נוסף: תוכן הרשימה
import CloseIcon from "@mui/icons-material/Close"
import { formatDate, formatTime } from "../utils/dates"

const MessagesInbox = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const queryClient = useQueryClient()
    const { data } = useQuery({
        queryKey: ['messages'],
        queryFn: getMessages,
        refetchInterval: 60 * 1000,
    })
    const messages = data ?? []
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await deleteMessage(id)
            await queryClient.invalidateQueries({ queryKey: ['messages'] })
        },
    })
    return (
        <>
            {/* הנפשה: הסבר בריחוף, הגדלה בעכבר, והמעטפה "קופצת" כשיש הודעות */}
            <Tooltip title="הודעות מהמטופלים">
                <IconButton
                    aria-label={`הודעות מהמטופלים (${messages.length})`}
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    className={`header-icon ${messages.length > 0 ? 'has-news-mail' : ''}`}
                    sx={{ bgcolor: "#F2F6F4", borderRadius: "14px", color: "primary.dark" }}
                >
                    <Badge badgeContent={messages.length} color="warning">
                        <MailOutlineIcon />
                    </Badge>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={() => setAnchorEl(null)}
                slotProps={{ paper: { sx: { width: 360, maxWidth: '90vw', maxHeight: 420 } } }}
            >
                {/* נוסף: תוכן הרשימה – "אין הודעות", או הודעה בכל שורה עם X למחיקה */}
                {messages.length === 0 ? (
                    <Typography className="px-4 py-2" color="text.secondary">אין הודעות</Typography>
                ) : (
                    messages.map(message => (
                        <div key={message.id} className="flex items-start gap-2 border-0 border-b border-solid border-[#EDF2EF] px-4 py-3 last:border-b-0">
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-baseline gap-x-2">
                                    <Typography sx={{ fontWeight: 700 }}>{message.patientName}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDate(message.createdAt)} · {formatTime(message.createdAt)}
                                    </Typography>
                                </div>
                                <Typography sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{message.text}</Typography>
                            </div>
                            <IconButton
                                size="small"
                                aria-label={`מחיקת ההודעה של ${message.patientName}`}
                                onClick={() => deleteMutation.mutate(message.id)}
                                disabled={deleteMutation.isPending}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </div>
                    ))
                )}
                {deleteMutation.isError && (
                    <Typography className="px-4 pb-2" variant="caption" color="error">המחיקה נכשלה. נסו שוב</Typography>
                )}
            </Menu>
        </>
    )
}
export default MessagesInbox
