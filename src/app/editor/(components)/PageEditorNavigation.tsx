"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import clsx from "clsx";
import {
    ArrowLeft,
    Eye,
    Laptop,
    Redo2,
    Smartphone,
    Undo2,
    Wand,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { DeviceTypes, useEditor } from "../provider/EditorProvider";

type Props = {};
function PageEditorNavigation({}: Props) {
    const router = useRouter();
    const { state, dispatch } = useEditor();
    const [aiPrompt, setAiPrompt] = React.useState("");
    const [aiEditModalOpen, setAiEditModalOpen] = React.useState(false);

    const handlePreviewClick = () => {
        dispatch({ type: "TOGGLE_PREVIEW_MODE" });
        dispatch({ type: "TOGGLE_LIVE_MODE" });
    };

    const handleUndo = () => {
        dispatch({ type: "UNDO" });
    };

    const handleRedo = () => {
        dispatch({ type: "REDO" });
    };

    const handleOnSave = () => {
        try {
            const content = JSON.stringify(state.editor.elements);
            console.log("Current Element", state.editor.elements);
            localStorage.setItem("savedPage", content);
            // console.log("JSON", JSON.stringify(state.editor.elements));
            toast("Success", {
                description: "Content saved successfully",
            });
        } catch (error) {
            toast("Error", {
                description: "Error saving content",
            });
        }
    };

    const handleAiSubmit = async () => {
        try {
            dispatch({ type: "SET_LOADING", payload: { loading: true } });
            setAiEditModalOpen(false);
            const response = await fetch("/api/component", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: aiPrompt,
                    currentElements: state.editor.elements,
                    selectedElement: state.editor.elements,
                }),
            });

            const data = await response.json();
            console.log("Data", data);
            dispatch({
                type: "UPDATE_ROOT",
                payload: {
                    elementDetails: data.updatedElements,
                },
            });

            setAiPrompt("");

            toast.success("Content updated");
        } catch (e) {
            console.error("Error", e);
            toast.error("Error", {
                description: "Error generating content",
            });
        } finally {
            dispatch({ type: "SET_LOADING", payload: { loading: false } });
        }
    };

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.metaKey && e.key === "k") {
                e.preventDefault();
                setAiEditModalOpen(true);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <TooltipProvider>
            <nav
                className={clsx(
                    "border- flex items-center justify-between px-6 py-4 gap-2 transition-all z-[100]",
                    {
                        "h-0 p-0 -mt-10 overflow-hidden":
                            state.editor.previewMode,
                    }
                )}
            >
                <aside className="flex items-center gap-4 max-w-[260px] w-[300px]">
                    <Link href="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft />
                        </Button>
                    </Link>
                </aside>
                <aside>
                    <Tabs
                        defaultValue="Desktop"
                        className="w-fit"
                        value={state.editor.device}
                        onValueChange={(value) => {
                            dispatch({
                                type: "CHANGE_DEVICE",
                                payload: {
                                    device: value as DeviceTypes,
                                },
                            });
                        }}
                    >
                        <TabsList className="grid w-full grid-cols-3 gap-x-2 bg-transparent h-fit">
                            <Tooltip>
                                <TooltipTrigger>
                                    <TabsTrigger
                                        value="Desktop"
                                        className="data-[state=active]:bg-muted w-10 h-10 p-0 border border-input bg-background"
                                    >
                                        <Laptop className="w-5 h-5" />
                                    </TabsTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Desktop</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger>
                                    <TabsTrigger
                                        value="Mobile"
                                        className="data-[state=active]:bg-muted w-10 h-10 p-0 border border-input bg-background"
                                    >
                                        <Smartphone className="w-5 h-5" />
                                    </TabsTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Mobile</p>
                                </TooltipContent>
                            </Tooltip>
                        </TabsList>
                    </Tabs>
                </aside>
                <aside className="flex items-center gap-2">
                    <Dialog
                        open={aiEditModalOpen}
                        onOpenChange={setAiEditModalOpen}
                    >
                        <DialogTrigger asChild>
                            <Button variant={"ghost"} size="icon">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant={"ghost"} size="icon">
                                            <Wand
                                                className="w-5 h-5"
                                                aria-label="AIgenerate"
                                            />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="inline-flex items-center gap-2">
                                            Build with AI{" "}
                                            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                                <div className="text-xs">⌘</div>
                                                K
                                            </kbd>
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Build with AI</DialogTitle>
                                <DialogDescription>
                                    Describe what you want to build, and let AI
                                    help you create it.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-4">
                                <Textarea
                                    placeholder="Describe what you want to build..."
                                    value={aiPrompt}
                                    onChange={(e) =>
                                        setAiPrompt(e.target.value)
                                    }
                                    className="min-h-[100px]"
                                />
                                <Button onClick={handleAiSubmit}>
                                    Generate
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={"ghost"}
                                size="icon"
                                onClick={handlePreviewClick}
                            >
                                <Eye className="w-5 h-5" aria-label="Preview" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="inline-flex items-center gap-2">
                                Preview{" "}
                                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                    <div className="text-xs">⌘</div>P
                                </kbd>
                            </p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                disabled={
                                    state.history.currentIndex > 0 === false
                                }
                                onClick={handleUndo}
                                variant={"ghost"}
                                size="icon"
                            >
                                <Undo2 className="w-5 h-5" aria-label="Undo" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="inline-flex items-center gap-2">
                                Undo{" "}
                                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                    <div className="text-xs">⌘</div>Z
                                </kbd>
                            </p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                disabled={
                                    state.history.currentIndex <
                                        state.history.history.length - 1 ===
                                    false
                                }
                                onClick={handleRedo}
                                variant={"ghost"}
                                size="icon"
                            >
                                <Redo2 className="w-5 h-5" aria-label="Redo" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="inline-flex items-center gap-2">
                                Redo{" "}
                                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                    <div className="text-xs">⌘</div>Y
                                </kbd>
                            </p>
                        </TooltipContent>
                    </Tooltip>
                    <div className="flex flex-col gap-1 relative">
                        <Button
                            onClick={handleOnSave}
                            // isLoading={isLoading}
                            // disabled={isLoading}
                            className={"w-24 px-0"}
                        >
                            Save{" "}
                            {/* {editor.history.history.length > 1 &&
                                `(${
                                    editor.history.history.length <= 50
                                        ? editor.history.history.length
                                        : "50+"
                                })`} */}
                        </Button>
                    </div>
                </aside>
            </nav>
        </TooltipProvider>
    );
}
export default PageEditorNavigation;
