import { Clock, CheckCircle, XCircle, AlertCircle, Zap } from 'lucide-react';

interface StatisticsProps {
  statistics: {
    correct: number;
    incorrect: number;
    skipped: number;
    answered: number;
  };
  totalQuestions: number;
  currentQuestion: number;
  timeLeft: number;
  percentage: number;
}

export default function Statistics({
  statistics,
  totalQuestions,
  currentQuestion,
  timeLeft,
  percentage,
}: StatisticsProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimeRunningOut = timeLeft < 600; // Menos de 10 minutos

  return (
    <div className="space-y-4">
      {/* Timer */}
      <div className={`rounded-xl shadow-lg p-6 ${isTimeRunningOut ? 'bg-red-50' : 'bg-white'}`}>
        <div className="flex items-center gap-3 mb-3">
          <Clock size={24} className={isTimeRunningOut ? 'text-red-600' : 'text-blue-600'} />
          <h3 className={`text-lg font-bold ${isTimeRunningOut ? 'text-red-900' : 'text-gray-900'}`}>
            Tiempo
          </h3>
        </div>
        <div className={`text-4xl font-bold font-mono ${isTimeRunningOut ? 'text-red-600' : 'text-blue-600'}`}>
          {formatTime(timeLeft)}
        </div>
        <p className={`text-xs mt-2 ${isTimeRunningOut ? 'text-red-700' : 'text-gray-600'}`}>
          {isTimeRunningOut && '⚠️ '}Tiempo restante
        </p>
      </div>

      {/* Progreso general */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Progreso</h3>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Pregunta {currentQuestion + 1} de {totalQuestions}</span>
            <span className="text-sm font-bold text-blue-600">{Math.round((currentQuestion / totalQuestions) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Estadísticas</h3>
        
        <div className="space-y-3">
          {/* Respondidas */}
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-green-700 font-semibold">CORRECTAS</p>
              <p className="text-2xl font-bold text-green-600">{statistics.correct}</p>
            </div>
          </div>

          {/* Incorrectas */}
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <XCircle size={24} className="text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-red-700 font-semibold">INCORRECTAS</p>
              <p className="text-2xl font-bold text-red-600">{statistics.incorrect}</p>
            </div>
          </div>

          {/* Omitidas */}
          <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
            <AlertCircle size={24} className="text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-yellow-700 font-semibold">OMITIDAS</p>
              <p className="text-2xl font-bold text-yellow-600">{statistics.skipped}</p>
            </div>
          </div>
        </div>

        {/* Desempeño */}
        {statistics.answered > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={18} className="text-blue-600" />
              <span className="text-sm font-bold text-blue-900">Desempeño Actual</span>
            </div>
            <div className="text-3xl font-bold text-blue-600">{percentage}%</div>
            <p className="text-xs text-blue-700 mt-1">
              {percentage >= 70 ? '¡Excelente desempeño!' : percentage >= 50 ? 'Buen desempeño' : 'Continúa estudiando'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
