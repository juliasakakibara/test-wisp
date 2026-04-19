import Link from "next/link";
import { getConfig } from "@/lib/actions";

export async function Header() {
    const config = await getConfig();

    return (
        <header className="main-header">
            <div className="container grid items-center">
                <div className="c1 s4 md:s2">
                    <Link href="/" className="nav-logo">
                        {config.siteName}
                    </Link>
                </div>
                <nav className="c5 s8 md:c10 md:s2 nav-menu">
                    <Link href="/" className="nav-link">Blog</Link>
                    <Link href="/about" className="nav-link">About</Link>
                </nav>
            </div>
        </header>
    );
}
