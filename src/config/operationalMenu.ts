import {
    Users,
    ShoppingCart,
    Truck,
    Settings,
    Shield,
    Briefcase,
    MapPin,
    FileText,
    CreditCard,
    Globe,
    Smartphone,
    Database,
    RefreshCw,
    Lock,
    Building
} from 'lucide-react';

export interface MenuItem {
    id: string;
    label: string;
    icon?: any;
    code?: string; // ACL Code
    children?: MenuItem[];
}

export const operationalMenu: MenuItem[] = [
    {
        id: 'CADASTROS',
        label: 'Cadastros',
        icon: Users,
        code: 'OP_CAD',
        children: [
            { id: 'CLIENTES', label: 'Clientes', code: 'OP_CAD_CLIENTES' },
            { id: 'FORNECEDORES', label: 'Fornecedores', code: 'OP_CAD_FORNECEDORES' },
            { id: 'VENDEDORES', label: 'Vendedores', code: 'OP_CAD_VENDEDORES' },
            { id: 'FUNCIONARIOS', label: 'Funcionários', code: 'OP_CAD_FUNCIONARIOS' }, // Link p/ Colaboradores
            { id: 'MOTORISTAS', label: 'Motoristas', code: 'OP_CAD_MOTORISTAS' },
            { id: 'TRANSPORTADORAS', label: 'Transportadoras', code: 'OP_CAD_TRANSPORTADORAS' },
            { id: 'CIDADES', label: 'Cidades', code: 'OP_CAD_CIDADES' },
            { id: 'SETORES', label: 'Setores', code: 'OP_CAD_SETORES' },
            { id: 'ESTADOS', label: 'Estados', code: 'OP_CAD_ESTADOS' },
            { id: 'ATIVIDADE_PRINCIPAL', label: 'Atividade Principal', code: 'OP_CAD_ATIVIDADE' },
            { id: 'EMAIL', label: 'Email', code: 'OP_CAD_EMAIL' },
            { id: 'EVENTOS_PESSOA', label: 'Eventos de Pessoa', code: 'OP_CAD_EVENTOS' },
            { id: 'CANAL_SEGMENTACAO', label: 'Canal Seg. Mercado', code: 'OP_CAD_CANAL' },
            { id: 'ROTEIRO', label: 'Roteiro de Atendimento', code: 'OP_CAD_ROTEIRO' },
        ]
    },
    {
        id: 'COMERCIAL',
        label: 'Comercial',
        icon: ShoppingCart,
        code: 'OP_COM',
        children: [
            { id: 'VENDAS', label: 'Vendas', code: 'OP_COM_VENDAS' },
            { id: 'GRUPO_CLIENTE', label: 'Grupo de Cliente', code: 'OP_COM_GRP_CLIENTE' },
            { id: 'CONDICAO_PAGAMENTO', label: 'Condição de Pagamento', code: 'OP_COM_COND_PAGTO' },
            { id: 'MACRO_REGIAO', label: 'Macro Região', code: 'OP_COM_MACRO_REGIAO' },
            { id: 'AREA_COMERCIAL', label: 'Área Comercial', code: 'OP_COM_AREA_COM' },
            { id: 'FUNCAO_COMERCIAL', label: 'Função Comercial', code: 'OP_COM_FUNC_COM' },
            { id: 'PERFIL_COMISSAO', label: 'Perfil de Comissão', code: 'OP_COM_PERFIL_COM' },
            { id: 'USUARIOS_MOBILE', label: 'Usuários Mobile', code: 'OP_COM_USR_MOBILE' },
            { id: 'TAREFAS_MOBILE', label: 'Tarefas Mobile', code: 'OP_COM_TASK_MOBILE' },
            { id: 'AREA_PROMOTOR', label: 'Area Comercial Promotor', code: 'OP_COM_AREA_PROMOTOR' },
            { id: 'JUSTIFICATIVA_PROMOTOR', label: 'Justificativa Promotor', code: 'OP_COM_JUST_PROMOTOR' },
            { id: 'USUARIO_WEB', label: 'Usuário Web', code: 'OP_COM_USR_WEB' },
            { id: 'SOLICITACOES_ALTERACAO', label: 'Solicitações de Alteração', code: 'OP_COM_SOL_ALT' },
            { id: 'TRANSFERENCIA_CLIENTES', label: 'Transferência de Clientes', code: 'OP_COM_TRANSF_CLI' },
            { id: 'MANUTENCAO_ROTEIRO', label: 'Manutenção de Roteiro', code: 'OP_COM_MANT_ROTEIRO' },
            { id: 'LIB_CLIENTE_ROTEIRO', label: 'Liberação Cliente Roteiro', code: 'OP_COM_LIB_CLI_ROT' },
            { id: 'LIB_VENDEDOR_ROTEIRO', label: 'Liberação Vendedor Roteiro', code: 'OP_COM_LIB_VEND_ROT' },
        ]
    },
    {
        id: 'MOVIMENTACOES',
        label: 'Movimentações',
        icon: Truck,
        code: 'OP_MOV',
        children: [
            { id: 'MOV_FUNCIONARIOS', label: 'Movimentação de Funcionários', code: 'OP_MOV_FUNC' },
        ]
    },
    {
        id: 'INTEGRADOR',
        label: 'Integrador de Plataforma',
        icon: Globe,
        code: 'OP_INT',
        children: [
            { id: 'INTEGRADOR_PLAT', label: 'Integrador Plataforma', code: 'OP_INT_PLAT' },
        ]
    },
    {
        id: 'SEGURANCA',
        label: 'Segurança',
        icon: Shield,
        code: 'OP_SEG',
        children: [
            { id: 'ACESSO_FORMS', label: 'Acesso / Formulários', code: 'OP_SEG_FORMS' },
            { id: 'USUARIOS', label: 'Usuários', code: 'OP_SEG_USUARIOS' },
            { id: 'ATUALIZACAO_EMPRESA', label: 'Atualização Empresa', code: 'OP_SEG_UPD_EMP' },
            { id: 'LOG_ACESSO', label: 'Usuário - Log de Acesso', code: 'OP_SEG_LOGS' },
        ]
    },
    {
        id: 'EMPRESA',
        label: 'Empresa',
        icon: Building,
        code: 'OP_EMP',
        children: [
            { id: 'TROCAR_EMPRESA', label: 'Trocar a Empresa', code: 'OP_EMP_TROCA' },
            { id: 'VERSOES_SISTEMA', label: 'Versões do Sistema', code: 'OP_EMP_VERSOES' },
        ]
    }
];
