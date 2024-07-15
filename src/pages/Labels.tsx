import React from 'react'
import Sidebar from '../components/Common/SideBar'
import AllTasks from '../components/Tasks/LabelGroup'
import AI from '../components/Common/AI'

const Labels: React.FC = () => {
  return (
    <div className='flex h-screen'>
    <Sidebar />
    <div className='flex-1 p-4'>
      <h1 className="text-2xl font-bold mb-4">Labels</h1>
      <AllTasks/>
      <AI/>
    </div>    
    </div>
  )
}

export default Labels