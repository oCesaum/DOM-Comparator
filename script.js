// Configuração do robô de sitemap
const sitemapRobot = {
    // URLs comuns de sitemap para tentar automaticamente
    commonSitemapPaths: [
        '/sitemap.xml',
        '/sitemap_index.xml',
        '/sitemaps.xml',
        '/sitemap/sitemap.xml',
        '/sitemap/index.xml',
        '/sitemap.xml.gz',
        '/sitemap/sitemap.xml.gz'
    ],
    
    // Headers para requisições
    headers: {
        'User-Agent': 'SitemapComparatorRobot/1.0',
        'Accept': 'application/xml, text/xml, */*',
        'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8'
    }
};

// Elementos DOM
let sitemapATextarea, sitemapBTextarea, compareBtn, analyzeBtn;
let resultSection, errorSection, operationCount, sitemapStatus, analysisStatus;
let urlResult, priorityResult, frequencyResult, dateResult, statsResult, groupingResult;
let errorMessage, sitemapInfo, analysisInfo, previewA, previewB;
let themeToggle, themeIcon;
let notificationPopup, notificationIcon, notificationTitle, notificationMessage, closeNotification;
let executiveSummary, executiveSummaryContent;
let sideBySideComparison, sideBySideContent;

// Variáveis globais para filtros e paginação
let currentPage = 1;
let itemsPerPage = 25;
let activeFilters = { type: 'all', search: '' };
let currentDifferences = null;

// Elementos DOM para comparação de dois sites
let twoSitesConfig;
let siteUrlAInput, sitemapUrlAInput, fetchSitemapABtn;
let siteUrlBInput, sitemapUrlBInput, fetchSitemapBBtn;
let compareTwoSitesBtn, manualSitemapABtn, manualSitemapBBtn;

// Elementos DOM do Comparador HTML
let htmlComparatorInterface, htmlATextarea, htmlBTextarea, compareHtmlBtn, previewBtn;
let normalizedA, normalizedB, normalizationStatus, normalizationInfo;
let normalizeWhitespace, normalizeAttributes, ignoreComments, normalizeCase;
let textResult, domResult, attributeResult, hashResult, normalizedResult;
let sitemapMethods, htmlMethods;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
});

function initializeElements() {
    // Elementos de configuração do site (removidos - apenas modo de 2 sites)
    
    // Elementos de sitemap
    sitemapATextarea = document.getElementById('sitemapA');
    sitemapBTextarea = document.getElementById('sitemapB');
    compareBtn = document.getElementById('compareBtn');
    analyzeBtn = document.getElementById('analyzeBtn');
    
    // Elementos de resultado
    resultSection = document.getElementById('resultSection');
    errorSection = document.getElementById('errorSection');
    sitemapStatus = document.getElementById('sitemapStatus');
    analysisStatus = document.getElementById('analysisStatus');
    operationCount = document.getElementById('operationCount');
    
    // Elementos do resumo executivo
    executiveSummary = document.getElementById('executiveSummary');
    executiveSummaryContent = document.getElementById('executiveSummaryContent');
    
    // Elementos da comparação lado a lado
    sideBySideComparison = document.getElementById('sideBySideComparison');
    sideBySideContent = document.getElementById('sideBySideContent');
    
    // Elementos de resultado específicos
    urlResult = document.getElementById('urlResult');
    priorityResult = document.getElementById('priorityResult');
    frequencyResult = document.getElementById('frequencyResult');
    dateResult = document.getElementById('dateResult');
    statsResult = document.getElementById('statsResult');
    groupingResult = document.getElementById('groupingResult');
    
    // Elementos de informação
    errorMessage = document.getElementById('errorMessage');
    sitemapInfo = document.getElementById('sitemapInfo');
    analysisInfo = document.getElementById('analysisInfo');
    previewA = document.getElementById('previewA');
    previewB = document.getElementById('previewB');
    
    // Elementos do tema
    themeToggle = document.getElementById('themeToggle');
    themeIcon = document.getElementById('themeIcon');
    
    // Elementos do popup de notificação
    notificationPopup = document.getElementById('notificationPopup');
    notificationIcon = document.getElementById('notificationIcon');
    notificationTitle = document.getElementById('notificationTitle');
    notificationMessage = document.getElementById('notificationMessage');
    closeNotification = document.getElementById('closeNotification');
    
    // Elementos para comparação de dois sites
    twoSitesConfig = document.getElementById('twoSitesConfig');
    siteUrlAInput = document.getElementById('siteUrlA');
    sitemapUrlAInput = document.getElementById('sitemapUrlA');
    fetchSitemapABtn = document.getElementById('fetchSitemapABtn');
    siteUrlBInput = document.getElementById('siteUrlB');
    sitemapUrlBInput = document.getElementById('sitemapUrlB');
    fetchSitemapBBtn = document.getElementById('fetchSitemapBBtn');
    compareTwoSitesBtn = document.getElementById('compareTwoSitesBtn');
    manualSitemapABtn = document.getElementById('manualSitemapABtn');
    manualSitemapBBtn = document.getElementById('manualSitemapBBtn');
    
    // Elementos do Comparador HTML
    htmlComparatorInterface = document.getElementById('htmlComparatorInterface');
    htmlATextarea = document.getElementById('htmlA');
    htmlBTextarea = document.getElementById('htmlB');
    compareHtmlBtn = document.getElementById('compareHtmlBtn');
    previewBtn = document.getElementById('previewBtn');
    normalizedA = document.getElementById('normalizedA');
    normalizedB = document.getElementById('normalizedB');
    normalizationStatus = document.getElementById('normalizationStatus');
    normalizationInfo = document.getElementById('normalizationInfo');
    
    // Checkboxes de normalização
    normalizeWhitespace = document.getElementById('normalizeWhitespace');
    normalizeAttributes = document.getElementById('normalizeAttributes');
    ignoreComments = document.getElementById('ignoreComments');
    normalizeCase = document.getElementById('normalizeCase');
    
    // Elementos de resultado do HTML
    textResult = document.getElementById('textResult');
    domResult = document.getElementById('domResult');
    attributeResult = document.getElementById('attributeResult');
    hashResult = document.getElementById('hashResult');
    normalizedResult = document.getElementById('normalizedResult');
    
    // Containers de métodos
    sitemapMethods = document.getElementById('sitemapMethods');
    htmlMethods = document.getElementById('htmlMethods');
}

function setupEventListeners() {
    // Eventos dos botões principais (removidos - apenas modo de 2 sites)
    compareBtn.addEventListener('click', compareSitemaps);
    analyzeBtn.addEventListener('click', analyzeSitemap);
    
    // Eventos para comparação de dois sites
    fetchSitemapABtn.addEventListener('click', () => fetchSitemapForSite('A'));
    fetchSitemapBBtn.addEventListener('click', () => fetchSitemapForSite('B'));
    compareTwoSitesBtn.addEventListener('click', compareTwoSites);
    manualSitemapABtn.addEventListener('click', () => showManualSitemapDialogForSite('A'));
    manualSitemapBBtn.addEventListener('click', () => showManualSitemapDialogForSite('B'));
    
    // Eventos do Comparador HTML
    compareHtmlBtn.addEventListener('click', compareHTML);
    previewBtn.addEventListener('click', previewNormalization);
    
    // Eventos de mudança nos textareas
    sitemapATextarea.addEventListener('input', updateSitemapPreview);
    sitemapBTextarea.addEventListener('input', updateSitemapPreview);
    htmlATextarea.addEventListener('input', hideResults);
    htmlBTextarea.addEventListener('input', hideResults);
    
    // Eventos nos campos de URL (removidos - apenas modo de 2 sites)
    
    // Eventos nos checkboxes para atualizar prévia em tempo real
    normalizeWhitespace.addEventListener('change', updatePreview);
    normalizeAttributes.addEventListener('change', updatePreview);
    ignoreComments.addEventListener('change', updatePreview);
    normalizeCase.addEventListener('change', updatePreview);
    
    // Eventos do seletor de modo
    const modeRadios = document.querySelectorAll('input[name="comparatorMode"]');
    modeRadios.forEach(radio => {
        radio.addEventListener('change', switchComparatorMode);
    });
    
    // Eventos do seletor de modo de comparação (removido - apenas modo de 2 sites)
    
    // Evento do toggle de tema
    themeToggle.addEventListener('click', toggleTheme);
    
    // Evento do botão de fechar notificação
    closeNotification.addEventListener('click', hideNotification);
    
    // Event listeners para filtros
    const urlTypeFilter = document.getElementById('urlTypeFilter');
    const urlSearch = document.getElementById('urlSearch');
    const clearFilters = document.getElementById('clearFilters');
    const itemsPerPageSelect = document.getElementById('itemsPerPage');
    
    if (urlTypeFilter) {
        urlTypeFilter.addEventListener('change', (e) => {
            activeFilters.type = e.target.value;
            applyFilters();
        });
    }
    
    if (urlSearch) {
        urlSearch.addEventListener('input', (e) => {
            activeFilters.search = e.target.value;
            applyFilters();
        });
    }
    
    if (clearFilters) {
        clearFilters.addEventListener('click', () => {
            activeFilters.type = 'all';
            activeFilters.search = '';
            urlTypeFilter.value = 'all';
            urlSearch.value = '';
            applyFilters();
        });
    }
    
    if (itemsPerPageSelect) {
        itemsPerPageSelect.addEventListener('change', (e) => {
            itemsPerPage = parseInt(e.target.value);
            currentPage = 1;
            if (currentDifferences) {
                applyFilters();
            }
        });
    }
    
    // Event listeners para exportação
    const exportCSVBtn = document.getElementById('exportCSV');
    const exportJSONBtn = document.getElementById('exportJSON');
    
    if (exportCSVBtn) {
        exportCSVBtn.addEventListener('click', () => {
            if (currentDifferences && window.lastComparisonStats) {
                exportToCSV(currentDifferences, window.lastComparisonStats);
            } else {
                showError('Nenhuma comparação disponível para exportação. Execute uma comparação primeiro.');
            }
        });
    }
    
    if (exportJSONBtn) {
        exportJSONBtn.addEventListener('click', () => {
            if (currentDifferences && window.lastComparisonStats) {
                exportToJSON(currentDifferences, window.lastComparisonStats);
            } else {
                showError('Nenhuma comparação disponível para exportação. Execute uma comparação primeiro.');
            }
        });
    }
    
    // Inicializa o tema
    initializeTheme();
    
    // Listener para mudanças na preferência do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    // Carrega DOM Comparator
    loadDOMComparator();
    
    // Inicializa o modo correto
    switchComparatorMode();
    
    // Inicializa o modo de comparação (apenas 2 sites)
}

// FUNÇÕES PRINCIPAIS DO ROBÔ DE SITEMAP

// Função removida - apenas modo de 2 sites

// Função removida - apenas modo de 2 sites

// Compara dois sitemaps
async function compareSitemaps() {
    const sitemapA = sitemapATextarea.value.trim();
    const sitemapB = sitemapBTextarea.value.trim();
    
    if (!sitemapA || !sitemapB) {
        showError('Por favor, preencha ambos os campos de sitemap.');
        return;
    }

    showLoading(compareBtn, '<i class="fas fa-search mr-2"></i>Comparando sitemaps...');
    hideResults();

    try {
        // Parse dos sitemaps
        const parsedA = parseSitemap(sitemapA);
        const parsedB = parseSitemap(sitemapB);
        
        if (!parsedA.success || !parsedB.success) {
            showError('Erro ao fazer parse dos sitemaps. Verifique se são XML válidos.');
            return;
        }
        
        // Validação adicional dos dados parseados
        if (!parsedA.data || !Array.isArray(parsedA.data) || !parsedB.data || !Array.isArray(parsedB.data)) {
            showError('Erro: Dados do sitemap inválidos após o parse.');
            return;
        }
        
        // Executa comparações
        const urlDiffs = compareUrls(parsedA.data, parsedB.data);
        const priorityDiffs = comparePriorities(parsedA.data, parsedB.data);
        const frequencyDiffs = compareFrequencies(parsedA.data, parsedB.data);
        const dateDiffs = compareDates(parsedA.data, parsedB.data);
        const stats = generateStats(parsedA.data, parsedB.data);
        
        // Armazena estatísticas globalmente para exportação
        window.lastComparisonStats = stats;
        
        // Gera e exibe resumo executivo
        const executiveSummary = generateExecutiveSummary(urlDiffs, stats);
        const executiveSummaryContent = document.getElementById('executiveSummaryContent');
        const executiveSummarySection = document.getElementById('executiveSummary');
        
        if (executiveSummaryContent && executiveSummarySection) {
            executiveSummaryContent.innerHTML = formatExecutiveSummary(executiveSummary);
            executiveSummarySection.classList.remove('hidden');
            executiveSummarySection.classList.add('animate-fade-in');
        }
        
        // Exibe resultados
        urlResult.innerHTML = formatUrlComparison(urlDiffs);
        priorityResult.innerHTML = formatPriorityComparison(priorityDiffs);
        frequencyResult.innerHTML = formatFrequencyComparison(frequencyDiffs);
        dateResult.innerHTML = formatDateComparison(dateDiffs);
        statsResult.innerHTML = formatStatsComparison(stats);
        
        // Agrupamento inteligente
        const allUrls = [...urlDiffs.added, ...urlDiffs.removed, ...urlDiffs.modified.map(item => item.original)];
        const groupedUrls = groupUrlsByPattern(allUrls);
        groupingResult.innerHTML = formatGroupedUrls(groupedUrls);
        
        // Comparação lado a lado
        if (sideBySideContent && sideBySideComparison) {
            const sideBySideHtml = createSideBySideComparison(parsedA.data, parsedB.data);
            sideBySideContent.innerHTML = sideBySideHtml;
            sideBySideComparison.classList.remove('hidden');
            sideBySideComparison.classList.add('animate-fade-in');
        }

        // Atualiza contador
        const totalDiffs = urlDiffs.added.length + urlDiffs.removed.length + urlDiffs.modified.length +
                          priorityDiffs.length + frequencyDiffs.length + dateDiffs.length;
        operationCount.textContent = `${totalDiffs} diferença${totalDiffs !== 1 ? 's' : ''} encontrada${totalDiffs !== 1 ? 's' : ''}`;
        
        resultSection.classList.remove('hidden');
        resultSection.classList.add('animate-fade-in');
        
        // Notificações contextuais
        const context = analyzeComparisonContext(urlDiffs);
        showContextualNotifications(context);

    } catch (error) {
        showError(`Erro durante a comparação: ${error.message}`);
    } finally {
        hideLoading(compareBtn, '<i class="fas fa-search mr-2"></i>Comparar Sitemaps');
    }
}

