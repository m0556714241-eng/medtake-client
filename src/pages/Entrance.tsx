import { useState } from "react"
import Login from "../components/Login"
import Register from "../components/Register"
import Paper from "@mui/material/Paper"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
type Mode = "login" | "register"
const Entrance = () => {
    
    const [show,setShow]=useState<Mode>("login")
    return (
        <div className="flex justify-center p-8">
    <Paper className="w-full max-w-md p-8" sx={{ borderRadius: 6 }}>
        <Tabs
            value={show}
            onChange={(_, val: Mode) => setShow(val)}
            variant="fullWidth"
            className="mb-6"
        >
            <Tab value="login" label="התחברות" />
            <Tab value="register" label="הרשמה כמטפל" />
        </Tabs>

        {show === "login" ? <Login /> : <Register />}
    </Paper>
</div>
    )
}
export default Entrance