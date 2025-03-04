import React from "react"
import { AppBar, Toolbar, Typography, Button } from "@mui/material"
import Link from 'next/link'

const Navigation = () => {
    return (
        <AppBar position="static">
            <Toolbar>
                {/* <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    My App
                </Typography> */}
                
                <Link href={"/"} color="inherit" style={{marginRight:"0.5rem"}} >Каско</Link>
                <Link href={"/mtpl"} color="inherit">Автоцивілка</Link>
            </Toolbar>
        </AppBar>
    )
}

export default Navigation
