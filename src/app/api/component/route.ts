import path from "path";
import fs from "fs";
import { EditorElement } from "@/app/editor/provider/EditorProvider";
import { OpenAI } from "openai";

/*
Potential Queries
1. Change all the copy here to be about Barca
2. Make all the borders rounded 
3. Make this the same theme as [some prebuilt site] or public site like yelp
4. Scale everything down a little bit 
5. Add a CTA section to the bottom of the page with a video


1. Single query, let llm have full control
- Give the llm the selectedElement and the prompt that says what it should do to that selectedElement
- Give it context on EditorElement schema
- Maybe give example with every type of element?
- Give it context on Editor types

2. Some function calling
- Give the llm the selectedElement and the prompt
- For certain cases like “external styling” make it call functions
- Maybe when asking for a new component, not just styling, make it a function to get like a guide on how to make that type of component
- Adding a button is a text with a border and text centered

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
*/

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const searchKb = (query: string) => {
    // open the json file in knowledgebase
    console.log("Query: ", query);
    try {
        const kbPath = path.join(
            process.cwd(),
            "src/app/api/knowledge-base",
            "kb.json"
        );
        const kbContent = fs.readFileSync(kbPath, "utf-8");
        const kb = JSON.parse(kbContent);
        return kb;
    } catch (e) {
        console.error("Error: ", e);
    }
};

