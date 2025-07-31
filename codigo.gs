// Configurações globais
const CONFIG = {
  pontuacao: {
    indicacao: { basico: 0.1, maximo: 3 },
    requerimento: { basico: 0.1, maximo: 3 },
    projetoLei: { basico: 0.2, minimo: -5, maximo: 5 },
    votacao: { minimo: -4, maximo: 4 }
  },
  senha: "matra2025"
};

// Função para inicializar o sistema
function inicializarSistema() {
  try {
    console.log("Iniciando inicialização do sistema...");
    
    inicializarPlanilhas();
    inicializarDadosVereadores();
    criarDashboard();
    criarConfiguracoes();
    
    // Forçar atualização inicial do dashboard
    atualizarDashboard();
    
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Dashboard').activate();
    SpreadsheetApp.getUi().alert('Sistema inicializado com sucesso!');
  } catch (e) {
    console.error("Erro na inicialização:", e.message);
    SpreadsheetApp.getUi().alert('Erro na inicialização: ' + e.message);
  }
}

// Função para reinicializar o sistema (corrigir problemas)
function reinicializarSistema() {
  try {
    console.log("Reinicializando sistema...");
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Limpar cache
    limparCacheVereadores();
    
    // Recriar planilhas
    inicializarPlanilhas();
    inicializarDadosVereadores();
    criarDashboard();
    criarConfiguracoes();
    
    // Forçar atualização
    atualizarDashboard();
    
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Dashboard').activate();
    SpreadsheetApp.getUi().alert('Sistema reinicializado com sucesso!');
  } catch (e) {
    console.error("Erro na reinicialização:", e.message);
    SpreadsheetApp.getUi().alert('Erro na reinicialização: ' + e.message);
  }
}

// Inicializa a estrutura das planilhas
function inicializarPlanilhas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let planilhas = ["Dashboard", "Vereadores", "Sessões", "Pontuações", "Configurações", "Relatórios"];
  
  // Remover planilhas padrão e criar novas
  let sheets = ss.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    if (planilhas.indexOf(sheets[i].getName()) === -1) {
      ss.deleteSheet(sheets[i]);
    }
  }
  
  // Criar planilhas que não existem
  planilhas.forEach(function(nome) {
    if (!ss.getSheetByName(nome)) {
      ss.insertSheet(nome);
    }
  });
  
  // Configurar planilha de Sessões
  let sheetSessoes = ss.getSheetByName("Sessões");
  sheetSessoes.clear();
  sheetSessoes.appendRow(["ID Sessão", "Data", "Descrição"]);
  formatarCabecalho(sheetSessoes, 1);
  
  // Configurar planilha de Pontuações
  let sheetPontuacoes = ss.getSheetByName("Pontuações");
  sheetPontuacoes.clear();
  sheetPontuacoes.appendRow(["ID Sessão", "ID Vereador", "Tipo", "Descrição", "Pontuação", "Data"]);
  formatarCabecalho(sheetPontuacoes, 1);
}

// Formata o cabeçalho da planilha
function formatarCabecalho(sheet, row) {
  const range = sheet.getRange(row, 1, 1, sheet.getLastColumn());
  range.setBackground("#0070c0");
  range.setFontColor("white");
  range.setFontWeight("bold");
  
  // Congelar linha do cabeçalho
  sheet.setFrozenRows(1);
  
  // Ajustar largura das colunas
  sheet.autoResizeColumns(1, sheet.getLastColumn());
}

// Inicializa os dados dos vereadores
function inicializarDadosVereadores() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetVereadores = ss.getSheetByName("Vereadores");
  
  // Limpar planilha
  sheetVereadores.clear();
  
  // Adicionar cabeçalhos
  sheetVereadores.appendRow(["ID", "Nome", "Partido", "Pontuação Total", "Ranking"]);
  formatarCabecalho(sheetVereadores, 1);
  
  // Dados dos vereadores
  const vereadores = [
    ["Danilo da Saúde", "PSDB"],
    ["Dr. Elio Ajeka", "PP"],
    ["Fabiana Camarinha", "PODE"],
    ["Professor Galdino da Unimar", "CIDADANIA"],
    ["Guilherme Burcão", "DC"],
    ["João do Bar", "PSD"],
    ["Chico do Açougue", "AVANTE"],
    ["Luiz Eduardo Nardi", "CIDADANIA"],
    ["Marcos Custódio", "PSDB"],
    ["Mauro Cruz", "SOLIDARIEDADE"],
    ["Agente Federal Junior Féfin", "UNIÃO"],
    ["Delegada Rossana Camacho", "PSD"],
    ["Professora Daniela", "PL"],
    ["Thiaguinho", "PP"],
    ["Vânia Ramos", "REPUBLICANOS"],
    ["Wellington Corredato/Batata", "PP"],
    ["Delegado Wilson Damasceno", "PL"]
  ];
  
  // Inserir dados
  for (let i = 0; i < vereadores.length; i++) {
    sheetVereadores.appendRow([
      i + 1,                     // ID
      vereadores[i][0],          // Nome
      vereadores[i][1],          // Partido
      0,                         // Pontuação inicial
      "-"                        // Ranking inicial (será calculado depois)
    ]);
  }
  
  // Aplicar fórmula de ranking
  const numVereadores = vereadores.length;
  for (let i = 0; i < numVereadores; i++) {
    const rowNum = i + 2; // +2 porque começamos na linha 2 (após o cabeçalho)
    sheetVereadores.getRange(`E${rowNum}`).setFormula(`=IF(D${rowNum}=0,"-",RANK(D${rowNum},$D$2:$D${numVereadores+1},0))`);
  }
  
  // Formatar tabela
  const range = sheetVereadores.getRange(1, 1, numVereadores + 1, 5);
  range.setBorder(true, true, true, true, true, true);
  
  // Formatar coluna de pontuação
  sheetVereadores.getRange(2, 4, numVereadores, 1).setNumberFormat("0.00");
}

