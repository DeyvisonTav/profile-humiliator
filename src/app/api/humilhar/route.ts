import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { profileUrl } = await request.json();

    if (!profileUrl) {
      return NextResponse.json(
        { error: 'O nome de usuário do GitHub é obrigatório' },
        { status: 400 }
      );
    }

    // Validar se o username contém apenas caracteres válidos
    const validUsernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;
    if (!validUsernameRegex.test(profileUrl)) {
      return NextResponse.json(
        { error: 'Nome de usuário do GitHub inválido' },
        { status: 400 }
      );
    }

    const githubApiUrl = `https://api.github.com/users/${profileUrl}`;

    const response = await fetch(githubApiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Profile-Humiliator-App'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: 'Usuário do GitHub não encontrado' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Erro ao acessar a API do GitHub' },
        { status: response.status }
      );
    }

    const profile = await response.json();

    const { name, bio, public_repos, followers, following, location, html_url, avatar_url } = profile;

    const prompt = `Você é um comediante de stand-up e vai fazer um roast MUITO engraçado com base no seguinte perfil de desenvolvedor do GitHub.

Informações disponíveis:
- Nome: ${name || profileUrl}
- Bio: ${bio || 'Bio vazia, ou seja, a própria deep web do GitHub.'}
- Repositórios públicos: ${public_repos}
- Seguidores: ${followers}
- Seguindo: ${following}
- Localização: ${location || 'Desconhecida, talvez Marte?'}
- Perfil: ${html_url}

Instruções:
1. Faça piadas com base nesses dados.
2. Use um tom sarcástico e engraçado, como se estivesse em um roast.
3. Use emojis para deixar mais divertido.
4. Exagere as conquistas ou falta delas com humor.
5. Seja criativo com a bio ou a falta dela.

Exemplo de tom:
"Esse aqui tem 3 seguidores no GitHub e 47 repositórios com README vazio. Claramente um influenciador do código! 😎
A bio diz 'Fullstack developer', mas o único stack que ele lida é o de boletos no final do mês. 📉"`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'Você é um comediante stand-up especializado em fazer roasts divertidos sobre perfis de desenvolvedores. Use humor, sarcasmo leve e criatividade com emojis.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.9,
      max_tokens: 500,
    });

    const roast = completion.choices[0].message.content?.trim() || 'Ops, não consegui gerar um roast engraçado!';

    return NextResponse.json({ roast, profileImage: avatar_url });
  } catch (error) {
    console.error('Erro ao gerar roast:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar roast' },
      { status: 500 }
    );
  }
}