import React, { useState } from 'react';
import { CURATED_BOOKS, CuratedBook } from '../constants/books';
import { Spinner } from './Spinner';

interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

export const Bookshelf: React.FC<{ playSound: (sound: 'ui-click') => void }> = ({ playSound }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<OpenLibraryBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    playSound('ui-click');
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}&language=spa&limit=12`
      );
      if (!response.ok) throw new Error('Error al conectar con la biblioteca');
      const data = await response.json();
      setSearchResults(data.docs);
    } catch (err) {
      console.error(err);
      setError('No pudimos conectar con la biblioteca digital. ¡Inténtalo de nuevo más tarde!');
    } finally {
      setIsLoading(false);
    }
  };

  const BookCard: React.FC<{ book: CuratedBook }> = ({ book }) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col h-full transition-transform hover:scale-105">
      <div className="text-5xl mb-4 text-center">{book.emoji}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-1">{book.title}</h3>
      <p className="text-sm font-semibold text-purple-600 mb-2">{book.author}</p>
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs font-bold rounded-full">
          {book.ageRange}
        </span>
        {book.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">{book.description}</p>
      <a
        href={book.link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => playSound('ui-click')}
        className="mt-auto block text-center py-2 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-colors"
      >
        Ver en Biblioteca
      </a>
    </div>
  );

  const SearchResultCard: React.FC<{ book: OpenLibraryBook }> = ({ book }) => (
    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 flex gap-4 items-start shadow-sm border border-white/50">
      <div className="w-16 h-24 bg-purple-100 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
        {book.cover_i ? (
          <img
            src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-2xl">📚</span>
        )}
      </div>
      <div className="flex-grow min-w-0">
        <h4 className="font-bold text-gray-800 truncate" title={book.title}>
          {book.title}
        </h4>
        <p className="text-sm text-purple-600 truncate">{book.author_name?.[0] || 'Autor desconocido'}</p>
        <p className="text-xs text-gray-500 mt-1">{book.first_publish_year || 'Año desconocido'}</p>
        <a
          href={`https://openlibrary.org${book.key}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => playSound('ui-click')}
          className="inline-block mt-2 text-xs font-bold text-pink-500 hover:text-pink-600 underline"
        >
          Más información
        </a>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto p-4 space-y-12 pb-20">
      <section>
        <header className="text-center mb-8">
          <h2 className="text-3xl font-bold text-purple-800 mb-2">Lecturas Recomendadas</h2>
          <p className="text-gray-600">Joyas literarias para mentes que crecen (8-12 años)</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CURATED_BOOKS.map((book, i) => (
            <BookCard key={i} book={book} />
          ))}
        </div>
      </section>

      <section className="bg-purple-100/50 backdrop-blur-sm p-6 rounded-3xl border-2 border-white shadow-inner">
        <header className="text-center mb-6">
          <h3 className="text-2xl font-bold text-purple-800">Explorar la Biblioteca Digital</h3>
          <p className="text-sm text-gray-600">Busca entre miles de libros en la Open Library</p>
        </header>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ej: Aventura, Misterio, Tolkien..."
            className="flex-grow p-3 rounded-full border-2 border-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-pink-500 text-white font-bold rounded-full shadow-md hover:bg-pink-600 transition-colors"
          >
            Buscar
          </button>
        </form>

        {isLoading ? (
          <Spinner text="Buscando en los estantes digitales..." />
        ) : error ? (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((book) => (
              <SearchResultCard key={book.key} book={book} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
