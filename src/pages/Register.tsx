// src/pages/Register.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Mail, Lock, Phone, Calendar as CalendarIcon } from 'lucide-react';

type WeekAvailability = {
  [key: string]: ('morning' | 'afternoon' | 'evening')[];
};

type Estado = {
  id: number;
  sigla: string;
  nome: string;
};

type Cidade = {
  id: number;
  nome: string;
};

export const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Credenciais
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: Dados Pessoais
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');

  // Step 3: Perfil de Jogador
  const [preferredSide, setPreferredSide] = useState('');
  const [dominantHand, setDominantHand] = useState('');
  const [initialCategory, setInitialCategory] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  // Estados e Cidades da API do IBGE
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [loadingCidades, setLoadingCidades] = useState(false);

  // Step 4: Disponibilidade
  const [availability, setAvailability] = useState<WeekAvailability>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  });

  // Buscar estados ao montar o componente
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
        const data = await response.json();
        setEstados(data);
      } catch (error) {
        console.error('Erro ao buscar estados:', error);
      }
    };

    fetchEstados();
  }, []);

  // Buscar cidades quando o estado mudar
  useEffect(() => {
    if (state) {
      const fetchCidades = async () => {
        setLoadingCidades(true);
        try {
          const response = await fetch(
            `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios?orderBy=nome`
          );
          const data = await response.json();
          setCidades(data);
          setCity(''); // Limpar cidade selecionada ao trocar de estado
        } catch (error) {
          console.error('Erro ao buscar cidades:', error);
        } finally {
          setLoadingCidades(false);
        }
      };

      fetchCidades();
    } else {
      setCidades([]);
      setCity('');
    }
  }, [state]);

  const weekDays = [
    { key: 'monday', label: 'Segunda' },
    { key: 'tuesday', label: 'Terça' },
    { key: 'wednesday', label: 'Quarta' },
    { key: 'thursday', label: 'Quinta' },
    { key: 'friday', label: 'Sexta' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ];

  const periods = [
    { key: 'morning' as const, label: 'Manhã' },
    { key: 'afternoon' as const, label: 'Tarde' },
    { key: 'evening' as const, label: 'Noite' },
  ];

  const toggleAvailability = (day: string, period: 'morning' | 'afternoon' | 'evening') => {
    setAvailability((prev) => {
      const dayAvailability = prev[day] || [];
      const isSelected = dayAvailability.includes(period);

      return {
        ...prev,
        [day]: isSelected
          ? dayAvailability.filter((p) => p !== period)
          : [...dayAvailability, period],
      };
    });
  };

  const selectAllPeriods = (period: 'morning' | 'afternoon' | 'evening') => {
    setAvailability((prev) => {
      const newAvailability = { ...prev };
      weekDays.forEach(({ key }) => {
        const dayAvailability = newAvailability[key] || [];
        if (!dayAvailability.includes(period)) {
          newAvailability[key] = [...dayAvailability, period];
        }
      });
      return newAvailability;
    });
  };

  const clearAll = () => {
    setAvailability({
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    // TODO: Integrar com Supabase Auth e criar player
    const playerData = {
      email,
      password,
      fullName,
      phone,
      gender,
      birthDate,
      preferredSide,
      dominantHand,
      initialCategory,
      state,
      city,
      availability,
    };

    console.log('Registrando jogador:', playerData);

    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 1500);
  };

  const canProceed = () => {
    if (step === 1) {
      return email && password && confirmPassword && password === confirmPassword;
    }
    if (step === 2) {
      return fullName && phone && gender && birthDate;
    }
    if (step === 3) {
      return preferredSide && dominantHand && initialCategory && state && city;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 px-4 pb-6" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : navigate('/login'))}
            className="p-2 -ml-2 active:bg-white/10 rounded-full transition-colors touch-manipulation"
          >
            <ChevronLeft size={24} className="text-white" />
          </button>
          <h1 className="text-xl font-black text-white">Criar Conta</h1>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                s <= step ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 overflow-y-auto pb-24">
        {/* Step 1: Credenciais */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Suas credenciais</h2>
              <p className="text-gray-500 mb-6">Como você vai acessar sua conta</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Mail size={16} className="inline mr-1" />
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Lock size={16} className="inline mr-1" />
                Senha *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Lock size={16} className="inline mr-1" />
                Confirmar Senha *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Digite a senha novamente"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-red-600 mt-1">As senhas não coincidem</p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Dados Pessoais */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Dados pessoais</h2>
              <p className="text-gray-500 mb-6">Conte-nos um pouco sobre você</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <User size={16} className="inline mr-1" />
                Nome Completo *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <Phone size={16} className="inline mr-1" />
                Telefone com DDD *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(XX) XXXXX-XXXX"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Gênero *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              >
                <option value="">Selecione</option>
                <option value="male">Masculino</option>
                <option value="female">Feminino</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <CalendarIcon size={16} className="inline mr-1" />
                Data de Nascimento *
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {/* Step 3: Perfil de Jogador */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Perfil de jogador</h2>
              <p className="text-gray-500 mb-6">Informações sobre seu estilo de jogo</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Lado de Preferência *</label>
              <select
                value={preferredSide}
                onChange={(e) => setPreferredSide(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              >
                <option value="">Selecione</option>
                <option value="left">Esquerda</option>
                <option value="right">Direita</option>
                <option value="both">Ambos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mão Dominante *</label>
              <select
                value={dominantHand}
                onChange={(e) => setDominantHand(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              >
                <option value="">Selecione</option>
                <option value="left">Canhoto</option>
                <option value="right">Destro</option>
                <option value="ambidextrous">Ambidestro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Categoria Inicial *</label>
              <select
                value={initialCategory}
                onChange={(e) => setInitialCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              >
                <option value="">Selecione sua categoria</option>
                <option value="beginner">Iniciante</option>
                <option value="1">1ª</option>
                <option value="2">2ª</option>
                <option value="3">3ª</option>
                <option value="4">4ª</option>
                <option value="5">5ª</option>
                <option value="6">6ª</option>
                <option value="7">7ª</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Seus primeiros 5 jogos terão impacto maior no ranking
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Estado *</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              >
                <option value="">Selecione o estado</option>
                {estados.map((estado) => (
                  <option key={estado.id} value={estado.sigla}>
                    {estado.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Cidade *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!state || loadingCidades}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">
                  {!state
                    ? 'Selecione um estado primeiro'
                    : loadingCidades
                      ? 'Carregando cidades...'
                      : 'Selecione a cidade'}
                </option>
                {cidades.map((cidade) => (
                  <option key={cidade.id} value={cidade.nome}>
                    {cidade.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Disponibilidade */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Disponibilidade Semanal</h2>
              <p className="text-gray-500 mb-6">Quando você costuma jogar?</p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => selectAllPeriods('morning')}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold"
              >
                Todas Manhãs
              </button>
              <button
                onClick={() => selectAllPeriods('afternoon')}
                className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold"
              >
                Todas Tardes
              </button>
              <button
                onClick={() => selectAllPeriods('evening')}
                className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-bold"
              >
                Todas Noites
              </button>
              <button onClick={clearAll} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                Limpar
              </button>
            </div>

            {/* Availability Grid */}
            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-4 bg-gray-50 border-b-2 border-gray-200">
                <div className="p-3 text-xs font-bold text-gray-600"></div>
                {periods.map((period) => (
                  <div key={period.key} className="p-3 text-xs font-bold text-gray-600 text-center">
                    {period.label}
                  </div>
                ))}
              </div>

              {/* Days */}
              {weekDays.map((day, index) => (
                <div
                  key={day.key}
                  className={`grid grid-cols-4 ${index < weekDays.length - 1 ? 'border-b border-gray-200' : ''}`}
                >
                  <div className="p-3 text-sm font-bold text-gray-700">{day.label}</div>
                  {periods.map((period) => {
                    const isSelected = availability[day.key]?.includes(period.key);
                    return (
                      <button
                        key={period.key}
                        onClick={() => toggleAvailability(day.key, period.key)}
                        className={`p-3 text-center transition-colors touch-manipulation ${
                          isSelected
                            ? period.key === 'morning'
                              ? 'bg-blue-100 text-blue-700'
                              : period.key === 'afternoon'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-gray-800 text-white'
                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <div className="flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl active:scale-[0.98] transition-transform touch-manipulation"
            >
              Voltar
            </button>
          )}
          <button
            onClick={() => (step < 4 ? setStep(step + 1) : handleSubmit())}
            disabled={!canProceed() || isLoading}
            className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl active:scale-[0.98] transition-transform touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Criando conta...' : step < 4 ? 'Continuar' : 'Começar a Jogar →'}
          </button>
        </div>
      </div>
    </div>
  );
};
