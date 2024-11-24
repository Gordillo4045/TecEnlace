import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    const [open, setOpen] = useState(false);

    const menuItems = [
        { label: "Dashboard", href: "#" },
        { label: "Gestión de Items", href: "#" },
        { label: "Configuración", href: "#" },
    ];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="border-b">
                <div className="flex h-16 items-center px-4">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64">
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col gap-2 mt-4">
                                {menuItems.map((item) => (
                                    <Button
                                        key={item.label}
                                        variant="ghost"
                                        className="justify-start"
                                        onClick={() => setOpen(false)}
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="ml-4 font-semibold">SQL Server CRUD</div>
                </div>
            </header>

            {/* Main content */}
            <div className="flex">
                {/* Sidebar - hidden on mobile */}
                <aside className="hidden md:flex w-64 flex-col border-r min-h-[calc(100vh-4rem)]">
                    <nav className="flex-1 space-y-1 p-4">
                        {menuItems.map((item) => (
                            <Button
                                key={item.label}
                                variant="ghost"
                                className="w-full justify-start"
                            >
                                {item.label}
                            </Button>
                        ))}
                    </nav>
                </aside>

                {/* Main content area */}
                <main className="flex-1 p-8">{children}</main>
            </div>
        </div>
    );
};