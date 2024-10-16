import { NextRequest, NextResponse } from "next/server";
import { queryRAG } from "@/lib/ragModel";
import { AIMessage } from "@langchain/core/messages";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  try {
    const response = await queryRAG(message);
    return NextResponse.json({ response: new AIMessage(response) });
  } catch (error) {
    console.error("Error querying RAG model:", error);
    return NextResponse.json({ error: "An error occurred while processing the query" }, { status: 500 });
  }
}
