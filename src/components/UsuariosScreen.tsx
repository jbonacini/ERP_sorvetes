import { useState, useEffect } from 'react';
import { dbService, db } from '../services/api';
import { Usuario, PerfilAcesso } from '@/types';
import { Users, Plus, Save, X, Search, UserCheck, Shield, Key, Mail, Briefcase, Lock, CheckSquare } from 'lucide-react';
import { LayoutWrapper } from './ui/LayoutWrapper';
import { GlassCard } from './ui/GlassCard';
import { ModernButton } from './ui/ModernButton';
import { ModernInput } from './ui/ModernInput';
import { operationalMenu } from '../config/operationalMenu';

export function UsuariosScreen({ embedded = false }: { embedded?: boolean }) {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [perfis, setPerfis] = useState<PerfilAcesso[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<Partial<Usuario> & { permissoes?: string[] } | null>(null);
    const [activeTab, setActiveTab] = useState<'DADOS' | 'AUTORIDADES'>('DADOS');

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        setLoading(true);
        try {
            const [usersData, perfisData] = await Promise.all([
                dbService.adminService.listarUsuarios(),
                dbService.adminService.listarPerfis()
            ]);
            setUsuarios(usersData);
            setPerfis(perfisData);
        } catch (e) {
            console.error("Erro ao carregar dados", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editingUser?.nome || !editingUser.email || !editingUser.senha) return alert('Preencha os campos obrigatórios');

        try {
            await dbService.adminService.criarUsuario({
                ...editingUser,
                empresaId: db.empresaAtual?.id
            } as any);
            setEditingUser(null);
            carregarDados();
        } catch (e) {
            console.error(e);
            alert('Erro ao salvar usuário');
        }
    };

    return (
        <LayoutWrapper title="Gestão de Usuários" subtitle="Administre os acessos e colaboradores" embedded={embedded}>

            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6">
                <div className="w-full md:w-96">
                    <ModernInput
                        placeholder="Buscar usuário..."
                        icon={<Search size={18} className="text-blue-200/50" />}
                    />
                </div>
                <ModernButton
                    onClick={() => {
                        setEditingUser({ nome: '', email: '', senha: '', status: 'ATIVO', permissoes: [] });
                        setActiveTab('DADOS');
                    }}
                    icon={Plus}
                >
                    Novo Usuário
                </ModernButton>
            </div>

            {/* Grid de Cards de Usuários */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-3 text-center text-white/50 p-12">Carregando usuários...</div>
                ) : usuarios.map(user => {
                    const perfilNome = perfis.find(p => p.id === user.perfilId)?.nome || 'Sem Perfil';
                    return (
                        <GlassCard key={user.id} className="flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group" onClick={() => setEditingUser(user)}>
                            <div className="w-14 h-14 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-xl border border-indigo-500/30 group-hover:scale-105 transition-transform">
                                {user.nome.charAt(0)}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h3 className="font-bold text-white truncate group-hover:text-indigo-200 transition-colors">{user.nome}</h3>
                                <p className="text-sm text-blue-100/60 truncate flex items-center gap-1">
                                    <Mail size={12} /> {user.email}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full font-medium border border-blue-500/20 flex items-center gap-1">
                                        <Shield size={10} /> {perfilNome}
                                    </span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border flex items-center gap-1 ${user.status === 'ATIVO' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/20' : 'bg-red-500/20 text-red-300 border-red-500/20'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ATIVO' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                                        {user.status}
                                    </span>
                                </div>
                            </div>
                        </GlassCard>
                    );
                })}
            </div>

            {/* Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <GlassCard className="w-full max-w-lg p-0 flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <UserCheck className="text-indigo-400" />
                                {editingUser.id ? 'Editar Usuário' : 'Novo Usuário'}
                            </h2>
                            <button onClick={() => setEditingUser(null)} className="text-white/50 hover:text-white transition-colors"><X size={24} /></button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-white/10">
                            <button
                                onClick={() => setActiveTab('DADOS')}
                                className={`flex-1 p-3 text-sm font-bold transition-colors ${activeTab === 'DADOS' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-white/5' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                            >
                                Dados Cadastrais
                            </button>
                            <button
                                onClick={() => setActiveTab('AUTORIDADES')}
                                className={`flex-1 p-3 text-sm font-bold transition-colors ${activeTab === 'AUTORIDADES' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-white/5' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                            >
                                Autoridades (Acessos)
                            </button>
                        </div>

                        <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                            {activeTab === 'DADOS' ? (
                                <>
                                    <ModernInput
                                        label="Nome Completo"
                                        icon={<Users size={16} />}
                                        value={editingUser.nome || ''}
                                        onChange={e => setEditingUser({ ...editingUser, nome: e.target.value })}
                                    />

                                    <ModernInput
                                        label="E-mail"
                                        type="email"
                                        icon={<Mail size={16} />}
                                        value={editingUser.email || ''}
                                        onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                                    />

                                    <ModernInput
                                        label="Senha (Inicial)"
                                        type="password"
                                        icon={<Key size={16} />}
                                        value={editingUser.senha || ''}
                                        onChange={e => setEditingUser({ ...editingUser, senha: e.target.value })}
                                    />

                                    <div>
                                        <label className="block text-sm font-medium text-blue-200 mb-1.5 ml-1">Perfil de Acesso</label>
                                        <div className="relative">
                                            <Shield className="absolute left-3 top-3.5 text-white/50 pointer-events-none" size={16} />
                                            <select
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white focus:outline-none focus:bg-black/40 focus:ring-2 focus:ring-indigo-500/50 appearance-none option:bg-slate-800 transition-all placeholder-white/30"
                                                value={editingUser.perfilId || ''}
                                                onChange={e => setEditingUser({ ...editingUser, perfilId: e.target.value })}
                                            >
                                                <option value="" className="bg-slate-800 text-gray-400">Selecione um perfil...</option>
                                                {perfis.map(p => (
                                                    <option key={p.id} value={p.id} className="bg-slate-800">{p.nome}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <ModernInput
                                        label="Cargo"
                                        icon={<Briefcase size={16} />}
                                        value={editingUser.cargo || ''}
                                        onChange={e => setEditingUser({ ...editingUser, cargo: e.target.value })}
                                        placeholder="Ex: Vendedor"
                                    />
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-lg flex items-start gap-3">
                                        <Lock className="shrink-0 text-blue-400 mt-0.5" size={16} />
                                        <p className="text-xs text-blue-200">
                                            Selecione as telas que este usuário pode acessar. Se o usuário for <b>Administrador</b> ou <b>Gerente</b>, ele terá acesso total independentemente destas configurações.
                                        </p>
                                    </div>

                                    <div className="space-y-1">
                                        {operationalMenu.map(category => (
                                            <div key={category.id} className="border border-white/10 rounded-xl overflow-hidden bg-black/20">
                                                {/* Header da Categoria */}
                                                <div className="p-3 bg-white/5 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {category.icon && <category.icon size={16} className="text-white/70" />}
                                                        <span className="font-bold text-sm text-white">{category.label}</span>
                                                    </div>
                                                    {category.code && (
                                                        <button
                                                            onClick={() => {
                                                                const hasAccess = editingUser.permissoes?.includes(category.code!);
                                                                let newPerms = editingUser.permissoes || [];
                                                                if (hasAccess) {
                                                                    newPerms = newPerms.filter(p => p !== category.code);
                                                                    // Remove children too? Maybe logic for separate button
                                                                } else {
                                                                    newPerms = [...newPerms, category.code!];
                                                                }
                                                                setEditingUser({ ...editingUser, permissoes: newPerms });
                                                            }}
                                                            className="text-xs text-white/50 hover:text-white"
                                                        >
                                                            {/* Checkbox visual logic handles by children mostly, but category can have code too */}
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Lista de Subitens */}
                                                <div className="p-2 grid grid-cols-1 gap-1">
                                                    {category.children?.map(child => {
                                                        const isChecked = editingUser.permissoes?.includes(child.code || '');
                                                        return (
                                                            <button
                                                                key={child.id}
                                                                onClick={() => {
                                                                    if (!child.code) return;
                                                                    let newPerms = [...(editingUser.permissoes || [])];
                                                                    if (isChecked) {
                                                                        newPerms = newPerms.filter(p => p !== child.code);
                                                                    } else {
                                                                        newPerms.push(child.code);
                                                                    }
                                                                    setEditingUser({ ...editingUser, permissoes: newPerms });
                                                                }}
                                                                className={`flex items-center gap-3 p-2 rounded-lg transition-colors text-left ${isChecked ? 'bg-indigo-500/20 border border-indigo-500/30' : 'hover:bg-white/5 border border-transparent'}`}
                                                            >
                                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-indigo-500 border-indigo-500' : 'border-white/30 bg-black/40'}`}>
                                                                    {isChecked && <CheckSquare size={14} className="text-white" />}
                                                                </div>
                                                                <div>
                                                                    <span className={`text-sm font-medium ${isChecked ? 'text-white' : 'text-white/70'}`}>{child.label}</span>
                                                                    <p className="text-[10px] text-white/30 font-mono">{child.code}</p>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-white/5 border-t border-white/10 flex justify-end gap-3 rounded-b-2xl">
                            <ModernButton variant="secondary" onClick={() => setEditingUser(null)}>
                                Cancelar
                            </ModernButton>
                            <ModernButton onClick={handleSave} icon={Save}>
                                Salvar Usuário
                            </ModernButton>
                        </div>
                    </GlassCard>
                </div>
            )}
        </LayoutWrapper>
    );
}
