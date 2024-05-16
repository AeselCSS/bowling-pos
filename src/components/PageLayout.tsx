import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { GiBowlingStrike } from "react-icons/gi";

function PageLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-stone-100">
            <NavBar />
            <main className="mt-20">{children}</main>
            <Toaster position={"bottom-center"} />
        </div>
    );
}

function NavBar() {
    return (
        <nav className="fixed z-20 bg-zinc-800 w-full top-0 h-20 items-center p-4 text-lg flex justify-between">
            <div className="flex gap-20 items-center">
                <GiBowlingStrike className=" text-7xl text-stone-400" />
                <Link
                    className="font-semibold bg-zinc-100 p-2.5 rounded-sm min-w-44 text-center text-stone-700 hover:bg-zinc-300 transition-colors"
                    to="/"
                >
                    Salgsmenu
                </Link>
            </div>
            <div className="flex gap-20 justify-center items-center">
                {/* Nav links fra højre */}
            </div>
        </nav>
    );
}

export default PageLayout;