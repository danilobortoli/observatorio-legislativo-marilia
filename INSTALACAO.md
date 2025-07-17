# 🚀 Guia de Instalação - Observatório Legislativo MATRA

Este guia fornece instruções passo a passo para instalar e configurar o sistema de rankeamento de vereadores.

## 📋 Pré-requisitos

- Conta Google (Gmail)
- Acesso ao Google Sheets
- Navegador web atualizado
- Permissões para criar e executar scripts no Google Apps Script

## 🔧 Passo 1: Criar Nova Planilha Google

1. Acesse [Google Sheets](https://sheets.google.com)
2. Clique em **"Planilha em branco"**
3. Renomeie a planilha para: `Observatório Legislativo MATRA`

## 💻 Passo 2: Configurar Google Apps Script

1. Na planilha, vá para **Extensões > Apps Script**
2. Será aberto o editor do Google Apps Script
3. Exclua o código padrão (`function myFunction() {}`)

## 📝 Passo 3: Adicionar o Código Principal

1. Cole todo o conteúdo do arquivo `codigo.gs` no editor
2. Salve o projeto (Ctrl+S ou Cmd+S)
3. Nomeie o projeto como: `Observatório Legislativo MATRA`

## 🌐 Passo 4: Criar Arquivos HTML

### FormularioRegistro.html
1. No Apps Script, clique em **"+"** ao lado de "Arquivos"
2. Selecione **"HTML"**
3. Nomeie como: `FormularioRegistro`
4. Cole o conteúdo do arquivo `FormularioRegistro.html`
5. Salve o arquivo

### FormularioPropositura.html
1. Repita o processo anterior
2. Nomeie como: `FormularioPropositura`
3. Cole o conteúdo do arquivo `FormularioPropositura.html`
4. Salve o arquivo

## ⚙️ Passo 5: Configurar Permissões

1. No Apps Script, clique em **"Executar"** na função `inicializarSistema`
2. Será solicitada autorização - clique em **"Revisar permissões"**
3. Selecione sua conta Google
4. Clique em **"Avançado"**
5. Clique em **"Acessar Observatório Legislativo MATRA (não seguro)"**
6. Clique em **"Permitir"**

### Permissões Necessárias
O sistema precisa de permissões para:
- ✅ Visualizar e gerenciar suas planilhas do Google Drive
- ✅ Exibir e executar conteúdo da Web de terceiros
- ✅ Conectar-se a um serviço externo

## 🎉 Passo 6: Primeira Execução

1. Execute a função `inicializarSistema()` no Apps Script
2. Aguarde a execução (pode demorar alguns segundos)
3. Verifique se apareceu o alerta: "Sistema inicializado com sucesso!"
4. Volte para a planilha do Google Sheets

## 📊 Passo 7: Verificar Instalação

Na planilha, você deve ver:

### Abas Criadas
- **Dashboard** (aba principal)
- **Vereadores** (lista dos vereadores)
- **Sessões** (registro de sessões)
- **Pontuações** (pontuações detalhadas)
- **Configurações** (configurações do sistema)
- **Relatórios** (para relatórios gerados)

### Menu MATRA
No menu da planilha deve aparecer um menu **"MATRA"** com as opções:
- Inicializar Sistema
- Registrar Nova Sessão
- Registrar Propositura
- Atualizar Dashboard
- Gerar Relatório
- Fazer Backup
- Sobre o Sistema

## 🎯 Passo 8: Primeiro Uso

1. Clique na aba **"Dashboard"** para ver o painel principal
2. Use o menu **MATRA > Registrar Nova Sessão** para testar
3. Preencha um registro de teste
4. Clique em **MATRA > Atualizar Dashboard** para ver os resultados

## 🔄 Passo 9: Configurações Opcionais

### Alterar Senha do Sistema
1. No arquivo `codigo.gs`, localize a linha:
   ```javascript
   senha: "matra2025"
   ```
2. Altere para sua senha desejada
3. Salve o arquivo

### Personalizar Pontuações
1. Vá para a aba **"Configurações"**
2. Altere os valores de pontuação conforme necessário
3. Clique em **MATRA > Atualizar Dashboard**

## 🛠️ Solução de Problemas

### Erro de Permissão
- **Problema**: Script não executa por falta de permissões
- **Solução**: Repita o Passo 5 e autorize todas as permissões

### Menu MATRA não aparece
- **Problema**: Menu personalizado não está visível
- **Solução**: Recarregue a planilha (F5) e aguarde alguns segundos

### Planilhas não são criadas
- **Problema**: `inicializarSistema()` não funciona
- **Solução**: Verifique se todos os arquivos foram salvos corretamente

### Formulários não abrem
- **Problema**: Botões do dashboard não funcionam
- **Solução**: Verifique se os arquivos HTML foram criados corretamente

## 📱 Dicas de Uso

### Navegadores Recomendados
- Google Chrome (recomendado)
- Mozilla Firefox
- Microsoft Edge
- Safari (funciona, mas com limitações)

### Melhor Performance
- Use em computador/laptop ao invés de celular
- Mantenha apenas uma aba da planilha aberta
- Execute "Atualizar Dashboard" após várias inserções

### Backup Regular
- Use **MATRA > Fazer Backup** regularmente
- Backups são salvos no seu Google Drive
- Mantenha pelo menos 3 backups de diferentes datas

## 🔒 Segurança

### Controle de Acesso
- Compartilhe a planilha apenas com pessoas autorizadas
- Use "Comentar" ou "Visualizar" para usuários que não devem editar
- Mantenha a senha do sistema em local seguro

### Dados Sensíveis
- Não inclua informações pessoais dos vereadores além do nome
- Mantenha descrições das atividades objetivas e imparciais
- Revise periodicamente os dados inseridos

## 📞 Suporte

Se encontrar problemas durante a instalação:

1. Verifique se seguiu todos os passos corretamente
2. Teste em modo anônimo/privado do navegador
3. Limpe o cache do navegador
4. Tente em outro navegador

## 📈 Próximos Passos

Após a instalação:
1. Treine a equipe no uso do sistema
2. Estabeleça rotina de atualização dos dados
3. Configure backup automático
4. Monitore o desempenho do sistema

---

*Parabéns! Seu Observatório Legislativo MATRA está pronto para usar! 🎉*