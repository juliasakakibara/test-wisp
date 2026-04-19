import { getConfig } from "@/lib/actions";

export async function Footer() {
    const config = await getConfig();

    return (
        <footer className="main-footer">
            <div className="container grid">
                <div className="c1 s12 md:s4 footer-info">
                    <p className="label opacity-40">About</p>
                    <p className="footer-text">{config.footerText}</p>
                </div>
                <div className="c1 s12 md:c9 md:s4 footer-legal">
                    <p className="label opacity-40">Legal</p>
                    <p className="copyright-text">
                        © {new Date().getFullYear()} {config.siteName}.<br />
                        All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
