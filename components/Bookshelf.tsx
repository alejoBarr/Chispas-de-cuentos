import React, { useState } from 'react';
import { CURATED_BOOKS, CuratedBook } from '../constants/books';
import { CONFIG } from '../services/config';
import { Spinner } from './Spinner';

interface BookSearchResult {
  id: string;
  title: string;
  authors?: string[];
  publishedDate?: string;
  thumbnail?: string;
  infoLink: string;
  description?: string;
  categories?: string[];
}

export const Bookshelf: React.FC<{ playSound: (sound: 'ui-click') => void }> = ({ playSound }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    playSound('ui-click');
    setIsLoading(true);
    setError(null);
    try {
      // Usamos la configuración centralizada para mayor consistencia
      const apiKey = CONFIG.API_KEYS[0] || '';
      const keyParam = apiKey ? `&key=${apiKey}` : '';
      
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&langRestrict=es&maxResults=12${keyParam}`
      );
      
      if (response.status === 429) {
        setError('¡Vaya! La biblioteca está muy llena de gente ahora mismo. Espera un momentito y vuelve a buscar. 📚');
        return;
      }

      if (!response.ok) throw new Error(`Error de red: ${response.status}`);
      const data = await response.json();
      
      const formattedBooks: BookSearchResult[] = (data.items || []).map((item: any) => {
        const title = item.volumeInfo.title;
        const author = item.volumeInfo.authors?.[0] || '';
        // Creamos el link de búsqueda de Google Books para que coincida con los recomendados
        const searchLink = `https://www.google.com/search?tbm=bks&q=${encodeURIComponent(title + ' ' + author)}`;
        
        return {
          id: item.id,
          title: title,
          authors: item.volumeInfo.authors,
          publishedDate: item.volumeInfo.publishedDate,
          thumbnail: item.volumeInfo.imageLinks?.thumbnail?.replace('http:', 'https:'),
          infoLink: searchLink, // Usamos el link de búsqueda unificado
          description: item.volumeInfo.description || item.searchInfo?.textSnippet || 'Sin descripción disponible.',
          categories: item.volumeInfo.categories,
        };
      });
      
      setSearchResults(formattedBooks);
    } catch (err) {
      console.error("Error en la búsqueda de libros:", err);
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

  const SearchResultCard: React.FC<{ book: BookSearchResult }> = ({ book }) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col h-full transition-transform hover:scale-105">
      <div className="w-full h-40 bg-purple-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden shadow-inner">
        {book.thumbnail ? (
          <img
            src={book.thumbnail}
            alt={book.title}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <span className="text-5xl">📖</span>
        )}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-1 truncate" title={book.title}>{book.title}</h3>
      <p className="text-sm font-semibold text-purple-600 mb-2 truncate">{book.authors?.[0] || 'Autor desconocido'}</p>
      
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
          {book.publishedDate?.split('-')[0] || 'Año desc.'}
        </span>
        {book.categories?.slice(0, 2).map((cat) => (
          <span key={cat} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full truncate max-w-[100px]">
            {cat}
          </span>
        ))}
      </div>

      <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3" dangerouslySetInnerHTML={{ __html: book.description || '' }} />
      
      <a
        href={book.infoLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => playSound('ui-click')}
        className="mt-auto block text-center py-2 bg-pink-500 text-white font-bold rounded-full hover:bg-pink-600 transition-colors"
      >
        Ver en Biblioteca
      </a>
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
          <p className="text-sm text-gray-600">Busca entre millones de libros en Google Books</p>
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
          <>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((book) => (
                  <SearchResultCard key={book.id} book={book} />
                ))}
              </div>
            ) : searchTerm && !isLoading && <p className="text-center text-gray-500 italic">No encontramos resultados para tu búsqueda. ¡Prueba con otro título!</p>}
          </>
        )}
      </section>
    </div>
  );
};
