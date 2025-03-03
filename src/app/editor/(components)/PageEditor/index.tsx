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
            let savedPage = localStorage.getItem("savedPage");
            if (!savedPage) {
                savedPage = EMPTY_PAGE_DEFAULT;
                localStorage.setItem("savedPage", savedPage);
            }

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

const EMPTY_PAGE_DEFAULT = `[{ "id": "__body", "content": [ { "id": "4f115421-081b-43ad-af09-dc36136f61d7", "content": [ { "id": "6f393844-975a-4958-9fa4-13edbc6d93e1", "content": { "innerText": "Barca AI" }, "name": "Text", "styles": { "color": "black", "display": "flex", "backgroundPosition": "center", "objectFit": "cover", "backgroundRepeat": "no-repeat", "textAlign": "left", "opacity": "100%", "width": "100px" }, "type": "text" }, { "id": "bed0fe19-6472-4be9-8767-0a139b62c69b", "content": { "innerText": "Sign Up" }, "name": "Text", "styles": { "color": "black", "display": "flex", "backgroundPosition": "center", "objectFit": "cover", "backgroundRepeat": "no-repeat", "textAlign": "center", "opacity": "100%", "justifyContent": "space-around", "width": "100px", "borderWidth": "2px", "borderRadius": "0px" }, "type": "text" } ], "name": "Container", "styles": { "display": "flex", "backgroundPosition": "center", "objectFit": "cover", "backgroundRepeat": "no-repeat", "textAlign": "center", "opacity": "100%", "marginBottom": "50px", "height": "", "justifyContent": "space-between" }, "type": "container" }, { "id": "da49d757-9388-4b7a-9759-cb95f3808d21", "content": [ { "id": "b58c1daa-a157-4e46-a8b7-bff640dba4a2", "content": { "innerText": "Use Barca AI to automate winning trebles!" }, "name": "Text", "styles": { "color": "black", "display": "flex", "backgroundPosition": "center", "objectFit": "cover", "backgroundRepeat": "no-repeat", "textAlign": "center", "opacity": "100%", "fontSize": "35px" }, "type": "text" }, { "id": "19fb8309-9891-452e-a1c6-e2ebb85f7e1a", "content": { "innerText": "Releasing new AI agents: Pedri, Raphina, Lamine!" }, "name": "Text", "styles": { "color": "black", "display": "flex", "backgroundPosition": "center", "objectFit": "cover", "backgroundRepeat": "no-repeat", "textAlign": "center", "opacity": "100%" }, "type": "text" }, { "id": "b579e92d-5d6f-4321-821f-b61713b76624", "content": [ { "id": "c15f2bea-2aa8-4937-9879-bc57decbf920", "content": { "innerText": "Contact Us" }, "name": "Text", "styles": { "color": "black", "display": "flex", "backgroundPosition": "center", "objectFit": "cover", "backgroundRepeat": "no-repeat", "textAlign": "center", "opacity": "100%", "borderWidth": "2px", "borderRadius": "8px" }, "type": "text" }, { "id": "e50af702-a131-4064-aca4-bedc6df5b2ca", "content": { "innerText": "Sign Up" }, "name": "Text", "styles": { "color": "black", "display": "flex", "backgroundPosition": "center", "objectFit": "cover", "backgroundRepeat": "no-repeat", "textAlign": "center", "opacity": "100%", "borderWidth": "2px", "borderRadius": "8px" }, "type": "text" } ], "name": "Container", "styles": { "display": "flex", "backgroundPosition": "center", "objectFit": "cover", "backgroundRepeat": "no-repeat", "textAlign": "center", "opacity": "100%" }, "type": "container" } ], "name": "Container", "styles": { "display": "flex", "backgroundPosition": "center", "objectFit": "cover", "backgroundRepeat": "no-repeat", "textAlign": "center", "opacity": "100%", "height": "250px", "flexDirection": "column", "background": "#f2f2f2", "marginBottom": "50px" }, "type": "container" } ], "name": "Body", "styles": { "backgroundColor": "#e3e3e3", "background": "#f5f5f5" }, "type": "__body" }]`;