// Analisa um sitemap individual
async function analyzeSitemap() {
    const sitemapA = sitemapATextarea.value.trim();
    
    if (!sitemapA) {
        showError('Por favor, primeiro busque um sitemap ou cole um sitemap no campo A.');
        return;
    }
    
    showLoading(analyzeBtn, '<i class="fas fa-chart-bar mr-2"></i>Analisando sitemap...');
    hideResults();
    
    try {
        const parsed = parseSitemap(sitemapA);
        
        if (!parsed.success) {
            showError('Erro ao fazer parse do sitemap. Verifique se é XML válido.');
            return;
        }
        
        const analysisData = analyzeSitemapData(parsed.data);
        const analysis = formatSitemapAnalysis(analysisData);
        showAnalysisStatus(analysis);
        
    } catch (error) {
        showError(`Erro durante a análise: ${error.message}`);
    } finally {
        hideLoading(analyzeBtn, '<i class="fas fa-chart-bar mr-2"></i>Analisar Sitemap');
    }
}

// FUNÇÕES AUXILIARES

function hideResults() {
    resultSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    sitemapStatus.classList.add('hidden');
    analysisStatus.classList.add('hidden');
}

// FUNÇÕES PARA COMPARAÇÃO DE DOIS SITES

// Modo de comparação fixo (apenas 2 sites)
// Função removida - sempre mostra configuração de 2 sites

// Busca sitemap para um site específico (A ou B)
async function fetchSitemapForSite(siteLetter) {
    const siteUrlInput = siteLetter === 'A' ? siteUrlAInput : siteUrlBInput;
    const sitemapUrlInput = siteLetter === 'A' ? sitemapUrlAInput : sitemapUrlBInput;
    const fetchBtn = siteLetter === 'A' ? fetchSitemapABtn : fetchSitemapBBtn;
    const sitemapTextarea = siteLetter === 'A' ? sitemapATextarea : sitemapBTextarea;
    const previewElement = siteLetter === 'A' ? previewA : previewB;
    
    const siteUrl = siteUrlInput.value.trim();
    const sitemapUrl = sitemapUrlInput.value.trim();
    
    if (!siteUrl) {
        showError(`Por favor, informe a URL do Site ${siteLetter}.`);
        return;
    }
    
    showLoading(fetchBtn, `<i class="fas fa-search mr-2"></i>Buscando sitemap ${siteLetter}...`);
    hideResults();
    
    try {
        let sitemapContent = '';
        let foundUrl = '';
        
        if (sitemapUrl) {
            // Usar URL específica fornecida
            foundUrl = sitemapUrl;
            sitemapContent = await fetchSitemapFromUrl(sitemapUrl);
        } else {
            // Buscar automaticamente
            const result = await findSitemap(siteUrl);
            foundUrl = result.url;
            sitemapContent = result.content;
        }
        
        if (sitemapContent) {
            sitemapTextarea.value = sitemapContent;
            updateSitemapPreview();
            showSitemapStatusForSite(siteLetter, foundUrl, sitemapContent);
            showSuccess(`Sitemap ${siteLetter}`, `Sitemap do Site ${siteLetter} carregado com sucesso!`);
        } else {
            showError(`Não foi possível encontrar ou acessar o sitemap do Site ${siteLetter}.`);
        }
        
    } catch (error) {
        console.error(`Erro ao buscar sitemap ${siteLetter}:`, error);
        
        // Verifica se é erro de CORS
        if (error.message.includes('CORS') || error.message.includes('blocked')) {
            const targetUrl = sitemapUrl || `${siteUrl}/sitemap.xml`;
            showCorsErrorForSite(siteLetter, targetUrl);
        } else {
            showError(`Erro ao buscar sitemap ${siteLetter}: ${error.message}`);
        }
    } finally {
        hideLoading(fetchBtn, `<i class="fas fa-search mr-2"></i>Buscar Sitemap ${siteLetter}`);
    }
}

// Compara dois sites diretamente
async function compareTwoSites() {
    const siteUrlA = siteUrlAInput.value.trim();
    const siteUrlB = siteUrlBInput.value.trim();
    
    if (!siteUrlA || !siteUrlB) {
        showError('Por favor, informe as URLs de ambos os sites.');
        return;
    }
    
    if (siteUrlA === siteUrlB) {
        showError('Os dois sites não podem ser iguais. Use "Comparar Consigo Mesmo" no modo Site Único.');
        return;
    }
    
    showLoading(compareTwoSitesBtn, '<i class="fas fa-exchange-alt mr-2"></i>Comparando sites...');
    hideResults();
    
    try {
        // Busca sitemaps de ambos os sites
        showInfo('Comparação de Sites', 'Buscando sitemaps de ambos os sites...');
        
        const [resultA, resultB] = await Promise.all([
            fetchSitemapForSiteDirect(siteUrlA, sitemapUrlAInput.value.trim()),
            fetchSitemapForSiteDirect(siteUrlB, sitemapUrlBInput.value.trim())
        ]);
        
        // Verifica se pelo menos um sitemap foi obtido com sucesso
        if (!resultA.success && !resultB.success) {
            showError('Não foi possível obter os sitemaps de nenhum dos sites. Tente usar a opção "Inserir Manualmente".');
            showCorsErrorForTwoSites(siteUrlA, siteUrlB);
            return;
        }
        
        // Se apenas um sitemap foi obtido, mostra aviso
        if (!resultA.success || !resultB.success) {
            const failedSite = !resultA.success ? 'A' : 'B';
            const successSite = resultA.success ? 'A' : 'B';
            
            showWarning('Sitemap Parcial', `Sitemap do Site ${failedSite} não pôde ser obtido automaticamente. Você pode inserir manualmente ou continuar com apenas o Site ${successSite}.`);
        }
        
        // Preenche os campos com os sitemaps encontrados (ou vazio se falhou)
        sitemapATextarea.value = resultA.success ? resultA.content : '';
        sitemapBTextarea.value = resultB.success ? resultB.content : '';
        updateSitemapPreview();
        
        // Se ambos os sitemaps estão vazios, não pode comparar
        if (!sitemapATextarea.value && !sitemapBTextarea.value) {
            showError('Nenhum sitemap foi obtido. Use a opção "Inserir Manualmente" para colar o conteúdo dos sitemaps.');
            return;
        }
        
        // Se apenas um sitemap está disponível, mostra análise individual
        if (!sitemapATextarea.value || !sitemapBTextarea.value) {
            const availableSitemap = sitemapATextarea.value ? sitemapATextarea.value : sitemapBTextarea.value;
            const siteName = sitemapATextarea.value ? 'Site A' : 'Site B';
            
            showInfo('Análise Individual', `Analisando apenas o ${siteName} (o outro sitemap não pôde ser obtido).`);
            
            const parsed = parseSitemap(availableSitemap);
            if (parsed.success) {
                const analysisData = analyzeSitemapData(parsed.data);
                const analysis = formatSitemapAnalysis(analysisData);
                showAnalysisStatus(`Análise do ${siteName}:<br><br>${analysis}`);
            }
            return;
        }
        
        // Executa a comparação completa
        const parsedA = parseSitemap(resultA.content);
        const parsedB = parseSitemap(resultB.content);
        
        if (!parsedA.success || !parsedB.success) {
            showError('Erro ao fazer parse dos sitemaps. Verifique se são XML válidos.');
            return;
        }
        
        // Validação adicional dos dados parseados
        if (!parsedA.data || !Array.isArray(parsedA.data) || !parsedB.data || !Array.isArray(parsedB.data)) {
            showError('Erro: Dados do sitemap inválidos após o parse.');
            return;
        }
        
        // Executa comparações
        const urlDiffs = compareUrls(parsedA.data, parsedB.data);
        const priorityDiffs = comparePriorities(parsedA.data, parsedB.data);
        const frequencyDiffs = compareFrequencies(parsedA.data, parsedB.data);
        const dateDiffs = compareDates(parsedA.data, parsedB.data);
        const stats = generateStats(parsedA.data, parsedB.data);
        
        // Armazena estatísticas globalmente para exportação
        window.lastComparisonStats = stats;
        
        // Gera e exibe resumo executivo
        const executiveSummary = generateExecutiveSummary(urlDiffs, stats);
        const executiveSummaryContent = document.getElementById('executiveSummaryContent');
        const executiveSummarySection = document.getElementById('executiveSummary');
        
        if (executiveSummaryContent && executiveSummarySection) {
            executiveSummaryContent.innerHTML = formatExecutiveSummary(executiveSummary);
            executiveSummarySection.classList.remove('hidden');
            executiveSummarySection.classList.add('animate-fade-in');
        }
        
        // Exibe resultados
        urlResult.innerHTML = formatUrlComparison(urlDiffs);
        priorityResult.innerHTML = formatPriorityComparison(priorityDiffs);
        frequencyResult.innerHTML = formatFrequencyComparison(frequencyDiffs);
        dateResult.innerHTML = formatDateComparison(dateDiffs);
        statsResult.innerHTML = formatStatsComparison(stats);
        
        // Agrupamento inteligente
        const allUrls = [...urlDiffs.added, ...urlDiffs.removed, ...urlDiffs.modified.map(item => item.original)];
        const groupedUrls = groupUrlsByPattern(allUrls);
        groupingResult.innerHTML = formatGroupedUrls(groupedUrls);
        
        // Comparação lado a lado
        if (sideBySideContent && sideBySideComparison) {
            const sideBySideHtml = createSideBySideComparison(parsedA.data, parsedB.data);
            sideBySideContent.innerHTML = sideBySideHtml;
            sideBySideComparison.classList.remove('hidden');
            sideBySideComparison.classList.add('animate-fade-in');
        }

        // Atualiza contador
        const totalDiffs = urlDiffs.added.length + urlDiffs.removed.length + urlDiffs.modified.length +
                          priorityDiffs.length + frequencyDiffs.length + dateDiffs.length;
        operationCount.textContent = `${totalDiffs} diferença${totalDiffs !== 1 ? 's' : ''} encontrada${totalDiffs !== 1 ? 's' : ''}`;
        
        resultSection.classList.remove('hidden');
        resultSection.classList.add('animate-fade-in');
        
        // Notificações contextuais
        const context = analyzeComparisonContext(urlDiffs);
        showContextualNotifications(context);
        
        showSuccess('Comparação Concluída', `Sites comparados com sucesso! ${totalDiffs} diferença${totalDiffs !== 1 ? 's' : ''} encontrada${totalDiffs !== 1 ? 's' : ''}.`);
        
    } catch (error) {
        showError(`Erro durante a comparação: ${error.message}`);
    } finally {
        hideLoading(compareTwoSitesBtn, '<i class="fas fa-exchange-alt mr-3"></i>Comparar os 2 Sites');
    }
}

