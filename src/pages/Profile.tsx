import { useUserProfile } from '../hooks/useUserProfile';
import { LoadingPage } from '../components/ui/LoadingSpinner';
import { ErrorPage } from '../components/ui/ErrorMessage';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Award,
  Settings,
  LogOut,
  Bell,
  CreditCard,
  HelpCircle,
  Shield
} from 'lucide-react';

export const Profile = () => {
  const { data: user, isLoading, error, refetch } = useUserProfile();

  if (isLoading) return <LoadingPage message="Carregando perfil..." />;
  if (error) return <ErrorPage message="Erro ao carregar perfil" onRetry={() => refetch()} />;

  // Dados de exemplo para quando a API não retornar
  const displayUser = user || {
    name: 'Gabriel',
    email: 'gabriel@example.com',
    phone: '(11) 98765-4321',
    skill_level: 'intermediate' as const,
    bio: 'Apaixonado por padel e sempre em busca de novos desafios!'
  };

  const getSkillLabel = (level?: string) => {
    switch (level) {
      case 'beginner':
        return 'Iniciante';
      case 'intermediate':
        return 'Intermediário';
      case 'advanced':
        return 'Avançado';
      case 'professional':
        return 'Profissional';
      default:
        return 'Não definido';
    }
  };

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      {/* Header com Avatar */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
            {displayUser.avatar ? (
              <img src={displayUser.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white">{displayUser.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Award size={16} className="text-white/80" />
              <span className="text-sm font-medium text-white/90">
                {getSkillLabel(displayUser.skill_level)}
              </span>
            </div>
          </div>
        </div>

        {displayUser.bio && (
          <p className="text-sm text-white/90 mt-4 font-medium leading-relaxed">
            {displayUser.bio}
          </p>
        )}
      </div>

      <div className="p-4 space-y-6 -mt-4">
        {/* Informações Pessoais */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <h2 className="text-sm font-bold text-gray-500 uppercase px-4 pt-4 pb-2">
            Informações Pessoais
          </h2>
          <div className="divide-y divide-gray-100">
            <InfoRow icon={<Mail size={20} />} label="Email" value={displayUser.email} />
            {displayUser.phone && (
              <InfoRow icon={<Phone size={20} />} label="Telefone" value={displayUser.phone} />
            )}
            <InfoRow
              icon={<Calendar size={20} />}
              label="Membro desde"
              value={displayUser.created_at ? new Date(displayUser.created_at).toLocaleDateString('pt-BR') : 'Recente'}
            />
          </div>
        </section>

        {/* Configurações */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <h2 className="text-sm font-bold text-gray-500 uppercase px-4 pt-4 pb-2">
            Configurações
          </h2>
          <div className="divide-y divide-gray-100">
            <MenuButton icon={<Settings size={20} />} label="Editar Perfil" />
            <MenuButton icon={<Bell size={20} />} label="Notificações" />
            <MenuButton icon={<CreditCard size={20} />} label="Pagamentos" />
            <MenuButton icon={<Shield size={20} />} label="Privacidade e Segurança" />
            <MenuButton icon={<HelpCircle size={20} />} label="Ajuda e Suporte" />
          </div>
        </section>

        {/* Ações */}
        <section>
          <button className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl font-bold border border-red-100 active:bg-red-100">
            <LogOut size={20} />
            Sair
          </button>
        </section>

        {/* Versão do App */}
        <div className="text-center text-sm text-gray-400 pb-4">
          Climb Mobile v1.0.0
        </div>
      </div>
    </div>
  );
};

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <div className="flex items-center gap-3 px-4 py-3">
    <div className="text-blue-600">{icon}</div>
    <div className="flex-1">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <p className="text-sm text-gray-900 font-bold">{value}</p>
    </div>
  </div>
);

interface MenuButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const MenuButton = ({ icon, label, onClick }: MenuButtonProps) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 active:bg-gray-50 transition-colors"
  >
    <div className="text-gray-600">{icon}</div>
    <span className="flex-1 text-left text-sm font-bold text-gray-900">{label}</span>
    <div className="text-gray-400">›</div>
  </button>
);
