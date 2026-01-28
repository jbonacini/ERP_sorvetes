import { useState, useEffect } from 'react';
import { db } from '../services/api';
import { GlassSidebar } from './ui/GlassSidebar';
import { operationalMenu, MenuItem } from '../config/operationalMenu';
// import { LayoutWrapper } from './ui/LayoutWrapper'; // Removido para layout Full Screen

// Telas Específicas
import { ClientesScreen } from './ClientesScreen';
import { VendedoresScreen } from './VendedoresScreen';
import { FuncionariosScreen } from './FuncionariosScreen';
import { ColaboradoresScreen } from './ColaboradoresScreen';
import { VendasScreen } from './VendasScreen';
import { GenericEntityScreen } from './GenericEntityScreen';
import { UsuariosScreen } from './UsuariosScreen';
import { MotoristasScreen } from './MotoristasScreen';
import { TransportadorasScreen } from './TransportadorasScreen';

import { FuncoesComerciaisScreen } from './FuncoesComerciaisScreen';
import { AreasComerciaisScreen } from './AreasComerciaisScreen';

import { Settings, Users, Truck, ShoppingBag, MapPin, Package, FileText, ChevronRight, Menu } from 'lucide-react';

interface OperationalModuleProps {
    onBack: () => void;
}

export function OperationalModule({ onBack }: OperationalModuleProps) {
    const [activeItem, setActiveItem] = useState<string>('');

    useEffect(() => {
        // Define default screen if none active
        // setActiveItem('CLIENTES'); 
    }, []);

    const handleSelect = (item: MenuItem) => {
        setActiveItem(item.id);
        // Find parent for breadcrumb - logic kept but state removed for now as it was unused visual
        // const parent = operationalMenu.find(cat => cat.children?.some(child => child.id === item.id));
    };

    const renderContent = () => {
        switch (activeItem) {
            // --- CADASTROS ---
            case 'CLIENTES': return <ClientesScreen embedded={true} />;
            case 'FUNCIONARIOS': return <FuncionariosScreen />;
            case 'VENDEDORES': return <VendedoresScreen />;
            case 'FORNECEDORES': return <GenericEntityScreen title="Fornecedores" entityName="Fornecedor" />;
            case 'MOTORISTAS': return <MotoristasScreen />;
            case 'TRANSPORTADORAS': return <TransportadorasScreen />;
            case 'CIDADES': return <GenericEntityScreen title="Cidades" entityName="Cidade" />;
            case 'SETORES': return <GenericEntityScreen title="Setores" entityName="Setor" />;
            case 'ESTADOS': return <GenericEntityScreen title="Estados" entityName="Estado" />;
            case 'ATIVIDADE_PRINCIPAL': return <GenericEntityScreen title="Atividade Principal" entityName="Atividade" />;
            case 'EMAIL': return <GenericEntityScreen title="Email" entityName="Configuração de Email" />;
            case 'EVENTOS_PESSOA': return <GenericEntityScreen title="Eventos de Pessoa" entityName="Evento" />;
            case 'CANAL_SEGMENTACAO': return <GenericEntityScreen title="Canal Seg. Mercado" entityName="Canal" />;
            case 'ROTEIRO': return <GenericEntityScreen title="Roteiro de Atendimento" entityName="Roteiro" />;

            // --- COMERCIAL ---
            case 'VENDAS': return <VendasScreen embedded={true} />; // VendasScreen ainda não aceita embedded, precisamos checar ou assumir que GenericEntityScreen não precisa
            case 'GRUPO_CLIENTE': return <GenericEntityScreen title="Grupo de Cliente" entityName="Grupo" />;
            case 'CONDICAO_PAGAMENTO': return <GenericEntityScreen title="Condição de Pagamento" entityName="Condição" />; // Existe screen especifica mas Generic serve por hora
            case 'MACRO_REGIAO': return <GenericEntityScreen title="Macro Região" entityName="Região" />;
            case 'AREA_COMERCIAL': return <AreasComerciaisScreen />;
            case 'FUNCAO_COMERCIAL': return <FuncoesComerciaisScreen />;
            case 'PERFIL_COMISSAO': return <GenericEntityScreen title="Perfil de Comissão" entityName="Perfil" />;
            case 'USUARIOS_MOBILE': return <GenericEntityScreen title="Usuários Mobile" entityName="Usuário" />;
            case 'TAREFAS_MOBILE': return <GenericEntityScreen title="Tarefas Mobile" entityName="Tarefa" />;
            case 'AREA_PROMOTOR': return <GenericEntityScreen title="Area Comercial Promotor" entityName="Área" />;
            case 'JUSTIFICATIVA_PROMOTOR': return <GenericEntityScreen title="Justificativa Promotor" entityName="Justificativa" />;
            case 'USUARIO_WEB': return <GenericEntityScreen title="Usuário Web" entityName="Usuário" />;
            case 'SOLICITACOES_ALTERACAO': return <GenericEntityScreen title="Solicitações de Alteração" entityName="Solicitação" />;
            case 'TRANSFERENCIA_CLIENTES': return <GenericEntityScreen title="Transferência de Clientes" entityName="Transferência" />;
            case 'MANUTENCAO_ROTEIRO': return <GenericEntityScreen title="Manutenção de Roteiro" entityName="Manutenção" />;
            case 'LIB_CLIENTE_ROTEIRO': return <GenericEntityScreen title="Liberação Cliente Roteiro" entityName="Liberação" />;
            case 'LIB_VENDEDOR_ROTEIRO': return <GenericEntityScreen title="Liberação Vendedor Roteiro" entityName="Liberação" />;

            // --- MOVIMENTAÇÕES ---
            case 'MOV_FUNCIONARIOS': return <GenericEntityScreen title="Movimentação de Funcionários" entityName="Movimentação" />;

            // --- INTEGRADOR ---
            case 'INTEGRADOR_PLAT': return <GenericEntityScreen title="Integrador de Plataforma" entityName="Configuração" />;

            // --- SEGURANÇA ---
            case 'ACESSO_FORMS': return <GenericEntityScreen title="Acesso / Formulários" entityName="Formulário" />;
            case 'USUARIOS': return <UsuariosScreen embedded={true} />; // Reusando a tela de Usuarios existente
            case 'ATUALIZACAO_EMPRESA': return <GenericEntityScreen title="Atualização Empresa" entityName="Empresa" />;
            case 'LOG_ACESSO': return <GenericEntityScreen title="Log de Acesso" entityName="Log" />;

            // --- EMPRESA ---
            case 'TROCAR_EMPRESA': return <GenericEntityScreen title="Trocar Empresa" entityName="Empresa" />;
            case 'VERSOES_SISTEMA': return <GenericEntityScreen title="Versões do Sistema" entityName="Versão" />;

            default:
                return (
                    <div className="h-full flex items-center justify-center text-white/50 flex-col">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <span className="text-4xl">🚀</span>
                        </div>
                        <h2 className="text-xl font-bold text-white">Bem-vindo ao Módulo Operacional</h2>
                        <p className="max-w-md text-center mt-2 text-blue-200/60">Selecione uma opção no menu lateral para começar.</p>
                    </div>
                );
        }
    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-slate-900 flex flex-row relative font-sans selection:bg-indigo-500/30">
            {/* Background Image Global */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=3270&auto=format&fit=crop"
                    alt="Background"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-indigo-900/40 mix-blend-multiply"></div>
            </div>

            {/* Sidebar Container */}
            <div className="relative z-10 h-full shrink-0 flex flex-col border-r border-white/10 bg-slate-900/50 backdrop-blur-xl">
                <GlassSidebar
                    items={operationalMenu}
                    activeItem={activeItem}
                    onSelect={handleSelect}
                    onBack={onBack}
                    logoTitle={db.empresaAtual?.nomeFantasia || db.empresaAtual?.razaoSocial || "Sua Empresa"}
                    logoSubtitle="Módulo Operacional"
                    className="h-full w-72 rounded-none border-none shadow-none bg-transparent" // Removendo estilos container do proprio sidebar para fluir melhor
                />
            </div>

            {/* Main Content Area - Full Screen */}
            <div className="relative z-10 flex-1 h-full overflow-hidden flex flex-col">
                {/* Header Superior (Opcional, pode ser embutido nas telas ou global) */}
                {/* <div className="h-16 border-b border-white/10 flex items-center px-8 bg-white/5 backdrop-blur-sm">
                    <h2 className="text-white font-medium">Módulo Operacional</h2>
                </div> */}

                {/* Área de Conteúdo Scrollável */}
                <div className="flex-1 overflow-auto relative p-0">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
