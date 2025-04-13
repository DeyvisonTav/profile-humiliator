import OpenAI from 'openai';

interface GithubProfile {
  name: string;
  bio: string;
  repositories: Array<{
    name: string;
    description: string;
    technologies: string[];
    stars?: number;
    forks?: number;
  }>;
  contributions: Array<{
    type: string;
    description: string;
    date?: string;
  }>;
  topLanguages: string[];
  location?: string;
  company?: string;
  blog?: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function parseGithubProfile(profileText: string): Promise<GithubProfile | null> {
  try {
    const prompt = `
    Por favor, analise este texto de perfil do GitHub e extraia as seguintes informações em formato JSON:
    - name (nome do usuário)
    - bio (biografia/descrição)
    - repositories (array com nome, descrição, tecnologias usadas, número de stars e forks)
    - contributions (array com tipo de contribuição, descrição e data)
    - topLanguages (array com as principais linguagens usadas)
    - location (localização, se disponível)
    - company (empresa, se disponível)
    - blog (site/blog, se disponível)

    Texto do perfil:
    ${profileText}

    Retorne apenas o JSON, sem explicações adicionais.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "Você é um assistente especializado em extrair informações estruturadas de perfis do GitHub. Responda apenas com o JSON solicitado. Foque em extrair informações relevantes sobre projetos, contribuições e habilidades técnicas."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('Resposta vazia da API do OpenAI');
    }

    return JSON.parse(response) as GithubProfile;
  } catch (error) {
    console.error('Erro ao analisar perfil do GitHub:', error);
    return null;
  }
} 