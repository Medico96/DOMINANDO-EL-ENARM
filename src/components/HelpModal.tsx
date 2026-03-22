import { X, HelpCircle, Keyboard, Settings, FileText } from 'lucide-react';
import { useState } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [activeTab, setActiveTab] = useState<'inicio' | 'controles' | 'tips'>('inicio');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <HelpCircle size={28} />
            <h2 className="text-2xl font-bold">Ayuda</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-blue-800 p-2 rounded-lg transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 flex">
          <button
            onClick={() => setActiveTab('inicio')}
            className={`flex-1 py-4 px-6 font-semibold transition-all border-b-2 ${
              activeTab === 'inicio'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => setActiveTab('controles')}
            className={`flex-1 py-4 px-6 font-semibold transition-all border-b-2 ${
              activeTab === 'controles'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Controles
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex-1 py-4 px-6 font-semibold transition-all border-b-2 ${
              activeTab === 'tips'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Tips
          </button>
        </div>

        {/* Contenido */}
        <div className="p-8">
          {activeTab === 'inicio' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">¿Cómo funciona el simulador?</h3>
              
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="text-2xl">📋</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Selecciona tus preferencias</h4>
                    <p className="text-gray-700">Elige especialidad, número de preguntas y haz clic en "Iniciar"</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl">❓</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Responde las preguntas</h4>
                    <p className="text-gray-700">Selecciona una opción (A, B, C o D) para cada pregunta</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl">⏱️</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Gestiona tu tiempo</h4>
                    <p className="text-gray-700">Dispones de 6 horas para completar el simulacro completo</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl">📊</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Revisa tus resultados</h4>
                    <p className="text-gray-700">Al finalizar, verás un análisis detallado de tu desempeño</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">💡 Tip:</span> Puedes saltar preguntas y volver a ellas después usando la navegación en la izquierda.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'controles' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Controles y Navegación</h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Keyboard size={20} className="text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Durante el simulador</h4>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-2 ml-6">
                    <li><span className="font-mono bg-gray-200 px-2 py-1 rounded">← Anterior</span> - Ir a la pregunta anterior</li>
                    <li><span className="font-mono bg-gray-200 px-2 py-1 rounded">Siguiente →</span> - Ir a la siguiente pregunta</li>
                    <li><span className="font-mono bg-gray-200 px-2 py-1 rounded">Click en número</span> - Saltar a pregunta específica</li>
                    <li><span className="font-mono bg-gray-200 px-2 py-1 rounded">A, B, C, D</span> - Seleccionar opción</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings size={20} className="text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Indicadores visuales</h4>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-2 ml-6">
                    <li><span className="inline-block w-3 h-3 bg-blue-600 rounded mr-2"></span><strong>Azul</strong> - Pregunta actual</li>
                    <li><span className="inline-block w-3 h-3 bg-green-100 rounded mr-2 border border-green-600"></span><strong>Verde</strong> - Ya respondida</li>
                    <li><span className="inline-block w-3 h-3 bg-gray-100 rounded mr-2"></span><strong>Gris</strong> - Sin responder</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={20} className="text-blue-600" />
                    <h4 className="font-semibold text-gray-900">En los resultados</h4>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-2 ml-6">
                    <li><span className="inline-block w-3 h-3 bg-green-500 rounded mr-2"></span> Descargar reporte en PDF</li>
                    <li><span className="inline-block w-3 h-3 bg-blue-600 rounded mr-2"></span> Intentar de nuevo el simulador</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Tips para Obtener el Mejor Resultado</h3>
              
              <div className="space-y-3">
                <div className="flex gap-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Lee cuidadosamente</h4>
                    <p className="text-sm text-gray-700">Comprende bien cada pregunta antes de responder. Muchos errores se deben a no leer completo.</p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-600">
                  <span className="text-2xl">⏰</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Gestiona el tiempo</h4>
                    <p className="text-sm text-gray-700">Son aproximadamente 1.3 minutos por pregunta. No gastes demasiado en una sola pregunta.</p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-600">
                  <span className="text-2xl">🔄</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Estrategia de omisión</h4>
                    <p className="text-sm text-gray-700">Si no sabes una pregunta, omítela y vuelve después. No dejes preguntas sin intentar si tienes tiempo.</p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-600">
                  <span className="text-2xl">📚</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Basado en GPC 2026</h4>
                    <p className="text-sm text-gray-700">Las preguntas se basan en las Guías de Práctica Clínica del DDIMBE. Estudia esos documentos.</p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-600">
                  <span className="text-2xl">❌</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Aprende de errores</h4>
                    <p className="text-sm text-gray-700">Revisa tus respuestas incorrectas. El simulador muestra la respuesta correcta y explicación.</p>
                  </div>
                </div>

                <div className="flex gap-3 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-600">
                  <span className="text-2xl">🔁</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">Practica múltiples veces</h4>
                    <p className="text-sm text-gray-700">Realiza varios simulacros. Tu desempeño mejorará con la práctica repetida.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-gray-900 mb-2">🏆 Objetivos de desempeño:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <strong>90%+</strong> - Excelente, completamente preparado</li>
                  <li>• <strong>70-89%</strong> - Muy bien, continúa repasando</li>
                  <li>• <strong>50-69%</strong> - Aceptable, necesita más estudio</li>
                  <li>• <strong>&lt;50%</strong> - Insuficiente, repasa los temas débiles</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
