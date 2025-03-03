"use client";
import React from "react";
import { useEditor } from "../../provider/EditorProvider";
import clsx from "clsx";
import { EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Recursive from "./PageEditorComponents/Recursive";

type Props = { liveMode?: boolean };
function PageEditor({ liveMode = false }: Props) {
    const { state, dispatch } = useEditor();

    React.useEffect(() => {
        if (liveMode) {
            dispatch({
                type: "TOGGLE_LIVE_MODE",
                payload: { value: true },
            });
        }
    }, [liveMode]);

    React.useEffect(() => {
        const fetchData = () => {
            const savedPage = localStorage.getItem("savedPage");
            if (!savedPage) return;

            dispatch({
                type: "LOAD_DATA",
                payload: {
                    elements: savedPage ? JSON.parse(savedPage) : "",
                },
            });
        };

        fetchData();
    }, []);

    const handleClick = () => {
        dispatch({
            type: "CHANGE_CLICKED_ELEMENT",
            payload: {},
        });
    };

    const handleUnpreview = () => {
        dispatch({
            type: "TOGGLE_PREVIEW_MODE",
        });
        dispatch({
            type: "TOGGLE_LIVE_MODE",
        });
    };

    return (
        <div
            className={clsx(
                "use-automation-zoom-in h-full overflow-scroll mr-[385px] bg-black transition-all rounded-md",
                {
                    "!p-0 !mr-0":
                        state.editor.previewMode === true ||
                        state.editor.liveMode === true,
                    "!w-[420px]": state.editor.device === "Mobile",
                    "w-full": state.editor.device === "Desktop",
                }
            )}
            onClick={handleClick}
        >
            {state.editor.previewMode && state.editor.liveMode && (
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="w-6 h-6 p-[2px] fixed top-0 left-0 z-[100]"
                    onClick={handleUnpreview}
                >
                    <EyeOff />
                </Button>
            )}
            {Array.isArray(state.editor.elements) &&
                state.editor.elements.map((childElement) => (
                    <Recursive key={childElement.id} element={childElement} />
                ))}
        </div>
    );
}
export default PageEditor;
