// #region -- Bibliotecas Importadas ---
import React, { useState, useEffect } from 'react';
import { 
  Menu, Moon, Sun, User, Activity, 
  BarChart2, Zap, Settings, Database, 
  ArrowLeft, LogOut, Unlock, Trash2, Plus,
  Info, Shield, AlertTriangle, ChevronDown,
  Map, MapPin, Clock, Battery, BatteryCharging,
  Thermometer
} from 'lucide-react';
// #endregion

// #region --- Mock Data Inicial ---
const initialMainData = Array.from({ length: 40 }, () => Math.floor(Math.random() * 50) + 20);
const initialMultiData = {
  series1: Array.from({ length: 20 }, () => Math.floor(Math.random() * 30) + 60),
  series2: Array.from({ length: 20 }, () => Math.floor(Math.random() * 40) + 20),
  series3: Array.from({ length: 20 }, () => Math.floor(Math.random() * 20) + 5),
};
// #endregion

// #region --- Gerador de Células Iniciais para o BMS ---
const generateInitialCells = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    voltage: 3.7 + (Math.random() * 0.1 - 0.05),
    temperature: 35 + (Math.random() * 5 - 2.5),
  }));
};
// #endregion

// #region --- Criando Modelo de Usuário ---
interface Member {
  id: number;
  email: string;
  name: string;
  mainRole: string;
  isModerador: boolean;
  photo: string;
  isOnline?: boolean;
  lastSeen?: string;
}
// #endregion

// #region --- Mock da Equipe ---
const initialMembers = [
  { 
    id: 1, 
    email: "rafael.martins@solares.com", 
    name: "Rafael Martins", 
    mainRole: "Engenheiro de Prova", 
    isModerador: true, 
    photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    isOnline: true,
    lastSeen: "agora"
  },
  { 
    id: 2, 
    email: "ana.clara@solares.com", 
    name: "Ana Clara", 
    mainRole: "Piloto", 
    isModerador: false, 
    photo: "https://ui-avatars.com/api/?name=Ana+Clara&background=random&color=fff",
    isOnline: true,
    lastSeen: "agora"
  },
  { 
    id: 3, 
    email: "lucas.silva@solares.com", 
    name: "Lucas Silva", 
    mainRole: "", 
    isModerador: true, 
    photo: "https://ui-avatars.com/api/?name=Lucas+Silva&background=random&color=fff",
    isOnline: false,
    lastSeen: "há 2 horas"
  }
];
// #endregion

// #region --- Funções Auxiliares ---
const generatePolyline = (data: number[], width: number, height: number, maxVal: number) => {
  const stepX = width / (data.length - 1);
  return data.map((val: number, index: number) => {
    const x = index * stepX;
    const y = height - (val / maxVal) * height;
    return `${x},${y}`;
  }).join(' ');
};

const generateNameFromEmail = (email: string) => {
  const prefix = email.split('@')[0];
  return prefix.split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
};
// #endregion

// #region --- Ícones Customizados ---
const SteeringWheelIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="2" />
    <path d="M12 14v7" />
    <path d="m10 11.5-6.5-2" />
    <path d="m14 11.5 6.5-2" />
  </svg>
);

const GoogleIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
// #endregion

