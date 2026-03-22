import { useState, useEffect } from 'react';
import { Play, CheckCircle } from 'lucide-react';
import SimulatorHeader from './components/SimulatorHeader';
import SidePanel from './components/SidePanel';
import QuestionCard from './components/QuestionCard';
import Statistics from './components/Statistics';
import ResultsModal from './components/ResultsModal';

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

interface SimulatorState {
  currentQuestion: number;
  answers: Record<number, string>;
  timeLeft: number;
  isRunning: boolean;
  showResults: boolean;
  statistics: {
    correct: number;
    incorrect: number;
    skipped: number;
    answered: number;
  };
}

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [questionsCount, setQuestionsCount] = useState<number>(10);
  const [simulatorState, setSimulatorState] = useState<SimulatorState>({
    currentQuestion: 0,
    answers: {},
    timeLeft: 3600,
    isRunning: false,
    showResults: false,
    statistics: {
      correct: 0,
      incorrect: 0,
      skipped: 0,
      answered: 0,
    },
  });

  // Simulated questions data - Reemplaza esto con tu API/BD real
  const mockQuestions: Question[] = [
    {
      id: 1,
      pregunta: '¿Cuál es el fármaco de primera línea para la hipertensión arterial esencial?',
      opcionA: 'Hidralazina',
      opcionB: 'Bloqueador de canales de calcio',
      opcionC: 'Inhibidor de la ECA',
      opcionD: 'Diurético tiazídico',
      respuesta_correcta: 'C',
      especialidad: 'Cardiología',
      materia: 'Farmacología',
      explicacion: 'Los inhibidores de la ECA son considerados de primera línea en hipertensión esencial según GPC 2026.'
    },
    {
      id: 2,
      pregunta: '¿Cuál es el signo de Kernig en meningitis?',
      opcionA: 'Rigidez de nuca',
      opcionB: 'Imposibilidad de extender la pierna cuando se flexiona la cadera',
      opcionC: 'Reflejo de Babinski presente',
      opcionD: 'Ptosis palpebral',
      respuesta_correcta: 'B',
      especialidad: 'Neurología',
      materia: 'Semiología',
      explicacion: 'El signo de Kernig es patognomónico de irritación meníngea.'
    },
    {
      id: 3,
      pregunta: '¿Cuál es la causa más frecuente de insuficiencia renal aguda en México?',
      opcionA: 'Glomerulonefritis',
      opcionB: 'Hipovolemia/Hipotensión',
      opcionC: 'Obstrucción ureteral',
      opcionD: 'Nefrotoxicidad por medicamentos',
      respuesta_correcta: 'B',
      especialidad: 'Nefrología',
      materia: 'Patología',
      explicacion: 'La hipovolemia es la causa más común de IRA prerrenal en la práctica clínica mexicana.'
    },
    {
      id: 4,
      pregunta: '¿Cuál es la complicación más frecuente de la diabetes tipo 2?',
      opcionA: 'Cetoacidosis diabética',
      opcionB: 'Retinopatía diabética',
      opcionC: 'Neuropatía diabética',
      opcionD: 'Nefropatía diabética',
      respuesta_correcta: 'C',
      especialidad: 'Endocrinología',
      materia: 'Complicaciones',
      explicacion: 'La neuropatía diabética es la complicación más frecuente en pacientes con diabetes tipo 2.'
    },
    {
      id: 5,
      pregunta: '¿Cuál es el tratamiento inicial de la apendicitis aguda?',
      opcionA: 'Antibióticos y observación',
      opcionB: 'Apendicectomía de emergencia',
      opcionC: 'Drenaje percutáneo',
      opcionD: 'Enema evacuante',
      respuesta_correcta: 'B',
      especialidad: 'Cirugía',
      materia: 'Abdomen Agudo',
      explicacion: 'La apendicectomía es el tratamiento definitivo de la apendicitis aguda.'
    },
  ];

  // Cargar preguntas
  useEffect(() => {
    // TODO: Aquí conectarías tu API/BD real
    // const fetchQuestions = async () => {
    //   try {
    //     const response = await axios.get('/api/questions', {
    //       params: { especialidad: selectedSpecialty, limit: questionsCount }
    //     });
    //     setQuestions(response.data);
    //   } catch (error) {
    //     console.error('Error fetching questions:', error);
    //   }
    // };
    
    setQuestions(mockQuestions.slice(0, questionsCount));
  }, [questionsCount, selectedSpecialty]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (simulatorState.isRunning && simulatorState.timeLeft > 0) {
      interval = setInterval(() => {
        setSimulatorState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [simulatorState.isRunning, simulatorState.timeLeft]);

  const startSimulator = () => {
    setSimulatorState(prev => ({
      ...prev,
      isRunning: true,
      currentQuestion: 0,
      answers: {},
      statistics: { correct: 0, incorrect: 0, skipped: 0, answered: 0 },
    }));
  };

  const handleAnswerSelect = (option: string) => {
    setSimulatorState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [prev.currentQuestion]: option,
      },
      statistics: {
        ...prev.statistics,
        answered: Object.keys({ ...prev.answers, [prev.currentQuestion]: option }).length,
      },
    }));
  };

  const handleNextQuestion = () => {
    if (simulatorState.currentQuestion < questions.length - 1) {
      setSimulatorState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }));
    } else {
      calculateResults();
    }
  };

  const handlePreviousQuestion = () => {
    if (simulatorState.currentQuestion > 0) {
      setSimulatorState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1,
      }));
    }
  };

  const calculateResults = () => {
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    questions.forEach((q, index) => {
      const userAnswer = simulatorState.answers[index];
      if (!userAnswer) {
        skipped++;
      } else if (userAnswer === q.respuesta_correcta) {
        correct++;
      } else {
        incorrect++;
      }
    });

    setSimulatorState(prev => ({
      ...prev,
      isRunning: false,
      showResults: true,
      statistics: {
        correct,
        incorrect,
        skipped,
        answered: correct + incorrect,
      },
    }));
  };

  const percentage = questions.length > 0 ? Math.round((simulatorState.statistics.correct / questions.length) * 100) : 0;

  if (!simulatorState.isRunning) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <SimulatorHeader onShowHelp={() => {}} />
        
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Panel de configuración */}
            <div className="lg:col-span-1">
              <SidePanel
                selectedSpecialty={selectedSpecialty}
                questionsCount={questionsCount}
                onSpecialtyChange={setSelectedSpecialty}
                onQuestionsCountChange={setQuestionsCount}
              />
            </div>

            {/* Panel principal - Inicio */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-white">
                  <h1 className="text-4xl font-bold mb-2">Dominio ENARM</h1>
                  <p className="text-blue-100 text-lg">Simulador Inteligente basado en GPC 2026</p>
                </div>

                <div className="p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Bienvenido al Simulador</h2>
                    <p className="text-gray-600 mb-4">
                      Prepárate para el ENARM con nuestro simulador inteligente. Responde preguntas basadas en las Guías de Práctica Clínica 2026 y obtén análisis detallado de tu desempeño.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-blue-600">{questionsCount}</div>
                      <div className="text-sm text-gray-600">Preguntas</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-green-600">6h</div>
                      <div className="text-sm text-gray-600">Tiempo</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-purple-600">GPC</div>
                      <div className="text-sm text-gray-600">2026</div>
                    </div>
                  </div>

                  <button
                    onClick={startSimulator}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
                  >
                    <Play size={24} />
                    Iniciar Simulador
                  </button>

                  <div className="mt-8 bg-gray-50 rounded-lg p-6">
                    <h3 className="font-bold text-gray-900 mb-3">Características:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-green-600" />
                        280 preguntas basadas en GPC DDIMBE 2026
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-green-600" />
                        5 tipos de simuladores diferentes
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-green-600" />
                        IA inteligente para análisis de errores
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-green-600" />
                        Dashboard de analytics completo
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={18} className="text-green-600" />
                        Basado en IMSS, ISSSTE y especialidades mexicanas
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (simulatorState.showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <SimulatorHeader onShowHelp={() => {}} />
        <ResultsModal
          statistics={simulatorState.statistics}
          percentage={percentage}
          questions={questions}
          answers={simulatorState.answers}
          onRestart={() => setSimulatorState(prev => ({
            ...prev,
            showResults: false,
            isRunning: false,
          }))}
        />
      </div>
    );
  }

  const currentQuestion = questions[simulatorState.currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <SimulatorHeader onShowHelp={() => {}} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panel lateral */}
          <div className="lg:col-span-1">
            <Statistics
              statistics={simulatorState.statistics}
              totalQuestions={questions.length}
              currentQuestion={simulatorState.currentQuestion}
              timeLeft={simulatorState.timeLeft}
              percentage={percentage}
            />

            {/* Navegación de preguntas */}
            <div className="bg-white rounded-xl shadow-lg p-4 mt-6">
              <h3 className="font-bold text-gray-900 mb-3">Preguntas</h3>
              <div className="grid grid-cols-5 gap-2 max-h-80 overflow-y-auto">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSimulatorState(prev => ({
                      ...prev,
                      currentQuestion: index,
                    }))}
                    className={`p-2 rounded-lg font-semibold transition-all ${
                      simulatorState.currentQuestion === index
                        ? 'bg-blue-600 text-white'
                        : simulatorState.answers[index]
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pregunta actual */}
          <div className="lg:col-span-3">
            {currentQuestion && (
              <>
                <QuestionCard
                  question={currentQuestion}
                  questionNumber={simulatorState.currentQuestion + 1}
                  totalQuestions={questions.length}
                  selectedAnswer={simulatorState.answers[simulatorState.currentQuestion]}
                  onAnswerSelect={handleAnswerSelect}
                />

                {/* Botones de navegación */}
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={simulatorState.currentQuestion === 0}
                    className="flex-1 bg-gray-700 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-all"
                  >
                    ← Anterior
                  </button>
                  
                  {simulatorState.currentQuestion < questions.length - 1 ? (
                    <button
                      onClick={handleNextQuestion}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
                    >
                      Siguiente →
                    </button>
                  ) : (
                    <button
                      onClick={calculateResults}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
                    >
                      Finalizar Examen
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
