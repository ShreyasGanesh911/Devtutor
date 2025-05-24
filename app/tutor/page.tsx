'use client'
import React from 'react'
import Chat from './Chat'
import Editor from './codeEditor/Editor'
function page() {
  return (
    <div className='flex w-full h-full bg-gray-800'>
      
      <Chat/>
      <div className='w-1/2'>
        <Editor/>
      </div>
    </div>
  )
}

export default page
