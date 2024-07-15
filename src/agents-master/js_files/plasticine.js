import { PromptTemplate } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai";
import { JsonOutputParser } from "@langchain/core/output_parsers"
import dotenv from 'dotenv';
import { OPENAI_API_KEY } from "./VAR";

/* dotenv.config() */

const promptTemplate = PromptTemplate.fromTemplate(
    `
    system
    You are a smart task selector. You are given a bunch of tasks and some description, and are supposed to pick the one that is closest to the given description. Return that task as a JSON object.\\n
    
    You return only one task, and the task details should be entirely complete.\n
    The task description will contain some fields,and will always contain PDATE, PSUMMARY and PTIME. Use the last 3 and only those to determine WHICH task is being returned.\\n

    Return something similar to this: \\n
    {{
        userId: the user id,
        _id: the chosen task's id,
        title: the task's title,
        description: the tasks's description,
        dueDate: YYYY-MM-DDTHH:MM:SSZ,
        completed: the task's completion state,
        label: the task's label
    }}\n
    For example:
    {{
        "userId": "5fa8d9a4d5e9b7c8e6f4d3a2",
        "_id": "7c9b3e4d2a1f6b8e5f7a4c3d",
        "title": "Spreadsheet",
        "description": "Finish work spreadsheet",
        "dueDate": "2023-11-23T17:00:00Z",
        "completed": false,
        "label":Work"
    }}\n

    \\n Ofcourse, the data will be received from the task itself \\n
    Here are the tasks from which you will select the task to return.\\n
    {task_list}\\n\\n

    Here is the description of the task. Use this  ONLY and determine the task to return.\\n
    {details}\\n\\n

    Use STEP BY STEP REASONING. Be careful not to return a task used in the examples
    Do NOT return any preamble or explanation, just the identified task. Your output should be a JSON object.\\n \\n
    assistant
    `
  );
const promptTemplate2 = PromptTemplate.fromTemplate(
    `
    system
    You are a smart task updator. You are given a task and its description, and are supposed to update certain fields and return the updated task, as per instructions below. Return that task as a JSON object.\\n
    
    The task description will contain some fields,and will always contain PDATE, PSUMMARY and PTIME. Ignore the last three, and only the others to determine how to update the task.\\n

    If the Date field is present in the task to update, or also the Time field, make sure to update the format approptiately. You shall see this in the examples\\n

    Do NOT touch the following fields: userId, _id, and completed \\n

    The other fields may be changed ONLY IF the details to change contains them. \\n

    The task details should be entirely complete.\n
    

    Return something similar to this: \\n
    {{
        userId: UNCHANGED,
        _id: UNCHANGED
        title: the task's title,
        description: the tasks's description,
        dueDate: YYYY-MM-DDTHH:MM:SSZ,
        completed: UNCHANGED,
        label: the task's label
    }}\n
    title, description, dueDate and label may change accordingly, or not change.\\n
    For example:
    task to change:{{
        "userId": "5fa8d9a4d5e9b7c8e6f4d3a2",
        "_id": "7c9b3e4d2a1f6b8e5f7a4c3d",
        "title": "Spreadsheet",
        "description": "Finish work spreadsheet",
        "dueDate": "2023-11-23T17:00:00Z",
        "completed": false,
        "label":Work"
    }}\n
    details: {{"Date":"2023-11-26",
        "Time":"11:59pm",
        "PDATE":"2023-11-23",
        "PTIME":"None",
        "PSUMMARY":"Work spreadsheet"}}

    Result:
    {{
        "userId": "5fa8d9a4d5e9b7c8e6f4d3a2",
        "_id": "7c9b3e4d2a1f6b8e5f7a4c3d",
        "title": "Spreadsheet",
        "description": "Finish work spreadsheet",
        "dueDate": "2023-11-26T11:59:00Z",
        "completed": false,
        "label":Work"
    }}
    \\n Notice How only the dueDate has changed, and the PDATE, PTIME and PTIME have been completely ignored. \\n

    Here is the tasks from which you willchange.\\n
    {task}\\n\\n

    Here is the description of the task.\\n
    {details}\\n\\n
a
    Do NOT return any preamble or explanation, just the identified task. Your output should be a JSON object.\\n \\n
    assistant
    `
  );

const model = new ChatOpenAI({
    temperature: 0.5,
    apiKey: OPENAI_API_KEY,
    model: "gpt-3.5-turbo",
    maxTokens:4096
}).bind({
    response_format: {
      type: "json_object",
    }})


const guiltyGetterChain = promptTemplate.pipe(model).pipe(new JsonOutputParser())
const guiltyUpdatorChain = promptTemplate2.pipe(model).pipe(new JsonOutputParser())

export const getTaskGuilty = async (task_list,desc) => {
    console.log("Identifying task to effect!")
    const result = await guiltyGetterChain.invoke(
        {
            "task_list": JSON.stringify(task_list), 
            "details":JSON.stringify(desc)
        }
    )
    return result
    }
export const updateTaskGuilty = async (task_list,desc) => {
    console.log("Updating task to effect!")
    const result = await guiltyUpdatorChain.invoke(
        {
            "task": JSON.stringify(task_list),
            "details":JSON.stringify(desc)
        }
        )
        return result
}
/*  const thed = await updateTaskGuilty(await getTaskGuilty([{
        userId: "92jd9sd9o3jd899ejf123d6",
        _id: "1123ddbu23sad028js2e6asdd2",
        title: "Game Night",
        description: "Announce a game night!",
        dueDate: "2023-11-23T11:00:00Z",
        completed: false,
        label: "announcement"
        },{
        userId: "92jd9sd9o3jd899ejf123d6",
        _id: "129s3jb4p2dd56hd34kk2sdu71x2",
        title: "Shopping",
        description: "Go grocery shopping",
        dueDate: "2023-11-23T17:00:00Z",
        completed: false,
        label: "shopping"
    }],{"Date":"2023-11-26",
        "Time":"11:59pm",
        "PDATE":"2023-11-23",
        "PTIME":"None",
        "PSUMMARY":"Grocery Shopping"}),{"Date":"2023-11-26",
            "Time":"11:59pm",
            "PDATE":"2023-11-23",
            "PTIME":"None",
            "PSUMMARY":"Grocery Shopping"})

console.log(thed)  */