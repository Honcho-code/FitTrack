import { Loader2Icon } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className='fixed inset-0 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-md flex items-center justify-center z-100'>
        <Loader2Icon className='h-8 w-8 animate-spin text-green-500'/>
    </div>
  )
}

export default Loading
