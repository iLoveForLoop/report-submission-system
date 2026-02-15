import AppLogoIcon from "../app-logo-icon";
import DarkModeToggle from "../toggle-icon";


const header = () => {
    return (
        <>
            <header className="flex items-center gap-2 px-10 lg:px-20 py-4 justify-between">
                {/* <img
                        src="/Logo/DILG-logo.png"
                        alt="DILG Logo"
                        className="h-10"
                    /> */}
                <div className="flex items-center gap-2">
                    <AppLogoIcon className="" />
                    <p className="text-lg font-bold">DILG RSS</p>
                </div>
                <DarkModeToggle />
            </header>
        </>
    );
};

export default header;
