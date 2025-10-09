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
let siteUrlInput, sitemapUrlInput, fetchSitemapBtn, compareWithSelfBtn, manualSitemapBtn;
let sitemapATextarea, sitemapBTextarea, compareBtn, analyzeBtn;
let resultSection, errorSection, operationCount, sitemapStatus, analysisStatus;
let urlResult, priorityResult, frequencyResult, dateResult, statsResult;
let errorMessage, sitemapInfo, analysisInfo, previewA, previewB;
let themeToggle, themeIcon;
let notificationPopup, notificationIcon, notificationTitle, notificationMessage, closeNotification;

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
    // Elementos de configuração do site
    siteUrlInput = document.getElementById('siteUrl');
    sitemapUrlInput = document.getElementById('sitemapUrl');
    fetchSitemapBtn = document.getElementById('fetchSitemapBtn');
    compareWithSelfBtn = document.getElementById('compareWithSelfBtn');
    manualSitemapBtn = document.getElementById('manualSitemapBtn');
    
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
    
    // Elementos de resultado específicos
    urlResult = document.getElementById('urlResult');
    priorityResult = document.getElementById('priorityResult');
    frequencyResult = document.getElementById('frequencyResult');
    dateResult = document.getElementById('dateResult');
    statsResult = document.getElementById('statsResult');
    
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
    // Eventos dos botões principais
    fetchSitemapBtn.addEventListener('click', fetchSitemap);
    compareWithSelfBtn.addEventListener('click', compareWithSelf);
    manualSitemapBtn.addEventListener('click', showManualSitemapDialog);
    compareBtn.addEventListener('click', compareSitemaps);
    analyzeBtn.addEventListener('click', analyzeSitemap);
    
    // Eventos do Comparador HTML
    compareHtmlBtn.addEventListener('click', compareHTML);
    previewBtn.addEventListener('click', previewNormalization);
    
    // Eventos de mudança nos textareas
    sitemapATextarea.addEventListener('input', updateSitemapPreview);
    sitemapBTextarea.addEventListener('input', updateSitemapPreview);
    htmlATextarea.addEventListener('input', hideResults);
    htmlBTextarea.addEventListener('input', hideResults);
    
    // Eventos nos campos de URL
    siteUrlInput.addEventListener('input', hideResults);
    sitemapUrlInput.addEventListener('input', hideResults);
    
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
    
    // Evento do toggle de tema
    themeToggle.addEventListener('click', toggleTheme);
    
    // Evento do botão de fechar notificação
    closeNotification.addEventListener('click', hideNotification);
    
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
}

// FUNÇÕES PRINCIPAIS DO ROBÔ DE SITEMAP

// Busca sitemap de um site
async function fetchSitemap() {
    const siteUrl = siteUrlInput.value.trim();
    const sitemapUrl = sitemapUrlInput.value.trim();
    
    if (!siteUrl) {
        showError('Por favor, informe a URL do site.');
        return;
    }
    
    showLoading(fetchSitemapBtn, '<i class="fas fa-search mr-2"></i>Buscando sitemap...');
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
            sitemapATextarea.value = sitemapContent;
            updateSitemapPreview();
            showSitemapStatus(foundUrl, sitemapContent);
        } else {
            showError('Não foi possível encontrar ou acessar o sitemap.');
        }
        
    } catch (error) {
        console.error('Erro ao buscar sitemap:', error);
        
        // Verifica se é erro de CORS
        if (error.message.includes('CORS') || error.message.includes('blocked')) {
            const targetUrl = sitemapUrl || `${siteUrl}/sitemap.xml`;
            showCorsError(targetUrl);
        } else {
            showError(`Erro ao buscar sitemap: ${error.message}`);
        }
    } finally {
        hideLoading(fetchSitemapBtn, '<i class="fas fa-search mr-2"></i>Buscar Sitemap');
    }
}

