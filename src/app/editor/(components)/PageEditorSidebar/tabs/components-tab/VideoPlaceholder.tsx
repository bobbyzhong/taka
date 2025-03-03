import { EditorBtns } from "@/app/editor/provider/EditorProvider";
import { PlayCircleIcon, VideoIcon } from "lucide-react";

type Props = {};
function VideoPlaceholder({}: Props) {
    const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
        if (type === null) return;

        e.dataTransfer.setData("componentType", type);
    };

    return (
        <div
            draggable
            onDragStart={(e) => handleDragStart(e, "video")}
            className="h-14 w-14 bg-muted rounded-md flex items-center justify-center cursor-grab"
        >
            <PlayCircleIcon className="text-muted-foreground w-10 h-10" />
        </div>
    );
}
export default VideoPlaceholder;
