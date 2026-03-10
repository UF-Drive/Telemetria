import React, { useState, useEffect } from 'react';
import { 
  Menu, Moon, Sun, User, Activity, 
  BarChart2, Zap, Settings, Database, 
  ArrowLeft, LogOut, Unlock, Trash2, Plus,
  Info, Shield, AlertTriangle
} from 'lucide-react';

// --- Mock Data Inicial ---
const initialMainData = Array.from({ length: 40 }, () => Math.floor(Math.random() * 50) + 20);
const multiChartData = {
  series1: Array.from({ length: 20 }, () => Math.floor(Math.random() * 30) + 60),
  series2: Array.from({ length: 20 }, () => Math.floor(Math.random() * 40) + 20),
  series3: Array.from({ length: 20 }, () => Math.floor(Math.random() * 20) + 5),
};

// --- Mock da Equipe (com a estrutura de Roles e Status) ---
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

// --- Funções Auxiliares ---
const generatePolyline = (data, width, height, maxVal) => {
  const stepX = width / (data.length - 1);
  return data.map((val, index) => {
    const x = index * stepX;
    const y = height - (val / maxVal) * height;
    return `${x},${y}`;
  }).join(' ');
};

const generateNameFromEmail = (email) => {
  const prefix = email.split('@')[0];
  return prefix.split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
};

// --- Ícones Customizados ---
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

