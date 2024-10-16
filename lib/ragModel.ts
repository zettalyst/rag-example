import { OpenAIEmbeddings } from "@langchain/openai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";


const COLLECTION_NAME = "pdf_collection";

export function getVectorStore() {
  const embeddings = new OpenAIEmbeddings();
  const vectorStore = new Chroma(embeddings, {
    collectionName: COLLECTION_NAME,
    url: "http://127.0.0.1:8000", // Optional, will default to this value
    collectionMetadata: {
      "hnsw:space": "cosine",
    }, // Optional, can be used to specify the distance method of the embedding space https://docs.trychroma.com/usage-guide#changing-the-distance-function
  });
  return vectorStore;
}

export async function queryRAG(query: string) {
  // Create an LLM instance
  const llm = new ChatOpenAI({
    model: "gpt-4o",
  });
  // Create embedding function
  const embeddings = new OpenAIEmbeddings();
  // Create a prompt template
  const prompt =
    ChatPromptTemplate.fromTemplate(`Answer the following question based only of the provided context:
            <context>{context}</context>
            Question: {input}
        `);

  // Create a vector store to interact with the vector store
  const vectorStore = new Chroma(embeddings, {
    url: "http://127.0.0.1:8000", //update this as per your requirements
    collectionName: COLLECTION_NAME,
  });
  // Create a retriever
  const retriever = await vectorStore.asRetriever({
    k: 1,
    searchType: "similarity",
  });

  // Define the document chain
  const combineDocsChain = await createStuffDocumentsChain({
    llm,
    prompt,
  });

  // Define the retrieval chain
  const retrievalChain = await createRetrievalChain({
    combineDocsChain,
    retriever,
  });
  const response = await retrievalChain.invoke({
    input: query,
  });
  return response;
}