const tools = [
    {
        type: "function" as const,
        function: {
            name: "searchKb",
            description:
                "If the user asks to create/add a call to action (CTA, Get Started Section, etc), use this function to search the knowledge base for a relevant example.",
            parameters: {
                type: "object",
                properties: {
                    requestedComponent: {
                        type: "string",
                        description: "The type of component the user requested",
                    },
                },
                required: ["requestedComponent"],
                additionalProperties: false,
            },
        },
    },
];

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("BODY", body);

        const { prompt, currentElements, selectedElement } = body;

        if (!prompt || !currentElements || !selectedElement) {
            return new Response(
                JSON.stringify({ error: "Missing required fields" }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const messages: any = [
            {
                role: "system" as const,
                content: `You are an agent that takes in a JSON object that represents a no-code editor element.
                The schema of an element is provided below. Your role is to use the prompt to make the correct
                changes to the element and return the updated element in JSON format. Return the updated element 
                in the same JSON level it came in. So if the first level id is __body the new one should look like { id: '__body'... }
                        **Context**
                        type EditorElement = {
                            id: string;
                            styles: React.CSSProperties;
                            name: string;
                            type: "text" | "container" | "video" | "__body" | null;
                        ;
                            content:
                                | EditorElement[]
                                | {
                                    href?: string;
                                    innerText?: string;
                                    src?: string;
                                };
                        };
                        `,
            },
            {
                role: "user" as const,
                content: `Here is the JSON of the element: ${JSON.stringify(
                    selectedElement
                )}. Modify it based on this instruction: "${prompt}". Only return the updated JSON.`,
            },
        ];

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: messages,
            response_format: { type: "json_object" },
            tools: tools,
        });

        console.log("HERE 1");

        let finalContent = completion.choices[0].message.content;
        const toolCalls = completion.choices[0].message.tool_calls;
        if (toolCalls) {
            console.log("INSIDE TOOL CALLS", toolCalls);
            for (const toolCall of toolCalls) {
                const toolName = toolCall.function.name;
                const toolArgs = JSON.parse(toolCall.function.arguments);
                messages.push(completion.choices[0].message as any);

                if (toolName === "searchKb") {
                    const result = searchKb(toolArgs.requestedComponent);
                    messages.push({
                        role: "tool",
                        tool_call_id: toolCall.id,
                        content: JSON.stringify(result),
                    });
                }
            }

            const completion2 = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: messages,
                response_format: { type: "json_object" },
            });
            finalContent = completion2.choices[0].message.content;
        }

        console.log("\n\nFINAL RESPONSE", finalContent);
        //         let finalContent = `{
        //     "__body": {
        //         "id": "__body",
        //         "content": [
        //             {
        //                 "id": "4f115421-081b-43ad-af09-dc36136f61d7",
        //                 "content": [
        //                     {
        //                         "id": "6f393844-975a-4958-9fa4-13edbc6d93e1",
        //                         "content": {
        //                             "innerText": "Barca AI"
        //                         },
        //                         "name": "Text",
        //                         "styles": {
        //                             "color": "black",
        //                             "display": "flex",
        //                             "backgroundPosition": "center",
        //                             "objectFit": "cover",
        //                             "backgroundRepeat": "no-repeat",
        //                             "textAlign": "left",
        //                             "opacity": "100%",
        //                             "width": "100px"
        //                         },
        //                         "type": "text"
        //                     },
        //                     {
        //                         "id": "bed0fe19-6472-4be9-8767-0a139b62c69b",
        //                         "content": {
        //                             "innerText": "Sign Up"
        //                         },
        //                         "name": "Text",
        //                         "styles": {
        //                             "color": "black",
        //                             "display": "flex",
        //                             "backgroundPosition": "center",
        //                             "objectFit": "cover",
        //                             "backgroundRepeat": "no-repeat",
        //                             "textAlign": "center",
        //                             "opacity": "100%",
        //                             "justifyContent": "space-around",
        //                             "width": "100px",
        //                             "borderWidth": "2px",
        //                             "borderRadius": "0px"
        //                         },
        //                         "type": "text"
        //                     }
        //                 ],
        //                 "name": "Container",
        //                 "styles": {
        //                     "display": "flex",
        //                     "backgroundPosition": "center",
        //                     "objectFit": "cover",
        //                     "backgroundRepeat": "no-repeat",
        //                     "textAlign": "center",
        //                     "opacity": "100%",
        //                     "marginBottom": "50px",
        //                     "height": "",
        //                     "justifyContent": "space-between"
        //                 },
        //                 "type": "container"
        //             },
        //             {
        //                 "id": "da49d757-9388-4b7a-9759-cb95f3808d21",
        //                 "content": [
        //                     {
        //                         "id": "b58c1daa-a157-4e46-a8b7-bff640dba4a2",
        //                         "content": {
        //                             "innerText": "Use Barca AI to automate winning trebles!"
        //                         },
        //                         "name": "Text",
        //                         "styles": {
        //                             "color": "black",
        //                             "display": "flex",
        //                             "backgroundPosition": "center",
        //                             "objectFit": "cover",
        //                             "backgroundRepeat": "no-repeat",
        //                             "textAlign": "center",
        //                             "opacity": "100%",
        //                             "fontSize": "35px"
        //                         },
        //                         "type": "text"
        //                     },
        //                     {
        //                         "id": "19fb8309-9891-452e-a1c6-e2ebb85f7e1a",
        //                         "content": {
        //                             "innerText": "Releasing new AI agents: Pedri, Raphina, Lamine!"
        //                         },
        //                         "name": "Text",
        //                         "styles": {
        //                             "color": "black",
        //                             "display": "flex",
        //                             "backgroundPosition": "center",
        //                             "objectFit": "cover",
        //                             "backgroundRepeat": "no-repeat",
        //                             "textAlign": "center",
        //                             "opacity": "100%"
        //                         },
        //                         "type": "text"
        //                     },
        //                     {
        //                         "id": "b579e92d-5d6f-4321-821f-b61713b76624",
        //                         "content": [
        //                             {
        //                                 "id": "c15f2bea-2aa8-4937-9879-bc57decbf920",
        //                                 "content": {
        //                                     "innerText": "Contact Us"
        //                                 },
        //                                 "name": "Text",
        //                                 "styles": {
        //                                     "color": "black",
        //                                     "display": "flex",
        //                                     "backgroundPosition": "center",
        //                                     "objectFit": "cover",
        //                                     "backgroundRepeat": "no-repeat",
        //                                     "textAlign": "center",
        //                                     "opacity": "100%",
        //                                     "borderWidth": "2px",
        //                                     "borderRadius": "8px"
        //                                 },
        //                                 "type": "text"
        //                             },
        //                             {
        //                                 "id": "e50af702-a131-4064-aca4-bedc6df5b2ca",
        //                                 "content": {
        //                                     "innerText": "Sign Up"
        //                                 },
        //                                 "name": "Text",
        //                                 "styles": {
        //                                     "color": "black",
        //                                     "display": "flex",
        //                                     "backgroundPosition": "center",
        //                                     "objectFit": "cover",
        //                                     "backgroundRepeat": "no-repeat",
        //                                     "textAlign": "center",
        //                                     "opacity": "100%",
        //                                     "borderWidth": "2px",
        //                                     "borderRadius": "8px"
        //                                 },
        //                                 "type": "text"
        //                             }
        //                         ],
        //                         "name": "Container",
        //                         "styles": {
        //                             "display": "flex",
        //                             "backgroundPosition": "center",
        //                             "objectFit": "cover",
        //                             "backgroundRepeat": "no-repeat",
        //                             "textAlign": "center",
        //                             "opacity": "100%"
        //                         },
        //                         "type": "container"
        //                     }
        //                 ],
        //                 "name": "Container",
        //                 "styles": {
        //                     "display": "flex",
        //                     "backgroundPosition": "center",
        //                     "objectFit": "cover",
        //                     "backgroundRepeat": "no-repeat",
        //                     "textAlign": "center",
        //                     "opacity": "100%",
        //                     "height": "250px",
        //                     "flexDirection": "column",
        //                     "background": "#f2f2f2",
        //                     "marginBottom": "50px"
        //                 },
        //                 "type": "container"
        //             },
        //             {
        //                 "id": "dd81f3f2-3587-482f-a5f2-c79196448c94",
        //                 "content": {
        //                     "src": "https://youtu.be/VxDrnyaOQsw?si=typmQnrvlTxebpJ9"
        //                 },
        //                 "name": "Video",
        //                 "styles": {
        //                     "display": "flex",
        //                     "backgroundPosition": "center",
        //                     "objectFit": "cover",
        //                     "backgroundRepeat": "no-repeat",
        //                     "textAlign": "center",
        //                     "opacity": "100%"
        //                 },
        //                 "type": "video"
        //             },
        //             {
        //                 "id": "1",
        //                 "content": [
        //                     {
        //                         "id": "c0b2102b-4ea1-4c81-8af8-824fe458d790",
        //                         "name": "Container",
        //                         "styles": {
        //                             "backgroundPosition": "center",
        //                             "backgroundRepeat": "no-repeat",
        //                             "display": "flex",
        //                             "flexDirection": "column",
        //                             "objectFit": "cover",
        //                             "opacity": "100%",
        //                             "textAlign": "center"
        //                         },
        //                         "type": "container",
        //                         "content": [
        //                             {
        //                                 "id": "da3f3698-9a7d-462e-9d80-767f4dc3b230",
        //                                 "content": {
        //                                     "innerText": "Get Started Today!"
        //                                 },
        //                                 "name": "Text",
        //                                 "styles": {
        //                                     "backgroundPosition": "center",
        //                                     "backgroundRepeat": "no-repeat",
        //                                     "color": "black",
        //                                     "display": "flex",
        //                                     "fontSize": "20px",
        //                                     "objectFit": "cover",
        //                                     "opacity": "100%",
        //                                     "textAlign": "left"
        //                                 },
        //                                 "type": "text"
        //                             },
        //                             {
        //                                 "id": "470cc4f9-e358-4cc0-a9c5-dfb482b3339c",
        //                                 "content": {
        //                                     "innerText": "We'd love to have you on our team"
        //                                 },
        //                                 "name": "Text",
        //                                 "styles": {
        //                                     "backgroundPosition": "center",
        //                                     "backgroundRepeat": "no-repeat",
        //                                     "color": "black",
        //                                     "display": "flex",
        //                                     "fontSize": "13px",
        //                                     "objectFit": "cover",
        //                                     "opacity": "100%",
        //                                     "textAlign": "left"
        //                                 },
        //                                 "type": "text"
        //                             }
        //                         ]
        //                     },
        //                     {
        //                         "id": "02c57a43-6e44-4c5f-9f21-56da019e5d8c",
        //                         "name": "Container",
        //                         "styles": {
        //                             "display": "flex",
        //                             "backgroundPosition": "center",
        //                             "objectFit": "cover",
        //                             "backgroundRepeat": "no-repeat",
        //                             "textAlign": "center",
        //                             "justifyContent": "flex-end",
        //                             "opacity": "100%"
        //                         },
        //                         "type": "container",
        //                         "content": [
        //                             {
        //                                 "id": "02c57a43-6e44-4c5f-9f21-56da019e5d8c",
        //                                 "content": [
        //                                     {
        //                                         "id": "ea3745f9-9a5e-40f4-85ad-b9e9bb98a775",
        //                                         "content": {
        //                                             "innerText": "Sign Up"
        //                                         },
        //                                         "name": "Text",
        //                                         "styles": {
        //                                             "backgroundPosition": "center",
        //                                             "backgroundRepeat": "no-repeat",
        //                                             "color": "black",
        //                                             "display": "flex",
        //                                             "fontSize": "20px",
        //                                             "objectFit": "cover",
        //                                             "opacity": "100%",
        //                                             "textAlign": "center",
        //                                             "width": "150px",
        //                                             "borderWidth": "2px",
        //                                             "borderRadius": "0px",
        //                                             "marginTop": "50px",
        //                                             "marginRight": "50px"
        //                                         },
        //                                         "type": "text"
        //                                     }
        //                                 ],
        //                                 "name": "Container",
        //                                 "styles": {
        //                                     "backgroundPosition": "center",
        //                                     "objectFit": "cover",
        //                                     "backgroundRepeat": "no-repeat",
        //                                     "textAlign": "center",
        //                                     "display": "flex",
        //                                     "justifyContent": "flex-end",
        //                                     "opacity": "100%"
        //                                 },
        //                                 "type": "container"
        //                             }
        //                         ]
        //                     }
        //                 ],
        //                 "name": "Call To Action",
        //                 "styles": {
        //                     "display": "flex",
        //                     "backgroundPosition": "center",
        //                     "objectFit": "cover",
        //                     "backgroundRepeat": "no-repeat",
        //                     "textAlign": "center",
        //                     "alignItems": "center",
        //                     "borderRadius": "0px",
        //                     "borderWidth": "2px",
        //                     "marginTop": "50px",
        //                     "marginRight": "50px"
        //                 }
        //             }
        //         ],
        //         "name": "Body",
        //         "styles": {
        //             "backgroundColor": "#e3e3e3",
        //             "background": "#f5f5f5"
        //         },
        //         "type": "__body"
        //     }
        // }`;
        const updatedElement = JSON.parse(finalContent || "{}");

        const updatedRoot = updateElement(currentElements, updatedElement)[0];

        console.log("UPDATED ROOT", updatedRoot);

        // const placeholder = `[{"id":"__body","content":[{"id":"4f115421-081b-43ad-af09-dc36136f61d7","content":[{"id":"6f393844-975a-4958-9fa4-13edbc6d93e1","content":{"innerText":"Barca AI"},"name":"Text","styles":{"color":"black","display":"flex","backgroundPosition":"center","objectFit":"cover","backgroundRepeat":"no-repeat","textAlign":"left","opacity":"100%"},"type":"text"},{"id":"bed0fe19-6472-4be9-8767-0a139b62c69b","content":{"innerText":"Sign Up"},"name":"Text","styles":{"color":"black","display":"flex","backgroundPosition":"center","objectFit":"cover","backgroundRepeat":"no-repeat","textAlign":"right","opacity":"100%","justifyContent":"center"},"type":"text"}],"name":"Container","styles":{"display":"flex","backgroundPosition":"center","objectFit":"cover","backgroundRepeat":"no-repeat","textAlign":"center","opacity":"100%","marginBottom":"50px","height":""},"type":"container"},{"id":"da49d757-9388-4b7a-9759-cb95f3808d21","content":[{"id":"b58c1daa-a157-4e46-a8b7-bff640dba4a2","content":{"innerText":"Use Barca AI to automate winning trebles!!"},"name":"Text","styles":{"color":"black","display":"flex","backgroundPosition":"center","objectFit":"cover","backgroundRepeat":"no-repeat","textAlign":"center","opacity":"100%","fontSize":"35px"},"type":"text"},{"id":"19fb8309-9891-452e-a1c6-e2ebb85f7e1a","content":{"innerText":"Releasing new AI agents: Pedri, Raphina, Lamine!!"},"name":"Text","styles":{"color":"black","display":"flex","backgroundPosition":"center","objectFit":"cover","backgroundRepeat":"no-repeat","textAlign":"center","opacity":"100%"},"type":"text"}],"name":"Container","styles":{"display":"flex","backgroundPosition":"center","objectFit":"cover","backgroundRepeat":"no-repeat","textAlign":"center","opacity":"100%","height":"250px","flexDirection":"column"},"type":"container"},{"id":"dd81f3f2-3587-482f-a5f2-c79196448c94","content":{"src":"https://youtu.be/VxDrnyaOQsw?si=typmQnrvlTxebpJ9"},"name":"Video","styles":{"display":"flex","backgroundPosition":"center","objectFit":"cover","backgroundRepeat":"no-repeat","textAlign":"center","opacity":"100%"},"type":"video"}],"name":"Body","styles":{"backgroundColor":"#e3e3e3","background":"#f5f5f5"},"type":"__body"}]`;
        // const updatedRoot = JSON.parse(placeholder);

        return new Response(JSON.stringify({ updatedElements: updatedRoot }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

const updateElement = (
    elements: EditorElement[],
    updatedElement: EditorElement
): EditorElement[] => {
    console.log("ELEMENTS", elements);
    console.log("UPDATED ELEMENT", updatedElement);
    return elements.map((element: EditorElement) => {
        console.log("ELEMENT INNER", element);
        console.log("UPDATED ELEMENT INNER", updatedElement);
        if (element.id === updatedElement.id) {
            console.log("RETURNING HERE");
            console.log({
                ...element,
                ...updatedElement,
            });
            return {
                ...element,
                ...updatedElement,
            };
        } else if (element.content && Array.isArray(element.content)) {
            return {
                ...element,
                content: updateElement(element.content, updatedElement),
            };
        }
        return element;
    });
};
