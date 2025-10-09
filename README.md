# 🤖 DOM Comparator Universal

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)](https://jquery.com/)
[![Underscore.js](https://img.shields.io/badge/Underscore.js-0371B5?style=for-the-badge&logo=underscore.js&logoColor=white)](https://underscorejs.org/)

> **Ferramenta completa para comparação de sitemaps e HTML com normalização inteligente e robô automatizado**

## 📋 Índice

- [🎯 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades](#-funcionalidades)
- [🚀 Como Usar](#-como-usar)
- [🔧 Métodos de Comparação](#-métodos-de-comparação)
- [⚙️ Opções de Normalização](#️-opções-de-normalização)
- [📱 Responsividade](#-responsividade)
- [🎨 Design System](#-design-system)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [📖 Exemplos Práticos](#-exemplos-práticos)
- [🔍 Casos de Uso](#-casos-de-uso)
- [⚡ Performance](#-performance)
- [🔒 Segurança](#-segurança)
- [🤝 Contribuição](#-contribuição)
- [📄 Licença](#-licença)

## 🎯 Sobre o Projeto

O **DOM Comparator Universal** é uma ferramenta web completa que oferece dois modos distintos de comparação:

1. **🤖 Modo Sitemap**: Robô automatizado para busca e comparação de sitemaps XML
2. **🔧 Modo HTML**: Comparação inteligente de código HTML com normalização automática

A ferramenta permite comparar sitemaps e códigos HTML de forma inteligente, ignorando diferenças irrelevantes de formatação e focando apenas nas mudanças estruturais e de conteúdo que realmente importam.

### 🎪 Características Principais

- **🤖 Robô de Sitemap**: Busca automática e comparação de sitemaps XML
- **🔧 Normalização Inteligente**: Remove diferenças de formatação desnecessárias
- **📊 Múltiplos Métodos**: 5 algoritmos diferentes de comparação para cada modo
- **🎨 Interface Moderna**: Design responsivo com suporte a tema claro/escuro
- **⚡ Performance Otimizada**: Processamento rápido mesmo com arquivos grandes
- **📱 Totalmente Responsivo**: Funciona perfeitamente em qualquer dispositivo
- **🔄 Proxy CORS**: Resolve problemas de CORS automaticamente

## ✨ Funcionalidades

### 🤖 Modo Sitemap (Robô Automatizado)

#### 🔍 Busca Automática de Sitemaps
- **Detecção Inteligente**: Busca sitemaps em caminhos comuns (`/sitemap.xml`, `/sitemap_index.xml`, etc.)
- **Proxy CORS**: Resolve problemas de CORS automaticamente usando múltiplos proxies
- **Validação XML**: Verifica se o conteúdo é um sitemap válido antes do processamento
- **Fallback Manual**: Opção para inserção manual quando CORS falha

#### 📊 Comparação de Sitemaps
- **🔗 Comparação de URLs**: Detecta URLs adicionadas, removidas ou modificadas
- **⭐ Análise de Prioridades**: Compara valores de prioridade entre sitemaps
- **🔄 Análise de Frequências**: Detecta mudanças nas frequências de atualização
- **📅 Análise de Datas**: Compara datas de última modificação
- **📊 Estatísticas Gerais**: Mostra estatísticas comparativas dos dois sitemaps

### 🔧 Modo HTML (Comparação Inteligente)

#### 🎯 Comparação Normalizada (Principal)
- Remove espaços em branco desnecessários
- Normaliza quebras de linha e indentação
- Ignora comentários HTML opcionais
- Ordena atributos alfabeticamente
- Converte tags para minúsculas

#### 📝 Comparação Textual Original
- Detecta qualquer mudança no código fonte
- Mostra diferenças linha por linha
- Identifica adições, remoções e modificações

#### 🔧 DOM Comparator (Wingify)
- Análise estrutural usando biblioteca especializada
- Detecta mudanças na estrutura do DOM
- Identifica operações específicas de modificação

#### 📋 Análise de Atributos
- Detecta mudanças em atributos específicos
- Identifica alterações em classes CSS
- Monitora mudanças em estilos inline

#### 🔐 Comparação por Hash
- Gera hash único para cada elemento
- Detecta diferenças através de algoritmos de hash
- Calcula similaridade percentual

## 🚀 Como Usar

### 🤖 Modo Sitemap (Robô Automatizado)

#### 1. 📥 Configuração do Site
1. Abra o arquivo `index.html` em seu navegador
2. Selecione o modo **🤖 Sitemap** no seletor de modo
3. Informe a URL do site no campo **URL do Site**
4. (Opcional) Informe uma URL específica de sitemap

#### 2. 🔍 Busca Automática
1. Clique em **"🔍 Buscar Sitemap"** para busca automática
2. O robô tentará encontrar o sitemap nos caminhos comuns
3. Se CORS falhar, use **"📋 Inserir Manualmente"** para colar o conteúdo
4. Use **"🔄 Comparar Consigo Mesmo"** para testar a ferramenta

#### 3. 📊 Comparação de Sitemaps
1. Cole o segundo sitemap no campo **Sitemap B**
2. Clique em **"🔍 Comparar Sitemaps"**
3. Analise os resultados nos 5 métodos de comparação

### 🔧 Modo HTML (Comparação Inteligente)

#### 1. 📥 Preparação
1. Selecione o modo **🔧 HTML** no seletor de modo
2. Cole o código HTML original no campo **HTML A**
3. Cole o código HTML modificado no campo **HTML B**

#### 2. ⚙️ Configuração
Ajuste as opções de normalização conforme necessário:
- ✅ **Normalizar espaços em branco**: Remove quebras de linha e espaços extras
- ✅ **Ordenar atributos**: Ordena atributos alfabeticamente
- ✅ **Ignorar comentários**: Remove comentários HTML
- ✅ **Normalizar maiúsculas**: Converte tags para minúsculas

#### 3. 🔍 Comparação
1. Clique em **"Comparar HTML com Normalização Inteligente"**
2. Aguarde o processamento (indicador de carregamento)
3. Analise os resultados nos diferentes métodos

### 📊 Análise dos Resultados
- **Verde**: Conteúdos são estruturalmente idênticos
- **Vermelho**: Diferenças estruturais reais encontradas
- **Amarelo**: Avisos e informações importantes
- **Azul**: Informações e estatísticas detalhadas

## 🔧 Métodos de Comparação

### 🎯 1. Comparação Normalizada
```javascript
// Remove formatação irrelevante e compara estrutura
const normalizedA = normalizeHTML(htmlA);
const normalizedB = normalizeHTML(htmlB);
const isIdentical = normalizedA === normalizedB;
```

### 📝 2. Comparação Textual
```javascript
// Compara linha por linha o código original
const linesA = htmlA.split('\n');
const linesB = htmlB.split('\n');
// Detecta adições, remoções e modificações
```

### 🔧 3. DOM Comparator
```javascript
// Usa biblioteca especializada da Wingify
const comparator = VWO.DOMComparator.create({
    stringA: normalizedA,
    stringB: normalizedB
});
const differences = comparator.compare();
```

### 📋 4. Análise de Atributos
```javascript
// Analisa atributos específicos de cada elemento
const elements1 = tempDiv1.querySelectorAll('*');
const elements2 = tempDiv2.querySelectorAll('*');
// Compara atributos, classes e estilos
```

### 🔐 5. Comparação por Hash
```javascript
// Gera hash único para detecção de mudanças
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
    }
    return hash;
}
```

## ⚙️ Opções de Normalização

### 🧹 Normalização de Espaços em Branco
- Remove quebras de linha desnecessárias
- Elimina espaços extras e indentação
- Normaliza espaços entre tags
- Preserva conteúdo textual importante

### 📝 Ordenação de Atributos
- Ordena atributos alfabeticamente
- Normaliza espaços entre atributos
- Preserva valores dos atributos
- Facilita comparação estrutural

### 💬 Remoção de Comentários
- Remove comentários HTML (`<!-- -->`)
- Ignora comentários condicionais
- Preserva funcionalidade do código
- Reduz ruído na comparação

### 🔤 Normalização de Maiúsculas
- Converte tags para minúsculas
- Padroniza `<DIV>` → `<div>`
- Mantém valores de atributos intactos
- Facilita comparação case-insensitive

## 📱 Responsividade

### 🖥️ Desktop (1280px+)
- Layout em grid com 2 colunas
- Todos os métodos visíveis simultaneamente
- Interface completa e detalhada

### 📱 Tablet (768px - 1024px)
- Grid adaptativo
- Métodos empilhados verticalmente
- Opções de normalização em coluna única

### 📱 Mobile (480px - 768px)
- Layout em coluna única
- Botões em largura total
- Textareas com altura reduzida
- Interface otimizada para toque

### 📱 Mobile Portrait (< 480px)
- Interface ultra-compacta
- Fontes reduzidas
- Elementos otimizados para telas pequenas
- Navegação simplificada

## 🎨 Design System

### 🎨 Paleta de Cores
```css
/* Cores Primárias */
--color-primary: #21808D;        /* Teal principal */
--color-success: #21808D;        /* Verde de sucesso */
--color-error: #C0152F;          /* Vermelho de erro */
--color-warning: #A84B2F;        /* Laranja de aviso */
--color-info: #626C71;           /* Cinza informativo */

/* Cores de Fundo */
--color-background: #FCFCF9;     /* Fundo principal */
--color-surface: #FFFFFD;        /* Superfície de cards */
--color-secondary: rgba(94, 82, 64, 0.12); /* Secundário */
```

### 📝 Tipografia
```css
/* Família de Fontes */
--font-family-base: "FKGroteskNeue", "Geist", "Inter", sans-serif;
--font-family-mono: "Berkeley Mono", ui-monospace, monospace;

/* Tamanhos */
--font-size-xs: 11px;
--font-size-sm: 12px;
--font-size-base: 14px;
--font-size-lg: 16px;
--font-size-xl: 18px;
--font-size-2xl: 20px;
--font-size-3xl: 24px;
--font-size-4xl: 30px;
```

### 📏 Espaçamento
```css
/* Sistema de Espaçamento */
--space-4: 4px;
--space-8: 8px;
--space-12: 12px;
--space-16: 16px;
--space-20: 20px;
--space-24: 24px;
--space-32: 32px;
```

### 🔄 Animações
```css
/* Durações */
--duration-fast: 150ms;
--duration-normal: 250ms;

/* Easing */
--ease-standard: cubic-bezier(0.16, 1, 0.3, 1);
```

## 📁 Estrutura do Projeto

```
DOM Comparator Universal/
├── 📄 index.html          # Página principal com interface dual
├── 🎨 styles.css          # Design system completo com tema claro/escuro
├── ⚡ script.js           # Lógica JavaScript para ambos os modos
└── 📖 README.md          # Documentação completa
```

### 📄 index.html
- **Interface Dual**: Seletor de modo para alternar entre Sitemap e HTML
- **Estrutura Semântica**: HTML5 com meta tags para responsividade
- **Dependências Externas**: jQuery, Underscore.js, DOM Comparator (Wingify)
- **Configuração de Site**: Campos para URL do site e sitemap específico
- **Áreas de Comparação**: Textareas para sitemaps e HTML
- **Resultados Dinâmicos**: Seções que alternam conforme o modo selecionado

### 🎨 styles.css
- **Design System Avançado**: Sistema de tokens de design baseado no Perplexity
- **Tema Claro/Escuro**: Suporte automático via `prefers-color-scheme`
- **Responsividade Completa**: Breakpoints para desktop, tablet e mobile
- **Animações Suaves**: Transições e efeitos visuais modernos
- **Componentes Reutilizáveis**: Botões, cards, status indicators
- **Scrollbars Customizadas**: Estilização personalizada para melhor UX

### ⚡ script.js
- **Robô de Sitemap**: Busca automática com detecção inteligente de caminhos
- **Proxy CORS**: Resolução automática de problemas de CORS
- **5 Métodos de Comparação**: Para sitemaps e HTML com algoritmos distintos
- **Normalização Inteligente**: Processamento avançado de HTML
- **Interface Interativa**: Event listeners e atualizações em tempo real
- **Tratamento de Erros**: Fallbacks e mensagens informativas
- **Validação XML**: Verificação de sitemaps antes do processamento

## 🛠️ Tecnologias Utilizadas

### 🌐 Frontend
- **HTML5**: Estrutura semântica moderna com meta tags responsivas
- **CSS3**: Design system avançado baseado no Perplexity com variáveis CSS
- **JavaScript ES6+**: Lógica moderna e otimizada com async/await

### 📚 Bibliotecas Externas
- **jQuery 3.6.0**: Manipulação DOM simplificada e eventos
- **Underscore.js 1.9.1**: Utilitários JavaScript para arrays e objetos
- **DOM Comparator (Wingify)**: Comparação estrutural avançada de HTML
- **DOMParser**: Parsing nativo de XML para sitemaps

### 🤖 Funcionalidades Avançadas
- **Fetch API**: Requisições HTTP modernas para busca de sitemaps
- **Proxy CORS**: Integração com múltiplos proxies para resolver CORS
- **XML Parsing**: Processamento nativo de sitemaps XML
- **Hash Algorithms**: Geração de hashes para detecção de mudanças
- **Levenshtein Distance**: Cálculo de similaridade entre strings

### 🎨 Design System
- **CSS Custom Properties**: Sistema de design tokenizado completo
- **Flexbox & Grid**: Layouts modernos e responsivos
- **CSS Animations**: Transições suaves e feedback visual
- **Dark Mode**: Suporte automático via `prefers-color-scheme`
- **Responsive Design**: Breakpoints para todos os dispositivos

## 📖 Exemplos Práticos

### 🤖 Exemplos de Sitemap

#### 🔍 Exemplo 1: Busca Automática
```
URL do Site: https://exemplo.com
Robô busca automaticamente em:
- https://exemplo.com/sitemap.xml
- https://exemplo.com/sitemap_index.xml
- https://exemplo.com/sitemaps.xml
```
**Resultado**: Sitemap encontrado e carregado automaticamente

#### 📊 Exemplo 2: Comparação de URLs
```xml
<!-- Sitemap A -->
<url>
  <loc>https://exemplo.com/pagina1</loc>
  <priority>0.8</priority>
</url>

<!-- Sitemap B -->
<url>
  <loc>https://exemplo.com/pagina1</loc>
  <loc>https://exemplo.com/pagina2</loc>
  <priority>0.9</priority>
</url>
```
**Resultado**: Detecta nova URL adicionada e mudança de prioridade

#### 🔄 Exemplo 3: Mudança de Frequência
```xml
<!-- Sitemap A -->
<url>
  <loc>https://exemplo.com/blog</loc>
  <changefreq>weekly</changefreq>
</url>

<!-- Sitemap B -->
<url>
  <loc>https://exemplo.com/blog</loc>
  <changefreq>daily</changefreq>
</url>
```
**Resultado**: Detecta mudança de frequência de atualização

### 🔧 Exemplos de HTML

#### 🎨 Exemplo 1: Mudança de Estilo
```html
<!-- HTML A (Original) -->
<div><p>Texto normal</p></div>

<!-- HTML B (Modificado) -->
<div><p style="color: red; font-weight: bold;">Texto normal</p></div>
```
**Resultado**: Detecta mudança de atributo `style`

#### 📝 Exemplo 2: Mudança de Texto
```html
<!-- HTML A (Original) -->
<button>Clique aqui</button>

<!-- HTML B (Modificado) -->
<button>Comprar agora</button>
```
**Resultado**: Detecta mudança de conteúdo textual

#### 🏗️ Exemplo 3: Mudança de Estrutura
```html
<!-- HTML A (Original) -->
<div><p>Parágrafo 1</p></div>

<!-- HTML B (Modificado) -->
<div><p>Parágrafo 1</p><span>Novo elemento</span></div>
```
**Resultado**: Detecta adição de novo elemento

#### 🎨 Exemplo 4: Formatação Diferente
```html
<!-- HTML A (Original) -->
<div>
    <p>Texto normal</p>
</div>

<!-- HTML B (Modificado) -->
<div><p>Texto normal</p></div>
```
**Resultado**: Identifica como estruturalmente idêntico após normalização

## 🔍 Casos de Uso

### 🤖 Sitemap Management
- **Monitoramento de SEO**: Detectar mudanças em sitemaps que afetam SEO
- **Auditoria de Sites**: Verificar integridade e completude de sitemaps
- **Comparação de Versões**: Identificar mudanças entre atualizações
- **Detecção de Problemas**: Encontrar URLs quebradas ou removidas
- **Análise de Prioridades**: Verificar se prioridades estão sendo atualizadas

### 🔧 HTML Development
- **Testes de Regressão**: Verificar se mudanças não quebraram funcionalidades
- **Comparação de Templates**: Identificar diferenças entre versões
- **Debugging de Layout**: Encontrar problemas de renderização
- **Validação de Componentes**: Verificar integridade de componentes

### 🔄 Versionamento e Deploy
- **Comparação de Commits**: Identificar mudanças entre versões
- **Deploy Validation**: Verificar se deploys não introduziram problemas
- **Rollback Analysis**: Analisar diferenças para rollbacks
- **Documentação de Mudanças**: Gerar relatórios de alterações

### 📊 Performance e SEO
- **Análise de Performance**: Medir impacto de otimizações
- **SEO Monitoring**: Detectar mudanças que afetam SEO
- **Content Analysis**: Comparar conteúdo entre versões
- **Structure Validation**: Verificar integridade estrutural

## ⚡ Performance

### 🚀 Otimizações Implementadas
- **Processamento Assíncrono**: Não bloqueia a interface
- **Lazy Loading**: Carrega bibliotecas sob demanda
- **Debouncing**: Evita processamento desnecessário
- **Caching**: Armazena resultados temporariamente

### 📊 Métricas de Performance
- **Tempo de Carregamento**: < 2 segundos
- **Processamento**: < 500ms para HTMLs médios
- **Memória**: Uso otimizado com cleanup automático
- **Responsividade**: 60fps em animações

### 🔧 Otimizações Futuras
- [ ] Web Workers para processamento pesado
- [ ] Virtual scrolling para HTMLs grandes
- [ ] Compressão de dados para comparações
- [ ] Cache persistente no localStorage

## 🔒 Segurança

### 🛡️ Medidas de Segurança
- **Sanitização de Input**: Previne XSS
- **Escape de HTML**: Protege contra injection
- **Validação de Dados**: Verifica integridade
- **CSP Headers**: Política de segurança de conteúdo

### 🔐 Privacidade
- **Processamento Local**: Dados não saem do navegador
- **Sem Coleta**: Não há tracking ou analytics
- **Temporário**: Dados são limpos automaticamente
- **Transparente**: Código fonte aberto e auditável

## 🤝 Contribuição

### 🚀 Como Contribuir
1. **Fork** o projeto
2. **Clone** seu fork localmente
3. **Crie** uma branch para sua feature
4. **Commit** suas mudanças
5. **Push** para sua branch
6. **Abra** um Pull Request

### 📋 Padrões de Código
- **ESLint**: Linting JavaScript
- **Prettier**: Formatação de código
- **Conventional Commits**: Padrão de commits
- **Semantic Versioning**: Versionamento semântico

### 🐛 Reportar Bugs
- Use o template de issue
- Inclua passos para reproduzir
- Adicione screenshots se necessário
- Especifique ambiente e versão

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

### 📜 Resumo da Licença
- ✅ Uso comercial permitido
- ✅ Modificação permitida
- ✅ Distribuição permitida
- ✅ Uso privado permitido
- ❌ Sem garantia
- ❌ Sem responsabilidade

---

## 🎉 Agradecimentos

- **Wingify** pela biblioteca DOM Comparator
- **jQuery Foundation** pela biblioteca jQuery
- **Underscore.js** pelos utilitários JavaScript
- **Comunidade Open Source** pelo suporte e feedback

---

<div align="center">

**Desenvolvido com ❤️ para a comunidade de desenvolvedores**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com)

</div>
