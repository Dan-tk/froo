import React, { useState, useEffect } from 'react';
import { AiOutlineMessage } from 'react-icons/ai'; // Import the icon from react-icons library or any other icon library
 import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store/store';
import { createTaskSuccess, updateTaskSuccess, deleteTaskSuccess  } from '../../app/store/slices/taskSlice'; 
import { destructureUserQueryByAI } from '../../agents-master/js_files/main';
import { URL } from '../../URL';
import { getTaskGuilty, updateTaskGuilty } from '../../agents-master/js_files/plasticine';
import { generateFinalAnswer } from '../../agents-master/js_files/finale';
import { goodDate } from '../../agents-master/js_files/workflow_functions';



const ChatIcon: React.FC = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
 
  const [showChat, setShowChat] = useState(false);
  const [query, setQuery] = useState('');
  // @ts-ignore
  const [response, setResponse] = useState('');
  const [history, setHistory] = useState<{ query: any; response: any }[]>([]);
  

  useEffect(() => {
   
    const storedHistory = localStorage.getItem('chatHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const toggleChat = () => {
    setShowChat((prev) => !prev);
  };

  const handleQuerySubmit = async () => {
    if (!query.trim()) {
      return; // Do not submit empty queries
    }
  
    try {
      const response  = await destructureUserQueryByAI({
        'query':query,
        'ref_query':'',
        'q_type': "TBD",
        'task_output': [],
        'multiple': false,
        'num_tasks':0,
        'date':[]
    })
     
        
    /* const aiTask = response.task_output[0] */
    const aiResponse:any = response

    /* handleAiResponse(aiResponse, aiTask); */
    handleTasks(aiResponse.task_output, aiResponse)
    
         

      
      /* const newHistoryItem = { query, response:response.task_output[0]?.GQ };
      const newHistory = [...history, newHistoryItem];
      setHistory(newHistory);
      localStorage.setItem('chatHistory', JSON.stringify(newHistory)); */
           
    } catch (error) {
      console.error('Error sending query to AI:', error);
    }
    
    setQuery(''); // Clear the query input after submitting
  };

  async function handleTasks(taskOutput:any, aiResponse:any) {
    let response1:any =''
    
    //@ts-ignore
    taskOutput.forEach(task => {
        const [taskType, taskDetails] = Object.entries(task)[0];
        
        switch (taskType) {
            case 'CTQ':
              handleCreateTask(taskDetails);
                console.log("test");
                break;
            case 'UTQ':
              handleUpdateTask(taskDetails);
              console.log("test 2");
                break;
            case 'DTQ':
              handleDeleteTask(taskDetails);
              console.log("test 3");
                break;
            case 'GQ':
              response1 = taskDetails
                console.log("test 4");
                break;
            default:
                console.log("test 5 err");
        }
    });

      let summary=await generateFinalAnswer(aiResponse)
      
      const aioutput = response1+summary

      const newHistoryItem = { query, response: aioutput };
      const newHistory = [...history, newHistoryItem];
      setHistory(newHistory);
      localStorage.setItem('chatHistory', JSON.stringify(newHistory));
}



  const handleCreateTask = async (task:any) => {

    
    

    try {
      const responseTask =task/* ?.CTQ */

     
      

      const validDate =await goodDate(responseTask.Date, responseTask.Time)
    
      const createTask = {
        userId: currentUser?._id,
        title: responseTask.Title,
        description: responseTask.Description,
        dueDate:new Date( validDate),
        completed: false,
        label: responseTask.Label
      };
      const response = await fetch(`${URL}/tasks`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createTask),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const {savedTask} = await response.json(); // Assuming backend returns created task data
      // Dispatch Redux action to update tasks state locally
      dispatch(createTaskSuccess(savedTask));
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };
 
  const handleUpdateTask = async (task:any) => {
    // Example of updating a task (assuming you have a selected task to update)
     
     const responseTask =task/* ?.UTQ */
        
     
     //filter tasks by date
     const filteredTasks = filterTasksByDate(tasks, '2024-07-15')

    
    
   
      try {
      // Example using fetch to update a task via backend API
      const updatedResponse:any  = await updateTaskGuilty(await getTaskGuilty(filteredTasks, responseTask), responseTask)
      
     const aiUpdatedTask = updatedResponse



      try {
        const date= aiUpdatedTask.dueDate
        const validDate = date.slice(0, 16);
        
        const updatedTaskData = {
          userId: currentUser?._id,
          _id: aiUpdatedTask._id,
          title: aiUpdatedTask.title,
          description: aiUpdatedTask.description,
          dueDate:   /* aiUpdatedTask.dueDate  */ new Date( validDate),
          completed: aiUpdatedTask.completed,
          label: aiUpdatedTask.label
      }
      
        const response = await fetch(`${URL}/tasks/task/${updatedTaskData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTaskData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update task');
        }
  
        const updatedTask = await response.json(); // Assuming backend returns updated task data
        // Dispatch Redux action to update tasks state locally
        dispatch(updateTaskSuccess(updatedTask));
      } catch (error) {
        console.error('Error updating task:', error);
      }      
    } catch (error) {
      console.error('Error updating task:', error);
    }  
  };

  const handleDeleteTask = async (task:any) => {
    // Example of deleting a task (assuming you have a selected task to delete)   
    const responseTask =task/* ?.DTQ */
       
    //filter tasks by date
    const filteredTasks = filterTasksByDate(tasks, /* prevDate */'2024-07-15')

    

     try {
        
      const deleteResponse  = await await getTaskGuilty(filteredTasks, responseTask)

    const aiDelete:any = deleteResponse


      try {
        // Example using fetch to delete a task via backend API
        const taskToDelete = {        
          _id: aiDelete._id,
          
      }
        const response = await fetch(`${URL}/tasks/task/${taskToDelete._id}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          throw new Error('Failed to delete task');
        }
  
        // Dispatch Redux action to delete task from tasks state locally
        dispatch(deleteTaskSuccess(taskToDelete._id));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
 
    
  }; 

  const filterTasksByDate = (tasks: any, dateTime: string): any | string => {
    const dateToMatch = dateTime.split('T')[0];

    const filteredTasks = tasks.filter((task: any) => {
        const taskDate = task.dueDate.split('T')[0];
        return taskDate === dateToMatch;
    });

    // Return a string message if no tasks match the criteria
    if (filteredTasks.length === 0) {
        return 'No tasks found for the specified date.';
    }

    return filteredTasks;
};

  const isSendDisabled = query.trim().length === 0;

  return (
    <div>
      <button
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg"
        onClick={toggleChat}
      >
        <AiOutlineMessage size={24} />
      </button>
      {showChat && (
        <div className="fixed bottom-12 right-4 bg-slate-100 p-4 shadow-lg rounded-lg " style={{ width: '400px' }}>
          <p className="text-center text-sm font-bold mb-2">Our AI can: answer questions,  create, edit and delete 1 or more tasks at a time (give proper details)</p>
          <div className="overflow-y-auto max-h-80">
            {history.map((item, index) => (
              <div key={index} className="mb-2 px-2 bg-white rounded-lg">
                <div className="text-right pr-4">
                  <p className="font-bold">You:</p>
                  <p>{item.query}</p>
                </div>
                <div className="text-left">
                  <p className="font-bold">AI:</p>
                  <p>{item.response}</p>
                </div>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter prompt"
            className="w-full border-gray-300 border-2 rounded px-2 py-1"
          />
          <button
            onClick={handleQuerySubmit}
            disabled={isSendDisabled} // Disable button when query is empty
            className={`mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 ${isSendDisabled && 'opacity-50 cursor-not-allowed'}`}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatIcon;