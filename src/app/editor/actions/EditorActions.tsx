import { DeviceTypes, EditorElement } from "../provider/EditorProvider";

export type EditorAction =
    | {
          type: "ADD_ELEMENT";
          payload: {
              containerId: string;
              elementDetails: EditorElement;
          };
      }
    | {
          type: "UPDATE_ELEMENT";
          payload: {
              elementDetails: EditorElement;
          };
      }
    | {
          type: "UPDATE_ROOT";
          payload: {
              elementDetails: EditorElement;
          };
      }
    | {
          type: "DELETE_ELEMENT";
          payload: {
              elementDetails: EditorElement;
          };
      }
    | {
          type: "CHANGE_CLICKED_ELEMENT";
          payload: {
              elementDetails?:
                  | EditorElement
                  | {
                        id: "";
                        content: [];
                        name: "";
                        styles: {};
                        type: null;
                    };
          };
      }
    | {
          type: "CHANGE_DEVICE";
          payload: {
              device: DeviceTypes;
          };
      }
    | {
          type: "TOGGLE_PREVIEW_MODE";
      }
    | {
          type: "TOGGLE_LIVE_MODE";
          payload?: {
              value: boolean;
          };
      }
    | {
          type: "UNDO";
      }
    | {
          type: "REDO";
      }
    | {
          type: "LOAD_DATA";
          payload: {
              elements: EditorElement[];
          };
      }
    | {
          type: "SET_LOADING";
          payload: {
              loading: boolean;
          };
      };
