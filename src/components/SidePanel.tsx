import { Settings, Filter } from 'lucide-react';

interface SidePanelProps {
  selectedSpecialty: string;
  questionsCount: number;
  onSpecialtyChange: (specialty: string) => void;
  onQuestionsCountChange: (count: number) => void;
}

export default function SidePanel({
  selectedSpecialty,
  questionsCount,
  onSpecialtyChange,
  onQuestionsCountChange,
}: SidePanelProps) {
  const specialties = [
    { value: 'all', label: 'Todas las especialidades' },
    { value: 'cardiologia', label: 'Cardiología' },
    { value: 'neurologia', label: 'Neurología' },
    { value: 'neumologia', label: 'Neumología' },
    { value: 'gastroenterologia', label: 'Gastroenterología' },
    { value: 'nefrologia', label: 'Nefrología' },
    { value: 'endocrinologia', label: 'Endocrinología' },
    { value: 'cirugia', label: 'Cirugía' },
    { value: 'pediatria', label: 'Pediatría' },
    { value: 'obstetrica', label: 'Obstetricia' },
  ];

  const questionCounts = [10, 20, 50, 100, 280];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Filtros</h2>
        </div>

        <div className="space-y-4">
          {/* Especialidades */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Especialidad
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => onSpecialtyChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              {specialties.map((spec) => (
                <option key={spec.value} value={spec.value}>
                  {spec.label}
                </option>
              ))}
            </select>
          </div>

          {/* Cantidad de preguntas */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Número de preguntas: {questionsCount}
            </label>
            <div className="space-y-2">
              {questionCounts.map((count) => (
                <button
                  key={count}
                  onClick={() => onQuestionsCountChange(count)}
                  className={`w-full px-3 py-2 rounded-lg font-medium transition-all ${
                    questionsCount === count
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {count} preguntas {count === 280 ? '(Simulacro)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 rounded-lg p-4 mt-6">
            <div className="flex items-start gap-2">
              <Settings size={16} className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  Configuración activa
                </h3>
                <p className="text-xs text-gray-600">
                  Ajusta los filtros y haz clic en "Iniciar Simulador" para comenzar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="border-t pt-6">
        <h3 className="font-bold text-gray-900 mb-4">Estadísticas Generales</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Preguntas disponibles</span>
            <span className="font-bold text-gray-900">280</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Basado en</span>
            <span className="font-bold text-gray-900">GPC 2026</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Tiempo estimado</span>
            <span className="font-bold text-gray-900">6 horas</span>
          </div>
        </div>
      </div>
    </div>
  );
}