// Criar o dashboard principal
function criarDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Dashboard");
  
  // Limpar planilha
  sheet.clear();
  
  // Título
  sheet.getRange("A1:L1").merge();
  sheet.getRange("A1").setValue("OBSERVATÓRIO LEGISLATIVO - MATRA MARÍLIA TRANSPARENTE");
  sheet.getRange("A1").setFontSize(16);
  sheet.getRange("A1").setFontWeight("bold");
  sheet.getRange("A1").setHorizontalAlignment("center");
  sheet.getRange("A1").setBackground("#0070c0");
  sheet.getRange("A1").setFontColor("white");
  
  // Subtítulo
  sheet.getRange("A2:L2").merge();
  sheet.getRange("A2").setValue("Sistema de Avaliação e Ranqueamento de Vereadores");
  sheet.getRange("A2").setFontSize(12);
  sheet.getRange("A2").setFontWeight("bold");
  sheet.getRange("A2").setHorizontalAlignment("center");
  sheet.getRange("A2").setBackground("#8eb4e3");
  
  // Data atualização
  sheet.getRange("A4").setValue("Última Atualização:");
  sheet.getRange("B4").setValue(new Date());
  sheet.getRange("B4").setNumberFormat("dd/mm/yyyy hh:mm");
  
  // Criar botões usando desenhos HTML
  criarBotoesDashboard();
  
  // Seção para estatísticas gerais
  sheet.getRange("A8:L8").merge();
  sheet.getRange("A8").setValue("ESTATÍSTICAS GERAIS");
  sheet.getRange("A8").setFontWeight("bold");
  sheet.getRange("A8").setHorizontalAlignment("center");
  sheet.getRange("A8").setBackground("#8eb4e3");
  
  // Indicadores
  sheet.getRange("A9").setValue("Total de Sessões:");
  sheet.getRange("B9").setFormula("=COUNTA(Sessões!A:A)-1");
  
  sheet.getRange("D9").setValue("Média de Pontuação:");
  sheet.getRange("E9").setFormula("=IFERROR(AVERAGEIF(Vereadores!D2:D100,\">0\"),0)");
  sheet.getRange("E9").setNumberFormat("0.00");
  
  sheet.getRange("G9").setValue("Melhor Pontuação:");
  sheet.getRange("H9").setFormula("=IFERROR(MAX(Vereadores!D2:D100),0)");
  sheet.getRange("H9").setNumberFormat("0.00");
  
  sheet.getRange("J9").setValue("Pior Pontuação:");
  sheet.getRange("K9").setFormula("=IFERROR(MIN(Vereadores!D2:D100),0)");
  sheet.getRange("K9").setNumberFormat("0.00");
  
  // Seção de Ranking
  sheet.getRange("A11:F11").merge();
  sheet.getRange("A11").setValue("RANKING DE VEREADORES");
  sheet.getRange("A11").setFontWeight("bold");
  sheet.getRange("A11").setHorizontalAlignment("center");
  sheet.getRange("A11").setBackground("#8eb4e3");
  
  // Cabeçalhos de Ranking
  sheet.getRange("A12").setValue("Posição");
  sheet.getRange("B12").setValue("Vereador");
  sheet.getRange("C12").setValue("Partido");
  sheet.getRange("D12").setValue("Pontuação");
  sheet.getRange("E12").setValue("Indicações");
  sheet.getRange("F12").setValue("Projetos de Lei");
  
  sheet.getRange("A12:F12").setFontWeight("bold");
  sheet.getRange("A12:F12").setBackground("#d9d9d9");
  
  // Inicializar ranking com dados vazios - será preenchido pela função atualizarDashboard()
  for (let i = 1; i <= 10; i++) {
    sheet.getRange(`A${12+i}`).setValue(i);
    sheet.getRange(`B${12+i}`).setValue("");
    sheet.getRange(`C${12+i}`).setValue("");
    sheet.getRange(`D${12+i}`).setValue(0);
    sheet.getRange(`D${12+i}`).setNumberFormat("0.00");
    sheet.getRange(`E${12+i}`).setValue(0);
    sheet.getRange(`F${12+i}`).setValue(0);
  }
  
  // Formatar tabela de ranking
  sheet.getRange(`A12:F${12+10}`).setBorder(true, true, true, true, true, true);
  
  // Área para gráficos
  sheet.getRange("G11:L11").merge();
  sheet.getRange("G11").setValue("VISUALIZAÇÃO GRÁFICA");
  sheet.getRange("G11").setFontWeight("bold");
  sheet.getRange("G11").setHorizontalAlignment("center");
  sheet.getRange("G11").setBackground("#8eb4e3");
  
  // Inserir gráficos
  criarGraficos();
  
  // Rodapé
  sheet.getRange("A24:L24").merge();
  sheet.getRange("A24").setValue(`© ${new Date().getFullYear()} MATRA - Marília Transparente | Observatório Legislativo`);
  sheet.getRange("A24").setFontSize(8);
  sheet.getRange("A24").setHorizontalAlignment("center");
  sheet.getRange("A24").setFontColor("#808080");
  
  // Ajustar largura das colunas
  sheet.autoResizeColumns(1, 12);
}

// Cache para dados de vereadores para evitar múltiplas consultas
let cacheVereadores = null;
let cacheTimestamp = null;
const CACHE_DURATION = 30000; // 30 segundos

// Função otimizada para obter dados de vereadores
function obterDadosVereadores() {
  try {
    // Verificar se o cache ainda é válido
    const agora = new Date().getTime();
    if (cacheVereadores && cacheTimestamp && (agora - cacheTimestamp) < CACHE_DURATION) {
      return cacheVereadores;
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const wsVereadores = ss.getSheetByName("Vereadores");
    
    const lastRow = wsVereadores.getLastRow();
    if (lastRow <= 1) {
      cacheVereadores = { count: 0, dados: [] };
      cacheTimestamp = agora;
      return cacheVereadores;
    }
    
    // Obter todos os dados de uma vez
    const dadosCompletos = wsVereadores.getRange(2, 1, lastRow - 1, 5).getValues();
    const dadosValidos = [];
    
    for (let i = 0; i < dadosCompletos.length; i++) {
      const id = parseInt(dadosCompletos[i][0]);
      const nome = dadosCompletos[i][1];
      
      if (!isNaN(id) && nome && nome.toString().trim() !== '') {
        dadosValidos.push({
          id: id,
          nome: nome,
          partido: dadosCompletos[i][2] || '',
          pontuacao: parseFloat(dadosCompletos[i][3]) || 0,
          ranking: dadosCompletos[i][4] || '-'
        });
      }
    }
    
    cacheVereadores = { count: dadosValidos.length, dados: dadosValidos };
    cacheTimestamp = agora;
    
    return cacheVereadores;
  } catch (e) {
    console.error("Erro ao obter dados de vereadores:", e.message);
    return { count: 0, dados: [] };
  }
}

// Função auxiliar simplificada para contar vereadores
function countVereadores() {
  return obterDadosVereadores().count;
}

// Função para limpar cache (usar após alterações na planilha)
function limparCacheVereadores() {
  cacheVereadores = null;
  cacheTimestamp = null;
}

// Criar os botões do dashboard usando HTML Service
function criarBotoesDashboard() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Dashboard");
  
  // Adicionar botões usando células formatadas com instruções para clique
  sheet.getRange("A6").setValue("Registrar Nova Sessão");
  sheet.getRange("A6").setBackground("#0070c0");
  sheet.getRange("A6").setFontColor("white");
  sheet.getRange("A6").setFontWeight("bold");
  sheet.getRange("A6").setHorizontalAlignment("center");
  sheet.getRange("A6").setVerticalAlignment("middle");
  sheet.getRange("A6").setBorder(true, true, true, true, true, true, "black", SpreadsheetApp.BorderStyle.SOLID);
  
  sheet.getRange("C6").setValue("Registrar Propositura");
  sheet.getRange("C6").setBackground("#0070c0");
  sheet.getRange("C6").setFontColor("white");
  sheet.getRange("C6").setFontWeight("bold");
  sheet.getRange("C6").setHorizontalAlignment("center");
  sheet.getRange("C6").setVerticalAlignment("middle");
  sheet.getRange("C6").setBorder(true, true, true, true, true, true, "black", SpreadsheetApp.BorderStyle.SOLID);
  
  sheet.getRange("E6").setValue("Atualizar Dashboard");
  sheet.getRange("E6").setBackground("#0070c0");
  sheet.getRange("E6").setFontColor("white");
  sheet.getRange("E6").setFontWeight("bold");
  sheet.getRange("E6").setHorizontalAlignment("center");
  sheet.getRange("E6").setVerticalAlignment("middle");
  sheet.getRange("E6").setBorder(true, true, true, true, true, true, "black", SpreadsheetApp.BorderStyle.SOLID);
  
  sheet.getRange("G6").setValue("Gerar Relatório");
  sheet.getRange("G6").setBackground("#0070c0");
  sheet.getRange("G6").setFontColor("white");
  sheet.getRange("G6").setFontWeight("bold");
  sheet.getRange("G6").setHorizontalAlignment("center");
  sheet.getRange("G6").setVerticalAlignment("middle");
  sheet.getRange("G6").setBorder(true, true, true, true, true, true, "black", SpreadsheetApp.BorderStyle.SOLID);
  
  sheet.getRange("I6").setValue("Configurações");
  sheet.getRange("I6").setBackground("#0070c0");
  sheet.getRange("I6").setFontColor("white");
  sheet.getRange("I6").setFontWeight("bold");
  sheet.getRange("I6").setHorizontalAlignment("center");
  sheet.getRange("I6").setVerticalAlignment("middle");
  sheet.getRange("I6").setBorder(true, true, true, true, true, true, "black", SpreadsheetApp.BorderStyle.SOLID);
  
  // Adicionar dados ocultos para rastreamento de botões
  sheet.getRange("N1").setValue("BOTOES_CONFIG");
  sheet.getRange("N2:O2").setValues([["A6", "registrarNovaSessao"]]);
  sheet.getRange("N3:O3").setValues([["C6", "registrarPropositura"]]);
  sheet.getRange("N4:O4").setValues([["E6", "atualizarDashboard"]]);
  sheet.getRange("N5:O5").setValues([["G6", "gerarRelatorio"]]);
  sheet.getRange("N6:O6").setValues([["I6", "abrirConfiguracoes"]]);
  
  // Ocultar células de configuração de botões
  sheet.hideColumns(14, 2);
}

