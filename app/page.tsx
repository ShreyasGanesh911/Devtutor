'use client'
import { useRouter } from 'next/navigation'
import { Code, MessageSquare, Terminal, ArrowRight } from 'react-feather'

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gray-900 text-gray-200">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            DevTutor
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Your Personal AI Code Tutor
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-gray-750 cursor-pointer border border-transparent hover:border-blue-500/20">
            <div className="text-blue-500 mb-4">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time AI Chat</h3>
            <p className="text-gray-400">
              Get instant help and explanations from our AI tutor through natural conversation.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-gray-750 cursor-pointer border border-transparent hover:border-purple-500/20">
            <div className="text-purple-500 mb-4">
              <Code size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Integrated Code Editor</h3>
            <p className="text-gray-400">
              Write, test, and run code directly in the browser without switching tabs.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-gray-750 cursor-pointer border border-transparent hover:border-green-500/20">
            <div className="text-green-500 mb-4">
              <Terminal size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Powered by GPT</h3>
            <p className="text-gray-400">
              Leveraging the latest GPT technology for intelligent and contextual coding assistance.
            </p>
          </div>
        </div>

        {/* About Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">About DevTutor</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            DevTutor is your intelligent coding companion that combines the power of AI with 
            a seamless learning experience. Whether you're a beginner learning to code or an 
            experienced developer looking for quick solutions, our platform provides real-time 
            assistance through natural conversation and an integrated development environment.
          </p>
          <p className="text-gray-400 mb-8 leading-relaxed">
            With our chat interface powered by GPT's real-time API, you can ask questions, 
            get explanations, and receive guidance as if you're talking to a real tutor. 
            The built-in code editor allows you to implement solutions immediately and run 
            your code without leaving the platform.
          </p>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => router.push('/tutor')}
            className="group bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 
                     text-white px-8 py-4 rounded-lg font-semibold 
                     transition-all duration-300 transform hover:scale-105
                     shadow-lg hover:shadow-blue-500/25
                     flex items-center gap-2 mx-auto"
          >
            <span>Start Learning Now</span>
            <ArrowRight className="group-hover:translate-x-1 transition-transform duration-300" size={20} />
          </button>
        </div>
      </div>
    </main>
  )
}
