import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Bot, Globe, Paperclip } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as codeTheme } from "react-syntax-highlighter/dist/esm/styles/prism";

const prompt = () => {
  const [inputValue, setInputValue] = useState("");
  const [typeMessage, setTypeMessage] = useState("");

  const [prompt, setPrompt] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(prompt);
  const promptEnd = useRef();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const storedPrompt = localStorage.getItem(`promptHistory_${user._id}`);
    if (storedPrompt) {
      setPrompt(JSON.parse(storedPrompt));
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    localStorage.setItem(`promptHistory_${user._id}`, JSON.stringify(prompt));
  }, [prompt]);

  useEffect(() => {
    promptEnd?.current?.scrollIntoView({ behavior: "smooth" });
  }, [prompt, loading]);

  const handleSent = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      return;
    }
    setTypeMessage(trimmed);
    setInputValue("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/deepseekai/prompt",
        {
          content: trimmed,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      setPrompt((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      setPrompt((prev) => [
        ...prev,
        { role: "user", content: trimmed },
        {
          role: "assistant",
          content: "Something went wrong to the AI response",
        },
      ]);
    } finally {
      setLoading(false);
      setTypeMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSent();
    }
  };
  return (
    <div className="flex flex-col items-center justify-between flex-1 w-full px-4 pb-4">
      {/*Greeting*/}
      <div className="mt-16 text-center">
        <div className="flex items-center justify-center gap-2">
          <img src="" alt="" />
          <h1 className="text-3xl font-semibold text-white mb-2">
            Hi, I'm Desi-Ai
          </h1>
        </div>
        <p className="text-gray-400  text-base mt-2">
          How can i help you today?{" "}
        </p>
      </div>

      {/*Prompt*/}
      <div className="w-full max-w-4xl flex-1 overflow-y-auto mt-6 mb-4 space-y-4 max-h-[60vh] px-1 scrollbar-hide">
        {prompt.map((msg, index) => (
          <div
            key={index}
            className={`w-full flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" ? (
              <div className="w-full bg-[#232323] text-white rounded-xl px-4 py-3 text-sm whitespace-pre-wrap">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={codeTheme}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg mt-2"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className="bg-gray-800 px-1 py-0.5 rounded"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="w-[50%] bg-blue-700 text-white rounded-xl px-4 py-2 text-sm whitespace-pre-wrap">
                {msg.content}
              </div>
            )}
          </div>
        ))}
        {loading && typeMessage && (
          <div className="w-[30%] self-end ml-auto break-words bg-blue-700 text-white rounded-xl px-4 py-2 text-sm whitespace-pre-wrap">
            {typeMessage}
          </div>
        )}{" "}
        {loading && (
          <div className="flex justify-start w-full">
            <div className="bg-[#2f2f2f] text-white px-4 py-3 rounded-xl text-sm animate-pulse">
              🤖Loading...
            </div>
          </div>
        )}
        <div ref={promptEnd} />
      </div>
      {/*imput box*/}
      <div className="w-full max-w-4xl relative mt-auto">
        <div className="bg-[#2f2f2f] rounded-[2rem] px-6 py-8 shadow-md">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Deep-Ai"
            className="bg-transparent w-full text-white placeholder-gray-400 text-lg outline-none"
          />
          <div className="flex items-center justify-between mt-4 gap-4">
            <div className="flex gap-2">
              <button className="flex items-center gap-2 border border-gray-500 text-white text-base px-3 py-1.5 rounded-full hover:bg-gray-600 transition">
                <Bot className="w-4 h-4" />
                Desi-Think(A1)
              </button>
              <button className="flex items-center gap-2 border border-gray-500 text-white text-base px-3 py-1.5 rounded-full hover:bg-gray-600 transition">
                <Globe className="w-4 h-4" /> Search
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-white transition">
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                onClick={handleSent}
                className="bg-gray-500 hover:bg-gray-900 p-2 rounded-full text-white transition "
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default prompt;