// Criar planilha de configurações
function criarConfiguracoes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Configurações");
  
  // Limpar planilha
  sheet.clear();
  
  // Título
  sheet.getRange("A1:F1").merge();
  sheet.getRange("A1").setValue("CONFIGURAÇÕES DE PONTUAÇÃO");
  sheet.getRange("A1").setFontWeight("bold");
  sheet.getRange("A1").setHorizontalAlignment("center");
  sheet.getRange("A1").setBackground("#0070c0");
  sheet.getRange("A1").setFontColor("white");
  
  // Configurações de pontuação para Indicações
  sheet.getRange("A3").setValue("PONTUAÇÃO PARA INDICAÇÕES");
  sheet.getRange("A3").setFontWeight("bold");
  
  sheet.getRange("A4").setValue("Básica");
  sheet.getRange("B4").setValue(CONFIG.pontuacao.indicacao.basico);
  
  sheet.getRange("A5").setValue("Com Princípios MATRA");
  sheet.getRange("B5").setValue(CONFIG.pontuacao.indicacao.maximo);
  
  // Configurações de pontuação para Requerimentos
  sheet.getRange("A7").setValue("PONTUAÇÃO PARA REQUERIMENTOS");
  sheet.getRange("A7").setFontWeight("bold");
  
  sheet.getRange("A8").setValue("Básico");
  sheet.getRange("B8").setValue(CONFIG.pontuacao.requerimento.basico);
  
  sheet.getRange("A9").setValue("Com Princípios MATRA");
  sheet.getRange("B9").setValue(CONFIG.pontuacao.requerimento.maximo);
  
  // Configurações de pontuação para Projetos de Lei
  sheet.getRange("A11").setValue("PONTUAÇÃO PARA PROJETOS DE LEI");
  sheet.getRange("A11").setFontWeight("bold");
  
  sheet.getRange("A12").setValue("Básico");
  sheet.getRange("B12").setValue(CONFIG.pontuacao.projetoLei.basico);
  
  sheet.getRange("A13").setValue("Mínimo (Princípios)");
  sheet.getRange("B13").setValue(CONFIG.pontuacao.projetoLei.minimo);
  
  sheet.getRange("A14").setValue("Máximo (Princípios)");
  sheet.getRange("B14").setValue(CONFIG.pontuacao.projetoLei.maximo);
  
  // Configurações de pontuação para Votações
  sheet.getRange("A16").setValue("PONTUAÇÃO PARA VOTAÇÕES");
  sheet.getRange("A16").setFontWeight("bold");
  
  sheet.getRange("A17").setValue("Mínimo");
  sheet.getRange("B17").setValue(CONFIG.pontuacao.votacao.minimo);
  
  sheet.getRange("A18").setValue("Máximo");
  sheet.getRange("B18").setValue(CONFIG.pontuacao.votacao.maximo);
  
  // Lista de tipos de atividade para validação
  sheet.getRange("D3").setValue("Indicação");
  sheet.getRange("D4").setValue("Requerimento");
  sheet.getRange("D5").setValue("Projeto de Lei");
  sheet.getRange("D6").setValue("Votação");
  
  // Ocultar a área de tipos
  sheet.hideColumns(4, 3);
  
  // Ajustar largura das colunas
  sheet.autoResizeColumns(1, 6);
}

// Criar gráficos no dashboard
function criarGraficos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Dashboard");
  
  // Criar área para dados de gráficos
  sheet.getRange("N2").setValue("Dados para Gráficos");
  sheet.getRange("N3").setValue("Vereador");
  sheet.getRange("O3").setValue("Pontuação");
  sheet.getRange("P3").setValue("Partido");
  
  // Preencher dados de exemplo
  for(let i = 1; i <= 5; i++) {
    sheet.getRange(`N${i+3}`).setValue(`Vereador ${i}`);
    sheet.getRange(`O${i+3}`).setValue(0);
    sheet.getRange(`P${i+3}`).setValue(`Partido ${i}`);
  }
  
  // Ocultar dados dos gráficos
  sheet.hideColumns(14, 3);
  
  // Criar gráfico de barras para Top 5
  let chartBuilder = sheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(sheet.getRange("N3:O8"))
    .setPosition(12, 6, 0, 0)
    .setOption('title', 'Top 5 Vereadores por Pontuação')
    .setOption('hAxis.title', 'Vereador')
    .setOption('vAxis.title', 'Pontuação')
    .setOption('width', 450)
    .setOption('height', 200);
  
  sheet.insertChart(chartBuilder.build());
  
  // Criar gráfico de pizza para distribuição por partido
  chartBuilder = sheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(sheet.getRange("P3:P8"))
    .addRange(sheet.getRange("O3:O8"))
    .setPosition(18, 6, 0, 0)
    .setOption('title', 'Pontuação por Partido')
    .setOption('width', 450)
    .setOption('height', 200);
  
  sheet.insertChart(chartBuilder.build());
}

// =====================================================================
// Funções para os botões do Dashboard
// =====================================================================

// Registrar nova sessão
function registrarNovaSessao() {
  const html = HtmlService.createHtmlOutputFromFile('FormularioRegistro')
    .setWidth(600)
    .setHeight(600)
    .setTitle('Registrar Nova Atividade Legislativa');
  
  SpreadsheetApp.getUi().showModalDialog(html, 'Registrar Nova Atividade Legislativa');
}

// Registrar indicações em bloco
function registrarIndicacoesEmBloco() {
  const html = HtmlService.createHtmlOutputFromFile('FormularioIndicacoesBloco')
    .setWidth(800)
    .setHeight(600)
    .setTitle('Registrar Indicações em Bloco');
  
  SpreadsheetApp.getUi().showModalDialog(html, 'Registrar Indicações em Bloco');
}

