"use client";

import { AIMessage, HumanMessage } from "@langchain/core/messages";
import React, { useState, useRef } from "react";

const ChatForm: React.FC<{
  messages: Array<HumanMessage | AIMessage>;
  setMessages: React.Dispatch<
    React.SetStateAction<(HumanMessage | AIMessage)[]>
  >;
}> = ({ messages, setMessages }) => {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPdfUploading, setIsPdfUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (response.ok) {
        const jsonData = await response.json();
        setInput("");
        console.log(jsonData.response.kwargs.answer);
        setMessages([
          ...messages,
          new HumanMessage(input),
          new AIMessage(jsonData.response.kwargs.answer),
        ]);
      } else {
        console.error("서버 응답 오류");
      }
    } catch (error) {
      console.error("메시지 전송 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsPdfUploading(true);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMessages([
          ...messages,
          new AIMessage(`PDF '${file.name}' 업로드 완료: ${result.message}`),
        ]);
      } else {
        console.error("PDF 업로드 오류");
      }
    } catch (error) {
      console.error("PDF 업로드 중 오류 발생:", error);
    } finally {
      setIsPdfUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="메시지를 입력하세요..."
          disabled={isLoading || isPdfUploading}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isLoading || isPdfUploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          disabled={isLoading || isPdfUploading}
        >
          {isLoading ? "처리 중..." : "전송"}
        </button>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
          ref={fileInputRef}
          disabled={isPdfUploading}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isPdfUploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
          disabled={isPdfUploading}
        >
          {isPdfUploading ? "업로드 중..." : "PDF 업로드"}
        </button>
      </div>
    </form>
  );
};

export default ChatForm;
