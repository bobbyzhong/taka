import { EditorElement } from "@/app/editor/provider/EditorProvider";
import TextComponent from "./TextComponent";
import Container from "./Container";
import VideoComponent from "./VideoComponent";

type Props = { element: EditorElement };
function Recursive({ element }: Props) {
    switch (element.type) {
        case "__body":
            return <Container element={element} />;
        case "container":
            return <Container element={element} />;
        case "text":
            return <TextComponent element={element} />;
        case "video":
            return <VideoComponent element={element} />;
        default:
            return null;
    }
}
export default Recursive;
