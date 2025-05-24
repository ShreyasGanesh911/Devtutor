'use client'
import React, { useState } from 'react'
import { Play, Copy, Check } from "react-feather"
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { cpp } from '@codemirror/lang-cpp'
import { java } from '@codemirror/lang-java'

const Editor: React.FC = () => {
    const [code, setCode] = useState<string>("console.log('Hello World')")
    const [language, setLanguage] = useState<string>("javascript")
    const [output, setOutput] = useState<string>("")
    const [copied, setCopied] = useState(false)

    const languageOptions = [
        { value: 'javascript', label: 'JavaScript', extension: javascript },
        { value: 'python', label: 'Python', extension: python },
        { value: 'cpp', label: 'C++', extension: cpp },
        { value: 'java', label: 'Java', extension: java }
    ]

    const getCurrentExtension = () => {
        const lang = languageOptions.find(l => l.value === language)
        return lang ? [lang.extension()] : [javascript()]
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const handleRun = async () => {
        setOutput("Running...")
        try {
            const response = await fetch("/api/compile", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, language, version: "18.15.0" })
            })
            
            const data = await response.json()
            if(!data.success){
                setOutput(`Error: ${data.error}`)
                return
            }
            let formattedOutput = formatOutput(data)

            if (typeof formattedOutput === 'string' && formattedOutput.includes('Hello World')) {
                formattedOutput = formattedOutput
                    .split('Hello World')
                    .filter(Boolean)
                    .map(() => 'Hello World')
                    .join('\n')
            }

            setOutput(formattedOutput)
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to run code'
            setOutput(`Error: ${errorMessage}`)
        }
    }

    const formatOutput = (data: any): string => {
        if (data.error) return `Error: ${data.error}`
        if (data.output) return String(data.output)
        if (data.repo) return String(data.repo)
        return 'No output received from the server'
    }

    return (
        <div className="flex flex-col h-full bg-gray-900 rounded-lg overflow-hidden shadow-lg">
            <div className="flex-1 p-4">
                <CodeMirror
                    className="h-full rounded-lg overflow-hidden"
                    value={code}
                    extensions={getCurrentExtension()}
                    height="400px"
                    theme="dark"
                    onChange={setCode}
                />
            </div>
            
            <div className="h-1/2">
                <div className="bg-gray-800 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="bg-gray-700 text-gray-200 px-3 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {languageOptions.map(lang => (
                                <option key={lang.value} value={lang.value}>
                                    {lang.label}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleCopy}
                            className="bg-gray-700 text-gray-200 px-3 py-2 rounded-md border border-gray-600 hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2"
                        >
                            {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>

                    <button 
                        onClick={handleRun} 
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors duration-200"
                    >
                        Run <Play size={16} />
                    </button>
                </div>

                <div className="bg-gray-800 h-4/5 p-4 mt-1">
                    <div className="text-gray-400 text-sm mb-2">Output:</div>
                    <div className="bg-gray-900 h-full p-4 rounded-lg text-gray-200 font-mono text-sm overflow-auto max-h-48 whitespace-pre-wrap">
                        {output || "No output yet"}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Editor
