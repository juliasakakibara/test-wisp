import { getConfig } from "@/lib/actions";

export async function Footer() {
    const config = await getConfig();

    return (
        <footer className="border-t py-10 md:py-16">
            <div className="container mx-auto max-w-6xl px-4 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left" data-editable="footerText">
                        {config.footerText}
                    </p>
                </div>
            </div>
        </footer>
    );
}