// Busca sitemap diretamente para um site (função auxiliar)
async function fetchSitemapForSiteDirect(siteUrl, sitemapUrl) {
    try {
        let sitemapContent = '';
        let foundUrl = '';
        
        if (sitemapUrl) {
            foundUrl = sitemapUrl;
            sitemapContent = await fetchSitemapFromUrl(sitemapUrl);
        } else {
            const result = await findSitemap(siteUrl);
            foundUrl = result.url;
            sitemapContent = result.content;
        }
        
        return { success: true, content: sitemapContent, url: foundUrl };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Mostra status do sitemap para um site específico
function showSitemapStatusForSite(siteLetter, url, content) {
    const parsed = parseSitemap(content);
    let info = `<strong>Sitemap ${siteLetter} encontrado:</strong><br>`;
    info += `• URL: ${escapeHtml(url)}<br>`;
    info += `• Tamanho: ${content.length} caracteres<br>`;
    
    if (parsed.success) {
        info += `• Itens: ${parsed.data.length}<br>`;
        info += `• Tipo: ${parsed.data[0]?.type === 'sitemap' ? 'Sitemap Index' : 'Sitemap de URLs'}<br>`;
        info += `<span class="result-success"><i class="fas fa-check-circle mr-2"></i>Sitemap ${siteLetter} válido e processado com sucesso</span>`;
    } else {
        info += `<span class="result-error"><i class="fas fa-exclamation-triangle mr-2"></i>Erro no parse: ${parsed.error}</span>`;
    }
    
    sitemapInfo.innerHTML = info;
    sitemapStatus.classList.remove('hidden');
}

// Mostra erro de CORS para um site específico
function showCorsErrorForSite(siteLetter, url) {
    let info = `<strong><i class="fas fa-exclamation-triangle mr-2"></i>Erro de CORS no Site ${siteLetter}:</strong><br><br>`;
    info += `O site <strong>${escapeHtml(url)}</strong> bloqueia requisições CORS.<br><br>`;
    info += `<strong><i class="fas fa-lightbulb mr-2"></i>Soluções:</strong><br>`;
    info += `1. <strong>Copie manualmente:</strong> Acesse ${escapeHtml(url)} no seu navegador e cole o conteúdo<br>`;
    info += `2. <strong>Use extensão CORS:</strong> Instale uma extensão como "CORS Unblock"<br>`;
    info += `3. <strong>Proxy local:</strong> Configure um proxy local para desenvolvimento<br><br>`;
    info += `<button onclick="openSitemapUrl('${escapeHtml(url)}')" class="btn btn--secondary btn--sm">Abrir Sitemap ${siteLetter} no Navegador</button>`;
    
    sitemapInfo.innerHTML = info;
    sitemapStatus.classList.remove('hidden');
}

// Mostra erro de CORS para dois sites
function showCorsErrorForTwoSites(siteUrlA, siteUrlB) {
    let info = `<strong><i class="fas fa-exclamation-triangle mr-2"></i>Erro de CORS em Ambos os Sites:</strong><br><br>`;
    info += `Os sites <strong>${escapeHtml(siteUrlA)}</strong> e <strong>${escapeHtml(siteUrlB)}</strong> bloqueiam requisições CORS.<br><br>`;
    info += `<strong><i class="fas fa-lightbulb mr-2"></i>Soluções:</strong><br>`;
    info += `1. <strong>Copie manualmente:</strong> Acesse os sitemaps no navegador e cole o conteúdo nos campos<br>`;
    info += `2. <strong>Use extensão CORS:</strong> Instale uma extensão como "CORS Unblock"<br>`;
    info += `3. <strong>Proxy local:</strong> Configure um proxy local para desenvolvimento<br><br>`;
    info += `<strong><i class="fas fa-download mr-2"></i>Links diretos:</strong><br>`;
    info += `<button onclick="openSitemapUrl('${escapeHtml(siteUrlA)}/sitemap.xml')" class="btn btn--secondary btn--sm mr-2">Abrir Sitemap A</button>`;
    info += `<button onclick="openSitemapUrl('${escapeHtml(siteUrlB)}/sitemap.xml')" class="btn btn--secondary btn--sm">Abrir Sitemap B</button>`;
    
    sitemapInfo.innerHTML = info;
    sitemapStatus.classList.remove('hidden');
}

// Busca sitemap automaticamente
async function findSitemap(siteUrl) {
    const baseUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
    
    for (const path of sitemapRobot.commonSitemapPaths) {
        try {
            const url = baseUrl + path;
            const content = await fetchSitemapFromUrl(url);
            if (content) {
                return { url, content };
            }
        } catch (error) {
            // Continua tentando outros caminhos
            continue;
        }
    }
    
    throw new Error('Nenhum sitemap encontrado nos caminhos comuns');
}

// Busca sitemap de uma URL específica
async function fetchSitemapFromUrl(url) {
    try {
        // Tenta primeiro com CORS
        let response;
        try {
            response = await fetch(url, {
                method: 'GET',
                headers: sitemapRobot.headers,
                mode: 'cors'
            });
        } catch (corsError) {
            console.warn('CORS bloqueado, tentando com proxy:', corsError.message);
            // Se CORS falhar, usa proxy
            response = await fetchWithProxy(url);
        }
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const content = await response.text();
        
        // Verifica se é um sitemap válido
        if (content.includes('<urlset') || content.includes('<sitemapindex')) {
            return content;
        } else {
            throw new Error('Conteúdo não parece ser um sitemap válido');
        }
        
    } catch (error) {
        throw new Error(`Erro ao buscar sitemap: ${error.message}`);
    }
}

// Busca sitemap usando proxy CORS
async function fetchWithProxy(url) {
    const proxyUrls = [
        // Proxy 1: AllOrigins (mais confiável)
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        
        // Proxy 2: CORS Anywhere (backup)
        `https://cors-anywhere.herokuapp.com/${url}`,
        
        // Proxy 3: CodeTabs
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
        
        // Proxy 4: CORS Proxy (novo)
        `https://corsproxy.io/?${encodeURIComponent(url)}`,
        
        // Proxy 5: ThingProxy (backup adicional)
        `https://thingproxy.freeboard.io/fetch/${url}`,
        
        // Proxy 6: Yacdn (proxy alternativo)
        `https://yacdn.org/proxy/${url}`,
        
        // Proxy 7: Proxy CORS (mais um backup)
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}&format=text`
    ];
    
    const proxyNames = ['AllOrigins', 'CORS Anywhere', 'CodeTabs', 'CORS Proxy', 'ThingProxy', 'Yacdn', 'CodeTabs Text'];
    
    for (let i = 0; i < proxyUrls.length; i++) {
        const proxyUrl = proxyUrls[i];
        const proxyName = proxyNames[i];
        
        try {
            console.log(`Tentando proxy ${i + 1}/${proxyUrls.length}: ${proxyName}`);
            
            const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': sitemapRobot.headers['User-Agent'],
                    'Accept': 'application/xml, text/xml, */*'
                },
                // Timeout de 10 segundos
                signal: AbortSignal.timeout(10000)
            });
            
            if (response.ok) {
                let content;
                
                try {
                    if (proxyUrl.includes('allorigins.win')) {
                        const data = await response.json();
                        content = data.contents;
                    } else if (proxyUrl.includes('corsproxy.io')) {
                        content = await response.text();
                    } else if (proxyUrl.includes('thingproxy.freeboard.io')) {
                        content = await response.text();
                    } else if (proxyUrl.includes('yacdn.org')) {
                        content = await response.text();
                    } else {
                        content = await response.text();
                    }
                    
                    // Valida se o conteúdo é um sitemap válido
                    if (content && typeof content === 'string' && 
                        (content.includes('<urlset') || content.includes('<sitemapindex'))) {
                        console.log(`✅ Proxy ${proxyName} funcionou!`);
                        return { ok: true, text: () => Promise.resolve(content) };
                    } else {
                        console.warn(`❌ Proxy ${proxyName} retornou conteúdo inválido`);
                    }
                } catch (parseError) {
                    console.warn(`❌ Erro ao processar resposta do proxy ${proxyName}:`, parseError.message);
                }
            } else {
                console.warn(`❌ Proxy ${proxyName} retornou status ${response.status}`);
            }
        } catch (proxyError) {
            console.warn(`❌ Proxy ${proxyName} falhou:`, proxyError.message);
            continue;
        }
    }
    
    throw new Error('Todos os proxies CORS falharam. Use a opção "Inserir Manualmente" para colar o conteúdo do sitemap.');
}

// Faz parse do XML do sitemap
function parseSitemap(xmlContent) {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
        
        // Verifica se há erros de parsing
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            return { success: false, error: 'XML inválido' };
        }
        
        const urls = [];
        
        // Verifica se é um sitemap index
        const sitemapIndex = xmlDoc.querySelector('sitemapindex');
        if (sitemapIndex) {
            const sitemaps = xmlDoc.querySelectorAll('sitemap');
            sitemaps.forEach(sitemap => {
                const loc = sitemap.querySelector('loc')?.textContent;
                const lastmod = sitemap.querySelector('lastmod')?.textContent;
                if (loc) {
                    urls.push({
                        url: loc,
                        lastmod: lastmod || null,
                        type: 'sitemap'
                    });
                }
            });
        } else {
            // É um sitemap normal
            const urlElements = xmlDoc.querySelectorAll('url');
            urlElements.forEach(urlElement => {
                const loc = urlElement.querySelector('loc')?.textContent;
                const lastmod = urlElement.querySelector('lastmod')?.textContent;
                const changefreq = urlElement.querySelector('changefreq')?.textContent;
                const priority = urlElement.querySelector('priority')?.textContent;
                
                if (loc) {
                    urls.push({
                        url: loc,
                        lastmod: lastmod || null,
                        changefreq: changefreq || null,
                        priority: priority ? parseFloat(priority) : null,
                        type: 'url'
                    });
                }
            });
        }
        
        return { success: true, data: urls };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Atualiza prévia dos sitemaps
function updateSitemapPreview() {
    const sitemapA = sitemapATextarea.value;
    const sitemapB = sitemapBTextarea.value;
    
    if (sitemapA) {
        const parsed = parseSitemap(sitemapA);
        if (parsed.success) {
            previewA.textContent = `Sitemap válido com ${parsed.data.length} itens`;
        } else {
            previewA.textContent = 'Sitemap inválido';
        }
    } else {
        previewA.textContent = '(vazio)';
    }
    
    if (sitemapB) {
        const parsed = parseSitemap(sitemapB);
        if (parsed.success) {
            previewB.textContent = `Sitemap válido com ${parsed.data.length} itens`;
        } else {
            previewB.textContent = 'Sitemap inválido';
        }
    } else {
        previewB.textContent = '(vazio)';
    }
}

// FUNÇÕES DE COMPARAÇÃO

// Compara URLs entre sitemaps
function compareUrls(sitemapA, sitemapB) {
    const urlsA = new Map(sitemapA.map(item => [item.url, item]));
    const urlsB = new Map(sitemapB.map(item => [item.url, item]));
    
    const added = [];
    const removed = [];
    const modified = [];
    
    // URLs adicionadas em B
    for (const [url, itemB] of urlsB) {
        if (!urlsA.has(url)) {
            added.push(itemB);
        }
    }
    
    // URLs removidas de A
    for (const [url, itemA] of urlsA) {
        if (!urlsB.has(url)) {
            removed.push(itemA);
        }
    }
    
    // URLs modificadas
    for (const [url, itemA] of urlsA) {
        if (urlsB.has(url)) {
            const itemB = urlsB.get(url);
            if (JSON.stringify(itemA) !== JSON.stringify(itemB)) {
                modified.push({ url, original: itemA, modified: itemB });
            }
        }
    }
    
    return { added, removed, modified };
}

// Compara prioridades
function comparePriorities(sitemapA, sitemapB) {
    const urlsA = new Map(sitemapA.map(item => [item.url, item]));
    const urlsB = new Map(sitemapB.map(item => [item.url, item]));
    
    const differences = [];
    
    for (const [url, itemA] of urlsA) {
        if (urlsB.has(url)) {
            const itemB = urlsB.get(url);
            if (itemA.priority !== itemB.priority) {
                differences.push({
                    url,
                    original: itemA.priority,
                    modified: itemB.priority
                });
            }
        }
    }

    return differences;
}

// Compara frequências
function compareFrequencies(sitemapA, sitemapB) {
    const urlsA = new Map(sitemapA.map(item => [item.url, item]));
    const urlsB = new Map(sitemapB.map(item => [item.url, item]));
    
    const differences = [];
    
    for (const [url, itemA] of urlsA) {
        if (urlsB.has(url)) {
            const itemB = urlsB.get(url);
            if (itemA.changefreq !== itemB.changefreq) {
                differences.push({
                    url,
                    original: itemA.changefreq,
                    modified: itemB.changefreq
                });
            }
        }
    }
    
    return differences;
}

// Compara datas
function compareDates(sitemapA, sitemapB) {
    const urlsA = new Map(sitemapA.map(item => [item.url, item]));
    const urlsB = new Map(sitemapB.map(item => [item.url, item]));
    
    const differences = [];
    
    for (const [url, itemA] of urlsA) {
        if (urlsB.has(url)) {
            const itemB = urlsB.get(url);
            if (itemA.lastmod !== itemB.lastmod) {
        differences.push({
                    url,
                    original: itemA.lastmod,
                    modified: itemB.lastmod
                });
            }
        }
    }

    return differences;
}

// Gera estatísticas comparativas
function generateStats(sitemapA, sitemapB) {
    const statsA = analyzeSitemapData(sitemapA);
    const statsB = analyzeSitemapData(sitemapB);
    
    return {
        sitemapA: statsA,
        sitemapB: statsB,
        comparison: {
            urlDifference: statsB.totalUrls - statsA.totalUrls,
            priorityDifference: statsB.avgPriority - statsA.avgPriority,
            frequencyDifference: statsB.frequencyDistribution,
            dateDifference: statsB.avgLastmod !== statsA.avgLastmod
        }
    };
}

// Analisa dados de um sitemap
function analyzeSitemapData(sitemapData) {
    if (!sitemapData || !Array.isArray(sitemapData)) {
        return {
            totalUrls: 0,
            avgPriority: 0,
            frequencyDistribution: {},
            avgLastmod: null,
            hasPriorities: false,
            hasFrequencies: false,
            hasDates: false
        };
    }
    
    const totalUrls = sitemapData.length;
    const priorities = sitemapData.filter(item => item.priority !== null).map(item => item.priority);
    const frequencies = sitemapData.filter(item => item.changefreq !== null).map(item => item.changefreq);
    const dates = sitemapData.filter(item => item.lastmod !== null).map(item => item.lastmod);
    
    const avgPriority = priorities.length > 0 ? 
        priorities.reduce((sum, p) => sum + p, 0) / priorities.length : 0;
    
    const frequencyDistribution = frequencies.reduce((acc, freq) => {
        if (freq && typeof freq === 'string') {
            acc[freq] = (acc[freq] || 0) + 1;
        }
        return acc;
    }, {});
    
    const avgLastmod = dates.length > 0 ? 
        dates.reduce((sum, date) => sum + new Date(date).getTime(), 0) / dates.length : null;
    
    return {
        totalUrls,
        avgPriority: Math.round(avgPriority * 100) / 100,
        frequencyDistribution,
        avgLastmod: avgLastmod ? new Date(avgLastmod).toISOString().split('T')[0] : null,
        hasPriorities: priorities.length > 0,
        hasFrequencies: frequencies.length > 0,
        hasDates: dates.length > 0
    };
}

// Formata análise individual de sitemap para exibição
function formatSitemapAnalysis(analysisData) {
    let analysis = `<strong>Análise do Sitemap:</strong><br><br>`;
    analysis += `• <strong>Total de URLs:</strong> ${analysisData.totalUrls}<br>`;
    analysis += `• <strong>Prioridade média:</strong> ${analysisData.avgPriority}<br>`;
    analysis += `• <strong>Tipos de frequência:</strong> ${Object.keys(analysisData.frequencyDistribution || {}).length}<br>`;
    analysis += `• <strong>Última modificação média:</strong> ${analysisData.avgLastmod || 'N/A'}<br><br>`;
    
    if (Object.keys(analysisData.frequencyDistribution || {}).length > 0) {
        analysis += `<strong>Distribuição de frequências:</strong><br>`;
        for (const [freq, count] of Object.entries(analysisData.frequencyDistribution)) {
            analysis += `• ${freq}: ${count} URLs<br>`;
        }
    }
    
    return analysis;
}

// FUNÇÕES DE FILTROS E BUSCA

// Filtra URLs por tipo de diferença
function filterUrlsByType(urls, type) {
    if (type === 'all') return urls;
    
    return urls.filter(item => {
        if (type === 'added') return item.type === 'added';
        if (type === 'removed') return item.type === 'removed';
        if (type === 'modified') return item.type === 'modified';
        return true;
    });
}

// Busca URLs por texto
function searchUrls(urls, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') return urls;
    
    const term = searchTerm.toLowerCase().trim();
    return urls.filter(item => {
        return item.url.toLowerCase().includes(term) ||
               (item.priority && item.priority.toString().includes(term)) ||
               (item.frequency && item.frequency.toLowerCase().includes(term)) ||
               (item.date && item.date.toLowerCase().includes(term));
    });
}

// Aplica todos os filtros ativos
function applyFilters() {
    if (!currentDifferences) return;
    
    let filteredData = [...currentDifferences.all];
    
    // Aplicar filtro por tipo
    if (activeFilters.type !== 'all') {
        filteredData = filterUrlsByType(filteredData, activeFilters.type);
    }
    
    // Aplicar busca por texto
    if (activeFilters.search) {
        filteredData = searchUrls(filteredData, activeFilters.search);
    }
    
    // Atualizar paginação
    currentPage = 1;
    updateUrlDisplay(filteredData);
}

// Atualiza a exibição das URLs com filtros aplicados
function updateUrlDisplay(filteredData) {
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    // Criar tabela paginada
    const tableHtml = createPaginatedTable(pageData, currentPage, totalPages, totalItems);
    urlResult.innerHTML = tableHtml;
}

// Cria tabela paginada com controles
function createPaginatedTable(data, currentPage, totalPages, totalItems) {
    if (data.length === 0) {
        return '<div class="text-center py-8 text-text-secondary"><i class="fas fa-search mr-2"></i>Nenhum resultado encontrado</div>';
    }
    
    let html = '<div class="overflow-x-auto">';
    html += '<table class="w-full text-sm border-collapse">';
    html += '<thead>';
    html += '<tr class="border-b border-border bg-surface-light">';
    html += '<th class="text-left p-3 font-semibold text-text">Tipo</th>';
    html += '<th class="text-left p-3 font-semibold text-text">URL</th>';
    html += '<th class="text-left p-3 font-semibold text-text">Prioridade</th>';
    html += '<th class="text-left p-3 font-semibold text-text">Frequência</th>';
    html += '<th class="text-left p-3 font-semibold text-text">Última Mod.</th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';
    
    data.forEach((item, index) => {
        const rowClass = index % 2 === 0 ? 'bg-surface' : 'bg-surface-light';
        const typeColor = item.type === 'added' ? 'text-success' : 
                         item.type === 'removed' ? 'text-error' : 'text-warning';
        const typeIcon = item.type === 'added' ? 'fas fa-plus' : 
                        item.type === 'removed' ? 'fas fa-minus' : 'fas fa-edit';
        const typeText = item.type === 'added' ? 'Adicionada' : 
                        item.type === 'removed' ? 'Removida' : 'Modificada';
        
        html += `<tr class="${rowClass} border-b border-border-light hover:bg-surface-light transition-colors duration-200">`;
        html += `<td class="p-3"><span class="${typeColor}"><i class="${typeIcon} mr-2"></i>${typeText}</span></td>`;
        html += `<td class="p-3 font-mono text-xs break-all">${escapeHtml(item.url)}</td>`;
        html += `<td class="p-3">${item.priority || 'N/A'}</td>`;
        html += `<td class="p-3">${item.changefreq || 'N/A'}</td>`;
        html += `<td class="p-3">${item.lastmod || 'N/A'}</td>`;
        html += '</tr>';
    });
    
    html += '</tbody>';
    html += '</table>';
    html += '</div>';
    
    // Controles de paginação
    html += '<div class="flex justify-between items-center mt-4 pt-4 border-t border-border">';
    html += `<div class="text-sm text-text-secondary">`;
    html += `Mostrando ${((currentPage - 1) * itemsPerPage) + 1} a ${Math.min(currentPage * itemsPerPage, totalItems)} de ${totalItems} resultados`;
    html += '</div>';
    
    html += '<div class="flex items-center gap-2">';
    
    // Botão Anterior
    if (currentPage > 1) {
        html += `<button onclick="changePage(-1)" class="px-3 py-2 bg-secondary text-text rounded-lg hover:bg-secondary-hover transition-colors duration-200">`;
        html += '<i class="fas fa-chevron-left mr-1"></i>Anterior';
        html += '</button>';
    }
    
    // Informações da página
    html += `<span class="px-3 py-2 bg-surface border border-border rounded-lg text-text">`;
    html += `Página ${currentPage} de ${totalPages}`;
    html += '</span>';
    
    // Botão Próxima
    if (currentPage < totalPages) {
        html += `<button onclick="changePage(1)" class="px-3 py-2 bg-secondary text-text rounded-lg hover:bg-secondary-hover transition-colors duration-200">`;
        html += 'Próxima<i class="fas fa-chevron-right ml-1"></i>';
        html += '</button>';
    }
    
    html += '</div>';
    html += '</div>';
    
    return html;
}

// Navega entre páginas
function changePage(direction) {
    if (!currentDifferences) return;
    
    const filteredData = getFilteredData();
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    const newPage = currentPage + direction;
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        updateUrlDisplay(filteredData);
    }
}

// Obtém dados filtrados
function getFilteredData() {
    if (!currentDifferences) return [];
    
    let filteredData = [...currentDifferences.all];
    
    if (activeFilters.type !== 'all') {
        filteredData = filterUrlsByType(filteredData, activeFilters.type);
    }
    
    if (activeFilters.search) {
        filteredData = searchUrls(filteredData, activeFilters.search);
    }
    
    return filteredData;
}

// FUNÇÕES DO RESUMO EXECUTIVO

// Gera resumo executivo inteligente
function generateExecutiveSummary(urlDiffs, stats) {
    const totalDifferences = urlDiffs.added.length + urlDiffs.removed.length + urlDiffs.modified.length;
    const similarity = calculateSiteSimilarity(stats.sitemapA, stats.sitemapB);
    const recommendations = generateRecommendations(urlDiffs, stats);
    
    return {
        totalDifferences,
        similarity,
        recommendations,
        stats
    };
}

// Calcula similaridade entre sites
function calculateSiteSimilarity(statsA, statsB) {
    if (statsA.totalUrls === 0 && statsB.totalUrls === 0) return 100;
    if (statsA.totalUrls === 0 || statsB.totalUrls === 0) return 0;
    
    const urlSimilarity = Math.min(statsA.totalUrls, statsB.totalUrls) / Math.max(statsA.totalUrls, statsB.totalUrls) * 100;
    const prioritySimilarity = Math.abs(statsA.avgPriority - statsB.avgPriority) <= 0.1 ? 100 : Math.max(0, 100 - Math.abs(statsA.avgPriority - statsB.avgPriority) * 50);
    
    return Math.round((urlSimilarity + prioritySimilarity) / 2);
}

// Gera recomendações automáticas
function generateRecommendations(diffs, stats) {
    const recommendations = [];
    
    // Análise de volume de diferenças
    if (diffs.added.length > 1000) {
        recommendations.push({
            type: 'warning',
            icon: 'fas fa-exclamation-triangle',
            title: 'Muitas URLs Adicionadas',
            message: `Site B tem ${diffs.added.length} URLs que não existem no Site A. Considere usar filtros para focar em categorias específicas.`
        });
    }
    
    if (diffs.removed.length > 1000) {
        recommendations.push({
            type: 'warning',
            icon: 'fas fa-exclamation-triangle',
            title: 'Muitas URLs Removidas',
            message: `${diffs.removed.length} URLs foram removidas do Site A. Verifique se são remoções intencionais.`
        });
    }
    
    // Análise de similaridade
    const similarity = calculateSiteSimilarity(stats.sitemapA, stats.sitemapB);
    if (similarity < 20) {
        recommendations.push({
            type: 'info',
            icon: 'fas fa-info-circle',
            title: 'Sites Completamente Diferentes',
            message: 'Os sites não compartilham muitas características. Esta é uma comparação entre sites totalmente diferentes.'
        });
    } else if (similarity > 80) {
        recommendations.push({
            type: 'success',
            icon: 'fas fa-check-circle',
            title: 'Sites Muito Similares',
            message: 'Os sites são muito similares. As diferenças detectadas são provavelmente pequenas atualizações.'
        });
    }
    
    // Análise de URLs modificadas
    if (diffs.modified.length === 0 && (diffs.added.length > 0 || diffs.removed.length > 0)) {
        recommendations.push({
            type: 'info',
            icon: 'fas fa-exchange-alt',
            title: 'Nenhuma URL Modificada',
            message: 'Não há URLs em comum entre os sites. Todas as diferenças são adições ou remoções completas.'
        });
    }
    
    // Análise de prioridades
    if (Math.abs(stats.sitemapA.avgPriority - stats.sitemapB.avgPriority) > 0.5) {
        recommendations.push({
            type: 'warning',
            icon: 'fas fa-star',
            title: 'Diferença Significativa de Prioridades',
            message: 'Os sites têm estratégias de priorização muito diferentes. Considere alinhar as prioridades.'
        });
    }
    
    return recommendations;
}

// Formata resumo executivo para exibição
function formatExecutiveSummary(summary) {
    let html = '';
    
    // Indicadores principais
    html += '<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">';
    
    // Total de diferenças
    html += '<div class="bg-surface p-6 rounded-xl border border-border text-center stats-card">';
    html += '<div class="text-3xl font-bold text-primary mb-2 counter-animate">' + summary.totalDifferences + '</div>';
    html += '<div class="text-sm text-text-secondary">Total de Diferenças</div>';
    html += '</div>';
    
    // Similaridade
    const similarityColor = summary.similarity > 70 ? 'text-success' : summary.similarity > 40 ? 'text-warning' : 'text-error';
    html += '<div class="bg-surface p-6 rounded-xl border border-border text-center stats-card similarity-indicator">';
    html += '<div class="text-3xl font-bold ' + similarityColor + ' mb-2 counter-animate">' + summary.similarity + '%</div>';
    html += '<div class="text-sm text-text-secondary">Similaridade</div>';
    html += '</div>';
    
    // Recomendações
    html += '<div class="bg-surface p-6 rounded-xl border border-border text-center stats-card">';
    html += '<div class="text-3xl font-bold text-accent mb-2 counter-animate">' + summary.recommendations.length + '</div>';
    html += '<div class="text-sm text-text-secondary">Recomendações</div>';
    html += '</div>';
    
    html += '</div>';
    
    // Gráficos de comparação
    html += '<div class="mb-8">';
    html += '<h4 class="text-lg font-bold text-text mb-4">Comparação Visual</h4>';
    html += createComparisonCharts(summary.stats);
    html += '</div>';
    
    // Recomendações
    if (summary.recommendations.length > 0) {
        html += '<div class="mb-8">';
        html += '<h4 class="text-lg font-bold text-text mb-4">Recomendações</h4>';
        html += '<div class="space-y-4">';
        
        summary.recommendations.forEach(rec => {
            const bgColor = rec.type === 'success' ? 'bg-success/10 border-success/20' :
                           rec.type === 'warning' ? 'bg-warning/10 border-warning/20' :
                           rec.type === 'error' ? 'bg-error/10 border-error/20' : 'bg-info/10 border-info/20';
            const textColor = rec.type === 'success' ? 'text-success' :
                             rec.type === 'warning' ? 'text-warning' :
                             rec.type === 'error' ? 'text-error' : 'text-info';
            
            html += '<div class="p-4 rounded-xl border ' + bgColor + '">';
            html += '<div class="flex items-start gap-3">';
            html += '<i class="' + rec.icon + ' ' + textColor + ' text-xl mt-1"></i>';
            html += '<div>';
            html += '<h5 class="font-bold text-text mb-1">' + rec.title + '</h5>';
            html += '<p class="text-text-secondary text-sm">' + rec.message + '</p>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
        });
        
        html += '</div>';
        html += '</div>';
    }
    
    return html;
}

// Cria gráficos de comparação com CSS
function createComparisonCharts(stats) {
    let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-6">';
    
    // Gráfico de barras para total de URLs
    html += '<div class="bg-surface p-4 rounded-xl border border-border">';
    html += '<h5 class="font-semibold text-text mb-3">Total de URLs</h5>';
    html += '<div class="space-y-3">';
    
    const maxUrls = Math.max(stats.sitemapA.totalUrls, stats.sitemapB.totalUrls);
    const percentageA = maxUrls > 0 ? (stats.sitemapA.totalUrls / maxUrls) * 100 : 0;
    const percentageB = maxUrls > 0 ? (stats.sitemapB.totalUrls / maxUrls) * 100 : 0;
    
    html += '<div>';
    html += '<div class="flex justify-between text-sm mb-1">';
    html += '<span class="text-text">Site A</span>';
    html += '<span class="text-text font-semibold counter-animate">' + stats.sitemapA.totalUrls + '</span>';
    html += '</div>';
    html += '<div class="comparison-bar h-3">';
    html += '<div class="comparison-bar-fill bg-primary" style="width: ' + percentageA + '%"></div>';
    html += '</div>';
    html += '</div>';
    
    html += '<div>';
    html += '<div class="flex justify-between text-sm mb-1">';
    html += '<span class="text-text">Site B</span>';
    html += '<span class="text-text font-semibold counter-animate">' + stats.sitemapB.totalUrls + '</span>';
    html += '</div>';
    html += '<div class="comparison-bar h-3">';
    html += '<div class="comparison-bar-fill bg-accent" style="width: ' + percentageB + '%"></div>';
    html += '</div>';
    html += '</div>';
    
    html += '</div>';
    html += '</div>';
    
    // Gráfico de prioridades médias
    html += '<div class="bg-surface p-4 rounded-xl border border-border">';
    html += '<h5 class="font-semibold text-text mb-3">Prioridade Média</h5>';
    html += '<div class="space-y-3">';
    
    const maxPriority = Math.max(stats.sitemapA.avgPriority, stats.sitemapB.avgPriority, 1);
    const priorityPercentageA = (stats.sitemapA.avgPriority / maxPriority) * 100;
    const priorityPercentageB = (stats.sitemapB.avgPriority / maxPriority) * 100;
    
    html += '<div>';
    html += '<div class="flex justify-between text-sm mb-1">';
    html += '<span class="text-text">Site A</span>';
    html += '<span class="text-text font-semibold counter-animate">' + stats.sitemapA.avgPriority.toFixed(2) + '</span>';
    html += '</div>';
    html += '<div class="comparison-bar h-3">';
    html += '<div class="comparison-bar-fill bg-warning" style="width: ' + priorityPercentageA + '%"></div>';
    html += '</div>';
    html += '</div>';
    
    html += '<div>';
    html += '<div class="flex justify-between text-sm mb-1">';
    html += '<span class="text-text">Site B</span>';
    html += '<span class="text-text font-semibold counter-animate">' + stats.sitemapB.avgPriority.toFixed(2) + '</span>';
    html += '</div>';
    html += '<div class="comparison-bar h-3">';
    html += '<div class="comparison-bar-fill bg-info" style="width: ' + priorityPercentageB + '%"></div>';
    html += '</div>';
    html += '</div>';
    
    html += '</div>';
    html += '</div>';
    
    html += '</div>';
    
    return html;
}

// FUNÇÕES DE AGRUPAMENTO INTELIGENTE

// Agrupa URLs por padrões
function groupUrlsByPattern(urls) {
    const groups = {
        homepage: [],
        blog: [],
        products: [],
        categories: [],
        pages: [],
        api: [],
        admin: [],
        other: []
    };
    
    urls.forEach(item => {
        const pattern = detectUrlPattern(item.url);
        groups[pattern].push(item);
    });
    
    return groups;
}

// Detecta padrão da URL
function detectUrlPattern(url) {
    const urlLower = url.toLowerCase();
    
    // Homepage
    if (urlLower === 'https://' + new URL(url).hostname + '/' || 
        urlLower.endsWith('/') && urlLower.split('/').length === 4) {
        return 'homepage';
    }
    
    // Blog
    if (urlLower.includes('/blog/') || 
        urlLower.includes('/post/') || 
        urlLower.includes('/article/') ||
        urlLower.includes('/news/')) {
        return 'blog';
    }
    
    // Produtos
    if (urlLower.includes('/product/') || 
        urlLower.includes('/item/') || 
        urlLower.includes('/shop/') ||
        urlLower.includes('/store/')) {
        return 'products';
    }
    
    // Categorias
    if (urlLower.includes('/category/') || 
        urlLower.includes('/cat/') || 
        urlLower.includes('/categoria/') ||
        urlLower.includes('/categorias/')) {
        return 'categories';
    }
    
    // API
    if (urlLower.includes('/api/') || 
        urlLower.includes('/rest/') || 
        urlLower.includes('/graphql/')) {
        return 'api';
    }
    
    // Admin
    if (urlLower.includes('/admin/') || 
        urlLower.includes('/dashboard/') || 
        urlLower.includes('/manage/')) {
        return 'admin';
    }
    
    // Páginas
    if (urlLower.includes('/page/') || 
        urlLower.includes('/about/') || 
        urlLower.includes('/contact/') ||
        urlLower.includes('/help/') ||
        urlLower.includes('/faq/')) {
        return 'pages';
    }
    
    return 'other';
}

// Formata grupos para exibição
function formatGroupedUrls(groups) {
    let html = '<div class="space-y-4">';
    
    const groupNames = {
        homepage: { name: 'Homepage', icon: 'fas fa-home', color: 'text-primary' },
        blog: { name: 'Blog/Notícias', icon: 'fas fa-blog', color: 'text-accent' },
        products: { name: 'Produtos', icon: 'fas fa-shopping-cart', color: 'text-success' },
        categories: { name: 'Categorias', icon: 'fas fa-tags', color: 'text-warning' },
        pages: { name: 'Páginas', icon: 'fas fa-file-alt', color: 'text-info' },
        api: { name: 'API', icon: 'fas fa-code', color: 'text-error' },
        admin: { name: 'Admin', icon: 'fas fa-cog', color: 'text-text-secondary' },
        other: { name: 'Outros', icon: 'fas fa-ellipsis-h', color: 'text-text-muted' }
    };
    
    Object.entries(groups).forEach(([key, urls]) => {
        if (urls.length === 0) return;
        
        const groupInfo = groupNames[key];
        html += '<div class="bg-surface p-4 rounded-xl border border-border">';
        html += `<h5 class="font-semibold text-text mb-3 flex items-center gap-2">`;
        html += `<i class="${groupInfo.icon} ${groupInfo.color}"></i>`;
        html += `${groupInfo.name} (${urls.length} URL${urls.length !== 1 ? 's' : ''})`;
        html += '</h5>';
        
        html += '<div class="space-y-2 max-h-40 overflow-y-auto">';
        urls.slice(0, 10).forEach(item => {
            html += '<div class="flex items-center gap-2 p-2 bg-surface-light rounded-lg">';
            html += `<span class="text-xs font-mono text-text-secondary break-all">${escapeHtml(item.url)}</span>`;
            if (item.priority) {
                html += `<span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded">${item.priority}</span>`;
            }
            html += '</div>';
        });
        
        if (urls.length > 10) {
            html += `<div class="text-center text-sm text-text-secondary py-2">... e mais ${urls.length - 10} URLs</div>`;
        }
        
        html += '</div>';
        html += '</div>';
    });
    
    html += '</div>';
    return html;
}

