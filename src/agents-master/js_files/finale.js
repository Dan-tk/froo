import { PromptTemplate } from "@langchain/core/prompts"
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers"
import dotenv from 'dotenv';
import { OPENAI_API_KEY } from "./VAR";
/* dotenv.config()
 */

const promptTemplate = PromptTemplate.fromTemplate(
    `
    system
    You are a summariser. You come at the end of a long process of breaking down tasks and calling the necessary functions.\\n

    Know that a the following are the types of tasks:
    GQ - This means general question, where the query is just a general question about task management
    WQ - This means website question, where the query is about website features, or how to navigate the website
    CTQ - This means create task query, where the query has instructed the model to create a query, and provided its details 
    UTQ - This means update task query, where the query has instructed the model to update an already existing query with new details
    DTQ - This means delete task query, where the query has instructed the model to delete an already existing query
    MQ - This means mixed query, where the query has multiple of the same or different query types (GQ, WQ, CTQ, UTQ, DTQ)

    Refer to the following examples to learn how the summary should be structured. The summary should be easily readable in string format\\n \\n
 
    User: No longer have a date with Abby on Wednesday, 2:00pm. Schedule movies on that day at 3:00pm.\\n
    Operations: 
    [{{
  CTQ: {{
    Title: 'Watch Movie',
    Description: 'Watch another movie',
    Date: '2024-07-14',
    Time: '11:59pm',
    Label: 'Movie'
}}
}}
{{
  CTQ: {{
    Title: 'Watch a Movie',
    Description: 'Watch a movie in the evening',
    Date: '2024-07-14',
    Time: '6:00pm',
    Label: 'Movie'
}}
}}
{{
  CTQ: {{
    Title: 'Shopping',
    Description: 'Go shopping in the afternoon',
    Date: '2024-07-14',
    Time: '3:00pm',
    Label: 'Shopping'
}}
}}
{{ DONE: 'NECESSARY STOP SEQUENCE' }}]

Result:
Created a task for you: Go shopping  at 3 pm. I have also created a task for you: Watch Movie, at 6 pm and 11:59 pm. 

    The output must be a string

    user
    {data}\\n
    assistant:
    `
)
const model = new ChatOpenAI({
    temperature: 0.5,
    apiKey: OPENAI_API_KEY,
    model: "gpt-3.5-turbo"
})

const killGame = promptTemplate.pipe(model).pipe(new StringOutputParser())

export const generateFinalAnswer = async (state) => {
    console.log("Currently summarising!")
    const result = await killGame.invoke(
        {
            "data": JSON.stringify(state.task_output) 
        }
        )
    
    return result
}

/* const ada = await generateFinalAnswer({
    'query':"I want to go shopping in the afternoon, and then in the evening, go watch a movie, and late at night, watch another movie",
    'ref_query':'',
    'q_type': "TBD",
    'task_output': [
        {
          DTQ: {
            Title: 'Delete the date with Joan',
            Description: 'You have a date with Joan that needs to be deleted',
            Time: '10:00pm',
            PDATE: '2024-07-15',
            PTIME: 'None',
            PSUMMARY: 'Date with Joan'
          }
        },
        {
          CTQ: {
            Title: 'Date with Abby',
            Description: 'You have a date with Abby',
            Date: '2024-07-15',
            Time: '10:00pm',
            Label: 'Date'
          }
        },
        { DONE: 'NECESSARY STOP SEQUENCE' }
      ],
    'multiple': false,
    'num_tasks':0,
    'date':[]
})

console.log(ada) */