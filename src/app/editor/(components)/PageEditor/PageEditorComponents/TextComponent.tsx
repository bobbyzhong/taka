"use client";

import { EditorElement, useEditor } from "@/app/editor/provider/EditorProvider";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { Trash } from "lucide-react";
import { useState } from "react";

type Props = { element: EditorElement };
function TextComponent({ element }: Props) {
    const { state, dispatch } = useEditor();
    const [aiPrompt, setAiPrompt] = useState("");

    const styles = element.styles;

    const handleDeleteElement = () => {
        dispatch({
            type: "DELETE_ELEMENT",
            payload: {
                elementDetails: element,
            },
        });
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

    return (
        <div
            style={styles}
            className={clsx(
                "p-[2px] w-full m-[5px] relative text-[16px] transition-all",
                {
                    "!border-blue-500":
                        state.editor.selectedElement.id === element.id,
                    "!border-solid":
                        state.editor.selectedElement.id === element.id,
                    "border-dashed border-[1px] border-gray-300":
                        !state.editor.liveMode,
                }
            )}
            onClick={handleOnClickBody}
        >
            {state.editor.selectedElement.id === element.id &&
                !state.editor.liveMode && (
                    <Badge className="absolute -top-[23px] bg-blue-500 flex flex-row items-center gap-2 text-white -left-[1px] rounded-none rounded-t-lg">
                        <div>{state.editor.selectedElement.name}</div>
                    </Badge>
                )}
            <span
                style={{ textAlign: styles.textAlign }}
                className="w-full outline-none"
                suppressContentEditableWarning={true}
                contentEditable={!state.editor.liveMode}
                onBlur={(e) => {
                    const spanElement = e.target as HTMLSpanElement;
                    dispatch({
                        type: "UPDATE_ELEMENT",
                        payload: {
                            elementDetails: {
                                ...element,
                                content: {
                                    innerText: spanElement.innerText,
                                },
                            },
                        },
                    });
                }}
            >
                {!Array.isArray(element.content) &&
                    element.content.innerText &&
                    element.content.innerText}
            </span>
            {state.editor.selectedElement.id === element.id &&
                !state.editor.liveMode &&
                !Array.isArray(element.content) &&
                element.content.innerText && (
                    <div className="absolute bg-blue-500 px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
                        <Trash
                            className="cursor-pointer w-4 h-4"
                            onClick={handleDeleteElement}
                        />
                    </div>
                )}
        </div>
    );
}
export default TextComponent;