// Registrar indicações em bloco - Modo Rápido
function registrarIndicacoesRapido() {
  const html = HtmlService.createHtmlOutputFromFile('FormularioIndicacoesRapido')
    .setWidth(900)
    .setHeight(700)
    .setTitle('Indicações em Bloco - Modo Rápido');
  
  SpreadsheetApp.getUi().showModalDialog(html, 'Indicações em Bloco - Modo Rápido');
}

// Registrar propositura independente
function registrarPropositura() {
  const html = HtmlService.createHtmlOutputFromFile('FormularioPropositura')
    .setWidth(600)
    .setHeight(600)
    .setTitle('Registrar Nova Propositura');
  
  SpreadsheetApp.getUi().showModalDialog(html, 'Registrar Nova Propositura');
}

// Atualizar dashboard otimizado
function atualizarDashboard() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const wsPontuacoes = ss.getSheetByName("Pontuações");
    const wsDashboard = ss.getSheetByName("Dashboard");
    
    console.log("Iniciando atualização otimizada do dashboard");
    
    // Recalcular pontuações (já otimizado com cache)
    recalcularPontuacoesRankings();
    
    // Obter dados dos vereadores do cache
    const dadosVereadores = obterDadosVereadores();
    
    if (dadosVereadores.count <= 0) {
      throw new Error("Nenhum vereador encontrado na planilha");
    }
    
    // Os dados já vêm atualizados e validados do cache
    const vereadorOrdenados = [...dadosVereadores.dados];
    
    // Ordenar por pontuação (maior para menor)
    vereadorOrdenados.sort((a, b) => b.pontuacao - a.pontuacao);
    
    // Obter dados de pontuações apenas uma vez
    const dadosPontuacoes = wsPontuacoes.getDataRange().getValues();
    
    // Calcular estatísticas e dados do ranking em uma única passada
    let somaPontuacoes = 0;
    let maxPontuacao = 0;
    let minPontuacao = Infinity;
    let contadorPontuados = 0;
    
    // Contar tipos de atividades por vereador
    const atividadesPorVereador = {};
    
    // Inicializar contadores
    dadosVereadores.dados.forEach(vereador => {
      atividadesPorVereador[vereador.id] = { indicacoes: 0, projetos: 0 };
    });
    
    // Processar pontuações e contar atividades em uma única passada
    for (let i = 1; i < dadosPontuacoes.length; i++) {
      const vereadorID = parseInt(dadosPontuacoes[i][1]);
      const tipo = dadosPontuacoes[i][2];
      
      if (!isNaN(vereadorID) && atividadesPorVereador[vereadorID]) {
        if (tipo === "Indicação") {
          atividadesPorVereador[vereadorID].indicacoes++;
        } else if (tipo === "Projeto de Lei") {
          atividadesPorVereador[vereadorID].projetos++;
        }
      }
    }
    
    // Calcular estatísticas
    vereadorOrdenados.forEach(vereador => {
      if (vereador.pontuacao > 0) {
        somaPontuacoes += vereador.pontuacao;
        maxPontuacao = Math.max(maxPontuacao, vereador.pontuacao);
        minPontuacao = Math.min(minPontuacao, vereador.pontuacao);
        contadorPontuados++;
      }
    });
    
    // Preparar todas as atualizações do dashboard em lote
    const atualizacoesDashboard = [
      // Estatísticas gerais
      [Math.max(0, ss.getSheetByName("Sessões").getLastRow() - 1)], // B9 - Total de Sessões
      [contadorPontuados > 0 ? somaPontuacoes / contadorPontuados : 0], // E9 - Média
      [maxPontuacao], // H9 - Máximo
      [minPontuacao === Infinity ? 0 : minPontuacao] // K9 - Mínimo
    ];
    
    wsDashboard.getRange("B9").setValue(atualizacoesDashboard[0][0]);
    wsDashboard.getRange("E9").setValue(atualizacoesDashboard[1][0]);
    wsDashboard.getRange("H9").setValue(atualizacoesDashboard[2][0]);
    wsDashboard.getRange("K9").setValue(atualizacoesDashboard[3][0]);
    
    // Limpar e preparar dados do ranking
    wsDashboard.getRange("A13:F25").clearContent();
    
    const rankingData = [];
    const top10 = vereadorOrdenados.slice(0, 10).filter(v => v.pontuacao > 0);
    
    top10.forEach((vereador, index) => {
      const atividades = atividadesPorVereador[vereador.id] || { indicacoes: 0, projetos: 0 };
      rankingData.push([
        index + 1, // Posição
        vereador.nome, // Nome
        vereador.partido, // Partido
        vereador.pontuacao, // Pontuação
        atividades.indicacoes, // Indicações
        atividades.projetos // Projetos
      ]);
    });
    
    // Atualizar ranking em lote se houver dados
    if (rankingData.length > 0) {
      wsDashboard.getRange(13, 1, rankingData.length, 6).setValues(rankingData);
    }
    
    // Atualizar data e hora
    wsDashboard.getRange("B4").setValue(new Date());
    
    // Atualizar gráficos (opcional, pode ser removido se causar lentidão)
    try {
      atualizarGraficos();
    } catch (e) {
      console.log("Gráficos não atualizados:", e.message);
    }
    
    console.log("Dashboard atualizado com sucesso (otimizado)");
    SpreadsheetApp.getUi().alert("Dashboard atualizado com sucesso!");
  } catch (e) {
    console.error("Erro ao atualizar dashboard:", e.message);
    SpreadsheetApp.getUi().alert("Erro ao atualizar dashboard: " + e.message);
    throw e;
  }
}

