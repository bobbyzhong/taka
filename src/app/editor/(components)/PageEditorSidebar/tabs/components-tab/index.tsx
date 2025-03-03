import { EditorBtns } from "@/app/editor/provider/EditorProvider";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import TextPlaceholder from "./TextPlaceholder";
import ContainerPlaceholder from "./ContainerPlaceholder";
import VideoPlaceholder from "./VideoPlaceholder";

type Props = {};
function ComponentsTab({}: Props) {
    const elements: {
        Component: React.ReactNode;
        label: string;
        id: EditorBtns;
        group: "layout" | "elements";
    }[] = [
        {
            Component: <TextPlaceholder />,
            label: "Text",
            id: "text",
            group: "elements",
        },
        {
            Component: <ContainerPlaceholder />,
            label: "Container",
            id: "container",
            group: "layout",
        },
        {
            Component: <VideoPlaceholder />,
            label: "Video",
            id: "video",
            group: "elements",
        },
    ];

    return (
        <Accordion
            type="multiple"
            className="w-full"
            defaultValue={["Layout", "Elements"]}
        >
            <AccordionItem value="Layout" className="px-6 py-0 border-y-[1px]">
                <AccordionTrigger className="!no-underline">
                    Layout
                </AccordionTrigger>
                <AccordionContent className="flex flex-wrap gap-2">
                    {elements
                        .filter((element) => element.group === "layout")
                        .map((element) => (
                            <div
                                key={element.id}
                                className="flex flex-col items-center justify-center"
                            >
                                {element.Component}
                                <span className="mt-1 text-xs">
                                    {element.label}
                                </span>
                            </div>
                        ))}
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="Elements" className="px-6 py-0">
                <AccordionTrigger className="!no-underline">
                    Elements
                </AccordionTrigger>
                <AccordionContent className="flex flex-wrap gap-2">
                    {elements
                        .filter((element) => element.group === "elements")
                        .map((element) => (
                            <div
                                key={element.id}
                                className="flex flex-col items-center justify-center"
                            >
                                {element.Component}
                                <span className="mt-1 text-xs">
                                    {element.label}
                                </span>
                            </div>
                        ))}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
export default ComponentsTab;
