import Link from "next/link";
import { getConfig } from "@/lib/actions";

export async function Header() {
    const config = await getConfig();

    return (
        <header className="main-header">
            <Link href="/" className="nav-logo">
                {config.siteName}
            </Link>
            <nav className="nav-menu">
                <ul>
                    <li><Link href="/" className="nav-link">Blog</Link></li>
                    <li><Link href="/about" className="nav-link">About</Link></li>
                </ul>
            </nav>
        </header>
    );
}
