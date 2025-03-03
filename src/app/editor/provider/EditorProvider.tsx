"use client";
import React from "react";
import { EditorAction } from "../actions/EditorActions";

export type EditorBtns =
    | "text"
    | "container"
    | "section"
    | "2Col"
    | "video"
    | "__body"
    | "image"
    | "3Col"
    | null;

export type DeviceTypes = "Mobile" | "Desktop";

export type EditorElement = {
    id: string;
    styles: React.CSSProperties;
    name: string;
    type: EditorBtns;
    content:
        | EditorElement[]
        | {
              href?: string;
              innerText?: string;
              src?: string;
          };
};

export type Editor = {
    liveMode: boolean;
    elements: EditorElement[];
    selectedElement: EditorElement;
    device: DeviceTypes;
    previewMode: boolean;
    loading: boolean;
};

export type HistoryState = {
    history: Editor[];
    currentIndex: number;
};

export type EditorState = {
    editor: Editor;
    history: HistoryState;
};

const initialEditorState: EditorState["editor"] = {
    elements: [
        {
            id: "__body",
            content: [],
            name: "Body",
            styles: {
                backgroundColor: "#e3e3e3",
            },
            type: "__body",
        },
    ],
    selectedElement: {
        id: "",
        name: "",
        styles: {},
        type: null,
        content: [],
    },
    device: "Desktop",
    liveMode: false,
    previewMode: false,
    loading: false,
};

const initialHistoryState: EditorState["history"] = {
    history: [initialEditorState],
    currentIndex: 0,
};

const initialState: EditorState = {
    editor: initialEditorState,
    history: initialHistoryState,
};

const addAnElement = (
    editorArray: EditorElement[],
    action: EditorAction
): EditorElement[] => {
    if (action.type !== "ADD_ELEMENT") {
        throw new Error("Invalid action type");
    }
    return editorArray.map((elem) => {
        if (
            elem.id === action.payload.containerId &&
            Array.isArray(elem.content)
        ) {
            return {
                ...elem,
                content: [...elem.content, action.payload.elementDetails],
            };
        } else if (elem.content && Array.isArray(elem.content)) {
            return {
                ...elem,
                content: addAnElement(elem.content, action),
            };
        }

        return elem;
    });
};

const updateAnElement = (
    editorArray: EditorElement[],
    action: EditorAction
): EditorElement[] => {
    if (action.type !== "UPDATE_ELEMENT" && action.type !== "UPDATE_ROOT") {
        throw new Error("Invalid action type");
    }

    return editorArray.map((elem) => {
        if (elem.id === action.payload.elementDetails?.id) {
            return {
                ...elem,
                ...action.payload.elementDetails,
            };
        } else if (elem.content && Array.isArray(elem.content)) {
            return {
                ...elem,
                content: updateAnElement(elem.content, action),
            };
        }
        return elem;
    });
};

const deleteAnElement = (
    editorArray: EditorElement[],
    action: EditorAction
): EditorElement[] => {
    if (action.type !== "DELETE_ELEMENT") {
        throw new Error("Invalid action type");
    }

    const newState = editorArray.filter((elem) => {
        if (elem.id === action.payload.elementDetails.id) {
            return false;
        } else if (elem.content && Array.isArray(elem.content)) {
            elem.content = deleteAnElement(elem.content, action);
        }
        return true;
    });

    return newState;
};

