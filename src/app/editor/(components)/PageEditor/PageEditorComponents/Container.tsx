"use client";
import {
    EditorBtns,
    EditorElement,
    useEditor,
} from "@/app/editor/provider/EditorProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import clsx from "clsx";
import { Loader2, Trash, Wand } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import Recursive from "./Recursive";

export const defaultStyles: React.CSSProperties = {
    display: "flex",
    backgroundPosition: "center",
    objectFit: "cover",
    backgroundRepeat: "no-repeat",
    textAlign: "center",
    opacity: "100%",
};

type Props = {
    element: EditorElement;
};

function Container({ element }: Props) {
    const { id, content, name, styles, type } = element;
    const { state, dispatch } = useEditor();
    const [aiPrompt, setAiPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDrop = (e: React.DragEvent, id: string) => {
        e.stopPropagation();
        const componentType = e.dataTransfer.getData(
            "componentType"
        ) as EditorBtns;

        switch (componentType) {
            case "text":
                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            id: uuidv4(),
                            content: { innerText: "New Text" },
                            name: "Text",
                            styles: {
                                color: "black",
                                ...defaultStyles,
                            },
                            type: "text",
                        },
                    },
                });
                break;
            case "container":
                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            id: uuidv4(),
                            content: [],
                            name: "Container",
                            styles: { ...defaultStyles },
                            type: "container",
                        },
                    },
                });
                break;
            case "video":
                dispatch({
                    type: "ADD_ELEMENT",
                    payload: {
                        containerId: id,
                        elementDetails: {
                            id: uuidv4(),
                            content: {
                                src: "https://youtu.be/VxDrnyaOQsw?si=typmQnrvlTxebpJ9",
                            },
                            name: "Video",
                            styles: { ...defaultStyles },
                            type: "video",
                        },
                    },
                });
                break;
            default:
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDragStart = (e: React.DragEvent, type: string) => {
        if (type === "__body") return;
        e.dataTransfer.setData("componentType", type);
    };

    const handleOnClickBody = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch({
            type: "CHANGE_CLICKED_ELEMENT",
            payload: {
                elementDetails: element,
            },
        });
    };

    const handleDeleteElement = () => {
        dispatch({
            type: "DELETE_ELEMENT",
            payload: {
                elementDetails: element,
            },
        });
    };

    const handleAiSubmit = async () => {
        try {
            setIsGenerating(true);
            dispatch({ type: "SET_LOADING", payload: { loading: true } });
            const response = await fetch("/api/component", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: aiPrompt,
                    currentElements: state.editor.elements,
                    selectedElement: element,
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
            setIsGenerating(false);
        }
    };

    return (
        <div
            style={styles}
            className={clsx(
                "relative p-6 transition-all rounded-md group scrollbar scrollbar-thumb-muted-foreground/20 scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thin",
                {
                    "max-w-full w-full":
                        type === "container" || type === "2Col",
                    "h-fit": type === "container",
                    "h-full w-full overflow-y-auto overflow-x-hidden":
                        type === "__body",
                    "flex flex-col md:!flex-row": type === "2Col",
                    "!border-blue-500":
                        state.editor.selectedElement.id === id &&
                        !state.editor.liveMode &&
                        state.editor.selectedElement.type !== "__body",
                    "!border-yellow-500 border-4":
                        state.editor.selectedElement.id === id &&
                        !state.editor.liveMode &&
                        state.editor.selectedElement.type === "__body",
                    "!mb-[200px]":
                        !state.editor.liveMode &&
                        !state.editor.previewMode &&
                        type === "__body",
                    "!border-solid":
                        state.editor.selectedElement.id === id &&
                        !state.editor.liveMode,
                    "!border-dashed !border": !state.editor.liveMode,
                }
            )}
            onDrop={(e) => {
                handleDrop(e, id);
            }}
            onDragOver={handleDragOver}
            draggable={type !== "__body"}
            onDragStart={(e) => handleDragStart(e, "container")}
            onClick={handleOnClickBody}
        >
            {state.editor.loading && element.type === "__body" && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[200]">
                    <Loader2 className="animate-spin h-8 w-8" />
                </div>
            )}
            <Badge
                className={clsx(
                    "absolute bg-blue-500 text-white hover:bg-blue-500 -top-[23px] -left-[1px] rounded-none rounded-t-md hidden",
                    {
                        block:
                            state.editor.selectedElement.id === element.id &&
                            !state.editor.liveMode,
                    }
                )}
            >
                {name}
            </Badge>

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        className={clsx(
                            "absolute bg-blue-500 hover:text-white text-white -top-[24px] cursor-pointer hover:bg-blue-600 text-xs left-[85px] rounded-none rounded-t-md hidden p-0 px-2 h-[23px]",
                            {
                                block:
                                    state.editor.selectedElement.id ===
                                        element.id && !state.editor.liveMode,
                            }
                        )}
                    >
                        <Wand className="w-4 h-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent side="right" className="w-80">
                    <div className="flex flex-col gap-4">
                        <Textarea
                            placeholder="Add a text block..."
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                        />
                        <Button
                            disabled={isGenerating}
                            onClick={handleAiSubmit}
                        >
                            {isGenerating && (
                                <Loader2 className="animate-spin" />
                            )}
                            Run
                        </Button>
                    </div>
                </PopoverContent>
            </Popover>

            {Array.isArray(content) &&
                content.map((childElement) => (
                    <Recursive key={childElement.id} element={childElement} />
                ))}

            {state.editor.selectedElement.id === element.id &&
                !state.editor.liveMode &&
                state.editor.selectedElement.type !== "__body" && (
                    <div className="absolute px-2.5 py-1 bg-blue-500 text-xs font-bold -top-[23px] -right-[1px] rounded-none rounded-t-lg !text-white">
                        <Trash
                            className="cursor-pointer w-4 h-4"
                            onClick={handleDeleteElement}
                        />
                    </div>
                )}
        </div>
    );
}
export default Container;
