export const determineNextFunction  = async (state) => {
    const currentTask = state.num_tasks
    console.log(`Currently determining function ${currentTask + 1}`)
    const taskObject = state.task_output[currentTask]
    const newQueryType = Object.keys(taskObject)[0]
    const newRefQuery = taskObject[newQueryType]
    state.ref_query = newRefQuery
    state.q_type = newQueryType
    state.num_tasks += 1
    return state
}

export const getDayDateTime = async (state) => {
    const currentDateTime = new Date();
    const date = currentDateTime.toISOString().split('T')[0];
    const time = currentDateTime.toTimeString().split(' ')[0];
    const day = currentDateTime.toLocaleDateString('en-US', { weekday: 'long' });
    state.date = [day, date, time]
    return state;
}

export const checkWhetherMQ = async (state) => {
    if (state.multiple){
        return 'multiple'
    } else {
        return 'single'
    }
}

export const returnNextFunction = async (state) => {
    if (state.multiple){
        if (state.multiple >= state.task_output.length && state.task_output.length > 0){
            return 'done'
        }
    }
    return state.q_type
}


/* export const goodDate = async (dateToUse,timeToUse) => {
    const col = eval(dateToUse.split('-')[2])
    let fust = ""
    let stuf = ""
    if (col < 10){
        fust = dateToUse.split('-')[0] + '-' + dateToUse.split('-')[1] + '-0' + String(col)
    } else {
        fust = dateToUse
    }
    if (timeToUse.includes("pm")){
        const ppp = timeToUse.split('p')[0]
        const hhh = eval(ppp.split(':')[0]) + 12
        const iii = ppp.split(':')[1]
         stuf =  String(hhh)+':'+iii+':00'
    } else if (timeToUse.includes("am")){
        const ppp = timeToUse.split('a')[0]
        const hhh = eval(ppp.split(':')[0])
        const iii = ppp.split(':')[1]
        if (hhh < 10){
            stuf =  String('0'+hhh)+':'+iii+':00'
        } else {
            stuf =  String(hhh)+':'+iii+':00'
        }    
    }
    return  fust + 'T' + stuf
} */
    export const goodDate = async (dateToUse, timeToUse) => {
        const col = parseInt(dateToUse.split('-')[2]); // Parse the day part as integer
    
        let fust = ""; // Initialize fust variable
    
        // Check if day part is less than 10, then format accordingly
        if (col < 10) {
            fust = dateToUse.split('-')[0] + '-' + dateToUse.split('-')[1] + '-0' + String(col);
        } else {
            fust = dateToUse;
        }
    
        let stuf = ""; // Initialize stuf variable outside if-else block
    
        // Process time part based on 'am' or 'pm' in timeToUse
        if (timeToUse.includes("pm")) {
            const ppp = timeToUse.split('p')[0];
            const hhh = parseInt(ppp.split(':')[0]) + 12; // Convert to 24-hour format
            const iii = ppp.split(':')[1];
            stuf = String(hhh) + ':' + iii + ':00'; // Assign stuf with time in 24-hour format
        } else if (timeToUse.includes("am")) {
            const ppp = timeToUse.split('a')[0];
            const hhh = parseInt(ppp.split(':')[0]); // Get hours in 24-hour format
            const iii = ppp.split(':')[1];
            if (hhh < 10) {
                stuf = '0' + hhh + ':' + iii + ':00'; // Pad hours with zero if less than 10
            } else {
                stuf = hhh + ':' + iii + ':00';
            }
        }
    
        return fust + 'T' + stuf; // Return formatted date and time string
    };
    