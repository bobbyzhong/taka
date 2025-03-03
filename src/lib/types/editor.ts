// import React from "react";

// export type EditorBtns =
//     | "text"
//     | "container"
//     | "section"
//     | "contactForm"
//     | "paymentForm"
//     | "link"
//     | "2Col"
//     | "video"
//     | "__body"
//     | "image"
//     | "3Col"
//     | null;

// export type DeviceTypes = "Mobile" | "Desktop";

// export interface EditorElement {
//     id: string
//     styles: React.CSSProperties
//     name: string
//     type: EditorBtns
//     content: EditorElement[] | {}
// }

// export interface Editor {
//     liveMode: boolean
//     elements: EditorElement[]
//     selectedElement: EditorElement
//     device: DeviceTypes
//     previewMode: boolean
// }

// export interface HistoryState {
//     history: Editor[]
//     currentIndex: number
// }

// export interface EditorState {
//     editor: Editor
//     history: HistoryState
// }

// const initialEditorState: EditorState['editor'] = {
//     elements: [
//         {
//             id: '__body',
//             content: [],
//             name: 'Body',
//             styles: {},
//             type: '__body'
//         }
//     ],
//     selectedElement: {
//         id: '',
//         name: '',
//         styles: {},
//         type: null,
//         content: []
//     },
//     device: 'Desktop',
//     liveMode: false,
//     previewMode: false
// }

// const initialHistoryState: EditorState['history'] = {
//     history: [initialEditorState],
//     currentIndex: 0
// }

// const initialState: EditorState = {
//     editor: initialEditorState,
//     history: initialHistoryState
// }