// FUNÇÕES DE COMPARAÇÃO LADO A LADO

// Cria comparação lado a lado
function createSideBySideComparison(urlsA, urlsB) {
    const siteAExclusive = urlsA.filter(urlA => !urlsB.some(urlB => urlB.url === urlA.url));
    const siteBExclusive = urlsB.filter(urlB => !urlsA.some(urlA => urlA.url === urlB.url));
    
    let html = '';
    
    // Container principal com grid responsivo
    html += '<div class="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">';
    
    // Coluna Site A
    html += '<div class="bg-surface p-6 rounded-2xl border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full">';
    html += '<div class="flex items-center justify-between mb-6">';
    html += '<h4 class="text-primary font-bold text-xl flex items-center gap-3">';
    html += '<i class="fas fa-globe text-2xl"></i>';
    html += `Site A - URLs Exclusivas`;
    html += '</h4>';
    html += '<span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">' + siteAExclusive.length + '</span>';
    html += '</div>';
    html += formatSideColumn(siteAExclusive, 'Site A');
    html += '</div>';
    
    // Coluna Site B
    html += '<div class="bg-surface p-6 rounded-2xl border-2 border-accent/20 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full">';
    html += '<div class="flex items-center justify-between mb-6">';
    html += '<h4 class="text-accent font-bold text-xl flex items-center gap-3">';
    html += '<i class="fas fa-globe text-2xl"></i>';
    html += `Site B - URLs Exclusivas`;
    html += '</h4>';
    html += '<span class="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-semibold">' + siteBExclusive.length + '</span>';
    html += '</div>';
    html += formatSideColumn(siteBExclusive, 'Site B');
    html += '</div>';
    
    html += '</div>';
    
    return html;
}

