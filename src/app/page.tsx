import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex h-screen flex-col gap-3 w-full items-center justify-center">
            <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
            <h1 className="text-2xl text-white font-medium">Welcome to Taka</h1>
            <Link href="/editor">
                <Button
                    variant={"secondary"}
                    className="flex flex-row gap-2 items-center"
                >
                    Try the Editor
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </Link>
        </div>
    );
}
