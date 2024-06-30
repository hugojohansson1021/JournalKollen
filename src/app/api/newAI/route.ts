import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

const assistantId = 'asst_kEblhwMnLn6hr7uTZ4VqfpqA';

export const maxDuration = 50;

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is missing in the request body' }, { status: 400 });
    }

    const assistant = await openai.beta.assistants.retrieve(assistantId);
    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, { role: "user", content: question });
    const run = await openai.beta.threads.runs.create(thread.id, { assistant_id: assistant.id });

    await checkRunStatus(thread.id, run.id);

    const messagesResponse = await openai.beta.threads.messages.list(thread.id);
    let assistantResponse = "No response received";

    if (messagesResponse.data) {
      const assistantMessage = messagesResponse.data.find(m => m.role === 'assistant');
      if (assistantMessage && assistantMessage.content) {
        assistantResponse = assistantMessage.content
          .map(c => {
            if ('text' in c && c.text) {
              let text = c.text.value;
              text = text.replace(/### (.+?)(?=\n|$)/g, '<h3>$1</h3>');
              text = text.replace(/#### (.+?)(?=\n|$)/g, '<h4>$1</h4>');
              text = text.replace(/\n/g, '<br />');
              return text;
            }
            return '';
          })
          .join('\n');
      }
    }

    return NextResponse.json({ response: assistantResponse });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function checkRunStatus(threadId: string, runId: string): Promise<void> {
  let status = '';
  do {
    const response = await openai.beta.threads.runs.retrieve(threadId, runId);
    status = response.status;
    if (status !== 'completed') {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  } while (status !== 'completed');
}