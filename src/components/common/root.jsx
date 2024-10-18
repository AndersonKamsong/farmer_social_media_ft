import React, { useEffect, useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
// import '../assets/css/root.css'



export default function Root() {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    const handleChanges = () => {
        setScreenWidth(window.innerWidth)
    }
    useEffect(() => {
        window.addEventListener('resize', handleChanges);
        return () => {
            window.removeEventListener('resize', handleChanges);
        };
    }, [])

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            document.documentElement.setAttribute('data-theme', storedTheme);

        }
    }, []);
    return (
        <>
            <div id="appContainer">
                {/* <WordEdition /> */}
                {/* <Spreadsheet /> */}
                {/* <SocketComponent /> */}
                {/* <UserActivity /> */}
                {/* <DropzoneComponet /> */}
                <Outlet />
            </div>
        </>
    );
}