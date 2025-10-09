// Exemplos pré-definidos
const examples = {
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

// Elementos DOM
let htmlATextarea, htmlBTextarea, compareBtn, previewBtn;
let resultSection, errorSection, operationCount, normalizationStatus;
let textResult, domResult, attributeResult, hashResult, normalizedResult;
let errorMessage, normalizationInfo, normalizedA, normalizedB;
let normalizeWhitespace, normalizeAttributes, ignoreComments, normalizeCase;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    loadDOMComparator();
});

function initializeElements() {
    htmlATextarea = document.getElementById('htmlA');
    htmlBTextarea = document.getElementById('htmlB');
    compareBtn = document.getElementById('compareBtn');
    previewBtn = document.getElementById('previewBtn');
    resultSection = document.getElementById('resultSection');
    errorSection = document.getElementById('errorSection');
    normalizationStatus = document.getElementById('normalizationStatus');
    operationCount = document.getElementById('operationCount');
    textResult = document.getElementById('textResult');
    domResult = document.getElementById('domResult');
    attributeResult = document.getElementById('attributeResult');
    hashResult = document.getElementById('hashResult');
    normalizedResult = document.getElementById('normalizedResult');
    errorMessage = document.getElementById('errorMessage');
    normalizationInfo = document.getElementById('normalizationInfo');
    normalizedA = document.getElementById('normalizedA');
    normalizedB = document.getElementById('normalizedB');
    
    // Checkboxes de normalização
    normalizeWhitespace = document.getElementById('normalizeWhitespace');
    normalizeAttributes = document.getElementById('normalizeAttributes');
    ignoreComments = document.getElementById('ignoreComments');
    normalizeCase = document.getElementById('normalizeCase');
}

function setupEventListeners() {
    compareBtn.addEventListener('click', compareHTML);
    previewBtn.addEventListener('click', previewNormalization);
    
    // Eventos de mudança nos textareas
    htmlATextarea.addEventListener('input', hideResults);
    htmlBTextarea.addEventListener('input', hideResults);
    
    // Eventos nos checkboxes para atualizar prévia em tempo real
    normalizeWhitespace.addEventListener('change', updatePreview);
    normalizeAttributes.addEventListener('change', updatePreview);
    ignoreComments.addEventListener('change', updatePreview);
    normalizeCase.addEventListener('change', updatePreview);
}

function loadExample(type) {
    const example = examples[type];
    if (example) {
        htmlATextarea.value = example.htmlA;
        htmlBTextarea.value = example.htmlB;
        hideResults();
        updatePreview();
    }
}

function clearFields() {
    htmlATextarea.value = '';
    htmlBTextarea.value = '';
    hideResults();
    updatePreview();
}

function hideResults() {
    resultSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    normalizationStatus.classList.add('hidden');
}

function showLoading() {
    compareBtn.innerHTML = '<div class="loading"></div>Analisando com Normalização...';
    compareBtn.disabled = true;
}

function hideLoading() {
    compareBtn.innerHTML = 'Comparar HTML com Normalização Inteligente';
    compareBtn.disabled = false;
}

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

// FUNÇÃO PRINCIPAL DE NORMALIZAÇÃO DE HTML
function normalizeHTML(html) {
    if (!html || !html.trim()) return '';
    
    let normalized = html.trim();
    
    try {
        // Cria um elemento temporário para parsing
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = normalized;
        
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
        info += '<span class="result-warning">⚠️ Nenhuma opção de normalização está ativa</span>';
    }
    
    normalizationInfo.innerHTML = info;
    normalizationStatus.classList.remove('hidden');
}

async function compareHTML() {
    const htmlA = htmlATextarea.value.trim();
    const htmlB = htmlBTextarea.value.trim();

    if (!htmlA || !htmlB) {
        showError('Por favor, preencha ambos os campos HTML.');
        return;
    }

    showLoading();
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
        resultSection.classList.add('fade-in');

    } catch (error) {
        showError(`Erro durante a comparação: ${error.message}`);
    } finally {
        hideLoading();
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
        info += '<span class="result-success">✅ Os HTMLs são idênticos (original e normalizado)</span>';
    } else if (!originalEqual && normalizedEqual) {
        info += '<span class="result-success">✅ Os HTMLs são estruturalmente idênticos após normalização</span><br>';
        info += '<span class="result-info">💡 As diferenças detectadas são apenas de formatação (espaços, quebras de linha, etc.)</span>';
    } else if (originalEqual && !normalizedEqual) {
        info += '<span class="result-warning">⚠️ Situação inesperada: originais iguais mas normalizados diferentes</span>';
    } else {
        info += '<span class="result-error">❌ Os HTMLs possuem diferenças estruturais reais</span>';
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

// MÉTODOS DE COMPARAÇÃO EXISTENTES (mantidos iguais)

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

// FUNÇÕES DE FORMATAÇÃO DOS RESULTADOS

function formatNormalizedComparison(result) {
    if (!result.hasDifference) {
        return `<span class="result-success">✅ HTMLs são estruturalmente idênticos após normalização</span><br><br>
                <strong>Similaridade:</strong> 100%<br>
                <strong>Status:</strong> <span class="result-success">Conteúdo equivalente</span>`;
    }

    let html = `<span class="result-error">❌ HTMLs possuem diferenças estruturais reais</span><br><br>`;
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
        return '<span class="result-success">✅ Nenhuma diferença textual encontrada</span>';
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
        return '<span class="result-success">✅ Nenhuma diferença estrutural encontrada pelo DOM Comparator</span>';
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
        return '<span class="result-success">✅ Nenhuma diferença de atributos encontrada</span>';
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
        return '<span class="result-success">✅ Conteúdo idêntico confirmado por hash</span>';
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

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError(message) {
    errorMessage.textContent = message;
    errorSection.classList.remove('hidden');
}
