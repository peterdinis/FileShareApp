import { FC } from "react";
import { SignOutButton } from "../auth/SignOutButton";

const Header: FC = () => {
    return (
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
            <h2 className="text-xl font-semibold accent-text">File Share</h2>
            <SignOutButton />
        </header>
    )
}

export default Header