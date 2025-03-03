"use client";
import PageEditor from "./(components)/PageEditor";
import PageEditorNavigation from "./(components)/PageEditorNavigation";
import PageEditorSidebar from "./(components)/PageEditorSidebar";
import EditorProvider from "./provider/EditorProvider";

type Props = {};
function Editor({}: Props) {
    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden">
            <EditorProvider>
                <PageEditorNavigation />
                <div className="h-full flex justify-center">
                    <PageEditor />
                </div>
                <PageEditorSidebar />
            </EditorProvider>
        </div>
    );
}
export default Editor;
