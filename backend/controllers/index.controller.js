import dotenv from "dotenv";
dotenv.config();
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

// 1 => index the document :
// => load the doc
// => convert into chunks

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "text-embedding-004",
});

const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});

export async function indexDocument(PDF_PATH, semester) {
  try {
    const pdfLoader = new PDFLoader(PDF_PATH);
    const rawDocs = await pdfLoader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

    //   console.log(chunkedDocs.length);

    const docsWithMetadata = chunkedDocs.map((doc, i) => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        semester: semester, // Add semester info
        type: "syllabus",
      },
    }));

    // Delete old syllabus data for this semester (if needed)
    await pineconeIndex.delete({
      deleteAll: false,
      filter: { semester: semester },
    });

    // Add updated syllabus :
    await vectorStore.addDocuments(docsWithMetadata);

    console.log(`Indexed syllabus for semester ${semester}`);
    return { message: `Indexed syllabus for semester ${semester}` };
  } catch (error) {
    console.error("Error indexing document:", error);
    throw error;
  }
}