// Formata cada coluna da comparação lado a lado
function formatSideColumn(urls, siteName) {
    if (urls.length === 0) {
        return '<div class="flex-1 flex items-center justify-center text-center py-12 text-text-secondary">' +
               '<div>' +
               '<i class="fas fa-check-circle text-4xl mb-4 text-success"></i>' +
               '<p class="text-lg font-medium">Nenhuma URL exclusiva encontrada</p>' +
               '<p class="text-sm mt-2 opacity-75">Este site não possui URLs únicas</p>' +
               '</div>' +
               '</div>';
    }
    
    let html = '<div class="flex-1 space-y-3 overflow-y-auto pr-2">';
    
    urls.slice(0, 50).forEach((item, index) => {
        const bgColor = index % 2 === 0 ? 'bg-surface-light' : 'bg-surface';
        const siteColor = siteName === 'Site A' ? 'border-primary/30' : 'border-accent/30';
        
        html += '<div class="p-4 rounded-xl border-2 ' + bgColor + ' ' + siteColor + ' hover:shadow-lg hover:scale-102 transition-all duration-200 group">';
        html += '<div class="flex items-start justify-between gap-4">';
        html += '<div class="flex-1 min-w-0">';
        html += '<div class="text-sm font-mono text-text break-all mb-3 leading-relaxed">' + escapeHtml(item.url) + '</div>';
        
        // Metadados em layout mais organizado
        html += '<div class="flex flex-wrap gap-2">';
        if (item.priority) {
            html += '<span class="bg-primary/15 text-primary px-3 py-1 rounded-full text-xs font-medium border border-primary/20">' +
                   '<i class="fas fa-star mr-1"></i>Prioridade: ' + item.priority + '</span>';
        }
        if (item.changefreq) {
            html += '<span class="bg-accent/15 text-accent px-3 py-1 rounded-full text-xs font-medium border border-accent/20">' +
                   '<i class="fas fa-sync-alt mr-1"></i>' + item.changefreq + '</span>';
        }
        if (item.lastmod) {
            html += '<span class="bg-warning/15 text-warning px-3 py-1 rounded-full text-xs font-medium border border-warning/20">' +
                   '<i class="fas fa-calendar-alt mr-1"></i>' + item.lastmod + '</span>';
        }
        html += '</div>';
        
        html += '</div>';
        html += '<div class="flex-shrink-0">';
        html += '<button onclick="copyToClipboard(\'' + escapeHtml(item.url) + '\')" class="text-text-secondary hover:text-primary transition-all duration-200 p-2 rounded-lg hover:bg-primary/10 group-hover:scale-110" title="Copiar URL">';
        html += '<i class="fas fa-copy text-lg"></i>';
        html += '</button>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
    });
    
    if (urls.length > 50) {
        html += '<div class="text-center py-6 text-text-secondary border-t-2 border-border mt-4">';
        html += '<div class="bg-surface-light rounded-xl p-4">';
        html += '<i class="fas fa-ellipsis-h text-2xl mb-2"></i>';
        html += '<p class="font-medium">... e mais ' + (urls.length - 50) + ' URLs</p>';
        html += '<p class="text-xs mt-1 opacity-75">Mostrando apenas as primeiras 50</p>';
        html += '</div>';
        html += '</div>';
    }
    
    html += '</div>';
    return html;
}

// Copia URL para clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showSuccess('URL Copiada', 'URL copiada para a área de transferência!');
    }).catch(() => {
        // Fallback para navegadores mais antigos
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showSuccess('URL Copiada', 'URL copiada para a área de transferência!');
    });
}

// FUNÇÕES DE NOTIFICAÇÕES CONTEXTUAIS

// Analisa contexto da comparação
function analyzeComparisonContext(diffs) {
    const context = {
        totalDifferences: diffs.added.length + diffs.removed.length + diffs.modified.length,
        hasManyDifferences: false,
        isCompletelyDifferent: false,
        hasLargeDataset: false,
        recommendations: []
    };
    
    // Análise de volume
    if (context.totalDifferences > 1000) {
        context.hasManyDifferences = true;
        context.recommendations.push({
            type: 'warning',
            message: 'Muitas diferenças detectadas. Considere usar filtros para focar em categorias específicas.'
        });
    }
    
    // Análise de sites completamente diferentes
    if (diffs.modified.length === 0 && (diffs.added.length > 0 && diffs.removed.length > 0)) {
        context.isCompletelyDifferent = true;
        context.recommendations.push({
            type: 'info',
            message: 'Os sites não compartilham URLs em comum. Esta é uma comparação entre sites totalmente diferentes.'
        });
    }
    
    // Análise de dataset grande
    if (context.totalDifferences > 500) {
        context.hasLargeDataset = true;
        context.recommendations.push({
            type: 'info',
            message: 'Dataset grande detectado. Use a paginação e filtros para navegar pelos resultados.'
        });
    }
    
    return context;
}

// Mostra notificações contextuais apropriadas
function showContextualNotifications(context) {
    // Aguardar um pouco para não sobrecarregar o usuário
    setTimeout(() => {
        context.recommendations.forEach((rec, index) => {
            setTimeout(() => {
                if (rec.type === 'warning') {
                    showWarning('Análise Contextual', rec.message);
                } else if (rec.type === 'info') {
                    showInfo('Dica de Uso', rec.message);
                } else if (rec.type === 'success') {
                    showSuccess('Análise Concluída', rec.message);
                }
            }, index * 2000); // Espaçar as notificações
        });
    }, 1000);
}

// FUNÇÕES DE EXPORTAÇÃO

// Exporta dados para CSV
function exportToCSV(differences, stats) {
    const exportData = prepareExportData(differences, stats);
    
    // Cabeçalho CSV
    const headers = ['Tipo', 'URL', 'Prioridade', 'Frequência', 'Última Modificação', 'Site Origem'];
    let csvContent = headers.join(',') + '\n';
    
    // Dados das diferenças
    exportData.differences.forEach(item => {
        const row = [
            `"${item.type}"`,
            `"${item.url}"`,
            `"${item.priority || 'N/A'}"`,
            `"${item.frequency || 'N/A'}"`,
            `"${item.date || 'N/A'}"`,
            `"${item.site || 'N/A'}"`
        ];
        csvContent += row.join(',') + '\n';
    });
    
    // Adicionar estatísticas
    csvContent += '\n# ESTATÍSTICAS\n';
    csvContent += 'Métrica,Site A,Site B,Diferença\n';
    csvContent += `"Total de URLs","${stats.sitemapA.totalUrls}","${stats.sitemapB.totalUrls}","${stats.comparison.urlDifference}"\n`;
    csvContent += `"Prioridade Média","${stats.sitemapA.avgPriority}","${stats.sitemapB.avgPriority}","${stats.comparison.priorityDifference.toFixed(2)}"\n`;
    csvContent += `"Datas Diferentes","${stats.comparison.dateDifference ? 'Sim' : 'Não'}","",""\n`;
    
    const filename = `comparacao-sitemaps-${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(csvContent, filename, 'text/csv');
}

// Exporta dados para JSON
function exportToJSON(differences, stats) {
    const exportData = prepareExportData(differences, stats);
    
    const jsonData = {
        metadata: {
            exportDate: new Date().toISOString(),
            totalDifferences: exportData.differences.length,
            comparisonType: 'sitemap'
        },
        statistics: {
            siteA: stats.sitemapA,
            siteB: stats.sitemapB,
            comparison: stats.comparison
        },
        differences: exportData.differences,
        summary: {
            added: differences.added.length,
            removed: differences.removed.length,
            modified: differences.modified.length
        }
    };
    
    const jsonContent = JSON.stringify(jsonData, null, 2);
    const filename = `comparacao-sitemaps-${new Date().toISOString().split('T')[0]}.json`;
    downloadFile(jsonContent, filename, 'application/json');
}

// Prepara dados para exportação
function prepareExportData(differences, stats) {
    const exportDifferences = [];
    
    // URLs adicionadas
    differences.added.forEach(item => {
        exportDifferences.push({
            type: 'Adicionada',
            url: item.url,
            priority: item.priority || null,
            frequency: item.changefreq || null,
            date: item.lastmod || null,
            site: 'Site B'
        });
    });
    
    // URLs removidas
    differences.removed.forEach(item => {
        exportDifferences.push({
            type: 'Removida',
            url: item.url,
            priority: item.priority || null,
            frequency: item.changefreq || null,
            date: item.lastmod || null,
            site: 'Site A'
        });
    });
    
    // URLs modificadas
    differences.modified.forEach(item => {
        exportDifferences.push({
            type: 'Modificada',
            url: item.url,
            priority: `${item.original.priority || 'N/A'} → ${item.modified.priority || 'N/A'}`,
            frequency: `${item.original.changefreq || 'N/A'} → ${item.modified.changefreq || 'N/A'}`,
            date: `${item.original.lastmod || 'N/A'} → ${item.modified.lastmod || 'N/A'}`,
            site: 'Ambos'
        });
    });
    
    return {
        differences: exportDifferences,
        stats: stats
    };
}

// Gerencia download de arquivos
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showSuccess('Exportação Concluída', `Arquivo ${filename} baixado com sucesso!`);
}

// FUNÇÕES DE FORMATAÇÃO DE RESULTADOS

function formatUrlComparison(diffs) {
    if (diffs.added.length === 0 && diffs.removed.length === 0 && diffs.modified.length === 0) {
        return '<span class="result-success"><i class="fas fa-check-circle mr-2"></i>Nenhuma diferença de URLs encontrada</span>';
    }
    
    // Preparar dados para o novo sistema
    const allDifferences = [
        ...diffs.added.map(item => ({ ...item, type: 'added' })),
        ...diffs.removed.map(item => ({ ...item, type: 'removed' })),
        ...diffs.modified.map(item => ({ ...item, type: 'modified' }))
    ];
    
    // Armazenar diferenças globalmente para filtros
    currentDifferences = {
        all: allDifferences,
        added: diffs.added,
        removed: diffs.removed,
        modified: diffs.modified
    };
    
    // Aplicar filtros e exibir diretamente
    applyFilters();
    
    // Retornar conteúdo temporário enquanto os filtros são aplicados
    return '<div class="text-center py-4 text-text-secondary"><i class="fas fa-spinner fa-spin mr-2"></i>Carregando diferenças...</div>';
}

function formatPriorityComparison(diffs) {
    if (diffs.length === 0) {
        return '<span class="result-success"><i class="fas fa-check-circle mr-2"></i>Nenhuma diferença de prioridades encontrada</span>';
    }
    
    let html = `<strong>${diffs.length} diferença(s) de prioridade:</strong><br><br>`;
    
    diffs.slice(0, 5).forEach(diff => {
        html += `<div style="margin-bottom: 8px; padding: 8px; background: #4a3d2d; border-radius: 4px; color: #fff3cd;">`;
        html += `<strong>URL:</strong> ${escapeHtml(diff.url)}<br>`;
        html += `<strong>Prioridade:</strong> ${diff.original || 'N/A'} → ${diff.modified || 'N/A'}`;
        html += `</div>`;
    });

    if (diffs.length > 5) {
        html += `<small class="result-info">... e mais ${diffs.length - 5} diferenças</small>`;
    }

    return html;
}

function formatFrequencyComparison(diffs) {
    if (diffs.length === 0) {
        return '<span class="result-success"><i class="fas fa-check-circle mr-2"></i>Nenhuma diferença de frequências encontrada</span>';
    }
    
    let html = `<strong>${diffs.length} diferença(s) de frequência:</strong><br><br>`;
    
    diffs.slice(0, 5).forEach(diff => {
        html += `<div style="margin-bottom: 8px; padding: 8px; background: #2d3a4a; border-radius: 4px; color: #d1ecf1;">`;
        html += `<strong>URL:</strong> ${escapeHtml(diff.url)}<br>`;
        html += `<strong>Frequência:</strong> ${diff.original || 'N/A'} → ${diff.modified || 'N/A'}`;
        html += `</div>`;
    });
    
    if (diffs.length > 5) {
        html += `<small class="result-info">... e mais ${diffs.length - 5} diferenças</small>`;
    }

    return html;
}

function formatDateComparison(diffs) {
    if (diffs.length === 0) {
        return '<span class="result-success"><i class="fas fa-check-circle mr-2"></i>Nenhuma diferença de datas encontrada</span>';
    }
    
    let html = `<strong>${diffs.length} diferença(s) de data:</strong><br><br>`;
    
    diffs.slice(0, 5).forEach(diff => {
        html += `<div style="margin-bottom: 8px; padding: 8px; background: #4a2d2d; border-radius: 4px; color: #f8d7da;">`;
        html += `<strong>URL:</strong> ${escapeHtml(diff.url)}<br>`;
        html += `<strong>Data:</strong> ${diff.original || 'N/A'} → ${diff.modified || 'N/A'}`;
        html += `</div>`;
    });

    if (diffs.length > 5) {
        html += `<small class="result-info">... e mais ${diffs.length - 5} diferenças</small>`;
    }

    return html;
}

function formatStatsComparison(stats) {
    let html = '<strong>Estatísticas Comparativas:</strong><br><br>';
    
    html += `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">`;
    
    // Sitemap A
    html += `<div style="background: #2d4a3e; padding: 12px; border-radius: 6px; color: #e8f5e8;">`;
    html += `<strong>Sitemap A:</strong><br>`;
    html += `• Total de URLs: ${stats.sitemapA.totalUrls}<br>`;
    html += `• Prioridade média: ${stats.sitemapA.avgPriority}<br>`;
    html += `• Frequências: ${Object.keys(stats.sitemapA.frequencyDistribution || {}).length} tipos<br>`;
    html += `• Última modificação: ${stats.sitemapA.avgLastmod || 'N/A'}`;
    html += `</div>`;
    
    // Sitemap B
    html += `<div style="background: #2d3a4a; padding: 12px; border-radius: 6px; color: #e8f0ff;">`;
    html += `<strong>Sitemap B:</strong><br>`;
    html += `• Total de URLs: ${stats.sitemapB.totalUrls}<br>`;
    html += `• Prioridade média: ${stats.sitemapB.avgPriority}<br>`;
    html += `• Frequências: ${Object.keys(stats.sitemapB.frequencyDistribution || {}).length} tipos<br>`;
    html += `• Última modificação: ${stats.sitemapB.avgLastmod || 'N/A'}`;
    html += `</div>`;
    
    html += `</div>`;
    
    // Comparação
    html += `<div style="margin-top: 16px; padding: 12px; background: #4a3d2d; border-radius: 6px; color: #fff3cd;">`;
    html += `<strong>Diferenças:</strong><br>`;
    html += `• URLs: ${stats.comparison.urlDifference > 0 ? '+' : ''}${stats.comparison.urlDifference}<br>`;
    html += `• Prioridade média: ${stats.comparison.priorityDifference > 0 ? '+' : ''}${stats.comparison.priorityDifference.toFixed(2)}<br>`;
    html += `• Datas diferentes: ${stats.comparison.dateDifference ? 'Sim' : 'Não'}`;
        html += `</div>`;

    return html;
}