function recalcularPontuacoesRankings() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const wsVereadores = ss.getSheetByName("Vereadores");
    const wsPontuacoes = ss.getSheetByName("Pontuações");
    
    // Obter dados de vereadores do cache
    const dadosVereadores = obterDadosVereadores();
    const numVereadores = dadosVereadores.count;
    
    if (numVereadores <= 0) {
      console.log("Nenhum vereador válido encontrado");
      return;
    }
    
    // Verificar se há pontuações
    const dadosPontuacoes = wsPontuacoes.getDataRange().getValues();
    
    if (dadosPontuacoes.length <= 1) {
      console.log("Sem dados de pontuação para recalcular");
      // Limpar pontuações se não houver dados
      wsVereadores.getRange(2, 4, numVereadores, 2).setValues(
        new Array(numVereadores).fill([0, "-"])
      );
      limparCacheVereadores(); // Limpar cache após alteração
      return;
    }
    
    // Criar mapa de pontuações por ID de vereador
    const pontuacoesPorID = {};
    
    // Inicializar com zero para todos os vereadores válidos
    dadosVereadores.dados.forEach(vereador => {
      pontuacoesPorID[vereador.id] = 0;
    });
    
    // Somar pontuações por vereador
    for (let i = 1; i < dadosPontuacoes.length; i++) {
      const vereadorID = parseInt(dadosPontuacoes[i][1]);
      const pontuacao = parseFloat(dadosPontuacoes[i][4]);
      
      if (!isNaN(vereadorID) && !isNaN(pontuacao) && pontuacoesPorID.hasOwnProperty(vereadorID)) {
        pontuacoesPorID[vereadorID] += pontuacao;
      }
    }
    
    // Preparar dados para atualização em lote
    const atualizacoesPontuacao = [];
    const atualizacoesRanking = [];
    
    // Criar array para ranking
    const rankData = dadosVereadores.dados.map((vereador, index) => ({
      row: index + 2,
      id: vereador.id,
      pontuacao: pontuacoesPorID[vereador.id]
    }));
    
    // Ordenar por pontuação (maior para menor)
    rankData.sort((a, b) => b.pontuacao - a.pontuacao);
    
    // Calcular rankings
    let rankAtual = 1;
    let pontuacaoAnterior = null;
    
    rankData.forEach((item, index) => {
      // Pontuação
      atualizacoesPontuacao.push([item.pontuacao]);
      
      // Ranking
      let ranking = "-";
      if (item.pontuacao > 0) {
        if (index > 0 && item.pontuacao === pontuacaoAnterior) {
          // Empate - manter ranking anterior
          ranking = atualizacoesRanking[atualizacoesRanking.length - 1][0];
        } else {
          rankAtual = index + 1;
          ranking = rankAtual;
        }
        pontuacaoAnterior = item.pontuacao;
      }
      atualizacoesRanking.push([ranking]);
    });
    
    // Atualizar planilha em lote (muito mais eficiente)
    if (atualizacoesPontuacao.length > 0) {
      wsVereadores.getRange(2, 4, numVereadores, 1).setValues(atualizacoesPontuacao);
      wsVereadores.getRange(2, 5, numVereadores, 1).setValues(atualizacoesRanking);
    }
    
    // Limpar cache após alterações
    limparCacheVereadores();
    
    console.log("Recálculo otimizado concluído com sucesso");
  } catch (e) {
    console.error("Erro ao recalcular pontuações e rankings:", e.message);
    throw new Error("Falha no recálculo do ranking: " + e.message);
  }
}

// Atualizar gráficos
function atualizarGraficos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Dashboard");
  
  // Remover gráficos existentes
  const charts = sheet.getCharts();
  charts.forEach(chart => sheet.removeChart(chart));
  
  // Recriar gráficos com dados atuais
  let chartBuilder = sheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(sheet.getRange("N3:O8"))
    .setPosition(12, 6, 0, 0)
    .setOption('title', 'Top 5 Vereadores por Pontuação')
    .setOption('hAxis.title', 'Vereador')
    .setOption('vAxis.title', 'Pontuação')
    .setOption('width', 450)
    .setOption('height', 200);
  
  sheet.insertChart(chartBuilder.build());
  
  chartBuilder = sheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(sheet.getRange("P3:P8"))
    .addRange(sheet.getRange("O3:O8"))
    .setPosition(18, 6, 0, 0)
    .setOption('title', 'Pontuação por Partido')
    .setOption('width', 450)
    .setOption('height', 200);
  
  sheet.insertChart(chartBuilder.build());
}

// Gerar relatório
function gerarRelatorio() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Gerar nome para a nova planilha de relatório
    const dataFormatada = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd-MM-yyyy");
    const nomeRelatorio = "Relatório_" + dataFormatada;
    
    // Verificar se já existe e remover
    let sheetRelatorio = ss.getSheetByName(nomeRelatorio);
    if (sheetRelatorio) {
      ss.deleteSheet(sheetRelatorio);
    }
    
    // Criar nova planilha
    sheetRelatorio = ss.insertSheet(nomeRelatorio);
    
    // Obter dados do dashboard
    const wsDashboard = ss.getSheetByName("Dashboard");
    const dashboardData = wsDashboard.getRange("A1:L24").getValues();
    const dashboardFormats = wsDashboard.getRange("A1:L24").getTextStyles();
    const dashboardBackgrounds = wsDashboard.getRange("A1:L24").getBackgrounds();
    const dashboardFontColors = wsDashboard.getRange("A1:L24").getFontColors();
    const dashboardFontWeights = wsDashboard.getRange("A1:L24").getFontWeights();
    
    // Copiar dados e formatos
    sheetRelatorio.getRange(1, 1, dashboardData.length, dashboardData[0].length).setValues(dashboardData);
    
    // Formatar relatório
    formatarRelatorio(sheetRelatorio);
    
    // Adicionar detalhamento das pontuações
    adicionarDetalhamentoPontuacoes(sheetRelatorio);
    
    // Ativar planilha
    sheetRelatorio.activate();
    
    SpreadsheetApp.getUi().alert("Relatório gerado com sucesso!");
  } catch (e) {
    SpreadsheetApp.getUi().alert("Erro ao gerar relatório: " + e.message);
  }
}

// Formatar relatório gerado
function formatarRelatorio(sheet) {
  sheet.getRange("A26").setValue("DETALHAMENTO DE PONTUAÇÕES POR VEREADOR");
  sheet.getRange("A26").setFontWeight("bold");
  sheet.getRange("A26").setFontSize(12);
  
  sheet.getRange("A28").setValue("Vereador");
  sheet.getRange("B28").setValue("Partido");
  sheet.getRange("C28").setValue("Tipo Atividade");
  sheet.getRange("D28").setValue("Descrição");
  sheet.getRange("E28").setValue("Pontuação");
  sheet.getRange("F28").setValue("Data");
  
  sheet.getRange("A28:F28").setFontWeight("bold");
  sheet.getRange("A28:F28").setBackground("#d9d9d9");
}

// Adicionar detalhamento de pontuações ao relatório
function adicionarDetalhamentoPontuacoes(sheetRelatorio) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const wsVereadores = ss.getSheetByName("Vereadores");
  const wsPontuacoes = ss.getSheetByName("Pontuações");
  
  // Obter dados
  const dadosVereadores = wsVereadores.getDataRange().getValues();
  const dadosPontuacoes = wsPontuacoes.getDataRange().getValues();
  
  // Verificar se há pontuações
  if (dadosPontuacoes.length <= 1) {
    sheetRelatorio.getRange("A29").setValue("Nenhum dado de pontuação registrado.");
    sheetRelatorio.getRange("A29:F29").merge();
    sheetRelatorio.getRange("A29").setHorizontalAlignment("center");
    return;
  }
  
  // Processar pontuações
  let linha = 29;
  for (let i = 1; i < dadosPontuacoes.length; i++) {
    const vereadorID = dadosPontuacoes[i][1];
    
    // Verificar se ID de vereador é válido
    if (vereadorID >= 1 && vereadorID <= countVereadores()) {
      const nomeVereador = dadosVereadores[vereadorID][1];
      const partidoVereador = dadosVereadores[vereadorID][2];
      
      sheetRelatorio.getRange(linha, 1).setValue(nomeVereador);
      sheetRelatorio.getRange(linha, 2).setValue(partidoVereador);
      sheetRelatorio.getRange(linha, 3).setValue(dadosPontuacoes[i][2]);
      sheetRelatorio.getRange(linha, 4).setValue(dadosPontuacoes[i][3]);
      sheetRelatorio.getRange(linha, 5).setValue(dadosPontuacoes[i][4]);
      
      // Formatar data
      if (dadosPontuacoes[i][5]) {
        sheetRelatorio.getRange(linha, 6).setValue(dadosPontuacoes[i][5]);
        sheetRelatorio.getRange(linha, 6).setNumberFormat("dd/MM/yyyy");
      }
      
      linha++;
    }
  }
  
  // Formatar tabela
  sheetRelatorio.getRange(`A28:F${linha-1}`).setBorder(true, true, true, true, true, true);
  sheetRelatorio.autoResizeColumns(1, 6);
  
  // Adicionar rodapé
  sheetRelatorio.getRange(linha + 2, 1).setValue("Relatório gerado em: " + new Date());
  sheetRelatorio.getRange(linha + 2, 1).setFontSize(8);
  sheetRelatorio.getRange(linha + 2, 1).setFontStyle("italic");
}

