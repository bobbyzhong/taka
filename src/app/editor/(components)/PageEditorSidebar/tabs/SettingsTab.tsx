"use client";

import { useEditor } from "@/app/editor/provider/EditorProvider";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    AlignHorizontalJustifyCenter,
    AlignHorizontalJustifyEnd,
    AlignHorizontalJustifyStart,
    AlignHorizontalSpaceAround,
    AlignHorizontalSpaceBetween,
    AlignVerticalJustifyCenter,
    AlignVerticalJustifyEnd,
    AlignVerticalJustifyStart,
} from "lucide-react";

type Props = {};
function SettingsTab({}: Props) {
    const { state, dispatch } = useEditor();

    const handleChangeCustomvalues = (e: any) => {
        const settingProperty = e.target.id;
        let value = e.target.value;

        const styleObject = {
            [settingProperty]: value,
        };

        dispatch({
            type: "UPDATE_ELEMENT",
            payload: {
                elementDetails: {
                    ...state.editor.selectedElement,
                    content: {
                        ...state.editor.selectedElement.content,
                        ...styleObject,
                    },
                },
            },
        });
    };

    const handleOnChanges = (e: any) => {
        const styleSettings = e.target.id;
        let value = e.target.value;

        // List of properties that need 'px' units
        const pxProperties = [
            "width",
            "height",
            "marginTop",
            "marginBottom",
            "marginLeft",
            "marginRight",
            "paddingTop",
            "paddingBottom",
            "paddingLeft",
            "paddingRight",
        ];

        // Clean the value to only include numbers
        if (pxProperties.includes(styleSettings)) {
            const numericValue = value.replace(/[^0-9]/g, "");
            value = numericValue ? `${numericValue}px` : "";
        }

        const styleObject = {
            [styleSettings]: value,
        };

        dispatch({
            type: "UPDATE_ELEMENT",
            payload: {
                elementDetails: {
                    ...state.editor.selectedElement,
                    styles: {
                        ...state.editor.selectedElement.styles,
                        ...styleObject,
                    },
                },
            },
        });
    };

    return (
        <Accordion
            type="multiple"
            className="w-full"
            defaultValue={[
                "Typography",
                "Dimensions",
                "Decorations",
                "Flexbox",
                "Layout",
            ]}
        >
            <AccordionItem
                value="Typography"
                className="px-5 py-0 border-y-[1px]"
            >
                <AccordionTrigger className="!no-underline">
                    Typography
                </AccordionTrigger>

                <AccordionContent className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2 px-1">
                        <p className="text-muted-foreground text-xs">
                            Font Size
                        </p>
                        <Input
                            id="fontSize"
                            onChange={(e) => {
                                const numericValue = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                );
                                handleOnChanges({
                                    target: {
                                        id: "fontSize",
                                        value: numericValue
                                            ? `${numericValue}px`
                                            : "",
                                    },
                                });
                            }}
                            value={
                                typeof state.editor.selectedElement.styles
                                    .fontSize === "string"
                                    ? state.editor.selectedElement.styles.fontSize.replace(
                                          /[^0-9]/g,
                                          ""
                                      )
                                    : typeof state.editor.selectedElement.styles
                                          .fontSize === "number"
                                    ? state.editor.selectedElement.styles
                                          .fontSize
                                    : ""
                            }
                        />
                    </div>
                    <div className="flex flex-col gap-2 px-1">
                        <p className="text-muted-foreground text-xs">Color</p>
                        <Input
                            // id is the css property we are changing
                            id="color"
                            onChange={handleOnChanges}
                            value={state.editor.selectedElement.styles.color}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs">Opacity</Label>
                        <div className="flex items-center justify-end -mt-2">
                            <span className="p-2">
                                {typeof state.editor.selectedElement.styles
                                    ?.opacity === "number"
                                    ? state.editor.selectedElement.styles
                                          ?.opacity
                                    : parseFloat(
                                          (
                                              state.editor.selectedElement
                                                  .styles?.opacity || "100"
                                          ).replace("%", "")
                                      ) || 100}
                                %
                            </span>
                        </div>
                        <Slider
                            onValueChange={(e) => {
                                handleOnChanges({
                                    target: {
                                        id: "opacity",
                                        value: `${e[0]}%`,
                                    },
                                });
                            }}
                            className="-mt-2"
                            defaultValue={[
                                typeof state.editor.selectedElement.styles
                                    ?.opacity === "number"
                                    ? state.editor.selectedElement.styles
                                          ?.opacity
                                    : parseFloat(
                                          (
                                              state.editor.selectedElement
                                                  .styles?.opacity || "100"
                                          ).replace("%", "")
                                      ) || 100,
                            ]}
                            max={100}
                            step={1}
                        />
                    </div>
                    <Label className="text-xs">Text Align</Label>
                    <Tabs
                        onValueChange={(e) =>
                            handleOnChanges({
                                target: {
                                    id: "textAlign",
                                    value: e,
                                },
                            })
                        }
                        value={state.editor.selectedElement.styles.textAlign}
                    >
                        <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                            <TabsTrigger
                                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                                value="left"
                            >
                                <AlignHorizontalJustifyStart size={18} />
                            </TabsTrigger>

                            <TabsTrigger
                                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                                value="center"
                            >
                                <AlignHorizontalJustifyCenter size={18} />
                            </TabsTrigger>

                            <TabsTrigger
                                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                                value="right"
                            >
                                <AlignHorizontalJustifyEnd size={18} />
                            </TabsTrigger>

                            <TabsTrigger
                                className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                                value="justify"
                            >
                                <AlignHorizontalSpaceBetween size={18} />
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Background color styler */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-muted-foreground text-xs">
                            Background Color
                        </Label>
                        <div className="flex border-[1px] rounded-md overflow-clip">
                            <Input
                                onChange={(e) => {
                                    handleOnChanges({
                                        target: {
                                            id: "background",
                                            value: e.target.value,
                                        },
                                    });
                                }}
                                type="color"
                            />
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="Decorations" className="px-6 py-0 ">
                <AccordionTrigger className="!no-underline">
                    Decorations
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs">Opacity</Label>
                        <div className="flex items-center justify-end -mt-2">
                            <span className="p-2">
                                {typeof state.editor.selectedElement.styles
                                    ?.opacity === "number"
                                    ? state.editor.selectedElement.styles
                                          ?.opacity
                                    : parseFloat(
                                          (
                                              state.editor.selectedElement
                                                  .styles?.opacity || "100"
                                          ).replace("%", "")
                                      ) || 100}
                                %
                            </span>
                        </div>
                        <Slider
                            onValueChange={(e) => {
                                handleOnChanges({
                                    target: {
                                        id: "opacity",
                                        value: `${e[0]}%`,
                                    },
                                });
                            }}
                            className="-mt-2"
                            defaultValue={[
                                typeof state.editor.selectedElement.styles
                                    ?.opacity === "number"
                                    ? state.editor.selectedElement.styles
                                          ?.opacity
                                    : parseFloat(
                                          (
                                              state.editor.selectedElement
                                                  .styles?.opacity || "100"
                                          ).replace("%", "")
                                      ) || 100,
                            ]}
                            max={100}
                            step={1}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs">Border Width</Label>
                        <div className="flex items-center justify-end -mt-2">
                            <span className="p-2">
                                {typeof state.editor.selectedElement.styles
                                    ?.borderWidth === "number"
                                    ? state.editor.selectedElement.styles
                                          ?.borderWidth
                                    : parseFloat(
                                          (
                                              state.editor.selectedElement
                                                  .styles?.borderWidth || "0"
                                          ).replace("px", "")
                                      ) || 0}
                                px
                            </span>
                        </div>
                        <Slider
                            onValueChange={(e) => {
                                handleOnChanges({
                                    target: {
                                        id: "borderWidth",
                                        value: `${e[0]}px`,
                                    },
                                });
                            }}
                            className="-mt-2"
                            defaultValue={[
                                typeof state.editor.selectedElement.styles
                                    ?.borderWidth === "number"
                                    ? state.editor.selectedElement.styles
                                          ?.borderWidth
                                    : parseFloat(
                                          (
                                              state.editor.selectedElement
                                                  .styles?.borderWidth || "0"
                                          ).replace("%", "")
                                      ) || 0,
                            ]}
                            max={100}
                            step={1}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs">Border Radius</Label>
                        <div className="flex items-center justify-end -mt-2">
                            <span className="p-2">
                                {typeof state.editor.selectedElement.styles
                                    ?.borderRadius === "number"
                                    ? state.editor.selectedElement.styles
                                          ?.borderRadius
                                    : parseFloat(
                                          (
                                              state.editor.selectedElement
                                                  .styles?.borderRadius || "0"
                                          ).replace("px", "")
                                      ) || 0}
                                px
                            </span>
                        </div>
                        <Slider
                            onValueChange={(e) => {
                                handleOnChanges({
                                    target: {
                                        id: "borderRadius",
                                        value: `${e[0]}px`,
                                    },
                                });
                            }}
                            className="-mt-2"
                            defaultValue={[
                                typeof state.editor.selectedElement.styles
                                    ?.borderRadius === "number"
                                    ? state.editor.selectedElement.styles
                                          ?.borderRadius
                                    : parseFloat(
                                          (
                                              state.editor.selectedElement
                                                  .styles?.borderRadius || "0"
                                          ).replace("%", "")
                                      ) || 0,
                            ]}
                            max={100}
                            step={1}
                        />
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="Layout" className="px-6 py-0">
                <AccordionTrigger className="!no-underline">
                    Layout
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4 px-1">
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs">Display Mode</Label>
                        <Select
                            onValueChange={(e) =>
                                handleOnChanges({
                                    target: {
                                        id: "display",
                                        value: e,
                                    },
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select display" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Display Mode</SelectLabel>
                                    <SelectItem value="flex">Flex</SelectItem>
                                    <SelectItem value="inline-flex">
                                        Inline Flex
                                    </SelectItem>
                                    <SelectItem value="inline">
                                        Inline
                                    </SelectItem>
                                    <SelectItem value="block">Block</SelectItem>
                                    <SelectItem value="inline-block">
                                        Inline Block
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs">Justify Content</Label>
                        <ToggleGroup
                            type="single"
                            className="w-[274px] justify-between border rounded-md gap-2 items-center p-1"
                            onValueChange={(e) =>
                                handleOnChanges({
                                    target: {
                                        id: "justifyContent",
                                        value: e,
                                    },
                                })
                            }
                            value={
                                state.editor.selectedElement.styles
                                    .justifyContent
                            }
                        >
                            <ToggleGroupItem value="space-between">
                                <AlignHorizontalSpaceBetween className="w-5 h-5" />
                            </ToggleGroupItem>

                            <ToggleGroupItem value="space-around">
                                <AlignHorizontalSpaceAround className="w-5 h-5" />
                            </ToggleGroupItem>

                            <ToggleGroupItem value="center">
                                <AlignHorizontalJustifyCenter className="w-5 h-5" />
                            </ToggleGroupItem>

                            <ToggleGroupItem value="flex-start">
                                <AlignHorizontalJustifyStart className="w-5 h-5" />
                            </ToggleGroupItem>

                            <ToggleGroupItem value="flex-end">
                                <AlignHorizontalJustifyEnd className="w-5 h-5" />
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label className="text-xs">Align Items</Label>
                        <ToggleGroup
                            type="single"
                            className="w-[274px] justify-between border rounded-md gap-4 items-center p-1"
                            onValueChange={(e) =>
                                handleOnChanges({
                                    target: {
                                        id: "alignItems",
                                        value: e,
                                    },
                                })
                            }
                            value={
                                state.editor.selectedElement.styles.alignItems
                            }
                        >
                            <ToggleGroupItem value="center">
                                <AlignVerticalJustifyCenter className="w-5 h-5" />
                            </ToggleGroupItem>

                            <ToggleGroupItem value="flex-start">
                                <AlignVerticalJustifyStart className="w-5 h-5" />
                            </ToggleGroupItem>

                            <ToggleGroupItem value="flex-end">
                                <AlignVerticalJustifyEnd className="w-5 h-5" />
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label className="text-xs">Direction</Label>
                        <Select
                            onValueChange={(e) =>
                                handleOnChanges({
                                    target: {
                                        id: "flexDirection",
                                        value: e,
                                    },
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select direction" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Directions</SelectLabel>
                                    <SelectItem value="row">Row</SelectItem>
                                    <SelectItem value="column">
                                        Column
                                    </SelectItem>
                                    <SelectItem value="row-reverse">
                                        Row Reverse
                                    </SelectItem>
                                    <SelectItem value="column-reverse">
                                        Column Reverse
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="Dimensions" className="px-6 py-0 border-b-0">
                <AccordionTrigger className="!no-underline">
                    Dimensions
                </AccordionTrigger>
                <AccordionContent>
                    <div className="flex flex-col gap-4 px-1">
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-4 flex-col">
                                <div className="flex gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs">
                                            Height
                                        </Label>
                                        <Input
                                            id="height"
                                            placeholder="px"
                                            onChange={handleOnChanges}
                                            value={
                                                state.editor.selectedElement
                                                    .styles.height
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs">Width</Label>
                                        <Input
                                            placeholder="px"
                                            id="width"
                                            onChange={handleOnChanges}
                                            value={
                                                state.editor.selectedElement
                                                    .styles.width
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <Label className="text-xs w-full text-center">
                                Margin (in px)
                            </Label>
                            <div className="flex gap-4 flex-col">
                                <div className="flex gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs">Top</Label>
                                        <Input
                                            id="marginTop"
                                            placeholder="px"
                                            onChange={handleOnChanges}
                                            value={
                                                state.editor.selectedElement
                                                    .styles.marginTop
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs">
                                            Bottom
                                        </Label>
                                        <Input
                                            placeholder="px"
                                            id="marginBottom"
                                            onChange={handleOnChanges}
                                            value={
                                                state.editor.selectedElement
                                                    .styles.marginBottom
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs">Left</Label>
                                        <Input
                                            placeholder="px"
                                            id="marginLeft"
                                            onChange={handleOnChanges}
                                            value={
                                                state.editor.selectedElement
                                                    .styles.marginLeft
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs">Right</Label>
                                        <Input
                                            placeholder="px"
                                            id="marginRight"
                                            onChange={handleOnChanges}
                                            value={
                                                state.editor.selectedElement
                                                    .styles.marginRight
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <Label className="text-xs w-full text-center">
                                Padding (in px)
                            </Label>
                            <div className="flex gap-4 flex-col">
                                <div className="flex gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs">Top</Label>
                                        <Input
                                            placeholder="px"
                                            id="paddingTop"
                                            onChange={handleOnChanges}
                                            value={
                                                state.editor.selectedElement
                                                    .styles.paddingTop
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs">
                                            Bottom
                                        </Label>
                                        <Input
                                            placeholder="px"
                                            id="paddingBottom"
                                            onChange={handleOnChanges}
                                            value={
                                                state.editor.selectedElement
                                                    .styles.paddingBottom
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs">Left</Label>
                                        <Input
                                            placeholder="px"
                                            id="paddingLeft"
                                            onChange={handleOnChanges}
                                            value={
                                                state.editor.selectedElement
                                                    .styles.paddingLeft
                                            }
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label className="text-xs">Right</Label>
                                        <Input
                                            placeholder="px"
                                            id="paddingRight"
                                            onChange={handleOnChanges}
                                            value={
                                                state.editor.selectedElement
                                                    .styles.paddingRight
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
export default SettingsTab;
