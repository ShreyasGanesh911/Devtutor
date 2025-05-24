import { NextResponse } from "next/server";
const apiKey = process.env.OPENAI_API_KEY
export async function GET(request:Request){
   const URL = "https://api.openai.com/v1/realtime/sessions"
  
   try {
      const response = await fetch(URL,{
         method:"POST",
         headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${apiKey}`
         },
         body:JSON.stringify({
            model: "gpt-4o-realtime-preview-2024-12-17",
            voice: "sage",
         })
      })
      const data = await response.json()
      return NextResponse.json(data,{status:200})
   } catch (error) {
      return NextResponse.json({message:"Error creating session",error},
         {status:500}
      )
   }
   
}

export async function POST(request:Request){
   try{
      const formData = await request.formData()
      formData.append("language","en")
   const response = await fetch("https://api.openai.com/v1/audio/transcriptions",{
      method:"POST",
      headers:{
         // "Content-Type":"multipart/form-data",
         "Authorization":`Bearer ${apiKey}`
      },
      body:formData
   })
   const data = await response.json()
   return NextResponse.json(data,{status:200})
   }catch(e){
      return NextResponse.json({message:"Error creating session",e},
         {status:500}
      )
   }
}
