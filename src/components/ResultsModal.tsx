import { Trophy, CheckCircle, XCircle, AlertCircle, BarChart3, Download, RotateCcw } from 'lucide-react';

interface Question {
  id: number;
  pregunta: string;
  opcionA: string;
  opcionB: string;
  opcionC: string;
  opcionD: string;
  respuesta_correcta: string;
  especialidad: string;
  materia: string;
  explicacion?: string;
}

interface ResultsModalProps {
  statistics: {
    correct: number;
    incorrect: number;
    skipped: number;
    answered: number;
  };
  percentage: number;
  questions: Question[];
  answers: Record<number, string>;
  onRestart: () => void;
}

export default function ResultsModal({
  statistics,
  percentage,
  questions,
  answers,
  onRestart,
}: ResultsModalProps) {
  const getPerformanceMessage = () => {
    if (percentage >= 90) return { title: '¡EXCELENTE!', color: 'from-green-500 to-green-600', message: 'Estás completamente preparado para el ENARM' };
    if (percentage >= 70) return { title: 'MUY BIEN', color: 'from-blue-500 to-blue-600', message: 'Continúa repasando los temas débiles' };
    if (percentage >= 50) return { title: 'ACEPTABLE', color: 'from-yellow-500 to-yellow-600', message: 'Necesitas más práctica' };
    return { title: 'INSUFICIENTE', color: 'from-red-500 to-red-600', message: 'Estudia más y vuelve a intentar' };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Banner de resultados */}
      <div className={`bg-gradient-to-r ${performance.color} rounded-2xl shadow-2xl p-12 text-white mb-8 text-center`}>
        <Trophy size={64} className="mx-auto mb-4 opacity-90" />
        <h1 className="text-5xl font-bold mb-2">{performance.title}</h1>
        <div className="text-6xl font-bold mb-4">{percentage}%</div>
        <p className="text-xl opacity-90">{performance.message}</p>
      </div>

      {/* Grid de resultados */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <CheckCircle size={32} className="mx-auto mb-2 text-green-600" />
          <p className="text-gray-600 text-sm mb-1">CORRECTAS</p>
          <p className="text-4xl font-bold text-green-600">{statistics.correct}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <XCircle size={32} className="mx-auto mb-2 text-red-600" />
          <p className="text-gray-600 text-sm mb-1">INCORRECTAS</p>
          <p className="text-4xl font-bold text-red-600">{statistics.incorrect}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <AlertCircle size={32} className="mx-auto mb-2 text-yellow-600" />
          <p className="text-gray-600 text-sm mb-1">OMITIDAS</p>
          <p className="text-4xl font-bold text-yellow-600">{statistics.skipped}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <BarChart3 size={32} className="mx-auto mb-2 text-blue-600" />
          <p className="text-gray-600 text-sm mb-1">TOTAL</p>
          <p className="text-4xl font-bold text-blue-600">{questions.length}</p>
        </div>
      </div>

      {/* Gráfico de desempeño */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Análisis Detallado</h2>
        
        <div className="space-y-4">
          {/* Correctas */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">Respuestas Correctas</span>
              <span className="text-green-600 font-bold">{statistics.correct}/{questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-green-500 h-full transition-all"
                style={{ width: `${(statistics.correct / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Incorrectas */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">Respuestas Incorrectas</span>
              <span className="text-red-600 font-bold">{statistics.incorrect}/{questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-red-500 h-full transition-all"
                style={{ width: `${(statistics.incorrect / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Omitidas */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">Respuestas Omitidas</span>
              <span className="text-yellow-600 font-bold">{statistics.skipped}/{questions.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-yellow-500 h-full transition-all"
                style={{ width: `${(statistics.skipped / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de preguntas */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Revisión de Respuestas</h2>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {questions.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.respuesta_correcta;
            const wasSkipped = !userAnswer;

            return (
              <div
                key={question.id}
                className={`p-4 rounded-lg border-l-4 ${
                  wasSkipped
                    ? 'bg-gray-50 border-yellow-500'
                    : isCorrect
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-semibold text-gray-900">
                    Pregunta {index + 1}: {question.especialidad}
                  </span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full">
                    {wasSkipped ? (
                      <span className="bg-yellow-200 text-yellow-800">Omitida</span>
                    ) : isCorrect ? (
                      <span className="bg-green-200 text-green-800">✓ Correcta</span>
                    ) : (
                      <span className="bg-red-200 text-red-800">✗ Incorrecta</span>
                    )}
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-2">{question.pregunta}</p>
                
                {!wasSkipped && (
                  <div className="text-xs space-y-1 bg-white bg-opacity-50 p-2 rounded">
                    <p>
                      <span className="font-semibold">Tu respuesta:</span> Opción{' '}
                      <span className={isCorrect ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                        {userAnswer}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p>
                        <span className="font-semibold">Respuesta correcta:</span> Opción{' '}
                        <span className="text-green-600 font-bold">{question.respuesta_correcta}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105"
        >
          <RotateCcw size={20} />
          Intentar de Nuevo
        </button>
        <button
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105"
        >
          <Download size={20} />
          Descargar Reporte
        </button>
      </div>

      {/* Footer con recomendaciones */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h3 className="font-bold text-gray-900 mb-3">📋 Recomendaciones</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>✓ Revisa los temas donde obtuviste respuestas incorrectas</li>
          <li>✓ Consulta las Guías de Práctica Clínica 2026 para profundizar</li>
          <li>✓ Practica con simulacros completos de 280 preguntas</li>
          <li>✓ Mantén un registro de tus mejoras en cada simulación</li>
        </ul>
      </div>
    </div>
  );
}
