import React from 'react';

const InfoCard: React.FC<{ title: string; children: React.ReactNode, icon: string }> = ({ title, children, icon }) => (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-3">
            <span className="text-3xl">{icon}</span>
            {title}
        </h3>
        <div className="text-gray-600 space-y-2">
            {children}
        </div>
    </div>
);

export const Guide: React.FC = () => {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-purple-800 mb-2">Guía para Padres y Educadores</h2>
                <p className="text-lg text-pink-500">¡Bienvenidos al universo mágico de Chispas de Cuentos!</p>
            </div>

            <InfoCard title="Nuestra Misión" icon="✨">
                <p>
                    Nuestra misión es encender la chispa de la imaginación en cada niño. Creemos que las historias son una herramienta poderosa para educar, entretener y, lo más importante, crear lazos afectivos. Esta app está diseñada para ser un puente entre la tecnología y la calidez de un cuento antes de dormir.
                </p>
            </InfoCard>

            <InfoCard title="¿Cómo Funciona?" icon="💡">
                 <ul className="list-disc list-inside space-y-1">
                    <li><strong>Elige una Aventura:</strong> Explora nuestra biblioteca de cuentos clasificados por edad.</li>
                    <li><strong>Escucha y Mira:</strong> Cada página cobra vida con una narración e ilustraciones únicas generadas por IA.</li>
                    <li><strong>Chatea con Chispa:</strong> Nuestro amigable bot está listo para responder las preguntas curiosas de los peques sobre las historias.</li>
                </ul>
            </InfoCard>
            
            <InfoCard title="Beneficios Educativos" icon="❤️">
                <ul className="list-disc list-inside space-y-1">
                    <li><strong>Fomento de la lectura:</strong> Despierta el interés por los libros y las narrativas.</li>
                    <li><strong>Desarrollo de la escucha:</strong> Mejora la capacidad de atención y comprensión auditiva.</li>
                    <li><strong>Estímulo de la creatividad:</strong> Las imágenes y relatos únicos inspiran la imaginación.</li>
                    <li><strong>Vínculo afectivo:</strong> Es la herramienta perfecta para compartir un momento de calidad en familia.</li>
                </ul>
            </InfoCard>

            <InfoCard title="Contacto y Sugerencias" icon="📧">
                <p>
                    ¡Nos encantaría saber de ti! Si tienes ideas para nuevos cuentos, sugerencias para mejorar la app o quieres compartir cómo usas Chispas de Cuentos en tu hogar o colegio, no dudes en escribirnos.
                </p>
                <p className="font-bold text-purple-700 pt-2">
                    <a href="mailto:jbarrios501@gmail.com" className="hover:underline">
                        jbarrios501@gmail.com
                    </a>
                </p>
                <p className="text-sm text-gray-500 pt-4">
                    Desarrollado con ❤️ por José Alejandro Barrios &lt;/JAB&gt;
                </p>
            </InfoCard>
        </div>
    );
};