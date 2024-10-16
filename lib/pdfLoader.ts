import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { getVectorStore } from "./ragModel";

export async function loadPDFAndStore(
  filePath: string,
  collectionName: string
) {
  // PDF 파일 로드
  const loader = new PDFLoader(filePath);
  const docs = await loader.load();

  // 텍스트 분할
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocs = await textSplitter.splitDocuments(docs);

  // Embeddings 생성 및 Chroma에 저장
  const vectorStore = getVectorStore();

  try {
    await vectorStore.addDocuments(splitDocs);
  } catch (error) {
    console.error(error);
  }

  console.log(`PDF loaded and stored in collection: ${collectionName}`);
  return vectorStore;
}