// FUNÇÕES DE INTERFACE

function showLoading(button, text) {
    button.innerHTML = `<div class="loading"></div>${text}`;
    button.disabled = true;
    button.classList.add('opacity-50', 'cursor-not-allowed');
}

function hideLoading(button, originalText) {
    button.innerHTML = originalText;
    button.disabled = false;
    button.classList.remove('opacity-50', 'cursor-not-allowed');
}

function showSitemapStatus(url, content) {
    const parsed = parseSitemap(content);
    let info = `<strong>Sitemap encontrado:</strong><br>`;
    info += `• URL: ${escapeHtml(url)}<br>`;
    info += `• Tamanho: ${content.length} caracteres<br>`;
    
    if (parsed.success) {
        info += `• Itens: ${parsed.data.length}<br>`;
        info += `• Tipo: ${parsed.data[0]?.type === 'sitemap' ? 'Sitemap Index' : 'Sitemap de URLs'}<br>`;
        info += `<span class="result-success"><i class="fas fa-check-circle mr-2"></i>Sitemap válido e processado com sucesso</span>`;
    } else {
        info += `<span class="result-error"><i class="fas fa-exclamation-triangle mr-2"></i>Erro no parse: ${parsed.error}</span>`;
    }
    
    sitemapInfo.innerHTML = info;
    sitemapStatus.classList.remove('hidden');
}

// Função para inserir sitemap manualmente quando CORS falha
function showCorsError(url) {
    let info = `<strong><i class="fas fa-exclamation-triangle mr-2"></i>Erro de CORS detectado:</strong><br><br>`;
    info += `O site <strong>${escapeHtml(url)}</strong> bloqueia requisições CORS.<br><br>`;
    info += `<strong><i class="fas fa-lightbulb mr-2"></i>Soluções:</strong><br>`;
    info += `1. <strong>Copie manualmente:</strong> Acesse ${escapeHtml(url)} no seu navegador e cole o conteúdo aqui<br>`;
    info += `2. <strong>Use extensão CORS:</strong> Instale uma extensão como "CORS Unblock"<br>`;
    info += `3. <strong>Proxy local:</strong> Configure um proxy local para desenvolvimento<br><br>`;
    info += `<button onclick="openSitemapUrl('${escapeHtml(url)}')" class="btn btn--secondary btn--sm">Abrir Sitemap no Navegador</button>`;
    
    sitemapInfo.innerHTML = info;
    sitemapStatus.classList.remove('hidden');
}

// Abre URL do sitemap em nova aba
function openSitemapUrl(url) {
    window.open(url, '_blank');
}

// Função removida - apenas modo de 2 sites

