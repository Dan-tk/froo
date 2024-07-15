
import dotenv from 'dotenv';
/* dotenv.config() */
import { taskModificationChain } from './update_task.js';

const taskTemplate =  `
A task has the following fields:
Title - Summary of the task
Description - Very brief description of the task
Date - Date by which the task should be complete
Time - Time by which the task should be complete
Label - Just One appropriate descriptive word that summarises the entire task
`

export const deleteTask = async (state) => {
    if (state.multiple){ 
        state.task_output.splice(state.num_tasks - 1, 1);
    }
    const result = await taskModificationChain.invoke(
        {
            "query": state.ref_query, 
            "TASK_TEMPLATE": taskTemplate,
            "date":state.date
        }
        )
    console.log("Currently deleting a task!")
    
        
    state.task_output = [{"DTQ":result},...state.task_output.filter(x => x !== null)]
    return state
}
/* const asada = await deleteTask({
    'query':"I want to go shopping in the afternoon, and then in the evening, go watch a movie, and late at night, watch another movie",
    'ref_query':'Delete todays meeting for me at 6pm',
    'q_type': "TBD",
    'task_output': [],
    'multiple': false,
    'num_tasks':0,
    'date':[]
})

console.log(asada.task_output) */