// Compara sitemap consigo mesmo (para testar)
async function compareWithSelf() {
    const sitemapA = sitemapATextarea.value.trim();
    
    if (!sitemapA) {
        showError('Por favor, primeiro busque um sitemap ou cole um sitemap no campo A.');
        return;
    }
    
    // Copia o sitemap A para o campo B
    sitemapBTextarea.value = sitemapA;
    updateSitemapPreview();
    
    // Executa a comparação
    await compareSitemaps();
    
    showAnalysisStatus('Comparação realizada consigo mesmo - deve mostrar 0 diferenças.');
}

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
        
        // Exibe resultados
        urlResult.innerHTML = formatUrlComparison(urlDiffs);
        priorityResult.innerHTML = formatPriorityComparison(priorityDiffs);
        frequencyResult.innerHTML = formatFrequencyComparison(frequencyDiffs);
        dateResult.innerHTML = formatDateComparison(dateDiffs);
        statsResult.innerHTML = formatStatsComparison(stats);

        // Atualiza contador
        const totalDiffs = urlDiffs.added.length + urlDiffs.removed.length + urlDiffs.modified.length +
                          priorityDiffs.length + frequencyDiffs.length + dateDiffs.length;
        operationCount.textContent = `${totalDiffs} diferença${totalDiffs !== 1 ? 's' : ''} encontrada${totalDiffs !== 1 ? 's' : ''}`;
        
        resultSection.classList.remove('hidden');
        resultSection.classList.add('animate-fade-in');

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
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
        `https://cors-anywhere.herokuapp.com/${url}`,
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
    ];
    
    for (const proxyUrl of proxyUrls) {
        try {
            console.log(`Tentando proxy: ${proxyUrl}`);
            const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: {
                    'User-Agent': sitemapRobot.headers['User-Agent']
                }
            });
            
            if (response.ok) {
                let content;
                if (proxyUrl.includes('allorigins.win')) {
                    const data = await response.json();
                    content = data.contents;
                } else {
                    content = await response.text();
                }
                
                if (content && (content.includes('<urlset') || content.includes('<sitemapindex'))) {
                    return { ok: true, text: () => Promise.resolve(content) };
                }
            }
        } catch (proxyError) {
            console.warn(`Proxy falhou: ${proxyError.message}`);
            continue;
        }
    }
    
    throw new Error('Todos os proxies falharam');
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

// FUNÇÕES DE FORMATAÇÃO DE RESULTADOS

