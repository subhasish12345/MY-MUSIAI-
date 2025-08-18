import Link from "next/link";
import { Logo } from "./logo";

export default function Footer() {
    return (
        <footer className="border-t">
            <div className="container mx-auto py-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <Logo />
                    <span className="font-semibold text-foreground">MuseAI</span>
                </div>
                <div className="text-center md:text-right">
                    <p>
                        Developed by SUBHASISH member of NANITES.
                    </p>
                    <p>
                        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link> | <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    </p>
                </div>
            </div>
        </footer>
    )
}
