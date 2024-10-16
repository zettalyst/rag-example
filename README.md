## Getting Started

First, create a `.env.local` file with the following environment variables:
```bash
# for OpenAI
OPENAI_API_KEY=
# for Langsmith
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=
LANGCHAIN_PROJECT=
```

Second, run chromadb locally:
```bash
$ docker run -d -p 8000:8000 chromadb/chroma
```

Third, install dependencies and run the development server:
```bash
$ npm install
$ npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.