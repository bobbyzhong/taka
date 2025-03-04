import { EditorElement } from "@/app/editor/provider/EditorProvider";
import { OpenAI } from "openai";
import kbData from "../knowledge-base/kb.json";

export const runtime = "edge";

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
- For certain cases like "external styling" make it call functions
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

const searchKb = (query: string) => {
    // open the json file in knowledgebase
    console.log("Query: ", query);
    try {
        // const kbPath = path.join(
        //     process.cwd(),
        //     "src/app/api/knowledge-base",
        //     "kb.json"
        // );
        // const kbContent = fs.readFileSync(kbPath, "utf-8");
        // const kb = JSON.parse(kbContent);
        return kbData;
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
        // can only be read once because it's like a stream
        const clonedReq = req.clone();

        const stream = new TransformStream();
        const writer = stream.writable.getWriter();
        const encoder = new TextEncoder();

        // Start processing in background
        (async () => {
            try {
                // Send immediate status
                await writer.write(
                    encoder.encode(
                        `data: ${JSON.stringify({ status: "processing" })}\n\n`
                    )
                );

                // Process the request
                const result = await processRequest(clonedReq);

                // Send final result
                await writer.write(
                    encoder.encode(
                        `data: ${JSON.stringify({
                            status: "complete",
                            ...result,
                        })}\n\n`
                    )
                );
            } catch (error) {
                await writer.write(
                    encoder.encode(
                        `data: ${JSON.stringify({
                            status: "error",
                            error: (error as Error).message,
                        })}\n\n`
                    )
                );
            } finally {
                await writer.close();
            }
        })().catch(console.error);

        return new Response(stream.readable, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: (error as Error).message }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

async function processRequest(req: Request) {
    const body = await req.json();
    const { prompt, currentElements, selectedElement } = body;

    if (!prompt || !currentElements || !selectedElement) {
        throw new Error("Missing required fields");
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        fetch: fetch,
    });

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

    let finalContent = completion.choices[0].message.content;
    const toolCalls = completion.choices[0].message.tool_calls;

    if (toolCalls) {
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

    const updatedElement = JSON.parse(finalContent || "{}");
    const updatedRoot = updateElement(currentElements, updatedElement)[0];

    return { updatedElements: updatedRoot };
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
