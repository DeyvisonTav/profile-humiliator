'use client';

import { useState } from 'react';
import { parseGithubProfile } from '../services/githubParser';

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

export default function GithubProfileAnalyzer() {
  const [username, setUsername] = useState('');
  const [profileData, setProfileData] = useState<GithubProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const githubUrl = `https://github.com/${username}`;
      const data = await parseGithubProfile(githubUrl);
      if (data) {
        setProfileData(data);
      } else {
        setError('Ops! Não consegui encontrar esse perfil. Será que ele existe mesmo? 🤔');
      }
    } catch (err) {
      setError('Deu ruim! Algo deu errado ao tentar humilhar esse perfil 😅');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">GitHub Roaster 3000</h1>
        <p className="text-gray-600">Prepare-se para ter seu GitHub exposto e zoado! 😈</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-lg font-medium text-gray-700 mb-2">
            🎯 Digite o username do GitHub da vítima
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">github.com/</span>
            </div>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
              className="w-full pl-24 pr-4 py-3 border-2 border-indigo-200 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="deyvison-tavares"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Ex: Se o perfil for github.com/deyvison-tavares, digite apenas "deyvison-tavares"
          </p>
        </div>
        <button
          type="submit"
          disabled={loading || !username}
          className={`w-full py-3 px-6 text-lg font-medium rounded-lg shadow-md transition-all duration-200 transform hover:scale-105
            ${loading || !username 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
        >
          {loading ? '🔍 Stalkeando...' : '🎭 Zoar esse Dev!'}
        </button>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
          <p className="text-red-600 font-medium flex items-center">
            <span className="text-2xl mr-2">😅</span>
            {error}
          </p>
        </div>
      )}

      {profileData && (
        <div className="mt-8 space-y-8 bg-white rounded-xl p-8 shadow-lg border-2 border-indigo-100">
          <div>
            <h2 className="text-3xl font-bold text-indigo-600">{profileData.name}</h2>
            <p className="text-gray-600 mt-2 text-lg">{profileData.bio || "Bio tão vazia quanto as contribuições... 👀"}</p>
            {(profileData.location || profileData.company || profileData.blog) && (
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                {profileData.location && <span className="flex items-center">📍 {profileData.location}</span>}
                {profileData.company && <span className="flex items-center">🏢 {profileData.company}</span>}
                {profileData.blog && (
                  <a href={profileData.blog} target="_blank" rel="noopener noreferrer" 
                    className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors">
                    🔗 Portfolio (se é que pode chamar isso de portfolio)
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">🔥</span>
              Linguagens "Dominadas"
            </h3>
            <div className="flex flex-wrap gap-2">
              {profileData.topLanguages.length > 0 ? (
                profileData.topLanguages.map((lang, index: number) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                  >
                    {lang}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 italic">Nenhuma linguagem? Nem HTML conta? 😅</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">📚</span>
              "Obras-Primas" (aka Repositórios)
            </h3>
            <div className="space-y-4">
              {profileData.repositories.length > 0 ? (
                profileData.repositories.map((repo, index: number) => (
                  <div key={index} className="border-2 border-indigo-50 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <h4 className="font-medium text-xl text-indigo-600">{repo.name}</h4>
                    <p className="text-gray-600 mt-2">
                      {repo.description || "Sem descrição... que mistério! 🕵️‍♂️"}
                    </p>
                    <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                      {repo.stars !== undefined && (
                        <span className="flex items-center">⭐ {repo.stars} estrelas (até a mãe deu star)</span>
                      )}
                      {repo.forks !== undefined && (
                        <span className="flex items-center">🔱 {repo.forks} forks (alguém realmente usa isso?)</span>
                      )}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {repo.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">Nenhum repositório público? O que está escondendo? 🤔</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">🎯</span>
              "Contribuições" (se é que podemos chamar assim)
            </h3>
            <div className="space-y-4">
              {profileData.contributions.length > 0 ? (
                profileData.contributions.map((contrib, index: number) => (
                  <div key={index} className="border-b-2 border-indigo-50 pb-4">
                    <div className="flex items-start">
                      <span className="mr-3 text-2xl">
                        {contrib.type === 'commit' ? '💻' : 
                         contrib.type === 'issue' ? '🐛' : 
                         contrib.type === 'pull_request' ? '🔄' : '📝'}
                      </span>
                      <div>
                        <h4 className="font-medium text-lg text-indigo-600">{contrib.type}</h4>
                        <p className="text-gray-600 mt-1">{contrib.description}</p>
                        {contrib.date && (
                          <p className="text-gray-400 text-sm mt-2">{contrib.date}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">Zero contribuições? Nem um commit de "Initial commit"? 😱</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 