// Chat.tsx
import React, { useState } from "react";
import { MessageSquare } from "lucide-react";

interface ChatProps {
  onAsk?: (question: string) => Promise<string>;
}

const Chat: React.FC<ChatProps> = ({ onAsk }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loadingAnswer, setLoadingAnswer] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoadingAnswer(true);
    setAnswer(null);

    try {
      if (onAsk) {
        const response = await onAsk(question);
        setAnswer(response);
      } else {
        // Default behavior: call local API
        const res = await fetch("https://job-forecast-app-backend-nt19.onrender.com/api/forecast/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        });
        const json = await res.json();
        setAnswer(json.answer);
      }
    } catch (err) {
      console.error(err);
      setAnswer("Error processing your question.");
    } finally {
      setLoadingAnswer(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 bg-fuchsia text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform z-50"
        onClick={() => setChatOpen(true)}
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
          <div className="w-full md:w-[360px] bg-card p-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Ask Forecast AI</h2>
              <button
                className="text-gray-400 hover:text-white"
                onClick={() => setChatOpen(false)}
              >
                ✖
              </button>
            </div>

            <div className="flex-1 overflow-auto mb-4">
              {loadingAnswer && <p className="text-gray-400">Thinking...</p>}
              {answer && <p className="text-gray-200">{answer}</p>}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 bg-card/50 border border-white/20 rounded px-3 py-2 text-sm text-white"
              />
              <button
                onClick={handleAsk}
                className="bg-fuchsia px-4 py-2 rounded text-white font-semibold hover:bg-fuchsia/90"
              >
                Ask
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