export default function App() {
  const [members, setMembers] = useState(initialMembers);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Estados da Tela de Login
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showUnlockAnim, setShowUnlockAnim] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showModInfo, setShowModInfo] = useState(false);

  // Estados da Interface do Painel
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pilotMode, setPilotMode] = useState(false);
  const [activeTab, setActiveTab] = useState('Resumo');
  
  // Estado para Cadastro
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberIsMod, setNewMemberIsMod] = useState(false);

  // Estados de Dados
  const [mainData, setMainData] = useState(initialMainData);
  const [rpm, setRpm] = useState(1450);
  const [speed, setSpeed] = useState(10);
  const [battery, setBattery] = useState(100);

  // Controle Global do Modo Noturno
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Simulação de telemetria em tempo real
  useEffect(() => {
    if (!currentUser) return; 

    const interval = setInterval(() => {
      setMainData(prev => {
        const newData = [...prev.slice(1)];
        const lastVal = prev[prev.length - 1];
        newData.push(Math.max(10, Math.min(90, lastVal + (Math.random() * 10 - 5))));
        return newData;
      });
      setRpm(prev => Math.floor(prev + (Math.random() * 50 - 25)));
      setSpeed(prev => Math.max(0, prev + (Math.random() * 0.4 - 0.2)));
      
      // Drenagem progressiva da bateria
      setBattery(prev => {
        if (prev <= 0) return 100;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Lógica de Login Simulado
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
          setCurrentUser(loggedUser);
          setShowUnlockAnim(false);
        }, 1200);
      }
    }, 1500);
  };

  // Funções de Gerenciamento de Equipe
  const handleAddMember = (e) => {
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

  const handleRemoveMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const handleUpdateMemberRole = (id, field, value) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  // Calcula total de usuários online
  const onlineCount = members.filter(m => m.isOnline).length;

  // ==========================================
  // VIEW: TELA DE LOGIN
  // ==========================================
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

  // ==========================================
  // LÓGICA DE CORES DA BATERIA (MODO PILOTO)
  // ==========================================
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

  // ==========================================
  // VIEW: MODO PILOTO
  // ==========================================
  if (pilotMode) {
    return (
      <div className="h-screen w-full bg-black text-white flex flex-col p-6 font-sans select-none overflow-hidden relative">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => setPilotMode(false)} 
            className="flex items-center space-x-2 text-gray-500 hover:text-white transition-colors p-2"
          >
            <ArrowLeft size={32} />
            <span className="text-xl font-bold uppercase tracking-widest hidden sm:block">Voltar</span>
          </button>
          
          <div className="flex items-center space-x-3 bg-red-950/50 border border-red-900 px-4 py-2 rounded-full">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
            <span className="text-red-500 font-bold tracking-widest text-sm">TELEMETRIA ATIVA</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full max-w-4xl mx-auto pb-10">
          
          <div className="flex items-center justify-between w-full bg-[#0a0a0a] border-2 border-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl relative">
            <div className="flex items-center w-full max-w-[70%]">
              <div className={`relative w-full h-24 md:h-32 border-4 md:border-8 ${batteryBorder} rounded-2xl md:rounded-3xl p-1 md:p-1.5 flex transition-colors duration-500 bg-gray-900`}>
                <div 
                  className={`h-full ${batteryFill} rounded-md md:rounded-xl transition-all duration-1000 ease-out`}
                  style={{ width: `${battery}%` }}
                ></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                   <span className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,1)] tracking-tighter">
                      {battery}
                   </span>
                   <span className="text-3xl md:text-5xl font-bold text-gray-200 drop-shadow-[0_4px_4px_rgba(0,0,0,1)] ml-1">
                      %
                   </span>
                </div>
              </div>
              <div className={`w-3 h-10 md:w-4 md:h-14 ${batteryNub} rounded-r-lg -ml-1 transition-colors duration-500`}></div>
            </div>

            <div className="text-6xl md:text-8xl font-black text-gray-700 ml-6">B</div>

            {battery < 15 && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-3/4 bg-red-600 text-white font-black text-lg md:text-2xl text-center py-3 rounded-full animate-pulse shadow-[0_0_30px_rgba(220,38,38,1)] border-2 border-red-400 tracking-widest uppercase flex items-center justify-center space-x-3 z-10">
                <AlertTriangle size={28} />
                <span>Bateria Muito Baixa</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between w-full bg-[#0a0a0a] border-2 border-gray-800 rounded-3xl p-6 md:p-10 shadow-2xl relative">
            <div className="flex items-baseline bg-gray-900 px-8 py-4 border border-gray-700 rounded-2xl w-2/3">
              <span className="text-7xl md:text-9xl font-black text-blue-400 tracking-tighter w-full text-right">{speed.toFixed(1)}</span>
              <span className="text-3xl md:text-5xl text-blue-600 font-bold ml-4">Nós</span>
            </div>
            <div className="text-6xl md:text-8xl font-black text-gray-700 ml-6">V</div>
          </div>

          <div className="flex items-center justify-between w-full bg-[#0a0a0a] border border-gray-800/50 rounded-3xl p-6 md:p-8">
            <div className="flex items-baseline px-4">
              <span className="text-5xl md:text-7xl font-black text-orange-400 tracking-tighter">{rpm}</span>
            </div>
            <div className="text-4xl md:text-5xl font-black text-gray-700 ml-6 tracking-widest">RPM</div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: DASHBOARD
  // ==========================================
  
  const userProfileSubtitle = currentUser.isModerador 
    ? (currentUser.mainRole ? `${currentUser.mainRole} | Mod` : 'Moderador') 
    : (currentUser.mainRole || 'Membro');

  const currentPower = mainData[mainData.length - 1] || 1;
  const estimatedTimeRaw = (battery / Math.max(10, currentPower)) * 2.5;
  const estHours = Math.floor(estimatedTimeRaw);
  const estMinutes = Math.floor((estimatedTimeRaw - estHours) * 60);

  return (
    <div className={`flex h-screen w-full transition-colors duration-300 font-sans ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
      
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col border-r ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} relative z-20`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-inherit">
          {sidebarOpen && <span className="font-bold text-xl tracking-wider text-orange-500">TELEMETRIA</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${!sidebarOpen && 'mx-auto'}`}>
            <Menu size={24} />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {[
              { icon: Activity, label: 'Resumo' },
              { icon: BarChart2, label: 'Análise' },
              { icon: Zap, label: 'Potência' },
              { icon: Database, label: 'Logs de Dados' },
              { icon: Settings, label: 'Configurações' },
            ].map((item, idx) => (
              <li key={idx}>
                <button 
                  onClick={() => setActiveTab(item.label)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.label 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  <item.icon size={20} className={sidebarOpen ? 'mr-4' : 'mx-auto'} />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP HEADER */}
        <header className={`h-16 flex items-center justify-between px-4 md:px-8 border-b transition-colors duration-300 ${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-gray-200'} backdrop-blur-md`}>
          <div className="flex items-center min-w-0 mr-4">
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
              onClick={() => setPilotMode(true)}
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

        {/* CONTEÚDO DINÂMICO BASEADO NA ABA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {activeTab === 'Configurações' ? (
            <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-orange-500/10 rounded-2xl">
                    <Settings className="text-orange-500" size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Gerenciamento de Equipe</h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {currentUser.isModerador ? 'Você tem acesso total para gerenciar membros.' : 'Visualização da equipe (Apenas Moderadores podem editar).'}
                    </p>
                  </div>
                </div>
                {currentUser.isModerador && (
                  <div className="px-3 py-1 bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-full text-xs font-bold flex items-center">
                    <Shield size={14} className="mr-1" /> Moderador Ativo
                  </div>
                )}
              </div>

              {currentUser.isModerador && (
                <div className={`rounded-3xl p-6 shadow-sm border mb-8 transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <Plus className="mr-2 text-green-500" size={20} /> Adicionar Novo Membro
                  </h3>
                  <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <input 
                      type="email" placeholder="E-mail (Gera o nome automático)" required
                      value={newMemberEmail} onChange={e => setNewMemberEmail(e.target.value)}
                      className={`md:col-span-5 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 outline-none transition-colors ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                    />
                    <select
                      value={newMemberRole} onChange={e => setNewMemberRole(e.target.value)}
                      className={`md:col-span-3 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-500 outline-none transition-colors ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-300'}`}
                    >
                      <option value="">Sem Função Especial</option>
                      <option value="Piloto">Piloto</option>
                      <option value="Engenheiro de Prova">Engenheiro de Prova</option>
                    </select>
                    
                    <label className={`md:col-span-2 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border cursor-pointer select-none transition-colors ${darkMode ? 'bg-gray-900 border-gray-700 text-white hover:bg-gray-800' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'}`}>
                      <input 
                        type="checkbox" 
                        checked={newMemberIsMod} 
                        onChange={e => setNewMemberIsMod(e.target.checked)}
                        className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                      />
                      <span className="font-semibold text-sm">Moderador</span>
                    </label>

                    <button type="submit" className="md:col-span-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:scale-[1.02] active:scale-95 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-green-500/30 flex items-center justify-center">
                      Cadastrar
                    </button>
                  </form>
                </div>
              )}

              <div className={`rounded-3xl shadow-sm border overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                <div className={`p-5 border-b flex justify-between items-center ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
                  <h3 className="text-lg font-bold flex items-center">
                    <User className="mr-2 text-blue-500" size={20} /> Membros Cadastrados
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                    Total: {members.length}
                  </span>
                </div>
                <div className="divide-y transition-colors duration-300">
                  {members.map(member => (
                    <div key={member.id} className={`flex items-center justify-between p-5 transition-colors ${darkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      
                      <div className="flex items-center space-x-4 w-1/2">
                        <img 
                          src={member.photo} 
                          alt={member.name} 
                          className={`w-12 h-12 flex-shrink-0 rounded-full object-cover ${member.isModerador ? 'border-[3px] border-orange-500' : (darkMode ? 'border-2 border-gray-600' : 'border-2 border-gray-300')}`} 
                        />
                        <div className="flex flex-col">
                          <p className="font-bold text-md flex items-center">
                            {member.name}
                            {member.isOnline && (
                              <span className="ml-2 w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]" title="Online agora"></span>
                            )}
                            {member.isModerador && <Shield size={14} className="ml-2 text-orange-500" title="Moderador" />}
                          </p>
                          <div className={`flex flex-col text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span>{member.email}</span>
                            <span className="text-[11px] font-medium opacity-80 mt-0.5">
                              {member.isOnline ? (
                                <span className="text-green-600 dark:text-green-400">Ativo agora</span>
                              ) : (
                                <span>Visto por último: {member.lastSeen}</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        {currentUser.isModerador ? (
                          <>
                            <select 
                              value={member.mainRole}
                              onChange={(e) => handleUpdateMemberRole(member.id, 'mainRole', e.target.value)}
                              className={`text-sm px-3 py-1.5 rounded-lg border focus:ring-2 focus:ring-orange-500 outline-none ${darkMode ? 'bg-gray-900 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300'}`}
                            >
                              <option value="">Sem Função Especial</option>
                              <option value="Piloto">Piloto</option>
                              <option value="Engenheiro de Prova">Engenheiro de Prova</option>
                            </select>
                            
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={member.isModerador}
                                onChange={(e) => handleUpdateMemberRole(member.id, 'isModerador', e.target.checked)}
                                className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                              />
                              <span className={`text-sm font-semibold ${member.isModerador ? 'text-orange-500' : (darkMode ? 'text-gray-400' : 'text-gray-600')}`}>Mod</span>
                            </label>

                            <button 
                              onClick={() => handleRemoveMember(member.id)}
                              disabled={member.email === currentUser.email}
                              className="p-2 text-red-500 hover:bg-red-500/10 hover:text-red-600 rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                              title={member.email === currentUser.email ? "Você não pode remover a si mesmo" : "Remover Membro"}
                            >
                              <Trash2 size={20} />
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center space-x-3">
                            {member.mainRole && (
                              <span className={`px-4 py-1.5 text-xs font-bold rounded-full ${darkMode ? 'bg-blue-900/40 text-blue-400 border border-blue-800' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                                {member.mainRole}
                              </span>
                            )}
                            {member.isModerador && (
                              <span className={`px-4 py-1.5 text-xs font-bold rounded-full ${darkMode ? 'bg-orange-900/40 text-orange-400 border border-orange-800' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                                Moderador
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {members.length === 0 && (
                    <div className="p-10 text-center text-gray-500 font-medium">Nenhum membro cadastrado.</div>
                  )}
                </div>
              </div>

            </div>
          ) : activeTab === 'Resumo' ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className={`lg:col-span-2 rounded-2xl p-6 shadow-sm border transition-colors duration-300 flex flex-col ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold flex items-center">
                      <Activity className="mr-2 text-orange-500" size={20} />
                      Desempenho Principal (Tempo Real)
                    </h2>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                      {mainData[mainData.length - 1].toFixed(1)} <span className="text-sm text-gray-400">kW</span>
                    </span>
                  </div>
                  
                  <div className="flex-1 w-full h-64 relative mt-2">
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

                <div className={`rounded-2xl p-6 shadow-sm border transition-colors duration-300 flex flex-col ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                   <h2 className="text-lg font-bold mb-4">Comparativo de Sensores</h2>
                   <div className="flex-1 w-full h-full relative min-h-[200px]">
                      <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-full">
                        {[50, 100, 150].map(y => (
                          <line key={`grid2-${y}`} x1="0" y1={y} x2="500" y2={y} stroke={darkMode ? '#374151' : '#f3f4f6'} strokeWidth="1" />
                        ))}
                        <polyline points={generatePolyline(multiChartData.series1, 500, 200, 100)} fill="none" stroke="#3b82f6" strokeWidth="3" />
                        <polyline points={generatePolyline(multiChartData.series2, 500, 200, 100)} fill="none" stroke="#eab308" strokeWidth="3" />
                        <polyline points={generatePolyline(multiChartData.series3, 500, 200, 100)} fill="none" stroke="#ef4444" strokeWidth="3" />
                        <line x1="0" y1="200" x2="500" y2="200" stroke={darkMode ? '#4b5563' : '#d1d5db'} strokeWidth="2" />
                        <line x1="0" y1="0" x2="0" y2="200" stroke={darkMode ? '#4b5563' : '#d1d5db'} strokeWidth="2" />
                      </svg>
                   </div>
                   <div className="flex justify-center space-x-4 mt-4 text-xs font-medium">
                      <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div> Motor</div>
                      <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div> Bateria</div>
                      <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div> Placas</div>
                   </div>
                </div>
              </div>

              <div className={`rounded-2xl shadow-sm border overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
                  <h2 className="text-lg font-bold">Métricas do Sistema</h2>
                </div>
                
                <div className="grid grid-cols-5 divide-x divide-y md:divide-y-0 text-center">
                  <div className={`p-4 font-bold text-lg ${darkMode ? 'text-blue-400 border-gray-700' : 'text-blue-600 border-gray-200'}`}>V</div>
                  <div className={`p-4 font-bold text-lg ${darkMode ? 'text-yellow-400 border-gray-700' : 'text-yellow-600 border-gray-200'}`}>A</div>
                  <div className={`p-4 font-bold text-lg ${darkMode ? 'text-orange-400 border-gray-700' : 'text-orange-600 border-gray-200'}`}>W</div>
                  <div className={`p-4 font-bold text-lg ${darkMode ? 'text-purple-400 border-gray-700' : 'text-purple-600 border-gray-200'}`}>T</div>
                  <div className={`p-4 font-bold text-lg ${darkMode ? 'text-red-400 border-gray-700' : 'text-red-600 border-gray-200'}`}>°C</div>

                  <div className={`p-6 text-2xl font-light border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>48.2</div>
                  <div className={`p-6 text-2xl font-light border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>12.4</div>
                  <div className={`p-6 text-2xl font-light border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>597.6</div>
                  <div className={`p-6 text-2xl font-light border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>34.1</div>
                  <div className={`p-6 text-2xl font-light border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>45.0</div>
                </div>

                <div className={`h-px w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>

                <div className="grid grid-cols-5 divide-x divide-y md:divide-y-0 text-center">
                  <div className={`p-4 font-bold text-lg flex justify-center items-center ${darkMode ? 'text-teal-400 border-gray-700' : 'text-teal-600 border-gray-200'}`}>Vel</div>
                  <div className={`p-4 font-bold text-lg flex justify-center items-center ${darkMode ? 'text-emerald-400 border-gray-700' : 'text-emerald-600 border-gray-200'}`}>RPM</div>
                  <div className={`p-4 font-bold text-lg flex justify-center items-center ${darkMode ? 'text-indigo-400 border-gray-700' : 'text-indigo-600 border-gray-200'}`}>
                    <span className="italic font-serif font-black">&beta;</span>
                  </div>
                  <div className={`p-4 font-bold text-lg flex justify-center items-center ${darkMode ? 'text-pink-400 border-gray-700' : 'text-pink-600 border-gray-200'}`}>S1</div>
                  <div className={`p-4 font-bold text-lg flex justify-center items-center ${darkMode ? 'text-rose-400 border-gray-700' : 'text-rose-600 border-gray-200'}`}>S2</div>

                  <div className={`p-6 text-2xl font-light border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>{speed.toFixed(1)}<span className="text-sm ml-1 text-gray-500">nós</span></div>
                  <div className={`p-6 text-2xl font-light border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>{rpm}</div>
                  <div className={`p-6 text-2xl font-light border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>12°</div>
                  <div className={`p-6 text-2xl font-light border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>OK</div>
                  <div className={`p-6 text-2xl font-light border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>WARN</div>
                </div>
              </div>
            </>
          ) : activeTab === 'Análise' ? (
            <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-blue-500/10 rounded-2xl">
                    <BarChart2 className="text-blue-500" size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Análise de Desempenho</h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Previsões e métricas avançadas baseadas em telemetria</p>
                  </div>
               </div>

               <div className={`rounded-3xl p-8 shadow-sm border mb-8 transition-colors duration-300 relative overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100 shadow-xl shadow-gray-200/50'}`}>
                  <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
                  
                  <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
                     <div className="flex-1 mb-6 md:mb-0 pr-4">
                        <h3 className="text-lg font-bold mb-2 flex items-center">
                          <Zap className="mr-2 text-blue-500" size={20} /> 
                          Tempo de Bateria Remanescente
                        </h3>
                        <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Calculado dinamicamente relacionando o nível de carga com o consumo (kW) atual.
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                           <div className={`px-4 py-2 rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                              <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Consumo</p>
                              <p className="text-xl font-bold text-orange-500">{currentPower.toFixed(1)} kW</p>
                           </div>
                           <div className={`px-4 py-2 rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                              <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Velocidade</p>
                              <p className="text-xl font-bold text-blue-500">{speed.toFixed(1)} nós</p>
                           </div>
                           <div className={`px-4 py-2 rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
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