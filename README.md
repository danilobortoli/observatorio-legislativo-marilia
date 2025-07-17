# Observatório Legislativo MATRA - Marília Transparente

Sistema de rankeamento e avaliação da atividade legislativa dos vereadores da Câmara Municipal de Marília.

## 📋 Sobre o Sistema

O **Observatório Legislativo MATRA** é um sistema desenvolvido para monitorar e avaliar a atividade legislativa dos vereadores da Câmara Municipal de Marília. O sistema permite:

- **Registrar atividades legislativas** (indicações, requerimentos, projetos de lei, votações)
- **Calcular pontuações** baseadas em critérios objetivos
- **Gerar rankings** dos vereadores mais ativos
- **Produzir relatórios** detalhados sobre as atividades
- **Visualizar dados** através de gráficos e dashboards

## 🛠️ Tecnologia

O sistema é desenvolvido em **Google Apps Script** e funciona inteiramente no **Google Sheets**, proporcionando:

- ✅ **Acesso fácil** via navegador
- ✅ **Colaboração em tempo real**
- ✅ **Backup automático** na nuvem
- ✅ **Interface intuitiva**
- ✅ **Sem custos de hospedagem**

## 🏛️ Vereadores Monitorados

O sistema monitora os seguintes vereadores da Câmara Municipal de Marília:

1. **Danilo da Saúde** - PSDB
2. **Dr. Elio Ajeka** - PP
3. **Fabiana Camarinha** - PODE
4. **Professor Galdino da Unimar** - CIDADANIA
5. **Guilherme Burcão** - DC
6. **João do Bar** - PSD
7. **Chico do Açougue** - AVANTE
8. **Luiz Eduardo Nardi** - CIDADANIA
9. **Marcos Custódio** - PSDB
10. **Mauro Cruz** - SOLIDARIEDADE
11. **Agente Federal Junior Féfin** - UNIÃO
12. **Delegada Rossana Camacho** - PSD
13. **Professora Daniela** - PL
14. **Thiaguinho** - PP
15. **Vânia Ramos** - REPUBLICANOS
16. **Wellington Corredato/Batata** - PP
17. **Delegado Wilson Damasceno** - PL

## 📊 Sistema de Pontuação

### Indicações
- **Básica**: 0.1 ponto
- **Com princípios MATRA**: até 3 pontos

### Requerimentos
- **Básico**: 0.1 ponto
- **Com princípios MATRA**: até 3 pontos

### Projetos de Lei
- **Básico**: 0.2 ponto
- **Com princípios MATRA**: -5 a +5 pontos

### Votações
- **Pontuação**: -4 a +4 pontos

## 📁 Estrutura do Projeto

```
observatorio-legislativo-marilia/
├── codigo.gs                    # Código principal do sistema
├── FormularioRegistro.html      # Formulário de registro de sessões
├── FormularioPropositura.html   # Formulário de proposituras avulsas
├── README.md                    # Documentação do projeto
├── LICENSE                      # Licença MIT
└── .gitignore                   # Arquivos ignorados pelo Git
```

## 🚀 Como Instalar

1. **Acesse o Google Sheets** e crie uma nova planilha
2. **Vá para Extensões > Apps Script**
3. **Cole o código** do arquivo `codigo.gs` no editor
4. **Crie os arquivos HTML**:
   - `FormularioRegistro.html`
   - `FormularioPropositura.html`
5. **Salve o projeto** e **execute a função** `inicializarSistema()`

### Primeira Execução

1. Execute `inicializarSistema()` no Apps Script
2. Autorize as permissões necessárias
3. O sistema criará automaticamente todas as planilhas necessárias
4. Acesse o menu **MATRA** na planilha para usar o sistema

## 📖 Como Usar

### Dashboard Principal
- **Visualização em tempo real** dos rankings
- **Estatísticas gerais** do sistema
- **Gráficos interativos** dos dados

### Registrar Atividades
1. Use o menu **MATRA > Registrar Nova Sessão**
2. Preencha os dados da atividade legislativa
3. Selecione o vereador e tipo de atividade
4. Atribua a pontuação conforme critérios
5. Salve o registro

### Proposituras Avulsas
1. Use o menu **MATRA > Registrar Propositura**
2. Para proposituras fora de sessões regulares
3. Mesmo processo de pontuação

### Relatórios
1. Use o menu **MATRA > Gerar Relatório**
2. Cria uma nova planilha com dados detalhados
3. Inclui ranking e detalhamento por vereador

## 🔧 Funcionalidades

### ✅ Implementadas
- [x] Sistema de vereadores e partidos
- [x] Registro de sessões legislativas
- [x] Registro de proposituras avulsas
- [x] Cálculo automático de pontuações
- [x] Ranking dinâmico dos vereadores
- [x] Dashboard com estatísticas
- [x] Geração de relatórios
- [x] Gráficos de visualização
- [x] Sistema de backup
- [x] Interface HTML para formulários

### 🔄 Melhorias Futuras
- [ ] Integração com sistema oficial da Câmara
- [ ] Análise de tendências temporais
- [ ] Notificações automáticas
- [ ] Export para outros formatos
- [ ] API para acesso externo
- [ ] Versão mobile otimizada

## 🎯 Princípios MATRA

O sistema avalia as atividades legislativas baseando-se nos princípios da **MATRA - Marília Transparente**:

- **Transparência**: Acesso público às informações
- **Participação**: Engajamento da sociedade civil
- **Accountability**: Prestação de contas dos mandatos
- **Eficiência**: Otimização dos recursos públicos
- **Inovação**: Uso de tecnologia para melhorar a gestão

## 👥 Contribuições

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

**MATRA - Marília Transparente**
- Website: [em desenvolvimento]
- Email: [em desenvolvimento]
- Versão: 1.0

---

*Desenvolvido para promover a transparência e accountability na política municipal de Marília/SP*