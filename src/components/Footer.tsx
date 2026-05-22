import { getConfig } from "@/lib/actions";

export async function Footer() {
    const config = await getConfig();

    return (
        <footer className="main-footer">
            <p className="footer-text">
                © {new Date().getFullYear()} {config.siteName}. All rights reserved.
            </p>
        </footer>
    );
}