// Abrir configurações
function abrirConfiguracoes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.getSheetByName("Configurações").activate();
  
  SpreadsheetApp.getUi().alert("Planilha de configurações aberta. Após fazer as alterações, clique em 'Atualizar Dashboard' para aplicá-las.");
}

// =====================================================================
// Manipulação de eventos e gatilhos
// =====================================================================

// Função executada quando o documento é aberto
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  // Criar menu personalizado
  ui.createMenu('MATRA')
    .addItem('Inicializar Sistema', 'inicializarSistema')
    .addItem('Reinicializar Sistema', 'reinicializarSistema')
    .addSeparator()
    .addItem('Registrar Nova Sessão', 'registrarNovaSessao')
    .addItem('Registrar Indicações em Bloco', 'registrarIndicacoesEmBloco')
    .addItem('🚀 Indicações Rápidas', 'registrarIndicacoesRapido')
    .addItem('Registrar Propositura', 'registrarPropositura')
    .addItem('Atualizar Dashboard', 'atualizarDashboard')
    .addItem('Gerar Relatório', 'gerarRelatorio')
    .addSeparator()
    .addItem('Fazer Backup', 'fazerBackup')
    .addItem('Sobre o Sistema', 'exibirSobre')
    .addToUi();
    
  // Criar menu de teste
  ui.createMenu('TESTE')
    .addItem('Testar Sistema', 'testarSistema')
    .addToUi();
    
  // Verificar se o sistema já foi inicializado
  if (!SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Vereadores").getRange("A1").getValue()) {
    ui.alert('Sistema não inicializado',
             'O sistema MATRA parece não estar inicializado. Use o menu MATRA → Inicializar Sistema para configurar o Observatório Legislativo.',
             ui.ButtonSet.OK);
  }
}

// Função para lidar com cliques em células (para simular botões)
function onEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  
  // Verificar se é na planilha Dashboard
  if (sheet.getName() === "Dashboard") {
    // Verifica se o clique foi em um botão
    const botoes = sheet.getRange("N2:O6").getValues();
    
    if (botoes[0][0] === "BOTOES_CONFIG") {
      for (let i = 1; i < botoes.length; i++) {
        if (range.getA1Notation() === botoes[i][0]) {
          // Chamar a função correspondente
          const funcao = botoes[i][1];
          
          // As funções serão chamadas por trigger instalado
          sheet.getRange("O7").setValue(funcao);
          
          // Criar trigger temporário para chamar a função depois
          ScriptApp.newTrigger('executarFuncaoBotao')
            .timeBased()
            .after(1000)
            .create();
          
          break;
        }
      }
    }
  }
}

// Executa a função correspondente ao botão clicado
function executarFuncaoBotao() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Dashboard");
  const funcao = sheet.getRange("O7").getValue();
  
  // Limpar valor para não executar novamente
  sheet.getRange("O7").clearContent();
  
  // Remover todos os triggers que chamam esta função
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'executarFuncaoBotao') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Executar a função correspondente
  if (funcao === "registrarNovaSessao") {
    registrarNovaSessao();
  } else if (funcao === "registrarPropositura") {
    registrarPropositura();
  } else if (funcao === "atualizarDashboard") {
    atualizarDashboard();
  } else if (funcao === "gerarRelatorio") {
    gerarRelatorio();
  } else if (funcao === "abrirConfiguracoes") {
    abrirConfiguracoes();
  }
}

// Função para fazer backup da planilha
function fazerBackup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Criar cópia da planilha atual
  const folder = DriveApp.getRootFolder();
  const novoNome = "Backup_MATRA_" + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd_HHmmss");
  const novoPlanilha = DriveApp.getFileById(ss.getId()).makeCopy(novoNome, folder);
  
  SpreadsheetApp.getUi().alert("Backup realizado com sucesso!\nArquivo: " + novoNome);
}

// Exibe informações sobre o sistema
function exibirSobre() {
  const htmlOutput = HtmlService
    .createHtmlOutput('<h2>MATRA - Marília Transparente</h2>' +
                      '<p>Observatório Legislativo</p>' +
                      '<p>Versão 1.1</p>' +
                      '<p>Correções de erro implementadas</p>' +
                      '<p>&copy; ' + new Date().getFullYear() + ' MATRA</p>')
    .setWidth(400)
    .setHeight(300);
  
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Sobre');
}

