import React, { useState, useCallback } from 'react';
import { generatePetNames } from './services/geminiService';
import Loader from './components/Loader';

const App: React.FC = () => {
  const [animalType, setAnimalType] = useState<string>('');
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateNames = useCallback(async () => {
    if (!animalType.trim()) {
      setError('動物の種類を入力してください。');
      setGeneratedNames([]);
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedNames([]); // Clear previous results

    try {
      const names = await generatePetNames(animalType);
      setGeneratedNames(names);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '名前の生成中にエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  }, [animalType]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAnimalType(e.target.value);
    if (error && e.target.value.trim()) {
      setError(null); // Clear error if user starts typing after an empty input error
    }
  }, [error]);

  return (
    <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-xl w-full max-w-md mx-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-700 mb-6">
        ペットの名前ジェネレーター
      </h1>

      <div className="mb-6">
        <label htmlFor="animalType" className="block text-gray-700 text-lg sm:text-xl font-medium mb-2">
          動物の種類を入力してください:
        </label>
        <input
          type="text"
          id="animalType"
          value={animalType}
          onChange={handleInputChange}
          placeholder="例: 犬、猫、ハムスター"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-base sm:text-lg"
          disabled={loading}
          aria-label="動物の種類"
        />
        {error && <p className="text-red-600 text-sm sm:text-base mt-2">{error}</p>}
      </div>

      <button
        onClick={handleGenerateNames}
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg text-lg sm:text-xl transition duration-300 ${
          loading || !animalType.trim() ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={loading || !animalType.trim()}
      >
        {loading ? '生成中...' : '名前を生成'}
      </button>

      {loading && (
        <Loader />
      )}

      {generatedNames.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-2xl sm:text-3xl font-semibold text-blue-700 mb-4 text-center">
            生成された名前:
          </h2>
          <ul className="list-disc list-inside space-y-2 text-lg sm:text-xl text-gray-800">
            {generatedNames.map((name, index) => (
              <li key={index} className="flex items-center">
                <span className="text-blue-500 mr-2">•</span>
                <span>{name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
