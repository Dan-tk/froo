import * as dotenv from "dotenv"
/* dotenv.config() */
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { OPENAI_API_KEY, PINECONE_API_KEY, PINECONE_INDEX } from "./VAR.js";


const client = new Pinecone({apiKey: PINECONE_API_KEY})
const pineconeIndex = client.Index(PINECONE_INDEX)
const embeddings = new OpenAIEmbeddings({ modelName: 'text-embedding-ada-002', apiKey: OPENAI_API_KEY });
const vectorStore = await PineconeStore.fromExistingIndex(embeddings,{ pineconeIndex })
  
const systemTemplate = [
    `You are an assistant and advisor concerning Time management, scheduling and Self Improvement. `,
    `If the following information is relevant for the question, use them to answer `,
    `the question. If its they are not relevant, craft something sensible up. `,
    `don't know. Use three sentences to eight sentences maximum and keep the `,
    `answer clear. Motivate the user, and use the date provided IF necessary.`,
    `\n\n`,
    `{context}`,
  ].join("");

const llm = new ChatOpenAI({
model: "gpt-3.5-turbo",
apiKey: OPENAI_API_KEY})

const prompt = ChatPromptTemplate.fromMessages([
["system", systemTemplate],
["human", "{input}\n\n{date}"],
]);

const questionAnswerChain = await createStuffDocumentsChain({ llm, prompt })

const chain = await createRetrievalChain({
    retriever: vectorStore.asRetriever(),
    combineDocsChain: questionAnswerChain});

export const generateGeneralAnswer = async (state) => {
    if (state.multiple){
        state.task_output.splice(state.num_tasks - 1, 1);
    }
    console.log("Currently answering a general question!")
    const result = await chain.invoke(
        {
            "input": state.ref_query, 
            "date":state.date
        }
        )
    state.task_output = [{"GQ":result.answer},...state.task_output.filter(x => x !== null)]
    return state
}

/* const bossum = await generateGeneralAnswer({
    'query':"I want to go shopping in the afternoon, and then in the evening, go watch a movie, and late at night, watch another movie",
    'ref_query':'What is the best way to become effective?',
    'q_type': "TBD",
    'task_output': [],
    'multiple': false,
    'num_tasks':0,
    'date':[]})


console.log(bossum.task_output) */