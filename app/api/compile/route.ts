import { NextResponse } from "next/server"

export async function POST(req:Request){
    const data = await req.json()
    const {code,language,version} = data
    const body = {language,version,files:[{content:code}]}
    try {
        const response = await fetch("https://emkc.org/api/v2/piston/execute",{
            method:"POST",
            headers:{
              "Content-Type": "application/json",
              
            },
            body: JSON.stringify(body)
          })
          const data = await response.json()
          if(data.run.stderr){
            return NextResponse.json({success:false,error:data.run.stderr},{status:500})
          }
          const repo = data.run.output.split('\n')
          return NextResponse.json({success:true,repo},{status:200})
    } catch (error) {
        return NextResponse.json({success:false,error},{status:500})
    }
}