function formatUrlComparison(diffs) {
    if (diffs.added.length === 0 && diffs.removed.length === 0 && diffs.modified.length === 0) {
        return '<span class="result-success"><i class="fas fa-check-circle mr-2"></i>Nenhuma diferença de URLs encontrada</span>';
    }
    
    let html = '<strong>Diferenças de URLs:</strong><br><br>';
    
    if (diffs.added.length > 0) {
        html += `<div style="color: #28a745; margin-bottom: 10px;">`;
        html += `<strong>+ ${diffs.added.length} URL(s) adicionada(s):</strong><br>`;
        diffs.added.slice(0, 5).forEach(item => {
            html += `• ${escapeHtml(item.url)}<br>`;
        });
        if (diffs.added.length > 5) {
            html += `... e mais ${diffs.added.length - 5} URLs`;
        }
        html += `</div>`;
    }
    
    if (diffs.removed.length > 0) {
        html += `<div style="color: #dc3545; margin-bottom: 10px;">`;
        html += `<strong>- ${diffs.removed.length} URL(s) removida(s):</strong><br>`;
        diffs.removed.slice(0, 5).forEach(item => {
            html += `• ${escapeHtml(item.url)}<br>`;
        });
        if (diffs.removed.length > 5) {
            html += `... e mais ${diffs.removed.length - 5} URLs`;
        }
        html += `</div>`;
    }
    
    if (diffs.modified.length > 0) {
        html += `<div style="color: #ffc107; margin-bottom: 10px;">`;
        html += `<strong>~ ${diffs.modified.length} URL(s) modificada(s):</strong><br>`;
        diffs.modified.slice(0, 3).forEach(item => {
            html += `• ${escapeHtml(item.url)}<br>`;
        });
        if (diffs.modified.length > 3) {
            html += `... e mais ${diffs.modified.length - 3} URLs`;
        }
        html += `</div>`;
    }

    return html;
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

// Mostra diálogo para inserção manual de sitemap
function showManualSitemapDialog() {
    const siteUrl = siteUrlInput.value.trim();
    const sitemapUrl = sitemapUrlInput.value.trim();
    
    let targetUrl = sitemapUrl || `${siteUrl}/sitemap.xml`;
    if (!siteUrl && !sitemapUrl) {
        targetUrl = 'https://exemplo.com/sitemap.xml';
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
    
    dialog.innerHTML = `
        <div style="
            background: var(--color-surface);
            padding: 24px;
            border-radius: 8px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            border: 2px solid var(--color-primary);
            box-shadow: var(--shadow-lg);
        ">
            <h3 style="margin-top: 0; color: var(--color-primary); font-size: var(--font-size-xl); font-weight: var(--font-weight-semibold);"><i class="fas fa-clipboard mr-2"></i>Inserir Sitemap Manualmente</h3>
            <p style="color: var(--color-text); margin-bottom: 16px; line-height: var(--line-height-normal);">
                Quando há bloqueio de CORS, você pode copiar o sitemap manualmente:
            </p>
            <ol style="color: var(--color-text); margin-bottom: 16px; line-height: var(--line-height-normal);">
                <li>Acesse o sitemap no navegador: <a href="${targetUrl}" target="_blank" style="color: var(--color-primary); text-decoration: none;">${targetUrl}</a></li>
                <li>Copie todo o conteúdo XML (Ctrl+A, Ctrl+C)</li>
                <li>Cole no campo abaixo</li>
            </ol>
            <textarea id="manualSitemapInput" placeholder="Cole aqui o conteúdo do sitemap XML..." 
                style="width: 100%; height: 200px; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; font-family: var(--font-family-mono); font-size: 12px; background: var(--color-background); color: var(--color-text); resize: vertical;"></textarea>
            <div style="margin-top: 16px; text-align: right;">
                <button id="cancelManualBtn" style="margin-right: 8px; padding: 8px 16px; border: 1px solid var(--color-border); background: var(--color-secondary); color: var(--color-text); border-radius: 4px; cursor: pointer; transition: var(--duration-fast) var(--ease-standard);">Cancelar</button>
                <button id="confirmManualBtn" style="padding: 8px 16px; background: var(--color-primary); color: var(--color-btn-primary-text); border: none; border-radius: 4px; cursor: pointer; transition: var(--duration-fast) var(--ease-standard);">Inserir Sitemap</button>
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
            sitemapATextarea.value = content;
            updateSitemapPreview();
            showSitemapStatus(targetUrl, content);
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
        confirmBtn.style.background = 'var(--color-primary-hover)';
    });
    
    confirmBtn.addEventListener('mouseleave', () => {
        confirmBtn.style.background = 'var(--color-primary)';
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
    notificationIcon.textContent = icons[type] || icons.info;
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    
    // Aplica cor da borda baseada no tipo
    const popupContent = notificationPopup.querySelector('.bg-surface-light');
    popupContent.className = popupContent.className.replace(/border-\w+/, '');
    popupContent.classList.add('border', colors[type] || colors.info);
    
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

// Alterna entre modos de comparação
function switchComparatorMode() {
    const selectedMode = document.querySelector('input[name="comparatorMode"]:checked').value;
    console.log('Alternando para modo:', selectedMode);
    
    if (selectedMode === 'sitemap') {
        // Mostra interface do sitemap - seção de configuração
        const sections = document.querySelectorAll('section.bg-surface-light.p-8.rounded-2xl.mb-10');
        console.log('Seções encontradas:', sections.length);
        sections.forEach(section => {
            const h2 = section.querySelector('h2');
            if (h2 && h2.textContent.includes('🌐 Configuração do Site')) {
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
        
        // Oculta interface do HTML
        htmlComparatorInterface.classList.add('hidden');
        
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
            if (h2 && h2.textContent.includes('🌐 Configuração do Site')) {
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
    notificationIcon.textContent = icons[type] || icons.info;
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    
    // Aplica cor da borda baseada no tipo
    const popupContent = notificationPopup.querySelector('.bg-surface-light');
    popupContent.className = popupContent.className.replace(/border-\w+/, '');
    popupContent.classList.add('border', colors[type] || colors.info);
    
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

// Normaliza espaços em branco e formatação
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
    notificationIcon.textContent = icons[type] || icons.info;
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    
    // Aplica cor da borda baseada no tipo
    const popupContent = notificationPopup.querySelector('.bg-surface-light');
    popupContent.className = popupContent.className.replace(/border-\w+/, '');
    popupContent.classList.add('border', colors[type] || colors.info);
    
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

// Atualiza prévia em tempo real
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
    notificationIcon.textContent = icons[type] || icons.info;
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    
    // Aplica cor da borda baseada no tipo
    const popupContent = notificationPopup.querySelector('.bg-surface-light');
    popupContent.className = popupContent.className.replace(/border-\w+/, '');
    popupContent.classList.add('border', colors[type] || colors.info);
    
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

