import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const DarkModeToggle = () => {
    const [dark, setDark] = useState(false);

    // Initialize theme from localStorage on component mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const isDark = savedTheme === 'dark';
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDark(isDark);

        if (isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = () => {
        const newDark = !dark;
        setDark(newDark);

        // Save to localStorage
        localStorage.setItem('theme', newDark ? 'dark' : 'light');

        // Update DOM
        if (newDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center justify-center rounded p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-200 ease-in-out cursor-pointer"
        >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};

export default DarkModeToggle;
