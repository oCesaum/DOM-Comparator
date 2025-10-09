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
}

function setupEventListeners() {
    // Eventos dos botões principais
    fetchSitemapBtn.addEventListener('click', fetchSitemap);
    compareWithSelfBtn.addEventListener('click', compareWithSelf);
    manualSitemapBtn.addEventListener('click', showManualSitemapDialog);
    compareBtn.addEventListener('click', compareSitemaps);
    analyzeBtn.addEventListener('click', analyzeSitemap);
    
    // Eventos de mudança nos textareas
    sitemapATextarea.addEventListener('input', updateSitemapPreview);
    sitemapBTextarea.addEventListener('input', updateSitemapPreview);
    
    // Eventos nos campos de URL
    siteUrlInput.addEventListener('input', hideResults);
    sitemapUrlInput.addEventListener('input', hideResults);
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
    
    showLoading(fetchSitemapBtn, '🔍 Buscando sitemap...');
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
        hideLoading(fetchSitemapBtn, '🔍 Buscar Sitemap');
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

    showLoading(compareBtn, '🔍 Comparando sitemaps...');
    hideResults();

    try {
        // Parse dos sitemaps
        const parsedA = parseSitemap(sitemapA);
        const parsedB = parseSitemap(sitemapB);
        
        if (!parsedA.success || !parsedB.success) {
            showError('Erro ao fazer parse dos sitemaps. Verifique se são XML válidos.');
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
        resultSection.classList.add('fade-in');

    } catch (error) {
        showError(`Erro durante a comparação: ${error.message}`);
    } finally {
        hideLoading(compareBtn, '🔍 Comparar Sitemaps');
    }
}

// Analisa um sitemap individual
async function analyzeSitemap() {
    const sitemapA = sitemapATextarea.value.trim();
    
    if (!sitemapA) {
        showError('Por favor, primeiro busque um sitemap ou cole um sitemap no campo A.');
        return;
    }
    
    showLoading(analyzeBtn, '📊 Analisando sitemap...');
    hideResults();
    
    try {
        const parsed = parseSitemap(sitemapA);
        
        if (!parsed.success) {
            showError('Erro ao fazer parse do sitemap. Verifique se é XML válido.');
            return;
        }
        
        const analysis = analyzeSitemapData(parsed.data);
        showAnalysisStatus(analysis);
        
    } catch (error) {
        showError(`Erro durante a análise: ${error.message}`);
    } finally {
        hideLoading(analyzeBtn, '📊 Analisar Sitemap');
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
    const totalUrls = sitemapData.length;
    const priorities = sitemapData.filter(item => item.priority !== null).map(item => item.priority);
    const frequencies = sitemapData.filter(item => item.changefreq !== null).map(item => item.changefreq);
    const dates = sitemapData.filter(item => item.lastmod !== null).map(item => item.lastmod);
    
    const avgPriority = priorities.length > 0 ? 
        priorities.reduce((sum, p) => sum + p, 0) / priorities.length : 0;
    
    const frequencyDistribution = frequencies.reduce((acc, freq) => {
        acc[freq] = (acc[freq] || 0) + 1;
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

// FUNÇÕES DE FORMATAÇÃO DE RESULTADOS

function formatUrlComparison(diffs) {
    if (diffs.added.length === 0 && diffs.removed.length === 0 && diffs.modified.length === 0) {
        return '<span class="result-success">✅ Nenhuma diferença de URLs encontrada</span>';
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
        return '<span class="result-success">✅ Nenhuma diferença de prioridades encontrada</span>';
    }
    
    let html = `<strong>${diffs.length} diferença(s) de prioridade:</strong><br><br>`;
    
    diffs.slice(0, 5).forEach(diff => {
        html += `<div style="margin-bottom: 8px; padding: 8px; background: #fff3cd; border-radius: 4px;">`;
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
        return '<span class="result-success">✅ Nenhuma diferença de frequências encontrada</span>';
    }
    
    let html = `<strong>${diffs.length} diferença(s) de frequência:</strong><br><br>`;
    
    diffs.slice(0, 5).forEach(diff => {
        html += `<div style="margin-bottom: 8px; padding: 8px; background: #d1ecf1; border-radius: 4px;">`;
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
        return '<span class="result-success">✅ Nenhuma diferença de datas encontrada</span>';
    }
    
    let html = `<strong>${diffs.length} diferença(s) de data:</strong><br><br>`;
    
    diffs.slice(0, 5).forEach(diff => {
        html += `<div style="margin-bottom: 8px; padding: 8px; background: #f8d7da; border-radius: 4px;">`;
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
    html += `<div style="background: #e8f5e8; padding: 12px; border-radius: 6px;">`;
    html += `<strong>Sitemap A:</strong><br>`;
    html += `• Total de URLs: ${stats.sitemapA.totalUrls}<br>`;
    html += `• Prioridade média: ${stats.sitemapA.avgPriority}<br>`;
    html += `• Frequências: ${Object.keys(stats.sitemapA.frequencyDistribution).length} tipos<br>`;
    html += `• Última modificação: ${stats.sitemapA.avgLastmod || 'N/A'}`;
    html += `</div>`;
    
    // Sitemap B
    html += `<div style="background: #e8f0ff; padding: 12px; border-radius: 6px;">`;
    html += `<strong>Sitemap B:</strong><br>`;
    html += `• Total de URLs: ${stats.sitemapB.totalUrls}<br>`;
    html += `• Prioridade média: ${stats.sitemapB.avgPriority}<br>`;
    html += `• Frequências: ${Object.keys(stats.sitemapB.frequencyDistribution).length} tipos<br>`;
    html += `• Última modificação: ${stats.sitemapB.avgLastmod || 'N/A'}`;
    html += `</div>`;
    
    html += `</div>`;
    
    // Comparação
    html += `<div style="margin-top: 16px; padding: 12px; background: #fff3cd; border-radius: 6px;">`;
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
}

function hideLoading(button, originalText) {
    button.innerHTML = originalText;
    button.disabled = false;
}

function showSitemapStatus(url, content) {
    const parsed = parseSitemap(content);
    let info = `<strong>Sitemap encontrado:</strong><br>`;
    info += `• URL: ${escapeHtml(url)}<br>`;
    info += `• Tamanho: ${content.length} caracteres<br>`;
    
    if (parsed.success) {
        info += `• Itens: ${parsed.data.length}<br>`;
        info += `• Tipo: ${parsed.data[0]?.type === 'sitemap' ? 'Sitemap Index' : 'Sitemap de URLs'}<br>`;
        info += `<span class="result-success">✅ Sitemap válido e processado com sucesso</span>`;
    } else {
        info += `<span class="result-error">❌ Erro no parse: ${parsed.error}</span>`;
    }
    
    sitemapInfo.innerHTML = info;
    sitemapStatus.classList.remove('hidden');
}

// Função para inserir sitemap manualmente quando CORS falha
function showCorsError(url) {
    let info = `<strong>❌ Erro de CORS detectado:</strong><br><br>`;
    info += `O site <strong>${escapeHtml(url)}</strong> bloqueia requisições CORS.<br><br>`;
    info += `<strong>💡 Soluções:</strong><br>`;
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
            background: white;
            padding: 24px;
            border-radius: 8px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        ">
            <h3 style="margin-top: 0; color: #333;">📋 Inserir Sitemap Manualmente</h3>
            <p style="color: #666; margin-bottom: 16px;">
                Quando há bloqueio de CORS, você pode copiar o sitemap manualmente:
            </p>
            <ol style="color: #666; margin-bottom: 16px;">
                <li>Acesse o sitemap no navegador: <a href="${targetUrl}" target="_blank" style="color: #007bff;">${targetUrl}</a></li>
                <li>Copie todo o conteúdo XML (Ctrl+A, Ctrl+C)</li>
                <li>Cole no campo abaixo</li>
            </ol>
            <textarea id="manualSitemapInput" placeholder="Cole aqui o conteúdo do sitemap XML..." 
                style="width: 100%; height: 200px; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-family: monospace; font-size: 12px;"></textarea>
            <div style="margin-top: 16px; text-align: right;">
                <button id="cancelManualBtn" style="margin-right: 8px; padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer;">Cancelar</button>
                <button id="confirmManualBtn" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Inserir Sitemap</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Event listeners
    document.getElementById('cancelManualBtn').addEventListener('click', () => {
        document.body.removeChild(dialog);
    });
    
    document.getElementById('confirmManualBtn').addEventListener('click', () => {
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
    
    // Fecha ao clicar fora
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            document.body.removeChild(dialog);
        }
    });
}

function showAnalysisStatus(analysis) {
    analysisInfo.innerHTML = analysis;
    analysisStatus.classList.remove('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorSection.classList.remove('hidden');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Função para análise individual de sitemap
function analyzeSitemapData(sitemapData) {
    const totalUrls = sitemapData.length;
    const priorities = sitemapData.filter(item => item.priority !== null).map(item => item.priority);
    const frequencies = sitemapData.filter(item => item.changefreq !== null).map(item => item.changefreq);
    const dates = sitemapData.filter(item => item.lastmod !== null).map(item => item.lastmod);
    
    const avgPriority = priorities.length > 0 ? 
        priorities.reduce((sum, p) => sum + p, 0) / priorities.length : 0;
    
    const frequencyDistribution = frequencies.reduce((acc, freq) => {
        acc[freq] = (acc[freq] || 0) + 1;
        return acc;
    }, {});
    
    const avgLastmod = dates.length > 0 ? 
        dates.reduce((sum, date) => sum + new Date(date).getTime(), 0) / dates.length : null;
    
    let analysis = `<strong>Análise do Sitemap:</strong><br><br>`;
    analysis += `• <strong>Total de URLs:</strong> ${totalUrls}<br>`;
    analysis += `• <strong>Prioridade média:</strong> ${Math.round(avgPriority * 100) / 100}<br>`;
    analysis += `• <strong>Tipos de frequência:</strong> ${Object.keys(frequencyDistribution).length}<br>`;
    analysis += `• <strong>Última modificação média:</strong> ${avgLastmod ? new Date(avgLastmod).toISOString().split('T')[0] : 'N/A'}<br><br>`;
    
    if (Object.keys(frequencyDistribution).length > 0) {
        analysis += `<strong>Distribuição de frequências:</strong><br>`;
        for (const [freq, count] of Object.entries(frequencyDistribution)) {
            analysis += `• ${freq}: ${count} URLs<br>`;
        }
    }
    
    return analysis;
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

// Função para análise individual de sitemap
function analyzeSitemapData(sitemapData) {
    const totalUrls = sitemapData.length;
    const priorities = sitemapData.filter(item => item.priority !== null).map(item => item.priority);
    const frequencies = sitemapData.filter(item => item.changefreq !== null).map(item => item.changefreq);
    const dates = sitemapData.filter(item => item.lastmod !== null).map(item => item.lastmod);
    
    const avgPriority = priorities.length > 0 ? 
        priorities.reduce((sum, p) => sum + p, 0) / priorities.length : 0;
    
    const frequencyDistribution = frequencies.reduce((acc, freq) => {
        acc[freq] = (acc[freq] || 0) + 1;
        return acc;
    }, {});
    
    const avgLastmod = dates.length > 0 ? 
        dates.reduce((sum, date) => sum + new Date(date).getTime(), 0) / dates.length : null;
    
    let analysis = `<strong>Análise do Sitemap:</strong><br><br>`;
    analysis += `• <strong>Total de URLs:</strong> ${totalUrls}<br>`;
    analysis += `• <strong>Prioridade média:</strong> ${Math.round(avgPriority * 100) / 100}<br>`;
    analysis += `• <strong>Tipos de frequência:</strong> ${Object.keys(frequencyDistribution).length}<br>`;
    analysis += `• <strong>Última modificação média:</strong> ${avgLastmod ? new Date(avgLastmod).toISOString().split('T')[0] : 'N/A'}<br><br>`;
    
    if (Object.keys(frequencyDistribution).length > 0) {
        analysis += `<strong>Distribuição de frequências:</strong><br>`;
        for (const [freq, count] of Object.entries(frequencyDistribution)) {
            analysis += `• ${freq}: ${count} URLs<br>`;
        }
    }
    
    return analysis;
}