const editorReducer = (
    state: EditorState = initialState,
    action: EditorAction
): EditorState => {
    switch (action.type) {
        case "ADD_ELEMENT":
            const updatedEditorState = {
                ...state.editor,
                elements: addAnElement(state.editor.elements, action),
            };

            const updatedHistory = [
                ...state.history.history.slice(
                    0,
                    state.history.currentIndex + 1
                ),
                { ...updatedEditorState },
            ];

            const newEditorState = {
                ...state,
                editor: updatedEditorState,
                history: {
                    ...state.history,
                    history: updatedHistory,
                    currentIndex: updatedHistory.length - 1,
                },
            };

            return newEditorState;
        case "UPDATE_ROOT":
            const updatedRoot = updateAnElement(state.editor.elements, action);

            const updatedRootState = {
                ...state.editor,
                elements: updatedRoot,
            };

            const updatedHistoryWithUpdateRoot = [
                ...state.history.history.slice(
                    0,
                    state.history.currentIndex + 1
                ),
                { ...updatedRootState },
            ];

            const updatedEditorRoot = {
                ...state,
                editor: updatedRootState,
                history: {
                    ...state.history,
                    history: updatedHistoryWithUpdateRoot,
                    currentIndex: updatedHistoryWithUpdateRoot.length - 1,
                },
            };

            return updatedEditorRoot;
        case "UPDATE_ELEMENT":
            const updatedElements = updateAnElement(
                state.editor.elements,
                action
            );

            const updatedElementIsSelected =
                state.editor.selectedElement.id ===
                action.payload.elementDetails.id;

            const updatedEditorStateWithUpdate = {
                ...state.editor,
                elements: updatedElements,
                selectedElement: updatedElementIsSelected
                    ? action.payload.elementDetails
                    : {
                          id: "",
                          content: [],
                          name: "",
                          styles: {},
                          type: null,
                      },
            };

            const updatedHistoryWithUpdate = [
                ...state.history.history.slice(
                    0,
                    state.history.currentIndex + 1
                ),
                { ...updatedEditorStateWithUpdate },
            ];

            const updatedEditor = {
                ...state,
                editor: updatedEditorStateWithUpdate,
                history: {
                    ...state.history,
                    history: updatedHistoryWithUpdate,
                    currentIndex: updatedHistoryWithUpdate.length - 1,
                },
            };

            return updatedEditor;
        case "DELETE_ELEMENT":
            const updatedElementsAfterDelete = deleteAnElement(
                state.editor.elements,
                action
            );

            const updatedEditorStateAfterDelete = {
                ...state.editor,
                elements: updatedElementsAfterDelete,
            };

            const updatedHistoryAfterDelete = [
                ...state.history.history.slice(
                    0,
                    state.history.currentIndex + 1
                ),
                { ...updatedEditorStateAfterDelete },
            ];

            const deletedState = {
                ...state,
                editor: updatedEditorStateAfterDelete,
                history: {
                    ...state.history,
                    history: updatedHistoryAfterDelete,
                    currentIndex: updatedHistoryAfterDelete.length - 1,
                },
            };

            return deletedState;
        case "CHANGE_CLICKED_ELEMENT":
            const clickedState = {
                ...state,
                editor: {
                    ...state.editor,
                    selectedElement: action.payload.elementDetails || {
                        id: "",
                        content: [],
                        name: "",
                        styles: {},
                        type: null,
                    },
                },
                history: {
                    ...state.history,
                    history: [
                        ...state.history.history.slice(
                            0,
                            state.history.currentIndex + 1
                        ),
                        { ...state.editor },
                    ],
                    currentIndex: state.history.currentIndex + 1,
                },
            };

            return clickedState;
        case "CHANGE_DEVICE":
            const changeDeviceState = {
                ...state,
                editor: {
                    ...state.editor,
                    device: action.payload.device,
                },
            };

            return changeDeviceState;
        case "TOGGLE_PREVIEW_MODE":
            const togglePreviewState = {
                ...state,
                editor: {
                    ...state.editor,
                    previewMode: !state.editor.previewMode,
                },
            };

            return togglePreviewState;
        case "TOGGLE_LIVE_MODE":
            const toggleLiveState = {
                ...state,
                editor: {
                    ...state.editor,
                    liveMode: action.payload
                        ? action.payload.value
                        : !state.editor.liveMode,
                },
            };
            return toggleLiveState;

        case "REDO":
            if (state.history.currentIndex < state.history.history.length - 1) {
                const nextIndex = state.history.currentIndex + 1;
                const nextEditorState = { ...state.history.history[nextIndex] };
                const redoState = {
                    ...state,
                    editor: nextEditorState,
                    history: {
                        ...state.history,
                        currentIndex: nextIndex,
                    },
                };

                return redoState;
            }
            return state;
        case "UNDO":
            if (state.history.currentIndex > 0) {
                const prevIndex = state.history.currentIndex - 1;
                const prevEditorState = { ...state.history.history[prevIndex] };
                const undoState = {
                    ...state,
                    editor: prevEditorState,
                    history: {
                        ...state.history,
                        currentIndex: prevIndex,
                    },
                };
                return undoState;
            }
            return state;
        case "LOAD_DATA":
            return {
                ...initialState,
                editor: {
                    ...initialState.editor,
                    elements:
                        action.payload.elements || initialEditorState.elements,
                    liveMode: false,
                },
            };
        case "SET_LOADING":
            return {
                ...state,
                editor: {
                    ...state.editor,
                    loading: action.payload.loading,
                },
            };
        default:
            return state;
    }
};

export type EditorContextData = {
    device: DeviceTypes;
    previewMode: boolean;
    setPreviewMode: (previewMode: boolean) => void;
    setDevice: (device: DeviceTypes) => void;
};

export const EditorContext = React.createContext<{
    state: EditorState;
    dispatch: React.Dispatch<EditorAction>;
}>({
    state: initialState,
    dispatch: () => undefined,
});

type EditorProviderProps = {
    children: React.ReactNode;
};

const EditorProvider = ({ children }: EditorProviderProps) => {
    const [mounted, setMounted] = React.useState(false);
    const [state, dispatch] = React.useReducer(editorReducer, initialState);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <EditorContext.Provider value={{ state, dispatch }}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditor = () => {
    const context = React.useContext(EditorContext);
    if (!context) {
        throw new Error("useEditor must be used within a EditorProvider");
    }
    return context;
};

export default EditorProvider;
