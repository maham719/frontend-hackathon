import React from 'react'
import { Moon, Sun } from "lucide-react";
import { useTheme } from '../context/ThemeContext.jsx'



const Themetogglebutton = () => {
    const { theme, toggleTheme } = useTheme();
  return (
<button className={theme === "dark"? "bg-[#382d4e] text-[#F1F1F5] hover:bg-[#271d38] p-2 rounded-full"  :"bg-[#FBF8FF] text-[#191928] hover:bg-[#EDE1FF] p-2 rounded-full " } onClick={toggleTheme}>
 {theme === "dark" ? (
  <Moon size={20} strokeWidth={1.5} />
) : (
  <Sun size={20} strokeWidth={1.5} />
)}


</button>
  )
}

export default Themetogglebutton
