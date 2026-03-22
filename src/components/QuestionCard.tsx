import { BookOpen } from 'lucide-react';

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

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | undefined;
  onAnswerSelect: (option: string) => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
}: QuestionCardProps) {
  const options = [
    { key: 'A', text: question.opcionA },
    { key: 'B', text: question.opcionB },
    { key: 'C', text: question.opcionC },
    { key: 'D', text: question.opcionD },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-blue-100 text-sm">Pregunta {questionNumber} de {totalQuestions}</p>
            <h2 className="text-white font-bold text-lg mt-1">Progreso: {((questionNumber / totalQuestions) * 100).toFixed(0)}%</h2>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">{question.especialidad}</p>
            <p className="text-white font-semibold">{question.materia}</p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-8">
        {/* Pregunta */}
        <div className="mb-8">
          <div className="flex gap-3 items-start">
            <BookOpen className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="text-lg font-semibold text-gray-900 leading-relaxed">
                {question.pregunta}
              </p>
            </div>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mb-8 bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>

        {/* Opciones */}
        <div className="space-y-3">
          {options.map((option) => (
            <button
              key={option.key}
              onClick={() => onAnswerSelect(option.key)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all transform hover:scale-102 ${
                selectedAnswer === option.key
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    selectedAnswer === option.key
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 text-gray-600'
                  }`}
                >
                  {option.key}
                </div>
                <span className="text-gray-900 font-medium">{option.text}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Indicador de respuesta */}
        {selectedAnswer && (
          <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <p className="text-sm text-green-800">
              <span className="font-semibold">Respuesta seleccionada:</span> Opción {selectedAnswer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
