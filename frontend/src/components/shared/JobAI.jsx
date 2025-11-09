import { useState, useRef, useEffect } from "react";
import "./App.css";
import ReactMarkdown from "react-markdown";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Initialize Gemini model
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function JobAI() {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const chatContainerRef = useRef(null);

  // Auto-scroll when new message appears
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  // ✅ Generate answer from Gemini
  const generateAnswer = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const currentQuestion = question;
    setQuestion("");
    setGeneratingAnswer(true);

    // Add user's message to chat
    setChatHistory((prev) => [...prev, { type: "question", content: currentQuestion }]);

    try {
      const result = await model.generateContent(currentQuestion);
      const aiResponse = result.response.text();

      // Add AI's response to chat
      setChatHistory((prev) => [...prev, { type: "answer", content: aiResponse }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: "❌ Something went wrong. Please try again later." },
      ]);
    } finally {
      setGeneratingAnswer(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="h-full max-w-4xl mx-auto flex flex-col p-3">
        {/* Header */}
        <header className="text-center py-4">
          <h1 className="text-4xl font-bold text-blue-500 hover:text-blue-600 transition-colors">
            Job AI ✨
          </h1>
        </header>

        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto mb-4 rounded-lg bg-white shadow-lg p-4 hide-scrollbar"
        >
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="bg-blue-50 rounded-xl p-8 max-w-2xl">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">
                  Welcome to Job AI! 👋
                </h2>
                <p className="text-gray-600 mb-4">
                  Ask me anything. I can help with:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="bg-white p-4 rounded-lg shadow-sm">💡 Job Selection</div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">🔧 Technical Questions</div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">📝 Writing Assistance</div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">🤔 Job Preferences</div>
                </div>
                <p className="text-gray-500 mt-6 text-sm">
                  Type your question below and press Enter or click Send 🪄
                </p>
              </div>
            </div>
          ) : (
            chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  chat.type === "question" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block max-w-[80%] p-3 rounded-lg overflow-auto hide-scrollbar ${
                    chat.type === "question"
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <ReactMarkdown>{chat.content}</ReactMarkdown>
                </div>
              </div>
            ))
          )}

          {generatingAnswer && (
            <div className="text-left">
              <div className="inline-block bg-gray-100 p-3 rounded-lg animate-pulse">
                Generating ✨
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={generateAnswer} className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex gap-2">
            <textarea
              required
              className="flex-1 border border-gray-300 rounded p-3 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything..."
              rows="2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  generateAnswer(e);
                }
              }}
            />
            <button
              type="submit"
              className={`px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${
                generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={generatingAnswer}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobAI;
