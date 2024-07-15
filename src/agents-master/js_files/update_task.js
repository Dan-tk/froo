import { PromptTemplate } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai";
import { JsonOutputParser } from "@langchain/core/output_parsers"
import dotenv from 'dotenv';
import { OPENAI_API_KEY } from "./VAR.js";
/* dotenv.config() */

const taskTemplate =  `
A task has the following fields:
Title - Summary of the task
Description - Very brief description of the task
Date - Date by which the task should be complete
Time - Time by which the task should be complete
Label - Just One appropriate descriptive word that summarises the entire task
`

const promptTemplate = PromptTemplate.fromTemplate(
    `
    system
    You are a model designed to extract specific details from a task query\\n

    {TASK_TEMPLATE} \\n\\n

    Given the query, extract the information above that is outlined in the query. \\n\\n

    Return a JSON object that contains an arbitrary number of keys, Depending on how many details you could extract, and three extra keys called 'PDATE', 'PTIME' and 'PSUMMARY'\\n 
    
    If a detail is missing, do not add it to the JSON object\\n
    
    If a title is to be changed, then it is likely that the description will change as well; and vice versa.\\n

    If the query has implicitly define a date or time, use the following information to fill the fields.\\n
    Current time [DAY,DATE,TIME] {date}. The date is in year-month-day format, and time in 24h system. \\n

    Always return time in 12hr clock e.g 3:12pm, 2:08 am, 12:20pm etc \\n

    To determine the PDATE, PTIME and PSUMMARY fields, understand that these are the date, time and summary of the previous task respectively, that is, the task to be updated. \\n
    Also use the information above to fill these fields if defined implicitly. PTIME may not be defined, even implicitly. Return "None" if so.\\n

    Always fill the PDATE, PTIME and PSUMMARY fields. These will be used for further processing! \\n

    Refer to the following examples\\n
    Date: ['Friday', '2022-08-23', '11:03:04']
    User: Meeting for 9:00am postponed to 1:00pm\\n
    
    Result: 
    {{"Date":"2022-08-23",
      "Time":"1:00pm",
      "PDATE":"2022-08-23",
      "PTIME":"9:00am",
      "PSUMMARY":"Meeting"}} \\n

    Date: ['Friday', '2024-01-3', '18:03:04']
    User: Change title from Date with Abigael to date with Abigail and time to 3pm.\\n
    
    Result: 
    {{"Title":"Date with Abigail,
      "Description":"You have a date with Abigail",
      "Time":"3:00pm"
      "PDATE":"2024-01-3",
      "PTIME:"None",
      "PSUMMARY":"Date with Abigael"}} \\n

    Date: ['Friday', '2024-02-19', '5:03:04']
    User: Change baby shower from today to tomorrow\\n
    
    Result: 
    {{"Date":"2024-02-20",
      "PDATE":"2024-02-19",
      "PTIME":"None",
      "PSUMMARY":"Baby shower."}} \\n

    Notice below, that the current date was Tuesday. Next week Wednesday is 8 days later. This date is 2024-07-2:\\n
    Date: ['Tuesday', '2024-06-25', '10:03:04']
    User: Change the date with Abby from Wednesday to next week Wednesday.\\n
    
    Result: 
    {{"Date":"2024-07-2",
      "PDATE":"2024-06-26",
      "PTIME":"None",
      "PSUMMARY":"Date with Abby."}} \\n
    

    user
    Question: {query} \\n
    assistant
    `
  );

const model = new ChatOpenAI({
    temperature: 0.5,
    apiKey: OPENAI_API_KEY,
    model: "gpt-3.5-turbo"
}).bind({
    response_format: {
      type: "json_object",
    }})

export const taskModificationChain = promptTemplate.pipe(model).pipe(new JsonOutputParser())

export const updateTask = async (state) => {
    if (state.multiple){
        state.task_output.splice(state.num_tasks - 1, 1);
    }
    console.log("Currently Updating task!")
    const result = await taskModificationChain.invoke(
        {
            "query": state.ref_query, 
            "TASK_TEMPLATE": taskTemplate,
            "date":state.date
        }
        )
    state.task_output = [{"UTQ":result},...state.task_output.filter(x => x !== null)]
    return state
}