// Script de teste para verificar o funcionamento do sistema
function testarSistema() {
  try {
    console.log("Iniciando testes do sistema...");
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Teste 1: Verificar se todas as abas existem
    const abasNecessarias = ["Dashboard", "Vereadores", "Sessões", "Pontuações", "Configurações"];
    const abasExistentes = ss.getSheets().map(sheet => sheet.getName());
    
    console.log("Abas necessárias:", abasNecessarias);
    console.log("Abas existentes:", abasExistentes);
    
    for (const aba of abasNecessarias) {
      if (!abasExistentes.includes(aba)) {
        throw new Error(`Aba "${aba}" não encontrada`);
      }
    }
    console.log("✅ Todas as abas estão presentes");
    
    // Teste 2: Verificar dados dos vereadores
    const wsVereadores = ss.getSheetByName("Vereadores");
    const dadosVereadores = wsVereadores.getDataRange().getValues();
    
    if (dadosVereadores.length <= 1) {
      throw new Error("Nenhum vereador encontrado na planilha");
    }
    
    console.log(`✅ ${dadosVereadores.length - 1} vereadores encontrados`);
    
    // Teste 3: Verificar dashboard
    const wsDashboard = ss.getSheetByName("Dashboard");
    const titulo = wsDashboard.getRange("A1").getValue();
    
    if (!titulo || !titulo.includes("OBSERVATÓRIO LEGISLATIVO")) {
      throw new Error("Dashboard não está configurado corretamente");
    }
    
    console.log("✅ Dashboard configurado corretamente");
    
    // Teste 4: Verificar fórmulas de estatísticas
    const mediaFormula = wsDashboard.getRange("E9").getFormula();
    const maxFormula = wsDashboard.getRange("H9").getFormula();
    
    if (!mediaFormula.includes("AVERAGEIF") || !maxFormula.includes("MAX")) {
      throw new Error("Fórmulas de estatísticas não estão corretas");
    }
    
    console.log("✅ Fórmulas de estatísticas estão corretas");
    
    // Teste 5: Verificar se não há erros #ERROR!
    const rangeRanking = wsDashboard.getRange("B13:D22");
    const valoresRanking = rangeRanking.getValues();
    
    let temErro = false;
    for (let i = 0; i < valoresRanking.length; i++) {
      for (let j = 0; j < valoresRanking[i].length; j++) {
        if (valoresRanking[i][j] === "#ERROR!") {
          temErro = true;
          console.log(`❌ Erro encontrado na célula ${String.fromCharCode(66+j)}${13+i}`);
        }
      }
    }
    
    if (temErro) {
      throw new Error("Ainda existem erros #ERROR! no ranking");
    }
    
    console.log("✅ Nenhum erro #ERROR! encontrado");
    
    // Teste 6: Verificar cache
    const dadosCache = obterDadosVereadores();
    if (dadosCache.count === 0) {
      throw new Error("Cache de vereadores não está funcionando");
    }
    
    console.log(`✅ Cache funcionando: ${dadosCache.count} vereadores`);
    
    // Todos os testes passaram
    console.log("🎉 Todos os testes passaram! Sistema funcionando corretamente.");
    
    SpreadsheetApp.getUi().alert(
      "Teste Concluído",
      "Todos os testes passaram! O sistema está funcionando corretamente.",
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    
  } catch (e) {
    console.error("❌ Teste falhou:", e.message);
    
    SpreadsheetApp.getUi().alert(
      "Teste Falhou",
      "Erro encontrado: " + e.message + "\n\nUse MATRA → Reinicializar Sistema para corrigir.",
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

// =====================================================================
// Funções para os formulários
// =====================================================================

/**
 * Obtém dados para preencher o formulário de registro de atividades legislativas
 * Esta função é chamada quando o formulário é aberto
 */
function obterDadosFormulario() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const wsVereadores = ss.getSheetByName("Vereadores");
  const wsSessoes = ss.getSheetByName("Sessões");
  
  // Obter próximo ID de sessão
  let proximoID = 1;
  const ultimaLinha = wsSessoes.getLastRow();
  if (ultimaLinha > 1) {
    proximoID = wsSessoes.getRange(ultimaLinha, 1).getValue() + 1;
  }
  
  // Determinar o número de vereadores dinamicamente
  const numLinhasVereadores = wsVereadores.getLastRow() - 1; // -1 para o cabeçalho
  
  // Obter lista de vereadores
  const dadosVereadores = wsVereadores.getRange(2, 2, numLinhasVereadores, 1).getValues();
  const listaVereadores = dadosVereadores.map(row => row[0]);
  
  // Obter lista de sessões existentes
  let sessoes = [];
  if (ultimaLinha > 1) {
    const dadosSessoes = wsSessoes.getRange(2, 1, ultimaLinha - 1, 3).getValues();
    sessoes = dadosSessoes.map(row => {
      return {
        id: row[0],
        data: Utilities.formatDate(new Date(row[1]), Session.getScriptTimeZone(), "yyyy-MM-dd"),
        descricao: row[2]
      };
    });
  }
  
  return {
    proximoID: proximoID,
    vereadores: listaVereadores,
    dataAtual: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd"),
    sessoes: sessoes
  };
}

/**
 * Obtém dados para o formulário de propositura
 * Esta função é usada pelo formulário de proposituras avulsas
 */
function obterDadosFormularioPropositura() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const wsVereadores = ss.getSheetByName("Vereadores");
  
  // Determinar o número de vereadores dinamicamente
  const numLinhasVereadores = wsVereadores.getLastRow() - 1; // -1 para o cabeçalho
  
  // Obter lista de vereadores
  const dadosVereadores = wsVereadores.getRange(2, 2, numLinhasVereadores, 1).getValues();
  const listaVereadores = dadosVereadores.map(row => row[0]);
  
  return {
    vereadores: listaVereadores,
    dataAtual: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd")
  };
}

/**
 * Registra uma atividade legislativa a partir dos dados do formulário
 * @param {Object} formData - Dados do formulário com informações da atividade
 * @return {Object} Resultado da operação (sucesso/erro)
 */
function registrarAtividade(formData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const wsSessoes = ss.getSheetByName("Sessões");
    const wsVereadores = ss.getSheetByName("Vereadores");
    const wsPontuacoes = ss.getSheetByName("Pontuações");
    
    // Validar pontuação
    const pontuacao = parseFloat(formData.pontuacao);
    let pontuacaoMin = 0;
    let pontuacaoMax = 0;
    
    switch (formData.tipo) {
      case "Indicação":
      case "Requerimento":
        pontuacaoMin = 0.1;
        pontuacaoMax = 3;
        break;
      case "Projeto de Lei":
        pontuacaoMin = -5;
        pontuacaoMax = 5;
        break;
      case "Votação":
        pontuacaoMin = -4;
        pontuacaoMax = 4;
        break;
    }
    
    if (pontuacao < pontuacaoMin || pontuacao > pontuacaoMax) {
      return {
        success: false, 
        message: `Pontuação deve estar entre ${pontuacaoMin} e ${pontuacaoMax}!`
      };
    }
    
    // Obter ID da sessão
    const sessaoID = parseInt(formData.sessaoID);
    
    // Verificar se é nova sessão
    const dadosSessoes = wsSessoes.getDataRange().getValues();
    let sessaoExistente = false;
    
    for (let i = 1; i < dadosSessoes.length; i++) {
      if (dadosSessoes[i][0] === sessaoID) {
        sessaoExistente = true;
        break;
      }
    }
    
    // Ajustar a data para evitar problemas de fuso horário
    const dataParts = formData.data.split('-');
    const dataAjustada = new Date(dataParts[0], dataParts[1]-1, dataParts[2], 12, 0, 0);

    // Se for nova sessão, registrá-la
    if (!sessaoExistente) {
      const novaLinha = wsSessoes.getLastRow() + 1;
      wsSessoes.getRange(novaLinha, 1).setValue(sessaoID);
      wsSessoes.getRange(novaLinha, 2).setValue(dataAjustada);
      wsSessoes.getRange(novaLinha, 3).setValue("Sessão de " + Utilities.formatDate(dataAjustada, Session.getScriptTimeZone(), "dd/MM/yyyy"));
    }
    
    // Obter ID do vereador
    let vereadorID = 0;
    const numVereadores = countVereadores();
    
    // Obter dados dos vereadores para encontrar o ID
    const dadosVereadores = wsVereadores.getRange(2, 1, numVereadores, 2).getValues();
    
    for (let i = 0; i < dadosVereadores.length; i++) {
      if (dadosVereadores[i][1] === formData.vereador) {
        vereadorID = dadosVereadores[i][0];
        break;
      }
    }
    
    if (vereadorID === 0) {
      return {
        success: false, 
        message: "Vereador não encontrado!"
      };
    }
    
    // Registrar pontuação
    const novaLinha = wsPontuacoes.getLastRow() + 1;
    wsPontuacoes.getRange(novaLinha, 1).setValue(sessaoID);
    wsPontuacoes.getRange(novaLinha, 2).setValue(vereadorID);
    wsPontuacoes.getRange(novaLinha, 3).setValue(formData.tipo);
    wsPontuacoes.getRange(novaLinha, 4).setValue(formData.descricao);
    wsPontuacoes.getRange(novaLinha, 5).setValue(pontuacao);
    wsPontuacoes.getRange(novaLinha, 6).setValue(dataAjustada);
    
    // Limpar cache e atualizar dashboard
    limparCacheVereadores();
    atualizarDashboard();
    
    return {
      success: true, 
      message: "Registro salvo com sucesso!"
    };
  } catch (e) {
    return {
      success: false, 
      message: "Erro ao salvar: " + e.message
    };
  }
}

/**
 * Registra indicações em bloco
 * @param {Object} formData - Dados do formulário com informações das indicações
 * @return {Object} Resultado da operação (sucesso/erro) 
 */
function registrarIndicacoesBlocoBackend(formData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const wsSessoes = ss.getSheetByName("Sessões");
    const wsVereadores = ss.getSheetByName("Vereadores");
    const wsPontuacoes = ss.getSheetByName("Pontuações");
    
    // Ajustar a data para evitar problemas de fuso horário
    const dataParts = formData.data.split('-');
    const dataAjustada = new Date(dataParts[0], dataParts[1]-1, dataParts[2], 12, 0, 0);
    
    // Obter ID da sessão
    const sessaoID = parseInt(formData.sessaoID);
    
    // Verificar se é nova sessão
    const dadosSessoes = wsSessoes.getDataRange().getValues();
    let sessaoExistente = false;
    
    for (let i = 1; i < dadosSessoes.length; i++) {
      if (dadosSessoes[i][0] === sessaoID) {
        sessaoExistente = true;
        break;
      }
    }
    
    // Se for nova sessão, registrá-la
    if (!sessaoExistente) {
      const novaLinha = wsSessoes.getLastRow() + 1;
      wsSessoes.getRange(novaLinha, 1).setValue(sessaoID);
      wsSessoes.getRange(novaLinha, 2).setValue(dataAjustada);
      wsSessoes.getRange(novaLinha, 3).setValue("Sessão de " + Utilities.formatDate(dataAjustada, Session.getScriptTimeZone(), "dd/MM/yyyy"));
    }
    
    // Criar mapa de vereadores para otimizar busca
    const numVereadores = countVereadores();
    const dadosVereadores = wsVereadores.getRange(2, 1, numVereadores, 2).getValues();
    const mapaVereadores = {};
    
    for (let i = 0; i < dadosVereadores.length; i++) {
      mapaVereadores[dadosVereadores[i][1]] = dadosVereadores[i][0];
    }
    
    // Processar cada indicação
    let registrosProcessados = 0;
    let erros = [];
    
    for (const indicacao of formData.indicacoes) {
      try {
        // Validar dados da indicação
        if (!indicacao.vereador || !indicacao.descricao || indicacao.pontuacao === undefined) {
          erros.push(`Indicação incompleta para ${indicacao.vereador || 'vereador não especificado'}`);
          continue;
        }
        
        const vereadorID = mapaVereadores[indicacao.vereador];
        if (!vereadorID) {
          erros.push(`Vereador não encontrado: ${indicacao.vereador}`);
          continue;
        }
        
        // Validar pontuação
        const pontuacao = parseFloat(indicacao.pontuacao);
        if (isNaN(pontuacao) || pontuacao < 0.1 || pontuacao > 3) {
          erros.push(`Pontuação inválida para ${indicacao.vereador}: ${indicacao.pontuacao}`);
          continue;
        }
        
        // Registrar pontuação
        const novaLinha = wsPontuacoes.getLastRow() + 1;
        wsPontuacoes.getRange(novaLinha, 1).setValue(sessaoID);
        wsPontuacoes.getRange(novaLinha, 2).setValue(vereadorID);
        wsPontuacoes.getRange(novaLinha, 3).setValue("Indicação");
        wsPontuacoes.getRange(novaLinha, 4).setValue(indicacao.descricao);
        wsPontuacoes.getRange(novaLinha, 5).setValue(pontuacao);
        wsPontuacoes.getRange(novaLinha, 6).setValue(dataAjustada);
        
        registrosProcessados++;
        
      } catch (e) {
        erros.push(`Erro ao processar indicação: ${e.message}`);
      }
    }
    
    // Limpar cache antes de atualizar dashboard
    if (registrosProcessados > 0) {
      limparCacheVereadores();
      atualizarDashboard();
    }
    
    // Retornar resultado
    if (erros.length === 0) {
      return {
        success: true,
        message: `${registrosProcessados} indicações registradas com sucesso!`
      };
    } else if (registrosProcessados > 0) {
      return {
        success: true,
        message: `${registrosProcessados} indicações registradas. Erros encontrados: ${erros.join('; ')}`
      };
    } else {
      return {
        success: false,
        message: `Nenhuma indicação foi registrada. Erros: ${erros.join('; ')}`
      };
    }
    
  } catch (e) {
    return {
      success: false,
      message: "Erro ao processar indicações: " + e.message
    };
  }
}

