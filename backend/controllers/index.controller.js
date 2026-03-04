import dotenv from "dotenv";
dotenv.config();
process.env.HTTPS_PROXY = "";
process.env.HTTP_PROXY = "";
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
  model: "gemini-embedding-001",
});

const pinecone = new Pinecone();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

export const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});

export async function indexDocument(
  PDF_PATH,
  semester,
  branch,
  type = "syllabus",
) {
  try {
    const pdfLoader = new PDFLoader(PDF_PATH);
    const rawDocs = await pdfLoader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

    //   console.log(chunkedDocs.length);

    // 1. Modify the metadata on the existing Document objects
    chunkedDocs.forEach((doc) => {
      doc.metadata = {
        ...doc.metadata,
        semester: semester || null,
        branch: branch || null,
        type,
      };
    });

    // 2. Create a separate array of IDs
    const docIds = chunkedDocs.map(
      (_, i) => `${branch || "common"}-sem${semester || "NA"}--${type}-${i}`,
    );

    // 3. FIX: Use Pinecone's $eq (equals) operator for the filter
    // const filter = {
    //   branch: { $eq: branch },
    //   semester: { $eq: semester },
    //   type: { $eq: "syllabus" },
    // };

    // console.log("🧹 Deleting old syllabus for", filter);

    // await pineconeIndex.namespace("").deleteAll({ filter: filter });

    // console.log(`🧹 Old syllabus deleted for ${branch} sem ${semester}`);

    // Add updated syllabus :
    await vectorStore.addDocuments(chunkedDocs, { ids: docIds });

    console.log(`Indexed syllabus for semester ${semester}`);
    return { message: `Indexed syllabus for semester ${semester}` };
  } catch (error) {
    console.error("Error indexing document:", error);
    throw error;
  }
}