export default function App() {
  // #region Estados - Controle de Usuário e Login
  const [members, setMembers] = useState(initialMembers);
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberIsMod, setNewMemberIsMod] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showUnlockAnim, setShowUnlockAnim] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showModInfo, setShowModInfo] = useState(false);
  // #endregion

  // #region Estados - Interface e Navegação
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pilotMode, setPilotMode] = useState(false);
  const [showPilotMap, setShowPilotMap] = useState(false); 
  const [activeTab, setActiveTab] = useState('Resumo');
  // #endregion

  // #region Estados - Dados de Telemetria
  const [mainData, setMainData] = useState(initialMainData);
  const [multiData, setMultiData] = useState(initialMultiData);
  const [rpm, setRpm] = useState(1450);
  const [cells, setCells] = useState(generateInitialCells(24));
  const [speed, setSpeed] = useState(5); 
  const [battery, setBattery] = useState(100);
  const [currentTime, setCurrentTime] = useState(new Date());
  // #endregion

  // #region Efeitos
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!currentUser) return; 

    const interval = setInterval(() => {
      setMainData(prev => {
        const newData = [...prev.slice(1)];
        const lastVal = prev[prev.length - 1];
        newData.push(Math.max(10, Math.min(90, lastVal + (Math.random() * 10 - 5))));
        return newData;
      });

      setMultiData(prev => ({
        series1: [...prev.series1.slice(1), Math.max(50, Math.min(100, prev.series1[prev.series1.length - 1] + (Math.random() * 10 - 5)))],
        series2: [...prev.series2.slice(1), Math.max(20, Math.min(70, prev.series2[prev.series2.length - 1] + (Math.random() * 10 - 5)))],
        series3: [...prev.series3.slice(1), Math.max(0, Math.min(30, prev.series3[prev.series3.length - 1] + (Math.random() * 6 - 3)))]
      }));

      setRpm(prev => Math.floor(prev + (Math.random() * 50 - 25)));
      
      setSpeed(prev => {
        let variation = prev + (Math.random() * 2 - 1);
        let nextSpeed = Math.round(variation);
        if (nextSpeed > 10) return 9; 
        if (nextSpeed < 0) return 1; 
        return nextSpeed;
      });
      
      setBattery(prev => {
        if (prev <= 0) return 100;
        return prev - 1;
      });

      setCells(prev => prev.map(cell => ({
        ...cell,
        voltage: Math.max(3.0, Math.min(4.2, cell.voltage + (Math.random() * 0.04 - 0.02))),
        temperature: Math.max(20, Math.min(60, cell.temperature + (Math.random() * 0.6 - 0.3)))
      })));

    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser]);
  // #endregion

  // #region Funções de Usuário
  const handleGoogleLogin = (simulateError = false) => {
    setIsLoggingIn(true);
    setLoginError("");
    setShowModInfo(false);
    
    setTimeout(() => {
      setIsLoggingIn(false);
      if (simulateError) {
        setLoginError("Erro ao efetuar o login. Se você já estiver cadastrado, contate um moderador.");
      } else {
        setShowUnlockAnim(true);
        setTimeout(() => {
          const loggedUser = members.find(m => m.id === 1);
          if (loggedUser) {
            setCurrentUser(loggedUser);
          }
          setShowUnlockAnim(false);
        }, 1200);
      }
    }, 1500);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newMemberEmail) return;
    
    const generatedName = generateNameFromEmail(newMemberEmail);
    
    setMembers([...members, {
      id: Date.now(),
      email: newMemberEmail,
      name: generatedName,
      mainRole: newMemberRole,
      isModerador: newMemberIsMod,
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(generatedName)}&background=random&color=fff`,
      isOnline: false,
      lastSeen: "nunca"
    }]);
    
    setNewMemberEmail('');
    setNewMemberRole('');
    setNewMemberIsMod(false);
  };

  const handleRemoveMember = (id: number) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const handleUpdateMemberRole = (id: number, field: keyof Member, value: string | boolean) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };
  // #endregion

  // #region Cálculos Derivados
  const totalBmsVoltage = cells.reduce((acc, cell) => acc + cell.voltage, 0);
  const avgBmsTemp = cells.reduce((acc, cell) => acc + cell.temperature, 0) / cells.length;
  const maxVoltageCell = [...cells].sort((a, b) => b.voltage - a.voltage)[0];
  const minVoltageCell = [...cells].sort((a, b) => a.voltage - b.voltage)[0];
  const voltageImbalance = maxVoltageCell.voltage - minVoltageCell.voltage;

  const onlineCount = members.filter(m => m.isOnline).length;
  const brasiliaTime = currentTime.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  const currentPower = mainData[mainData.length - 1] || 1;
  const estimatedTimeRaw = (battery / Math.max(10, currentPower)) * 2.5;
  const estHours = Math.floor(estimatedTimeRaw);
  const estMinutes = Math.floor((estimatedTimeRaw - estHours) * 60);

  const userProfileSubtitle = currentUser?.isModerador 
    ? (currentUser.mainRole ? `${currentUser.mainRole} | Mod` : 'Moderador') 
    : (currentUser?.mainRole || 'Membro');
  // #endregion

  // #region Renderização: Tela de Login
  if (!currentUser) {
    const moderatorsList = members.filter(m => m.isModerador);
  
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black text-white font-sans p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 blur-[100px] rounded-full"></div>

        <div className="max-w-md w-full bg-gray-800/40 backdrop-blur-2xl border border-gray-700 rounded-3xl p-8 shadow-2xl flex flex-col items-center relative z-10 transition-all duration-500">
          
          <div className="w-20 h-20 bg-gradient-to-tr from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/40">
            <Activity size={40} className="text-white" />
          </div>
          
          <h2 className="text-3xl font-black mb-2 text-center tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
            Telemetria do Solares
          </h2>
          <p className="text-gray-400 text-center mb-8 text-sm font-medium">
            Acesso restrito para a melhor área do solares.
          </p>
          
          {loginError && (
            <div className="w-full bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center animate-pulse">
              {loginError}
            </div>
          )}

          {showUnlockAnim ? (
            <div className="flex flex-col items-center justify-center py-4 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(34,197,94,0.4)] relative">
                <div className="absolute inset-0 border-4 border-green-500 rounded-full animate-ping opacity-20"></div>
                <Unlock size={32} className="text-green-500" />
              </div>
              <span className="text-green-400 font-bold tracking-widest text-sm uppercase">Acesso Liberado</span>
              <span className="text-gray-300 mt-2 text-sm font-medium animate-pulse">Seja bem-vindo, {members.find(m => m.id === 1)?.name.split(' ')[0]}!</span>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <button 
                onClick={() => handleGoogleLogin(false)}
                disabled={isLoggingIn}
                className="w-full bg-white text-gray-800 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center space-x-3 hover:bg-gray-100 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed shadow-xl shadow-white/5"
              >
                {isLoggingIn ? (
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                ) : (
                  <GoogleIcon size={24} />
                )}
                <span className="text-[15px]">{isLoggingIn ? 'Verificando credenciais...' : 'Entrar com o Google'}</span>
              </button>

              <button 
                onClick={() => handleGoogleLogin(true)}
                disabled={isLoggingIn}
                className="mt-4 text-xs text-gray-500 hover:text-gray-300 transition-colors underline decoration-gray-600 underline-offset-4 disabled:opacity-50"
              >
                Simular login com erro
              </button>
            </div>
          )}
          
          {!showUnlockAnim && (
            <div className="mt-8 w-full border-t border-gray-700/50 pt-4 flex flex-col items-center">
              <button 
                onClick={() => setShowModInfo(!showModInfo)}
                className="flex items-center space-x-2 text-xs text-gray-400 hover:text-orange-400 transition-colors"
              >
                <Info size={16} />
                <span>Problemas com acesso?</span>
              </button>
              
              {showModInfo && (
                <div className="mt-4 w-full bg-gray-900/80 border border-gray-700 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                  <p className="text-xs text-gray-400 mb-3 text-center">Contate um de nossos moderadores:</p>
                  <ul className="space-y-3">
                    {moderatorsList.map(mod => (
                      <li key={mod.id} className="flex items-center space-x-3">
                        <img src={mod.photo} alt={mod.name} className="w-8 h-8 rounded-full border border-gray-600" />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-200">{mod.name}</span>
                          <a href={`mailto:${mod.email}`} className="text-[11px] text-blue-400 hover:underline">{mod.email}</a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
  // #endregion
  
  let batteryFill = 'bg-emerald-500';
  let batteryBorder = 'border-emerald-600';
  let batteryNub = 'bg-emerald-700';

  if (battery <= 50 && battery >= 20) {
    batteryFill = 'bg-yellow-500';
    batteryBorder = 'border-yellow-600';
    batteryNub = 'bg-yellow-700';
  } else if (battery < 20) {
    batteryFill = 'bg-red-600';
    batteryBorder = 'border-red-700';
    batteryNub = 'bg-red-800';
  }

  // #region Renderização: Modo Piloto
  if (pilotMode) {
    return (
      <div className={`h-[100dvh] w-full flex flex-col p-4 md:p-6 font-sans select-none overflow-hidden relative transition-colors duration-300 ${darkMode ? 'bg-black text-white' : 'bg-gray-100 text-gray-900'}`}>
        <div className="flex justify-between items-center mb-4 md:mb-6 shrink-0">
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <button 
              onClick={() => { setPilotMode(false); setShowPilotMap(false); }} 
              className={`flex items-center space-x-2 transition-colors p-2 rounded-lg ${darkMode ? 'text-gray-500 hover:text-white hover:bg-gray-900' : 'text-gray-600 hover:text-black hover:bg-gray-200'}`}
            >
              <ArrowLeft size={32} />
              <span className="text-xl font-bold uppercase tracking-widest hidden sm:block">Voltar</span>
            </button>

            <button
              onClick={() => setShowPilotMap(!showPilotMap)}
              className={`flex items-center space-x-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold transition-all shadow-md border ${
                showPilotMap 
                  ? (darkMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-emerald-500/20' : 'bg-emerald-100 text-emerald-600 border-emerald-500')
                  : (darkMode ? 'bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-800 hover:text-white' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50 hover:text-gray-900')
              }`}
            >
              {showPilotMap ? <Activity size={20} /> : <Map size={20} />}
              <span className="hidden sm:block text-sm uppercase tracking-wider">{showPilotMap ? 'Instrumentos' : 'Navegação'}</span>
            </button>

            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className={`p-2 flex-shrink-0 rounded-full transition-all shadow-md border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white' 
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
              title="Alternar Modo de Visualização"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          
          <div className={`flex items-center space-x-3 px-4 py-2 rounded-full border ${darkMode ? 'bg-red-950/50 border-red-900' : 'bg-red-100 border-red-300'}`}>
            <div className={`w-3 h-3 bg-red-500 rounded-full animate-pulse ${darkMode ? 'shadow-[0_0_10px_rgba(239,68,68,0.8)]' : ''}`}></div>
            <span className="text-red-500 font-bold tracking-widest text-sm">TELEMETRIA ATIVA</span>
          </div>
        </div>

        {showPilotMap ? (
          <div className="flex-1 w-full max-w-5xl mx-auto pb-4 md:pb-8 min-h-0 flex flex-col animate-in fade-in duration-300">
             <div className={`flex-1 rounded-3xl overflow-hidden border-2 shadow-2xl relative flex items-center justify-center transition-colors ${darkMode ? 'bg-[#0a0a0a] border-gray-800' : 'bg-white border-gray-300'}`}>
                
                <div className={`absolute inset-0 ${darkMode ? 'opacity-10' : 'opacity-[0.03]'} bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]`}></div>
                
                <div className="relative z-10 flex flex-col items-center animate-bounce">
                  <MapPin size={64} className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                  <span className={`mt-4 px-6 py-2 rounded-full text-lg font-bold shadow-lg border uppercase tracking-widest ${darkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-300'}`}>
                    Posição Atual
                  </span>
                </div>

                <div className={`absolute bottom-6 left-6 md:bottom-8 md:left-8 p-4 md:p-6 rounded-2xl border-2 shadow-2xl backdrop-blur-md transition-colors ${darkMode ? 'bg-gray-900/90 border-gray-700 text-white' : 'bg-white/90 border-gray-300 text-gray-900'}`}>
                  <p className={`text-xs md:text-sm uppercase font-bold mb-2 md:mb-3 tracking-widest ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Coordenadas</p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 font-mono text-lg md:text-2xl font-bold">
                    <div>
                      <span className="text-orange-500 mr-2">LAT</span> -20.2976
                    </div>
                    <div>
                      <span className="text-blue-500 mr-2">LON</span> -40.2958
                    </div>
                  </div>
                </div>

             </div>
          </div>
        ) : (
          <div className="flex-1 grid grid-rows-3 gap-4 md:gap-6 w-full max-w-4xl mx-auto pb-4 md:pb-8 min-h-0 animate-in fade-in duration-300">
            
            <div className={`flex items-center justify-between w-full border-2 rounded-3xl p-4 md:p-8 shadow-2xl relative h-full min-h-0 transition-colors ${darkMode ? 'bg-[#0a0a0a] border-gray-800' : 'bg-white border-gray-300'}`}>
              <div className="flex items-center w-full max-w-[70%]">
                <div className={`relative w-full h-16 md:h-24 border-4 md:border-8 ${batteryBorder} rounded-2xl md:rounded-3xl p-1 md:p-1.5 flex transition-colors duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-full ${batteryFill} rounded-md md:rounded-xl transition-all duration-1000 ease-out`}
                    style={{ width: `${battery}%` }}
                  ></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-baseline -translate-y-[2px] md:-translate-y-[4px]">
                       <span className="text-5xl md:text-7xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,1)] tracking-tighter leading-none">
                          {battery}
                       </span>
                       <span className="text-2xl md:text-4xl font-bold text-gray-200 drop-shadow-[0_4px_4px_rgba(0,0,0,1)] ml-1 leading-none">
                          %
                       </span>
                    </div>
                  </div>
                </div>
                <div className={`w-3 h-8 md:w-4 md:h-10 ${batteryNub} rounded-r-lg -ml-1 transition-colors duration-500`}></div>
              </div>

              <div className={`text-5xl md:text-7xl font-black ml-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}>B</div>

              {battery < 15 && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-3/4 bg-red-600 text-white font-black text-lg md:text-2xl text-center py-2 md:py-3 rounded-full animate-pulse shadow-[0_0_30px_rgba(220,38,38,1)] border-2 border-red-400 tracking-widest uppercase flex items-center justify-center space-x-3 z-10">
                  <AlertTriangle size={24} className="md:w-7 md:h-7" />
                  <span>Bateria Muito Baixa</span>
                </div>
              )}
            </div>

            <div className={`flex items-center justify-between w-full border-2 rounded-3xl p-4 md:p-8 shadow-2xl relative h-full min-h-0 transition-colors ${darkMode ? 'bg-[#0a0a0a] border-gray-800' : 'bg-white border-gray-300'}`}>
              <div className="flex items-baseline px-4 w-2/3">
                <span className="text-6xl md:text-8xl font-black text-blue-400 tracking-tighter w-full">{speed}</span>
              </div>
              <div className={`text-5xl md:text-7xl font-black ml-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}>V</div>
            </div>

            <div className={`flex items-center justify-between w-full border-2 rounded-3xl p-4 md:p-8 shadow-2xl relative h-full min-h-0 transition-colors ${darkMode ? 'bg-[#0a0a0a] border-gray-800' : 'bg-white border-gray-300'}`}>
              <div className="flex items-baseline px-4">
                <span className="text-5xl md:text-7xl font-black text-orange-400 tracking-tighter">{brasiliaTime}</span>
              </div>
              <div className={`ml-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}>
                <Clock className="w-12 h-12 md:w-16 md:h-16" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  // #endregion

  // #region Renderização: Dashboard Engenharia
  return (
    <div className={`flex h-[100dvh] w-full transition-colors duration-300 font-sans overflow-hidden ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* #region Menu Lateral (Sidebar) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} 
        md:relative md:translate-x-0 ${sidebarOpen ? 'md:w-64' : 'md:w-20'}
        flex flex-col border-r shadow-2xl md:shadow-none
        ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      `}>
        <div className={`h-16 flex items-center border-b border-inherit shrink-0 ${sidebarOpen ? 'justify-between px-4' : 'justify-between px-4 md:justify-center md:px-0'}`}>
          <span className={`font-bold text-xl tracking-wider text-orange-500 ${!sidebarOpen ? 'md:hidden' : ''}`}>
            TELEMETRIA
          </span>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shrink-0"
          >
            <Menu size={24} className="hidden md:block" />
            <ArrowLeft size={24} className="md:hidden" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {[
              { icon: Activity, label: 'Resumo' },
              { icon: Battery, label: 'Baterias' },
              { icon: Map, label: 'Mapa' },
              { icon: BarChart2, label: 'Análise' },
              { icon: Zap, label: 'Potência' },
              { icon: Database, label: 'Logs de Dados' },
              { icon: Settings, label: 'Configurações' },
            ].map((item, idx) => (
              <li key={idx}>
                <button 
                  onClick={() => {
                    setActiveTab(item.label);
                    if (window.innerWidth < 768) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center py-3 rounded-xl transition-all ${
                    sidebarOpen ? 'px-4 justify-start' : 'px-4 md:px-0 md:justify-center'
                  } ${
                    activeTab === item.label 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <item.icon size={20} className={sidebarOpen ? 'mr-4 shrink-0' : 'mr-4 md:mr-0 shrink-0'} />
                  <span className={`font-medium whitespace-nowrap ${!sidebarOpen ? 'md:hidden' : ''}`}>
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* #endregion */}

      <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden min-w-0">
      
        {/* #region Cabeçalho (Header) */}
        <header className={`h-16 flex items-center justify-between px-4 md:px-8 border-b transition-colors duration-300 shrink-0 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'} backdrop-blur-md`}>
          <div className="flex items-center min-w-0 mr-4">
             <button 
               onClick={() => setSidebarOpen(true)}
               className="md:hidden mr-3 p-2 -ml-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300"
             >
               <Menu size={24} />
             </button>

             <h1 className="text-xl md:text-2xl font-bold truncate">Painel de Controle</h1>
             <span className="hidden md:flex ml-4 px-3 py-1 text-xs font-bold bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20 rounded-full items-center whitespace-nowrap shadow-sm">
               <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 mr-2 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
               {onlineCount} Online
             </span>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className={`p-2 flex-shrink-0 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 flex items-center justify-center ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200 shadow-sm'
              }`}
              title="Alternar Modo Noturno"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button 
              onClick={() => {
                setDarkMode(true);
                setPilotMode(true);
              }}
              className="flex items-center space-x-2 px-4 md:px-5 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-bold shadow-lg shadow-orange-500/40 hover:scale-105 hover:shadow-orange-500/60 transition-all active:scale-95 whitespace-nowrap"
            >
              <SteeringWheelIcon size={18} />
              <span className="hidden sm:inline tracking-wide">Modo Piloto</span>
            </button>

            <div className="flex items-center gap-3 group relative pl-3 md:pl-6 border-l border-gray-300 dark:border-gray-700">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-bold leading-none">{currentUser.name.split(' ')[0]}</p>
                <p className={`text-[11px] mt-1 font-medium tracking-wide flex items-center justify-end ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {currentUser.isModerador && <Shield size={10} className="mr-1 text-orange-500" />}
                  {userProfileSubtitle}
                </p>
              </div>
              
              <div className="relative h-10 w-10 flex-shrink-0">
                <img 
                  src={currentUser.photo} 
                  alt="Foto de Perfil" 
                  className={`w-full h-full rounded-full object-cover shadow-md group-hover:scale-105 transition-transform ${currentUser.isModerador ? 'border-[3px] border-orange-500' : 'border-2 border-gray-400'}`}
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
              </div>

              <button 
                onClick={() => setCurrentUser(null)}
                className="absolute -bottom-8 right-0 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-lg flex items-center space-x-1 whitespace-nowrap z-50"
              >
                <LogOut size={12} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </header>
        {/* #endregion */}

        {/* Removido o scroll externo para forçar as páginas a caberem e usarem barra de rolagem apenas internamente onde precisar */}
        <div className="flex-1 overflow-hidden p-2 md:p-6 flex flex-col min-h-0 relative">

          {activeTab === 'Baterias' ? (
            <div className="h-full w-full max-w-6xl mx-auto flex flex-col animate-in fade-in duration-300 min-h-0">
              {/* #region Aba Baterias */}
              <div className="flex items-center space-x-3 mb-2 md:mb-6 shrink-0">
                <div className="p-2 md:p-3 bg-orange-500/10 rounded-xl md:rounded-2xl">
                  <BatteryCharging className="text-orange-500 w-5 h-5 md:w-7 md:h-7" />
                </div>
                <div>
                  <h2 className="text-lg md:text-2xl font-bold">Diagnóstico do BMS</h2>
                  <p className={`text-[10px] md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Monitoramento individual de células e pack.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 md:gap-6 mb-2 md:mb-6 shrink-0">
                <div className={`rounded-xl md:rounded-3xl p-2 md:p-6 shadow-sm border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                  <h3 className="text-gray-500 font-bold text-[7px] sm:text-xs uppercase tracking-wider mb-1 md:mb-2 truncate">Tensão Total</h3>
                  <div className="flex items-baseline">
                    <span className="text-sm sm:text-4xl font-black text-blue-500">{totalBmsVoltage.toFixed(1)}</span>
                    <span className="text-[10px] sm:text-xl font-bold ml-0.5 md:ml-1 text-blue-500">V</span>
                  </div>
                </div>

                <div className={`rounded-xl md:rounded-3xl p-2 md:p-6 shadow-sm border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                  <h3 className="text-gray-500 font-bold text-[7px] sm:text-xs uppercase tracking-wider mb-1 md:mb-2 truncate">Desbalanço</h3>
                  <div className="flex items-baseline">
                    <span className={`text-sm sm:text-4xl font-black ${voltageImbalance > 0.15 ? 'text-red-500' : 'text-green-500'}`}>
                      {voltageImbalance.toFixed(3)}
                    </span>
                    <span className={`text-[10px] sm:text-xl font-bold ml-0.5 md:ml-1 ${voltageImbalance > 0.15 ? 'text-red-500' : 'text-green-500'}`}>V</span>
                  </div>
                </div>

                <div className={`rounded-xl md:rounded-3xl p-2 md:p-6 shadow-sm border transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                  <h3 className="text-gray-500 font-bold text-[7px] sm:text-xs uppercase tracking-wider mb-1 md:mb-2 truncate">Temp. Média</h3>
                  <div className="flex items-baseline">
                    <span className={`text-sm sm:text-4xl font-black ${avgBmsTemp > 45 ? 'text-red-500' : 'text-orange-500'}`}>
                      {avgBmsTemp.toFixed(1)}
                    </span>
                    <span className={`text-[10px] sm:text-xl font-bold ml-0.5 md:ml-1 ${avgBmsTemp > 45 ? 'text-red-500' : 'text-orange-500'}`}>°C</span>
                  </div>
                </div>
              </div>

              <div className={`flex-1 rounded-2xl md:rounded-3xl shadow-sm border overflow-hidden flex flex-col min-h-0 transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                <div className={`p-2 md:p-5 border-b flex justify-between items-center shrink-0 ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
                  <h3 className="text-xs md:text-lg font-bold flex items-center">
                    <Database className="mr-1 md:mr-2 text-orange-500 w-3 h-3 md:w-5 md:h-5" /> Células Individuais
                  </h3>
                  <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-xs font-bold ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                    Total: {cells.length}
                  </span>
                </div>
                
                <div className="flex-1 p-2 md:p-6 overflow-y-auto grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-1.5 md:gap-4 content-start">
                  {cells.map((cell) => {
                    const isHighTemp = cell.temperature >= 45;
                    const isLowVoltage = cell.voltage <= 3.2;
                    const isHighVoltage = cell.voltage >= 4.15;
                    
                    let cellStatusBorder = darkMode ? 'border-gray-700' : 'border-gray-200';
                    if (isHighTemp || isLowVoltage || isHighVoltage) {
                       cellStatusBorder = 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]';
                    }

                    return (
                      <div key={cell.id} className={`p-1.5 md:p-4 rounded-xl md:rounded-2xl border flex flex-col items-center justify-center transition-all ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} ${cellStatusBorder}`}>
                         <span className="text-[7px] md:text-xs font-bold text-gray-500 mb-1 md:mb-2">CÉLULA {cell.id}</span>
                         
                         <div className="flex items-baseline mb-1">
                           <span className={`text-xs md:text-xl font-bold ${(isLowVoltage || isHighVoltage) ? 'text-red-500' : (darkMode ? 'text-gray-200' : 'text-gray-800')}`}>
                             {cell.voltage.toFixed(2)}
                           </span>
                           <span className="text-[8px] md:text-xs ml-0.5 md:ml-1 font-medium text-gray-500">V</span>
                         </div>
                         
                         <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-1 md:h-1.5 mb-1.5 md:mb-3 overflow-hidden">
                           <div 
                             className={`h-1 md:h-1.5 rounded-full ${isLowVoltage ? 'bg-red-500' : isHighVoltage ? 'bg-orange-500' : 'bg-green-500'}`} 
                             style={{ width: `${Math.max(0, Math.min(100, ((cell.voltage - 3.0) / (4.2 - 3.0)) * 100))}%` }}
                           ></div>
                         </div>

                         <div className={`flex items-center text-[8px] md:text-xs font-bold ${isHighTemp ? 'text-red-500' : 'text-orange-400'}`}>
                           <Thermometer className="w-2 h-2 md:w-3.5 md:h-3.5 mr-0.5 md:mr-1" />
                           {cell.temperature.toFixed(1)}°C
                         </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* #endregion */}
            </div>

          ) : activeTab === 'Configurações' ? (
            <div className="h-full w-full max-w-5xl mx-auto flex flex-col animate-in fade-in duration-300 min-h-0">
              {/* #region Aba Configurações */}
               <div className="flex items-center justify-between mb-4 shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-orange-500/10 rounded-2xl">
                    <Settings className="text-orange-500" size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Gerenciamento de Equipe</h2>
                    <p className={`text-[10px] md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {currentUser.isModerador ? 'Você tem acesso total para gerenciar membros.' : 'Visualização da equipe (Apenas Moderadores podem editar).'}
                    </p>
                  </div>
                </div>
                {currentUser.isModerador && (
                  <div className="px-3 py-1 bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-full text-xs font-bold flex items-center">
                    <Shield size={14} className="mr-1 shrink-0" /> <span className="hidden sm:inline">Moderador Ativo</span>
                  </div>
                )}
              </div>

              {currentUser.isModerador && (
                <div className={`shrink-0 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border mb-4 transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                  <h3 className="text-sm md:text-lg font-bold mb-3 md:mb-4 flex items-center">
                    <Plus className="mr-2 text-green-500" size={20} /> Adicionar Novo Membro
                  </h3>
                  <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
                    <input 
                      type="email" placeholder="E-mail (Gera o nome automático)" required
                      value={newMemberEmail} onChange={e => setNewMemberEmail(e.target.value)}
                      className={`md:col-span-5 px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border focus:ring-2 focus:ring-orange-500 outline-none transition-colors text-sm ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                    />
                    <div className="relative md:col-span-3">
                      <select
                        value={newMemberRole} onChange={e => setNewMemberRole(e.target.value)}
                        className={`w-full text-sm appearance-none px-3 py-2 md:px-4 md:py-3 pr-10 rounded-lg md:rounded-xl border focus:ring-2 focus:ring-orange-500 outline-none transition-colors ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                      >
                        <option value="">Sem Função Especial</option>
                        <option value="Piloto">Piloto</option>
                        <option value="Engenheiro de Prova">Engenheiro de Prova</option>
                      </select>
                      <ChevronDown size={18} className={`absolute right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    
                    <label className={`md:col-span-2 flex items-center justify-center space-x-2 px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border cursor-pointer select-none transition-colors ${darkMode ? 'bg-gray-900 border-gray-700 text-white hover:bg-gray-800' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'}`}>
                      <input 
                        type="checkbox" 
                        checked={newMemberIsMod} 
                        onChange={e => setNewMemberIsMod(e.target.checked)}
                        className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                      />
                      <span className="font-semibold text-sm">Moderador</span>
                    </label>

                    <button type="submit" className="md:col-span-2 text-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.02] active:scale-95 text-white font-bold py-2 md:py-3 px-4 rounded-lg md:rounded-xl transition-all shadow-lg shadow-green-500/30 flex items-center justify-center">
                      Cadastrar
                    </button>
                  </form>
                </div>
              )}

              <div className={`flex-1 flex flex-col min-h-0 rounded-2xl md:rounded-3xl shadow-sm border overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                <div className={`p-3 md:p-5 border-b shrink-0 flex justify-between items-center ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
                  <h3 className="text-sm md:text-lg font-bold flex items-center">
                    <User className="mr-2 text-blue-500" size={20} /> Membros Cadastrados
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                    Total: {members.length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto divide-y transition-colors duration-300">
                  <div className="min-w-[600px] md:min-w-0">
                    {members.map(member => (
                      <div key={member.id} className={`flex items-center justify-between p-4 md:p-5 transition-colors ${darkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                        
                        <div className="flex items-center space-x-3 md:space-x-4 w-1/2">
                          <img 
                            src={member.photo} 
                            alt={member.name} 
                            className={`w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-full object-cover ${member.isModerador ? 'border-[3px] border-orange-500' : (darkMode ? 'border-2 border-gray-600' : 'border-2 border-gray-300')}`} 
                          />
                          <div className="flex flex-col">
                            <p className="font-bold text-sm md:text-md flex items-center">
                              {member.name}
                              {member.isOnline && (
                                <span className="ml-2 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]" title="Online agora"></span>
                              )}
                              {member.isModerador && <Shield size={12} className="ml-2 text-orange-500"/>}
                            </p>
                            <div className={`flex flex-col text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <span>{member.email}</span>
                              <span className="text-[10px] md:text-[11px] font-medium opacity-80 mt-0.5">
                                {member.isOnline ? (
                                  <span className="text-green-600 dark:text-green-400">Ativo agora</span>
                                ) : (
                                  <span>Visto por último: {member.lastSeen}</span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 md:space-x-6">
                          {currentUser.isModerador ? (
                            <>
                              <div className="relative">
                                <select 
                                  value={member.mainRole}
                                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleUpdateMemberRole(member.id, 'mainRole', e.target.value)}
                                  className={`appearance-none text-[10px] md:text-sm px-2 md:px-3 py-1 md:py-1.5 pr-6 md:pr-8 rounded-lg border focus:ring-2 focus:ring-orange-500 outline-none ${darkMode ? 'bg-gray-900 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300'}`}
                                >
                                  <option value="">Sem Função Especial</option>
                                  <option value="Piloto">Piloto</option>
                                  <option value="Engenheiro de Prova">Engenheiro de Prova</option>
                                </select>
                                <ChevronDown size={14} className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                              </div>
                              
                              <label className="flex items-center space-x-1.5 md:space-x-2 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={member.isModerador}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateMemberRole(member.id, 'isModerador', e.target.checked)}
                                  className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-500 rounded focus:ring-orange-500"
                                />
                                <span className={`text-[10px] md:text-sm font-semibold ${member.isModerador ? 'text-orange-500' : (darkMode ? 'text-gray-400' : 'text-gray-600')}`}>Mod</span>
                              </label>

                              <button 
                                onClick={() => handleRemoveMember(member.id)}
                                disabled={member.email === currentUser.email}
                                className="p-1.5 md:p-2 text-red-500 hover:bg-red-500/10 hover:text-red-600 rounded-lg md:rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                title={member.email === currentUser.email ? "Você não pode remover a si mesmo" : "Remover Membro"}
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center space-x-2 md:space-x-3">
                              {member.mainRole && (
                                <span className={`px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-bold rounded-full ${darkMode ? 'bg-blue-900/40 text-blue-400 border border-blue-800' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                                  {member.mainRole}
                                </span>
                              )}
                              {member.isModerador && (
                                <span className={`px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-bold rounded-full ${darkMode ? 'bg-orange-900/40 text-orange-400 border border-orange-800' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                                  Moderador
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {members.length === 0 && (
                    <div className="p-10 text-center text-gray-500 font-medium">Nenhum membro cadastrado.</div>
                  )}
                </div>
              </div>
              {/* #endregion */}
            </div>

          ) : activeTab === 'Resumo' ? (
            <div className="flex flex-col h-full w-full gap-2 md:gap-4 min-h-0 animate-in fade-in duration-300">
              {/* #region Aba Resumo */}
              <div className="flex gap-2 md:gap-6 flex-1 min-h-0 flex-col md:flex-row">
                
                <div className={`hidden md:flex flex-[2] rounded-2xl p-4 md:p-6 shadow-sm border transition-colors duration-300 flex-col h-full min-h-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold flex items-center shrink-0">
                      <Activity className="mr-2 text-orange-500" size={20} />
                      Desempenho Principal (Tempo Real)
                    </h2>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 shrink-0">
                      {mainData[mainData.length - 1].toFixed(1)} <span className="text-sm text-gray-400">kW</span>
                    </span>
                  </div>
                  
                  <div className="flex-1 w-full relative mt-2 min-h-0">
                    <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                      <defs>
                        <linearGradient id="mainGradient" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#f97316" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {[0, 50, 100, 150, 200].map(y => (
                        <line key={`grid-${y}`} x1="0" y1={y} x2="1000" y2={y} stroke={darkMode ? '#374151' : '#f3f4f6'} strokeWidth="1" strokeDasharray="5,5" />
                      ))}
                      <polygon points={`0,200 ${generatePolyline(mainData, 1000, 200, 100)} 1000,200`} fill="url(#mainGradient)" />
                      <polyline points={generatePolyline(mainData, 1000, 200, 100)} fill="none" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-md" />
                      <line x1="0" y1="200" x2="1000" y2="200" stroke={darkMode ? '#4b5563' : '#d1d5db'} strokeWidth="2" />
                      <line x1="0" y1="0" x2="0" y2="200" stroke={darkMode ? '#4b5563' : '#d1d5db'} strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                <div className={`flex-1 md:flex-[1] rounded-2xl p-2 md:p-6 shadow-sm border transition-colors duration-300 flex flex-col h-full min-h-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                   <h2 className="text-sm md:text-lg font-bold mb-1.5 md:mb-4 flex items-center shrink-0">
                      <BatteryCharging className="mr-1 md:mr-2 text-blue-500 w-4 h-4 md:w-5 md:h-5" />
                      Geral da Bateria (BMS)
                   </h2>
                   
                   <div className="flex-1 min-h-0 flex flex-col justify-center">
                     <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5 md:gap-4 w-full">
                        <div className={`flex flex-col md:flex-row justify-between items-center p-1.5 md:p-3 rounded-lg md:rounded-xl border text-center md:text-left ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                           <span className="text-[9px] md:text-xs uppercase font-bold text-gray-500 mb-0.5 md:mb-0">Tensão Pack</span>
                           <span className="font-bold text-blue-500 text-xs md:text-lg">{totalBmsVoltage.toFixed(1)} V</span>
                        </div>
                        <div className={`flex flex-col md:flex-row justify-between items-center p-1.5 md:p-3 rounded-lg md:rounded-xl border text-center md:text-left ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                           <span className="text-[9px] md:text-xs uppercase font-bold text-gray-500 mb-0.5 md:mb-0">Célula Máx/Mín</span>
                           <span className={`font-bold text-[10px] md:text-lg ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                             {maxVoltageCell.voltage.toFixed(2)}V / {minVoltageCell.voltage.toFixed(2)}V
                           </span>
                        </div>
                        <div className={`flex flex-col md:flex-row justify-between items-center p-1.5 md:p-3 rounded-lg md:rounded-xl border text-center md:text-left ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                           <span className="text-[9px] md:text-xs uppercase font-bold text-gray-500 mb-0.5 md:mb-0">Desbalanço</span>
                           <span className={`font-bold text-xs md:text-lg ${voltageImbalance > 0.15 ? 'text-red-500' : 'text-green-500'}`}>
                             Δ {voltageImbalance.toFixed(3)} V
                           </span>
                        </div>
                        <div className={`flex flex-col md:flex-row justify-between items-center p-1.5 md:p-3 rounded-lg md:rounded-xl border text-center md:text-left ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                           <span className="text-[9px] md:text-xs uppercase font-bold text-gray-500 mb-0.5 md:mb-0">Status BMS</span>
                           <span className={`px-2 py-0.5 md:py-1 rounded text-[9px] md:text-xs font-black uppercase ${voltageImbalance > 0.15 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                             {voltageImbalance > 0.15 ? 'Atenção' : 'Normal'}
                           </span>
                        </div>
                     </div>
                   </div>
                   
                   <button onClick={() => setActiveTab('Baterias')} className="mt-2 md:mt-4 w-full py-1.5 md:py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold rounded-lg transition-colors text-xs md:text-sm shrink-0">
                      Ver Detalhes <span className="hidden md:inline">das Células</span>
                   </button>
                </div>
              </div>

              <div className={`shrink-0 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300 w-full ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                <div className={`hidden md:block p-3 lg:p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
                  <h2 className="text-lg font-bold">Métricas do Sistema</h2>
                </div>
                
                <div className={`grid grid-cols-5 gap-[1px] w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  
                  <div className={`p-1 sm:p-2 md:p-3 lg:p-4 flex flex-col items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <span className="text-[7px] sm:text-[9px] lg:text-[11px] font-black uppercase tracking-wider text-gray-500 mb-0.5 text-center">Tensão</span>
                    <div className="flex items-baseline">
                      <span className={`text-xs sm:text-xl lg:text-3xl font-light ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>{totalBmsVoltage.toFixed(1)}</span>
                      <span className={`hidden sm:block text-[10px] sm:text-lg lg:text-xl font-medium ml-0.5 md:ml-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>V</span>
                    </div>
                  </div>

                  <div className={`p-1 sm:p-2 md:p-3 lg:p-4 flex flex-col items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <span className="text-[7px] sm:text-[9px] lg:text-[11px] font-black uppercase tracking-wider text-gray-500 mb-0.5 text-center">Corrente</span>
                    <div className="flex items-baseline">
                      <span className={`text-xs sm:text-xl lg:text-3xl font-light ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>12.4</span>
                      <span className={`hidden sm:block text-[10px] sm:text-lg lg:text-xl font-medium ml-0.5 md:ml-1 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>A</span>
                    </div>
                  </div>

                  <div className={`p-1 sm:p-2 md:p-3 lg:p-4 flex flex-col items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <span className="text-[7px] sm:text-[9px] lg:text-[11px] font-black uppercase tracking-wider text-gray-500 mb-0.5 text-center">Rotação</span>
                    <div className="flex items-baseline">
                      <span className={`text-xs sm:text-xl lg:text-3xl font-light ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{rpm}</span>
                    </div>
                  </div>

                  <div className={`p-1 sm:p-2 md:p-3 lg:p-4 flex flex-col items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <span className="text-[7px] sm:text-[9px] lg:text-[11px] font-black uppercase tracking-wider text-gray-500 mb-0.5 text-center truncate w-full">Temp. BMS</span>
                    <div className="flex items-baseline">
                      <span className={`text-xs sm:text-xl lg:text-3xl font-light ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{avgBmsTemp.toFixed(0)}</span>
                      <span className={`hidden sm:block text-[10px] sm:text-lg lg:text-xl font-medium ml-0.5 md:ml-1 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>°C</span>
                    </div>
                  </div>

                  <div className={`p-1 sm:p-2 md:p-3 lg:p-4 flex flex-col items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <span className="text-[7px] sm:text-[9px] lg:text-[11px] font-black uppercase tracking-wider text-gray-500 mb-0.5 text-center">Bateria</span>
                    <div className="flex items-baseline">
                      <span className={`text-xs sm:text-xl lg:text-3xl font-bold ${battery > 20 ? 'text-green-500' : 'text-red-500'}`}>{battery}%</span>
                    </div>
                  </div>

                  <div className={`p-1 sm:p-2 md:p-3 lg:p-4 flex flex-col items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <span className="text-[7px] sm:text-[9px] lg:text-[11px] font-black uppercase tracking-wider text-gray-500 mb-0.5 text-center truncate w-full">Velocidade</span>
                    <div className="flex items-baseline">
                      <span className={`text-xs sm:text-xl lg:text-3xl font-light ${darkMode ? 'text-teal-400' : 'text-teal-600'}`}>{speed}</span>
                    </div>
                  </div>

                  <div className={`p-1 sm:p-2 md:p-3 lg:p-4 flex flex-col items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <span className="text-[7px] sm:text-[9px] lg:text-[11px] font-black uppercase tracking-wider text-gray-500 mb-0.5 text-center">Potência</span>
                    <div className="flex items-baseline">
                      <span className={`text-xs sm:text-xl lg:text-3xl font-light ${darkMode ? 'text-yellow-300' : 'text-yellow-500'}`}>597</span>
                      <span className={`hidden sm:block text-[10px] sm:text-lg lg:text-xl font-medium ml-0.5 md:ml-1 ${darkMode ? 'text-yellow-300' : 'text-yellow-500'}`}>W</span>
                    </div>
                  </div>

                  <div className={`p-1 sm:p-2 md:p-3 lg:p-4 flex flex-col items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <span className="text-[7px] sm:text-[9px] lg:text-[11px] font-black uppercase tracking-wider text-gray-500 mb-0.5 text-center truncate w-full">Inclinação</span>
                    <div className="flex items-baseline">
                      <span className={`text-xs sm:text-xl lg:text-3xl font-light ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>12°</span>
                    </div>
                  </div>

                  <div className={`p-1 sm:p-2 md:p-3 lg:p-4 flex flex-col items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <span className="text-[7px] sm:text-[9px] lg:text-[11px] font-black uppercase tracking-wider text-gray-500 mb-0.5 text-center">S1 Status</span>
                    <div className="flex items-baseline">
                      <span className={`text-[9px] sm:text-xl lg:text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>OK</span>
                    </div>
                  </div>

                  <div className={`p-1 sm:p-2 md:p-3 lg:p-4 flex flex-col items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <span className="text-[7px] sm:text-[9px] lg:text-[11px] font-black uppercase tracking-wider text-gray-500 mb-0.5 text-center">S2 Status</span>
                    <div className="flex items-baseline">
                      <span className={`text-[9px] sm:text-xl lg:text-2xl font-bold ${darkMode ? 'text-rose-400' : 'text-rose-600'}`}>WARN</span>
                    </div>
                  </div>

                </div>
              </div>
              {/* #endregion */}
            </div>

          ) : activeTab === 'Mapa' ? (
            <div className="h-full w-full max-w-6xl mx-auto flex flex-col animate-in fade-in duration-300 min-h-0">
               {/* #region Aba Mapa */}
               <div className="flex items-center space-x-3 mb-4 shrink-0">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl">
                    <Map className="text-emerald-500" size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Rastreamento GPS</h2>
                    <p className={`text-[10px] md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Posicionamento do barco em tempo real</p>
                  </div>
               </div>

               <div className={`flex-1 rounded-2xl md:rounded-3xl overflow-hidden border shadow-sm relative flex items-center justify-center transition-colors duration-300 min-h-0 ${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-gray-200 border-gray-300'}`}>
                  
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                  
                  <div className="relative z-10 flex flex-col items-center animate-bounce">
                    <MapPin size={48} className="text-orange-500 drop-shadow-lg" />
                    <span className={`mt-2 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
                      Solares Atual
                    </span>
                  </div>

                  <div className={`absolute bottom-4 left-4 md:bottom-6 md:left-6 p-3 md:p-4 rounded-xl md:rounded-2xl border shadow-lg backdrop-blur-md ${darkMode ? 'bg-gray-900/80 border-gray-700 text-white' : 'bg-white/80 border-gray-200 text-gray-800'}`}>
                    <p className="text-[10px] uppercase font-bold text-gray-500 mb-1 md:mb-2">Coordenadas</p>
                    <div className="flex gap-3 md:gap-4 font-mono text-xs md:text-sm">
                      <div>
                        <span className="text-orange-500 mr-1">LAT</span> -20.2976
                      </div>
                      <div>
                        <span className="text-blue-500 mr-1">LON</span> -40.2958
                      </div>
                    </div>
                  </div>

               </div>
               {/* #endregion */}
            </div>
          ) : activeTab === 'Análise' ? (
            <div className="h-full w-full max-w-5xl mx-auto flex flex-col animate-in fade-in duration-300 min-h-0">
               {/* #region Aba Análise */}
               <div className="flex items-center space-x-3 mb-4 shrink-0">
                  <div className="p-3 bg-blue-500/10 rounded-2xl">
                    <BarChart2 className="text-blue-500" size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Análise de Desempenho</h2>
                    <p className={`text-[10px] md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Previsões e métricas avançadas baseadas em telemetria</p>
                  </div>
               </div>

               <div className={`flex-1 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-sm border mb-4 transition-colors duration-300 relative overflow-y-auto ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
                  
                  <div className="flex flex-col md:flex-row items-center justify-between relative z-10 h-full">
                     <div className="flex-1 mb-6 md:mb-0 md:pr-4 flex flex-col items-center md:items-start text-center md:text-left w-full justify-center">
                        <h3 className="text-lg font-bold mb-2 flex items-center justify-center md:justify-start">
                          <Zap className="mr-2 text-blue-500" size={20} /> 
                          Tempo de Bateria Remanescente
                        </h3>
                        <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Calculado dinamicamente relacionando o nível de carga com o consumo (kW) atual.
                        </p>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                           <div className={`px-4 py-2 rounded-xl border flex flex-col items-center text-center ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                              <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Consumo</p>
                              <p className="text-xl font-bold text-orange-500">{currentPower.toFixed(1)} kW</p>
                           </div>
                           <div className={`px-4 py-2 rounded-xl border flex flex-col items-center text-center ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                              <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Velocidade</p>
                              <p className="text-xl font-bold text-blue-500">{speed}</p>
                           </div>
                           <div className={`px-4 py-2 rounded-xl border flex flex-col items-center text-center ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                              <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Bateria</p>
                              <p className={`text-xl font-bold ${battery > 20 ? 'text-emerald-500' : 'text-red-500'}`}>{battery}%</p>
                           </div>
                        </div>
                     </div>

                     <div className="flex-shrink-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-lg shadow-blue-500/30 text-white min-w-[200px] md:min-w-[250px]">
                        <span className="text-sm font-bold uppercase tracking-wider mb-2 opacity-80">Tempo Estimado</span>
                        <div className="flex items-baseline space-x-2">
                           <span className="text-6xl font-black tracking-tighter">{estHours}</span>
                           <span className="text-2xl font-bold opacity-80">h</span>
                           <span className="text-6xl font-black tracking-tighter">{estMinutes.toString().padStart(2, '0')}</span>
                           <span className="text-2xl font-bold opacity-80">m</span>
                        </div>
                     </div>
                  </div>
               </div>
               {/* #endregion */}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              <p className="text-xl">Área de {activeTab} em desenvolvimento.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}