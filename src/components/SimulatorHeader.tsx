import { Brain, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import HelpModal from './HelpModal';

interface SimulatorHeaderProps {
  onShowHelp?: () => void;
}

export default function SimulatorHeader({ onShowHelp }: SimulatorHeaderProps) {
  const [showHelp, setShowHelp] = useState(false);

  const handleHelpClick = () => {
    setShowHelp(true);
    onShowHelp?.();
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain size={32} className="text-blue-200" />
            <div>
              <h1 className="text-2xl font-bold">Dominio ENARM</h1>
              <p className="text-blue-100 text-sm">Simulador Inteligente GPC 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleHelpClick}
              className="hover:bg-blue-700 p-2 rounded-lg transition-all"
              title="Ayuda"
            >
              <HelpCircle size={24} />
            </button>
            <div className="text-right">
              <div className="text-sm text-blue-100">Sistema CIFRHS</div>
              <div className="font-semibold">Integrado</div>
            </div>
          </div>
        </div>
      </header>
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
  );
}
