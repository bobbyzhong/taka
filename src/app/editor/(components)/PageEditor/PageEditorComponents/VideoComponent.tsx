"use client";

import { EditorElement, useEditor } from "@/app/editor/provider/EditorProvider";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { Trash } from "lucide-react";

type Props = { element: EditorElement };
function VideoComponent({ element }: Props) {
    const { state, dispatch } = useEditor();
    const styles = element.styles;

    const handleOnClick = (e: React.MouseEvent) => {
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

    return (
        <div
            style={styles}
            onClick={handleOnClick}
            className={clsx(
                "p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center ",
                {
                    "!border-blue-500":
                        state.editor.selectedElement.id === element.id,
                    "!border-solid":
                        state.editor.selectedElement.id === element.id,
                    "border-dashed border-[1px] border-slate-300":
                        !state.editor.liveMode,
                }
            )}
        >
            {state.editor.selectedElement.id === element.id &&
                !state.editor.liveMode && (
                    <Badge className="absolute -top-[23px] bg-blue-500 text-white -left-[1px] rounded-none rounded-t-lg">
                        {state.editor.selectedElement.name}
                    </Badge>
                )}

            {!Array.isArray(element.content) && (
                <iframe
                    src={(() => {
                        const url = element.content.src;
                        const videoId = url?.match(
                            /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/
                        )?.[1];
                        return videoId
                            ? `https://www.youtube.com/embed/${videoId}`
                            : url;
                    })()}
                    width={element.styles.width ?? "560"}
                    height={element.styles.height ?? "315"}
                    title={"Video Player"}
                    allow={
                        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    }
                    allowFullScreen
                />
            )}

            {state.editor.selectedElement.id === element.id &&
                !state.editor.liveMode &&
                !Array.isArray(element.content) && (
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
export default VideoComponent;