/**
 * Registra propositura a partir do formulário
 * @param {Object} formData - Dados do formulário com informações da propositura
 * @return {Object} Resultado da operação (sucesso/erro)
 */
function registrarAtividadePropositura(formData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const wsVereadores = ss.getSheetByName("Vereadores");
    const wsPontuacoes = ss.getSheetByName("Pontuações");
    
    // Ajustar a data para evitar problemas de fuso horário
    const dataParts = formData.data.split('-');
    const dataAjustada = new Date(dataParts[0], dataParts[1]-1, dataParts[2], 12, 0, 0);
    
    // Validar pontuação
    const pontuacao = parseFloat(formData.pontuacao);
    let pontuacaoMin = 0;
    let pontuacaoMax = 0;
    
    switch (formData.tipo) {
      case "Indicação":
      case "Requerimento":
        pontuacaoMin = 0.1;
        pontuacaoMax = 3;
        break;
      case "Projeto de Lei":
        pontuacaoMin = -5;
        pontuacaoMax = 5;
        break;
      case "Votação":
        pontuacaoMin = -4;
        pontuacaoMax = 4;
        break;
    }
    
    if (pontuacao < pontuacaoMin || pontuacao > pontuacaoMax) {
      return {
        success: false, 
        message: `Pontuação deve estar entre ${pontuacaoMin} e ${pontuacaoMax}!`
      };
    }
    
    // Usar um ID único para proposituras avulsas (sem sessão formal)
    // Número negativo para diferenciar de sessões regulares
    const proposituraID = -1 * (new Date().getTime());
    
    // Obter ID do vereador
    const numVereadores = countVereadores();
    const dadosVereadores = wsVereadores.getRange(2, 1, numVereadores, 2).getValues();
    let vereadorID = 0;
    
    for (let i = 0; i < dadosVereadores.length; i++) {
      if (dadosVereadores[i][1] === formData.vereador) {
        vereadorID = dadosVereadores[i][0];
        break;
      }
    }
    
    if (vereadorID === 0) {
      return {
        success: false, 
        message: "Vereador não encontrado!"
      };
    }
    
    // Registrar pontuação
    const novaLinha = wsPontuacoes.getLastRow() + 1;
    wsPontuacoes.getRange(novaLinha, 1).setValue(proposituraID);
    wsPontuacoes.getRange(novaLinha, 2).setValue(vereadorID);
    wsPontuacoes.getRange(novaLinha, 3).setValue(formData.tipo);
    wsPontuacoes.getRange(novaLinha, 4).setValue(formData.descricao);
    wsPontuacoes.getRange(novaLinha, 5).setValue(pontuacao);
    wsPontuacoes.getRange(novaLinha, 6).setValue(dataAjustada);
    
    // Limpar cache e atualizar dashboard
    limparCacheVereadores();
    atualizarDashboard();
    
    return {
      success: true, 
      message: "Propositura registrada com sucesso!"
    };
  } catch (e) {
    return {
      success: false, 
      message: "Erro ao salvar: " + e.message
    };
  }
}