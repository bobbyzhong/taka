"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { EditorElement, useEditor } from "../../provider/EditorProvider";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import clsx from "clsx";
import TabList from "./tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import SettingsTab from "./tabs/SettingsTab";
import ComponentsTab from "./tabs/components-tab";
import { useState } from "react";

type Props = {};
function PageEditorSidebar({}: Props) {
    const { state } = useEditor();

    return (
        <Sheet modal={false} open={true}>
            <Tabs className="w-full" defaultValue="Settings">
                <SheetContent
                    side="right"
                    className={clsx(
                        "mt-[97px] w-16 shadow-none p-0 focus:border-none transition-all overflow-hidden",
                        {
                            hidden: state.editor.previewMode,
                        }
                    )}
                >
                    <TabList />
                </SheetContent>
                <SheetContent
                    className={clsx(
                        "mt-[97px] w-80 mr-16 z-[40] shadow-none p-0 focus:border-none transition-all overflow-hidden",
                        {
                            hidden: state.editor.previewMode,
                        }
                    )}
                    side="right"
                >
                    <div className="grid gap-4 h-full pb-36 overflow-scroll">
                        <ScrollArea>
                            <TabsContent value="Settings">
                                <SheetHeader className="text-left p-6">
                                    <SheetTitle>Settings</SheetTitle>
                                    <SheetDescription>
                                        Sheet Description
                                    </SheetDescription>
                                </SheetHeader>
                                <SettingsTab />
                            </TabsContent>
                            <TabsContent value="Components">
                                <SheetHeader className="text-left p-6">
                                    <SheetTitle>Components</SheetTitle>
                                    <SheetDescription>
                                        Components tab Description
                                    </SheetDescription>
                                </SheetHeader>
                                <ComponentsTab />
                            </TabsContent>
                            <TabsContent value="Layers">
                                <SheetHeader className="text-left p-6">
                                    <SheetTitle>Layers</SheetTitle>
                                    <SheetDescription>
                                        View and manage page elements
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="p-4">
                                    {state.editor.elements.map((element) => (
                                        <ElementNode
                                            key={element.id}
                                            element={element}
                                        />
                                    ))}
                                </div>
                            </TabsContent>
                        </ScrollArea>
                    </div>
                </SheetContent>
            </Tabs>
        </Sheet>
    );
}
export default PageEditorSidebar;

const ElementNode = ({ element }: { element: EditorElement }) => {
    const [showStyles, setShowStyles] = useState(false);

    return (
        <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 py-1 px-2 hover:bg-muted rounded-md cursor-pointer">
                <span className="text-muted-foreground text-sm">
                    {element.name} ({element.type})
                </span>
                {element.styles && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowStyles(!showStyles);
                        }}
                        className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                    >
                        {showStyles ? "▼" : "▶"} Styles
                    </button>
                )}
            </div>
            {showStyles && element.styles && (
                <div className="ml-4 text-xs text-muted-foreground">
                    {Object.entries(element.styles).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                            <span className="font-medium">{key}:</span>
                            <span>{value}</span>
                        </div>
                    ))}
                </div>
            )}
            {Array.isArray(element.content) && element.content.length > 0 && (
                <div className="ml-4">
                    {element.content.map((childElement) => (
                        <ElementNode
                            key={childElement.id}
                            element={childElement}
                        />
                    ))}
                </div>
            )}
            {!Array.isArray(element.content) && element.content && (
                <div className="ml-4 text-xs text-muted-foreground">
                    {element.content.innerText &&
                        `Text: ${element.content.innerText}`}
                    {element.content.href && `Link: ${element.content.href}`}
                    {element.content.src && `Source: ${element.content.src}`}
                </div>
            )}
        </div>
    );
};