// Mostra diálogo para inserção manual de sitemap para um site específico
function showManualSitemapDialogForSite(siteLetter, targetUrl = null, targetTextarea = null) {
    const siteUrlInput = siteLetter === 'A' ? siteUrlAInput : siteUrlBInput;
    const sitemapUrlInput = siteLetter === 'A' ? sitemapUrlAInput : sitemapUrlBInput;
    const textarea = targetTextarea || (siteLetter === 'A' ? sitemapATextarea : sitemapBTextarea);
    
    const siteUrl = siteUrlInput.value.trim();
    const sitemapUrl = sitemapUrlInput.value.trim();
    
    let finalTargetUrl = targetUrl || sitemapUrl || `${siteUrl}/sitemap.xml`;
    if (!siteUrl && !sitemapUrl && !targetUrl) {
        finalTargetUrl = 'https://exemplo.com/sitemap.xml';
    }
    
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const siteColor = siteLetter === 'A' ? '#3B82F6' : '#06B6D4';
    
    dialog.innerHTML = `
        <div style="
            background: var(--color-surface);
            padding: 24px;
            border-radius: 8px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            border: 2px solid ${siteColor};
            box-shadow: var(--shadow-lg);
        ">
            <h3 style="margin-top: 0; color: ${siteColor}; font-size: var(--font-size-xl); font-weight: var(--font-weight-semibold);"><i class="fas fa-clipboard mr-2"></i>Inserir Sitemap ${siteLetter} Manualmente</h3>
            <p style="color: var(--color-text); margin-bottom: 16px; line-height: var(--line-height-normal);">
                Quando há bloqueio de CORS, você pode copiar o sitemap manualmente:
            </p>
            <ol style="color: var(--color-text); margin-bottom: 16px; line-height: var(--line-height-normal);">
                <li>Acesse o sitemap no navegador: <a href="${finalTargetUrl}" target="_blank" style="color: ${siteColor}; text-decoration: none;">${finalTargetUrl}</a></li>
                <li>Copie todo o conteúdo XML (Ctrl+A, Ctrl+C)</li>
                <li>Cole no campo abaixo</li>
            </ol>
            <textarea id="manualSitemapInput" placeholder="Cole aqui o conteúdo do sitemap XML..." 
                style="width: 100%; height: 200px; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; font-family: var(--font-family-mono); font-size: 12px; background: var(--color-background); color: var(--color-text); resize: vertical;"></textarea>
            <div style="margin-top: 16px; text-align: right;">
                <button id="cancelManualBtn" style="margin-right: 8px; padding: 8px 16px; border: 1px solid var(--color-border); background: var(--color-secondary); color: var(--color-text); border-radius: 4px; cursor: pointer; transition: var(--duration-fast) var(--ease-standard);">Cancelar</button>
                <button id="confirmManualBtn" style="padding: 8px 16px; background: ${siteColor}; color: white; border: none; border-radius: 4px; cursor: pointer; transition: var(--duration-fast) var(--ease-standard);">Inserir Sitemap ${siteLetter}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Event listeners
    const cancelBtn = document.getElementById('cancelManualBtn');
    const confirmBtn = document.getElementById('confirmManualBtn');
    
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(dialog);
    });
    
    confirmBtn.addEventListener('click', () => {
        const content = document.getElementById('manualSitemapInput').value.trim();
        if (content) {
            textarea.value = content;
            updateSitemapPreview();
            showSitemapStatusForSite(siteLetter, finalTargetUrl, content);
            showSuccess(`Sitemap ${siteLetter}`, `Sitemap ${siteLetter} inserido manualmente com sucesso!`);
            document.body.removeChild(dialog);
        } else {
            alert('Por favor, cole o conteúdo do sitemap.');
        }
    });
    
    // Adicionar efeitos de hover
    cancelBtn.addEventListener('mouseenter', () => {
        cancelBtn.style.background = 'var(--color-secondary-hover)';
    });
    
    cancelBtn.addEventListener('mouseleave', () => {
        cancelBtn.style.background = 'var(--color-secondary)';
    });
    
    confirmBtn.addEventListener('mouseenter', () => {
        confirmBtn.style.background = siteColor;
        confirmBtn.style.opacity = '0.9';
    });
    
    confirmBtn.addEventListener('mouseleave', () => {
        confirmBtn.style.background = siteColor;
        confirmBtn.style.opacity = '1';
    });
    
    // Fecha ao clicar fora
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            document.body.removeChild(dialog);
        }
    });
}

// ========================================
// SISTEMA DE NOTIFICAÇÕES
// ========================================

// Mostra notificação no canto inferior direito
function showNotification(title, message, type = 'info', duration = 5000) {
    // Define ícone e cores baseado no tipo
    const icons = {
        'error': '<i class="fas fa-exclamation-triangle"></i>',
        'success': '<i class="fas fa-check-circle"></i>',
        'warning': '<i class="fas fa-exclamation-triangle"></i>',
        'info': '<i class="fas fa-info-circle"></i>'
    };
    
    const colors = {
        'error': 'border-error',
        'success': 'border-success',
        'warning': 'border-warning',
        'info': 'border-info'
    };
    
    // Atualiza conteúdo da notificação
    notificationIcon.innerHTML = icons[type] || icons.info;
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    
    // Remove classes de tipo anteriores e aplica a nova
    notificationPopup.className = notificationPopup.className.replace(/border-\w+/, '');
    notificationPopup.classList.add(colors[type] || colors.info);
    
    // Aplica cor da borda baseada no tipo no conteúdo interno
    const popupContent = notificationPopup.querySelector('.bg-surface-light');
    if (popupContent) {
        popupContent.className = popupContent.className.replace(/border-\w+/, '');
        popupContent.classList.add('border', colors[type] || colors.info);
    }
    
    // Mostra a notificação
    notificationPopup.classList.remove('translate-x-full', 'opacity-0');
    notificationPopup.classList.add('translate-x-0', 'opacity-100');
    
    // Auto-hide após duração especificada
    setTimeout(() => {
        hideNotification();
    }, duration);
}

// Esconde a notificação
function hideNotification() {
    notificationPopup.classList.remove('translate-x-0', 'opacity-100');
    notificationPopup.classList.add('translate-x-full', 'opacity-0');
}

// Funções de conveniência para diferentes tipos de notificação
function showSuccess(title, message, duration = 3000) {
    showNotification(title, message, 'success', duration);
}

function showWarning(title, message, duration = 4000) {
    showNotification(title, message, 'warning', duration);
}

function showInfo(title, message, duration = 4000) {
    showNotification(title, message, 'info', duration);
}

function showAnalysisStatus(analysis) {
    analysisInfo.innerHTML = analysis;
    analysisStatus.classList.remove('hidden');
}

function showError(message) {
    showNotification('Erro', message, 'error');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


// Adiciona estilos responsivos para mobile
function addResponsiveStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 768px) {
            .site-input-group {
                grid-template-columns: 1fr;
            }
            
            .site-actions {
                flex-direction: column;
            }
            
            .sitemap-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
}

// Inicializa estilos responsivos
addResponsiveStyles();

// ========================================
// FUNÇÕES DO COMPARADOR HTML
// ========================================

// Exemplos pré-definidos para o comparador HTML
const htmlExamples = {
    estilo: {
        htmlA: `<div><p>Texto normal</p></div>`,
        htmlB: `<div><p style="color: red; font-weight: bold;">Texto normal</p></div>`
    },
    texto: {
        htmlA: `<button>Clique aqui</button>`,
        htmlB: `<button>Comprar agora</button>`
    },
    atributo: {
        htmlA: `<ul><li class="active">Item 1</li><li>Item 2</li></ul>`,
        htmlB: `<ul><li>Item 1</li><li>Item 2</li></ul>`
    },
    estrutura: {
        htmlA: `<div><p>Parágrafo 1</p></div>`,
        htmlB: `<div><p>Parágrafo 1</p><span>Novo elemento</span></div>`
    },
    formatacao: {
        htmlA: `<div>
    <p>Texto normal</p>
</div>`,
        htmlB: `<div><p>Texto normal</p></div>`
    }
};

// Atualiza os labels dos campos de entrada baseado no modo selecionado
function updateInputLabels() {
    const selectedMode = document.querySelector('input[name="comparatorMode"]:checked').value;
    
    // Encontra especificamente os labels dos campos de entrada (não os da interface HTML)
    const inputLabels = document.querySelectorAll('.grid.grid-cols-1.lg\\:grid-cols-2.gap-8.mb-10 h3.text-primary.mb-4.text-2xl.font-bold');
    
    inputLabels.forEach(label => {
        const text = label.textContent.trim();
        
        if (selectedMode === 'html') {
            // Muda de Sitemap para HTML
            if (text.includes('Sitemap A (Original)')) {
                label.textContent = 'HTML A (Original) *';
            } else if (text.includes('Sitemap B (Comparação)')) {
                label.textContent = 'HTML B (Comparação) *';
            }
        } else if (selectedMode === 'sitemap') {
            // Muda de HTML para Sitemap
            if (text.includes('HTML A (Original)')) {
                label.textContent = 'Sitemap A (Original) *';
            } else if (text.includes('HTML B (Comparação)')) {
                label.textContent = 'Sitemap B (Comparação) *';
            }
        }
    });
    
    // Atualiza os placeholders dos textareas
    updateTextareaPlaceholders(selectedMode);
    
    // Atualiza os labels de prévia
    updatePreviewLabels(selectedMode);
}

// Atualiza os placeholders dos textareas baseado no modo selecionado
function updateTextareaPlaceholders(mode) {
    const sitemapATextarea = document.getElementById('sitemapA');
    const sitemapBTextarea = document.getElementById('sitemapB');
    
    if (mode === 'html') {
        sitemapATextarea.placeholder = 'Cole aqui o HTML original...';
        sitemapBTextarea.placeholder = 'Cole aqui o HTML para comparação...';
    } else if (mode === 'sitemap') {
        sitemapATextarea.placeholder = 'Cole aqui o sitemap original ou deixe o robô buscar...';
        sitemapBTextarea.placeholder = 'Cole aqui o sitemap para comparação...';
    }
}

// Atualiza os labels de prévia baseado no modo selecionado
function updatePreviewLabels(mode) {
    const previewLabels = document.querySelectorAll('.text-text-secondary.text-sm.mb-3.uppercase.tracking-wide.font-semibold');
    
    previewLabels.forEach(label => {
        const text = label.textContent.trim();
        
        if (mode === 'html') {
            if (text === 'Prévia do Sitemap:') {
                label.textContent = 'Prévia do HTML:';
            }
        } else if (mode === 'sitemap') {
            if (text === 'Prévia do HTML:') {
                label.textContent = 'Prévia do Sitemap:';
            }
        }
    });
}

// Alterna entre modos de comparação
function switchComparatorMode() {
    const selectedMode = document.querySelector('input[name="comparatorMode"]:checked').value;
    console.log('Alternando para modo:', selectedMode);
    
    // Atualiza os labels primeiro
    updateInputLabels();
    
    if (selectedMode === 'sitemap') {
        // Mostra interface do sitemap - seção de configuração
        const sections = document.querySelectorAll('section.bg-surface-light.p-8.rounded-2xl.mb-10');
        console.log('Seções encontradas:', sections.length);
        sections.forEach(section => {
            const h2 = section.querySelector('h2');
            if (h2 && h2.textContent.includes('Configuração do Site')) {
                console.log('Mostrando seção de configuração do site');
                section.style.display = 'block';
            }
        });
        
        // Mostra grid de sitemaps (primeiro grid)
        const sitemapGrids = document.querySelectorAll('div.grid.grid-cols-1.lg\\:grid-cols-2.gap-8.mb-10');
        if (sitemapGrids.length > 0) {
            sitemapGrids[0].style.display = 'grid';
        }
        
        // Mostra botões de comparação de sitemap
        const buttonSections = document.querySelectorAll('section.text-center.my-10');
        buttonSections.forEach(section => {
            const button = section.querySelector('button');
            if (button && button.textContent.includes('Comparar Sitemaps')) {
                section.style.display = 'block';
            }
        });
        
        // Mostra seções de status de sitemap
        sitemapStatus.classList.remove('hidden');
        analysisStatus.classList.remove('hidden');
        
        // Oculta interface do HTML
        htmlComparatorInterface.classList.add('hidden');
        normalizationStatus.classList.add('hidden');
        
        // Mostra métodos do sitemap
        sitemapMethods.classList.remove('hidden');
        htmlMethods.classList.add('hidden');
        
        // Atualiza título dos resultados
        const resultTitle = document.querySelector('#resultSection h3');
        if (resultTitle) resultTitle.textContent = 'Análise Completa dos Sitemaps';
        
    } else if (selectedMode === 'html') {
        // Oculta interface do sitemap - seção de configuração
        const sections = document.querySelectorAll('section.bg-surface-light.p-8.rounded-2xl.mb-10');
        sections.forEach(section => {
            const h2 = section.querySelector('h2');
            if (h2 && h2.textContent.includes('Configuração do Site')) {
                section.style.display = 'none';
            }
        });
        
        // Oculta grid de sitemaps (primeiro grid)
        const sitemapGrids = document.querySelectorAll('div.grid.grid-cols-1.lg\\:grid-cols-2.gap-8.mb-10');
        if (sitemapGrids.length > 0) {
            sitemapGrids[0].style.display = 'none';
        }
        
        // Oculta botões de comparação de sitemap
        const buttonSections = document.querySelectorAll('section.text-center.my-10');
        buttonSections.forEach(section => {
            const button = section.querySelector('button');
            if (button && button.textContent.includes('Comparar Sitemaps')) {
                section.style.display = 'none';
            }
        });
        
        // Oculta seções de status de sitemap
        sitemapStatus.classList.add('hidden');
        analysisStatus.classList.add('hidden');
        
        // Mostra interface do HTML
        htmlComparatorInterface.classList.remove('hidden');
        
        // Mostra métodos do HTML
        sitemapMethods.classList.add('hidden');
        htmlMethods.classList.remove('hidden');
        
        // Atualiza título dos resultados
        const resultTitle = document.querySelector('#resultSection h3');
        if (resultTitle) resultTitle.textContent = 'Análise Completa das Diferenças HTML';
    }
    
    // Limpa resultados
    hideResults();
}

// Carrega exemplo no comparador HTML
function loadExample(type) {
    const example = htmlExamples[type];
    if (example) {
        htmlATextarea.value = example.htmlA;
        htmlBTextarea.value = example.htmlB;
        hideResults();
        updatePreview();
    }
}

// Limpa campos do comparador HTML
function clearFields() {
    htmlATextarea.value = '';
    htmlBTextarea.value = '';
    hideResults();
    updatePreview();
}

// FUNÇÃO PRINCIPAL DE NORMALIZAÇÃO DE HTML
function normalizeHTML(html) {
    if (!html || !html.trim()) return '';
    
    let normalized = html.trim();
    
    try {
        // Aplica as normalizações baseadas nas opções selecionadas
        if (ignoreComments.checked) {
            normalized = removeComments(normalized);
        }
        
        if (normalizeCase.checked) {
            normalized = normalizeTagCase(normalized);
        }
        
        if (normalizeWhitespace.checked) {
            normalized = normalizeWhitespaceAndFormatting(normalized);
        }
        
        if (normalizeAttributes.checked) {
            normalized = normalizeAttributeOrder(normalized);
        }
        
        return normalized;
        
    } catch (error) {
        console.warn('Erro na normalização:', error);
        return html.trim();
    }
}

// Remove comentários HTML
function removeComments(html) {
    return html.replace(/<!--[\s\S]*?-->/g, '');
}

// Normaliza maiúsculas/minúsculas das tags
function normalizeTagCase(html) {
    return html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^<>]*>/gi, function(match, tagName) {
        return match.replace(new RegExp(tagName, 'gi'), tagName.toLowerCase());
    });
}

function normalizeWhitespaceAndFormatting(html) {
    // Remove quebras de linha e espaços extras
    let normalized = html.replace(/\s+/g, ' ').trim();
    
    // Remove espaços antes e depois de tags
    normalized = normalized.replace(/\s*<\s*/g, '<');
    normalized = normalized.replace(/\s*>\s*/g, '>');
    
    // Remove espaços entre tags adjacentes
    normalized = normalized.replace(/>\s+</g, '><');
    
    // Normaliza espaços dentro de tags (mas preserva conteúdo)
    normalized = normalized.replace(/<([^>]+)>/g, function(match, content) {
        // Normaliza espaços entre atributos
        let normalized = content.replace(/\s+/g, ' ').trim();
        return '<' + normalized + '>';
    });
    
    return normalized;
}

// Normaliza ordem dos atributos
function normalizeAttributeOrder(html) {
    return html.replace(/<([a-zA-Z][a-zA-Z0-9]*)\b([^<>]*)>/gi, function(match, tagName, attributes) {
        if (!attributes || !attributes.trim()) {
            return match;
        }
        
        // Extrai atributos
        const attrRegex = /([a-zA-Z-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
        const attrs = [];
        let attrMatch;
        
        while ((attrMatch = attrRegex.exec(attributes)) !== null) {
            const name = attrMatch[1].toLowerCase();
            const value = attrMatch[2] || attrMatch[3] || attrMatch[4] || '';
            attrs.push({ name, value, original: attrMatch[0] });
        }
        
        // Ordena atributos alfabeticamente
        attrs.sort((a, b) => a.name.localeCompare(b.name));
        
        // Reconstrói a tag
        const sortedAttrs = attrs.map(attr => {
            if (attr.value) {
                return `${attr.name}="${attr.value}"`;
            }
            return attr.name;
        }).join(' ');
        
        return `<${tagName}${sortedAttrs ? ' ' + sortedAttrs : ''}>`;
    });
}

function updatePreview() {
    const htmlA = htmlATextarea.value;
    const htmlB = htmlBTextarea.value;
    
    if (htmlA) {
        normalizedA.textContent = normalizeHTML(htmlA);
    } else {
        normalizedA.textContent = '(vazio)';
    }
    
    if (htmlB) {
        normalizedB.textContent = normalizeHTML(htmlB);
    } else {
        normalizedB.textContent = '(vazio)';
    }
}

// Prévia da normalização
function previewNormalization() {
    const htmlA = htmlATextarea.value.trim();
    const htmlB = htmlBTextarea.value.trim();
    
    if (!htmlA && !htmlB) {
        showError('Por favor, preencha pelo menos um dos campos HTML para ver a prévia.');
        return;
    }
    
    updatePreview();
    
    // Mostra informações sobre a normalização
    let info = '<strong>Opções de normalização ativas:</strong><br><br>';
    
    if (normalizeWhitespace.checked) {
        info += '• <span class="result-info">Normalização de espaços em branco:</span> Remove quebras de linha, espaços extras e indentação<br>';
    }
    
    if (normalizeAttributes.checked) {
        info += '• <span class="result-info">Ordenação de atributos:</span> Ordena atributos alfabeticamente<br>';
    }
    
    if (ignoreComments.checked) {
        info += '• <span class="result-info">Remoção de comentários:</span> Remove todos os comentários HTML<br>';
    }
    
    if (normalizeCase.checked) {
        info += '• <span class="result-info">Normalização de maiúsculas:</span> Converte tags para minúsculas<br>';
    }
    
    if (!normalizeWhitespace.checked && !normalizeAttributes.checked && !ignoreComments.checked && !normalizeCase.checked) {
        info += '<span class="result-warning"><i class="fas fa-exclamation-triangle mr-2"></i>Nenhuma opção de normalização está ativa</span>';
    }
    
    normalizationInfo.innerHTML = info;
    normalizationStatus.classList.remove('hidden');
}

// Função principal de comparação HTML
async function compareHTML() {
    const htmlA = htmlATextarea.value.trim();
    const htmlB = htmlBTextarea.value.trim();

    if (!htmlA || !htmlB) {
        showError('Por favor, preencha ambos os campos HTML.');
        return;
    }

    showLoading(compareHtmlBtn, '<i class="fas fa-search mr-2"></i>Analisando com Normalização...');
    hideResults();

    try {
        let totalDifferences = 0;
        
        // Normaliza os HTMLs
        const normalizedHtmlA = normalizeHTML(htmlA);
        const normalizedHtmlB = normalizeHTML(htmlB);
        
        // MÉTODO 1: Comparação Normalizada (PRINCIPAL)
        const normalizedDiffs = compareNormalizedHTML(normalizedHtmlA, normalizedHtmlB, htmlA, htmlB);
        normalizedResult.innerHTML = formatNormalizedComparison(normalizedDiffs);
        if (normalizedDiffs.hasDifference) totalDifferences += 1;

        // MÉTODO 2: Comparação Textual Original
        const textDiffs = compareText(htmlA, htmlB);
        textResult.innerHTML = formatTextComparison(textDiffs);
        if (textDiffs.length > 0) totalDifferences += textDiffs.length;

        // MÉTODO 3: DOM Comparator Original (se disponível)
        let domDiffs = [];
        try {
            if (typeof VWO !== 'undefined' && VWO.DOMComparator) {
                const comparator = VWO.DOMComparator.create({
                    stringA: normalizedHtmlA,
                    stringB: normalizedHtmlB
                });
                domDiffs = comparator.compare();
                domResult.innerHTML = formatDOMComparison(domDiffs);
                if (domDiffs.length > 0) totalDifferences += domDiffs.length;
            } else {
                domResult.innerHTML = '<em>DOM Comparator não carregado. Usando método alternativo...</em>';
                const altDiffs = compareDOM(normalizedHtmlA, normalizedHtmlB);
                domResult.innerHTML += '<br><br>' + formatAttributeComparison(altDiffs);
                if (altDiffs.length > 0) totalDifferences += altDiffs.length;
            }
        } catch (e) {
            domResult.innerHTML = `<span class="result-error">Erro no DOM Comparator: ${e.message}</span>`;
        }

        // MÉTODO 4: Análise de Atributos
        const attrDiffs = compareAttributes(normalizedHtmlA, normalizedHtmlB);
        attributeResult.innerHTML = formatAttributeComparison(attrDiffs);
        if (attrDiffs.length > 0) totalDifferences += attrDiffs.length;

        // MÉTODO 5: Comparação Hash
        const hashDiffs = compareByHash(normalizedHtmlA, normalizedHtmlB);
        hashResult.innerHTML = formatHashComparison(hashDiffs);
        if (hashDiffs.length > 0) totalDifferences += hashDiffs.length;

        // Atualiza contador
        operationCount.textContent = `${totalDifferences} diferença${totalDifferences !== 1 ? 's' : ''} encontrada${totalDifferences !== 1 ? 's' : ''}`;

        // Mostra informações sobre normalização
        showNormalizationStatus(normalizedHtmlA, normalizedHtmlB, htmlA, htmlB);
        
        resultSection.classList.remove('hidden');
        resultSection.classList.add('animate-fade-in');
        
        // Notificações contextuais
        const context = analyzeComparisonContext(urlDiffs);
        showContextualNotifications(context);

    } catch (error) {
        showError(`Erro durante a comparação: ${error.message}`);
    } finally {
        hideLoading(compareHtmlBtn, '<i class="fas fa-search mr-2"></i>Comparar HTML com Normalização Inteligente');
    }
}

// NOVO MÉTODO: Comparação de HTML Normalizado
function compareNormalizedHTML(normalizedA, normalizedB, originalA, originalB) {
    const isIdentical = normalizedA === normalizedB;
    
    return {
        hasDifference: !isIdentical,
        normalizedA: normalizedA,
        normalizedB: normalizedB,
        originalA: originalA,
        originalB: originalB,
        similarity: isIdentical ? 100 : calculateSimilarity(normalizedA, normalizedB)
    };
}

function showNormalizationStatus(normalizedA, normalizedB, originalA, originalB) {
    let info = '<strong>Resultado da Normalização:</strong><br><br>';
    
    const originalEqual = originalA === originalB;
    const normalizedEqual = normalizedA === normalizedB;
    
    if (originalEqual && normalizedEqual) {
        info += '<span class="result-success"><i class="fas fa-check-circle mr-2"></i>Os HTMLs são idênticos (original e normalizado)</span>';
    } else if (!originalEqual && normalizedEqual) {
        info += '<span class="result-success"><i class="fas fa-check-circle mr-2"></i>Os HTMLs são estruturalmente idênticos após normalização</span><br>';
        info += '<span class="result-info"><i class="fas fa-lightbulb mr-2"></i>As diferenças detectadas são apenas de formatação (espaços, quebras de linha, etc.)</span>';
    } else if (originalEqual && !normalizedEqual) {
        info += '<span class="result-warning"><i class="fas fa-exclamation-triangle mr-2"></i>Situação inesperada: originais iguais mas normalizados diferentes</span>';
    } else {
        info += '<span class="result-error"><i class="fas fa-exclamation-triangle mr-2"></i>Os HTMLs possuem diferenças estruturais reais</span>';
    }
    
    info += '<br><br><strong>Estatísticas:</strong><br>';
    info += `• Tamanho original A: ${originalA.length} caracteres<br>`;
    info += `• Tamanho original B: ${originalB.length} caracteres<br>`;
    info += `• Tamanho normalizado A: ${normalizedA.length} caracteres<br>`;
    info += `• Tamanho normalizado B: ${normalizedB.length} caracteres<br>`;
    
    const compressionA = ((originalA.length - normalizedA.length) / originalA.length * 100).toFixed(1);
    const compressionB = ((originalB.length - normalizedB.length) / originalB.length * 100).toFixed(1);
    
    info += `• Compressão A: ${compressionA}%<br>`;
    info += `• Compressão B: ${compressionB}%`;
    
    normalizationInfo.innerHTML = info;
    normalizationStatus.classList.remove('hidden');
}

// MÉTODOS DE COMPARAÇÃO HTML EXISTENTES

function compareText(htmlA, htmlB) {
    const linesA = htmlA.split('\n');
    const linesB = htmlB.split('\n');
    const differences = [];

    const maxLines = Math.max(linesA.length, linesB.length);
    
    for (let i = 0; i < maxLines; i++) {
        const lineA = linesA[i] || '';
        const lineB = linesB[i] || '';
        
        if (lineA !== lineB) {
            differences.push({
                line: i + 1,
                original: lineA,
                modified: lineB,
                type: !lineA ? 'added' : !lineB ? 'removed' : 'changed'
            });
        }
    }

    return differences;
}

function compareDOM(htmlA, htmlB) {
    const differences = [];
    
    try {
        const tempDiv1 = document.createElement('div');
        const tempDiv2 = document.createElement('div');
        tempDiv1.innerHTML = htmlA;
        tempDiv2.innerHTML = htmlB;

        if (tempDiv1.innerHTML !== tempDiv2.innerHTML) {
            differences.push({
                type: 'structure_change',
                description: 'Estrutura do DOM foi alterada',
                original: htmlA,
                modified: htmlB
            });
        }
    } catch (e) {
        differences.push({
            type: 'parse_error',
            description: 'Erro ao analisar HTML: ' + e.message
        });
    }

    return differences;
}

function compareAttributes(htmlA, htmlB) {
    const differences = [];
    
    try {
        const tempDiv1 = document.createElement('div');
        const tempDiv2 = document.createElement('div');
        tempDiv1.innerHTML = htmlA;
        tempDiv2.innerHTML = htmlB;

        const elements1 = tempDiv1.querySelectorAll('*');
        const elements2 = tempDiv2.querySelectorAll('*');

        if (elements1.length !== elements2.length) {
            differences.push({
                type: 'element_count',
                description: `Quantidade de elementos alterada: ${elements1.length} → ${elements2.length}`
            });
        }

        const minLength = Math.min(elements1.length, elements2.length);
        
        for (let i = 0; i < minLength; i++) {
            const el1 = elements1[i];
            const el2 = elements2[i];

            if (el1.tagName !== el2.tagName) {
                differences.push({
                    type: 'tag_change',
                    description: `Tag alterada: ${el1.tagName} → ${el2.tagName}`,
                    position: i + 1
                });
            }

            const attrs1 = Array.from(el1.attributes).map(attr => `${attr.name}="${attr.value}"`);
            const attrs2 = Array.from(el2.attributes).map(attr => `${attr.name}="${attr.value}"`);

            attrs1.forEach(attr => {
                if (!attrs2.includes(attr)) {
                    differences.push({
                        type: 'attribute_removed',
                        description: `Atributo removido: ${attr}`,
                        element: el1.tagName.toLowerCase(),
                        position: i + 1
                    });
                }
            });

            attrs2.forEach(attr => {
                if (!attrs1.includes(attr)) {
                    differences.push({
                        type: 'attribute_added',
                        description: `Atributo adicionado: ${attr}`,
                        element: el2.tagName.toLowerCase(),
                        position: i + 1
                    });
                }
            });

            if (el1.textContent.trim() !== el2.textContent.trim()) {
                differences.push({
                    type: 'text_change',
                    description: `Texto alterado: "${el1.textContent.trim()}" → "${el2.textContent.trim()}"`,
                    element: el1.tagName.toLowerCase(),
                    position: i + 1
                });
            }
        }

    } catch (e) {
        differences.push({
            type: 'analysis_error',
            description: 'Erro na análise de atributos: ' + e.message
        });
    }

    return differences;
}

function compareByHash(htmlA, htmlB) {
    const differences = [];
    
    function simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }

    const hashA = simpleHash(htmlA);
    const hashB = simpleHash(htmlB);

    if (hashA !== hashB) {
        differences.push({
            type: 'hash_difference',
            description: 'Conteúdo alterado detectado por hash',
            hashA: hashA,
            hashB: hashB,
            similarity: calculateSimilarity(htmlA, htmlB)
        });
    }

    return differences;
}

function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 100;
    
    const distance = levenshteinDistance(longer, shorter);
    return Math.round(((longer.length - distance) / longer.length) * 100);
}

function levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

// FUNÇÕES DE FORMATAÇÃO DOS RESULTADOS HTML

function formatNormalizedComparison(result) {
    if (!result.hasDifference) {
        return `<span class="result-success"><i class="fas fa-check-circle mr-2"></i>HTMLs são estruturalmente idênticos após normalização</span><br><br>
                <strong>Similaridade:</strong> 100%<br>
                <strong>Status:</strong> <span class="result-success">Conteúdo equivalente</span>`;
    }

    let html = `<span class="result-error"><i class="fas fa-exclamation-triangle mr-2"></i>HTMLs possuem diferenças estruturais reais</span><br><br>`;
    html += `<strong>Similaridade após normalização:</strong> ${result.similarity}%<br>`;
    html += `<strong>Status:</strong> <span class="result-error">Conteúdo diferente</span><br><br>`;
    
    html += `<details style="margin-top: 15px;">`;
    html += `<summary style="cursor: pointer; font-weight: bold; color: #667eea;">Ver HTMLs normalizados</summary>`;
    html += `<div style="margin-top: 10px;">`;
    html += `<strong>HTML A normalizado:</strong><br>`;
    html += `<code style="background: #f8f9fa; padding: 5px; border-radius: 3px; display: block; margin: 5px 0; white-space: pre-wrap; max-height: 100px; overflow-y: auto;">${escapeHtml(result.normalizedA)}</code>`;
    html += `<strong>HTML B normalizado:</strong><br>`;
    html += `<code style="background: #f8f9fa; padding: 5px; border-radius: 3px; display: block; margin: 5px 0; white-space: pre-wrap; max-height: 100px; overflow-y: auto;">${escapeHtml(result.normalizedB)}</code>`;
    html += `</div></details>`;

    return html;
}

function formatTextComparison(differences) {
    if (differences.length === 0) {
        return '<span class="result-success"><i class="fas fa-check-circle mr-2"></i>Nenhuma diferença textual encontrada</span>';
    }

    let html = `<strong>${differences.length} linha(s) alterada(s):</strong><br><br>`;
    
    differences.slice(0, 5).forEach((diff, index) => {
        let color = diff.type === 'added' ? '#28a745' : diff.type === 'removed' ? '#dc3545' : '#ffc107';
        let symbol = diff.type === 'added' ? '+' : diff.type === 'removed' ? '-' : '~';
        
        html += `<div style="margin-bottom: 10px; padding: 8px; border-left: 3px solid ${color}; background: ${color}15;">`;
        html += `<strong>Linha ${diff.line}:</strong> <span style="color: ${color};">${symbol}</span><br>`;
        if (diff.original) html += `<span style="color: #dc3545;">- ${escapeHtml(diff.original.substring(0, 100))}${diff.original.length > 100 ? '...' : ''}</span><br>`;
        if (diff.modified) html += `<span style="color: #28a745;">+ ${escapeHtml(diff.modified.substring(0, 100))}${diff.modified.length > 100 ? '...' : ''}</span>`;
        html += `</div>`;
    });

    if (differences.length > 5) {
        html += `<small class="result-info">... e mais ${differences.length - 5} diferenças</small>`;
    }

    return html;
}

function formatDOMComparison(differences) {
    if (differences.length === 0) {
        return '<span class="result-success"><i class="fas fa-check-circle mr-2"></i>Nenhuma diferença estrutural encontrada pelo DOM Comparator</span>';
    }

    let html = `<strong>${differences.length} operação(ões) detectada(s):</strong><br><br>`;
    
    differences.forEach((diff, index) => {
        html += `<div style="margin-bottom: 10px; padding: 8px; background: #f8f9fa; border-radius: 5px;">`;
        html += `<strong>Operação ${index + 1}:</strong> ${diff.name || 'desconhecida'}<br>`;
        if (diff.selectorPath) html += `<strong>Seletor:</strong> ${diff.selectorPath}<br>`;
        if (diff.content) html += `<strong>Conteúdo:</strong> ${JSON.stringify(diff.content)}<br>`;
        html += `</div>`;
    });

    return html;
}

function formatAttributeComparison(differences) {
    if (differences.length === 0) {
        return '<span class="result-success"><i class="fas fa-check-circle mr-2"></i>Nenhuma diferença de atributos encontrada</span>';
    }

    let html = `<strong>${differences.length} diferença(s) de atributos/estrutura:</strong><br><br>`;
    
    differences.slice(0, 10).forEach((diff, index) => {
        let color = diff.type.includes('added') ? '#28a745' : diff.type.includes('removed') ? '#dc3545' : '#667eea';
        
        html += `<div style="margin-bottom: 10px; padding: 8px; border-left: 3px solid ${color}; background: ${color}15;">`;
        html += `<strong>Tipo:</strong> ${diff.type}<br>`;
        html += `<strong>Descrição:</strong> ${diff.description}<br>`;
        if (diff.element) html += `<strong>Elemento:</strong> ${diff.element}<br>`;
        if (diff.position) html += `<strong>Posição:</strong> ${diff.position}<br>`;
        html += `</div>`;
    });

    if (differences.length > 10) {
        html += `<small class="result-info">... e mais ${differences.length - 10} diferenças</small>`;
    }

    return html;
}

function formatHashComparison(differences) {
    if (differences.length === 0) {
        return '<span class="result-success"><i class="fas fa-check-circle mr-2"></i>Conteúdo idêntico confirmado por hash</span>';
    }

    let html = `<strong>Diferença detectada por hash:</strong><br><br>`;
    
    differences.forEach((diff, index) => {
        html += `<div style="padding: 8px; background: #fff3cd; border-radius: 5px; border: 1px solid #ffeaa7;">`;
        html += `<strong>Hash A:</strong> ${diff.hashA}<br>`;
        html += `<strong>Hash B:</strong> ${diff.hashB}<br>`;
        html += `<strong>Similaridade:</strong> ${diff.similarity}%<br>`;
        html += `<strong>Status:</strong> <span class="result-error">Conteúdo modificado</span>`;
        html += `</div>`;
    });

    return html;
}

// Carrega DOM Comparator da Wingify
function loadDOMComparator() {
    const script = document.createElement('script');
    script.src = 'https://raw.githubusercontent.com/wingify/dom-comparator/master/dist/dom-comparator.min.js';
    script.onload = function() {
        console.log('DOM Comparator carregado com sucesso');
    };
    script.onerror = function() {
        console.warn('Erro ao carregar DOM Comparator original - usando métodos alternativos');
    };
    document.head.appendChild(script);
}

// ========================================
// FUNÇÕES DE CONTROLE DE TEMA
// ========================================

// Inicializa o tema baseado na preferência do usuário
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // Por padrão, sempre inicia com tema claro
        setTheme('light');
    }
    
    // Garantir que o ícone inicial esteja correto
    if (themeIcon) {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        if (currentTheme === 'dark') {
            themeIcon.className = 'fas fa-sun text-xl';
        } else {
            themeIcon.className = 'fas fa-moon text-xl';
        }
    }
}

// Alterna entre tema claro e escuro
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Define o tema
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Atualiza o ícone do botão
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun text-xl';
        themeToggle.title = 'Alternar para tema claro';
    } else {
        themeIcon.className = 'fas fa-moon text-xl';
        themeToggle.title = 'Alternar para tema escuro';
    }
    
    // Aplica as classes do Tailwind para o tema
    applyThemeClasses(theme);
}

// Aplica as classes do Tailwind baseadas no tema
function applyThemeClasses(theme) {
    const root = document.documentElement;
    
    if (theme === 'dark') {
        // Aplica tema escuro usando classes do Tailwind
        root.classList.add('dark');
    } else {
        // Aplica tema claro
        root.classList.remove('dark');
    }
    
    // As cores são aplicadas via CSS com [data-theme="dark"]
    // Não precisamos mais manipular classes manualmente
}
