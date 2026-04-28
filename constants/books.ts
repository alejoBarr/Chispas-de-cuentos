export interface CuratedBook {
  title: string;
  author: string;
  emoji: string;
  ageRange: '8-9 años' | '10-11 años' | '11-12 años';
  tags: string[];
  description: string;
  link: string;
}

export const CURATED_BOOKS: CuratedBook[] = [
  // 8-9 años
  {
    title: 'El Principito',
    author: 'Antoine de Saint-Exupéry',
    emoji: '🌹',
    ageRange: '8-9 años',
    tags: ['Clásico', 'Reflexión', 'Amistad'],
    description: 'Un pequeño príncipe que viaja de planeta en planeta aprende las lecciones más importantes de la vida.',
    link: 'https://www.google.com/search?tbm=bks&q=El+Principito+Antoine+de+Saint-Exupéry',
  },
  {
    title: 'Matilda',
    author: 'Roald Dahl',
    emoji: '📖',
    ageRange: '8-9 años',
    tags: ['Magia', 'Humor', 'Escuela'],
    description: 'Una niña superdotada con poderes telequinéticos que descubre que los libros son su mayor tesoro.',
    link: 'https://www.google.com/search?tbm=bks&q=Matilda+Roald+Dahl',
  },
  {
    title: 'Las Brujas',
    author: 'Roald Dahl',
    emoji: '🧙‍♀️',
    ageRange: '8-9 años',
    tags: ['Fantasía', 'Aventura', 'Terror suave'],
    description: 'Un niño descubre una convención secreta de brujas reales. ¿Podrá escapar de su plan maléfico?',
    link: 'https://www.google.com/search?tbm=bks&q=Las+Brujas+Roald+Dahl',
  },

  // 10-11 años
  {
    title: 'Momo',
    author: 'Michael Ende',
    emoji: '⏰',
    ageRange: '10-11 años',
    tags: ['Fantasía', 'Tiempo', 'Amistad'],
    description: 'Una niña misteriosa lucha contra los Hombres Grises que roban el tiempo a las personas.',
    link: 'https://www.google.com/search?tbm=bks&q=Momo+Michael+Ende',
  },
  {
    title: 'La Historia Interminable',
    author: 'Michael Ende',
    emoji: '🐉',
    ageRange: '10-11 años',
    tags: ['Fantasía', 'Aventura', 'Imaginación'],
    description: 'Bastian encuentra un libro antiguo que le transporta al mágico mundo de Fantasía, donde es el único que puede salvarla.',
    link: 'https://www.google.com/search?tbm=bks&q=La+Historia+Interminable+Michael+Ende',
  },
  {
    title: 'El Capitán Calzoncillos',
    author: 'Dav Pilkey',
    emoji: '🩲',
    ageRange: '10-11 años',
    tags: ['Humor', 'Cómic', 'Aventura'],
    description: 'Dos amigos crean su propio cómic y, sin quererlo, hipnotizan a su director para convertirlo en un superhéroe de calzoncillos.',
    link: 'https://www.google.com/search?tbm=bks&q=El+Capitán+Calzoncillos+Dav+Pilkey',
  },

  // 11-12 años
  {
    title: 'El León, la Bruja y el Armario',
    author: 'C.S. Lewis',
    emoji: '🦁',
    ageRange: '11-12 años',
    tags: ['Fantasía', 'Épico', 'Clásico'],
    description: 'Cuatro hermanos descubren dentro de un armario el mundo de Narnia, gobernado por una bruja eterna.',
    link: 'https://www.google.com/search?tbm=bks&q=El+León+la+Bruja+y+el+Armario+CS+Lewis',
  },
  {
    title: 'El Hobbit',
    author: 'J.R.R. Tolkien',
    emoji: '🧙‍♂️',
    ageRange: '11-12 años',
    tags: ['Fantasía', 'Aventura', 'Épico'],
    description: 'El tranquilo hobbit Bilbo Bolsón emprende una aventura inesperada con enanos y un mago para recuperar un tesoro custodiado por un dragón.',
    link: 'https://www.google.com/search?tbm=bks&q=El+Hobbit+Tolkien',
  },
  {
    title: 'Charlie y la Fábrica de Chocolate',
    author: 'Roald Dahl',
    emoji: '🍫',
    ageRange: '11-12 años',
    tags: ['Magia', 'Humor', 'Fantasía'],
    description: 'Charlie, un niño pobre, gana un boleto dorado para visitar la misteriosa fábrica de chocolate de Willy Wonka.',
    link: 'https://www.google.com/search?tbm=bks&q=Charlie+y+la+Fábrica+de+Chocolate+Roald+Dahl',
  },
];
