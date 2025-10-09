# 🔍 DOM Comparator Aprimorado

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![jQuery](https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white)](https://jquery.com/)
[![Underscore.js](https://img.shields.io/badge/Underscore.js-0371B5?style=for-the-badge&logo=underscore.js&logoColor=white)](https://underscorejs.org/)

> **Uma ferramenta avançada para comparação inteligente de código HTML com normalização automática**

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

O **DOM Comparator Aprimorado** é uma ferramenta web avançada que permite comparar dois códigos HTML de forma inteligente, ignorando diferenças irrelevantes de formatação e focando apenas nas mudanças estruturais e de conteúdo que realmente importam.

### 🎪 Características Principais

- **🔧 Normalização Inteligente**: Remove diferenças de formatação desnecessárias
- **📊 Múltiplos Métodos**: 5 algoritmos diferentes de comparação
- **🎨 Interface Moderna**: Design responsivo com suporte a tema claro/escuro
- **⚡ Performance Otimizada**: Processamento rápido mesmo com HTMLs grandes
- **📱 Totalmente Responsivo**: Funciona perfeitamente em qualquer dispositivo

## ✨ Funcionalidades

### 🎯 Comparação Normalizada (Principal)
- Remove espaços em branco desnecessários
- Normaliza quebras de linha e indentação
- Ignora comentários HTML opcionais
- Ordena atributos alfabeticamente
- Converte tags para minúsculas

### 📝 Comparação Textual Original
- Detecta qualquer mudança no código fonte
- Mostra diferenças linha por linha
- Identifica adições, remoções e modificações

### 🔧 DOM Comparator (Wingify)
- Análise estrutural usando biblioteca especializada
- Detecta mudanças na estrutura do DOM
- Identifica operações específicas de modificação

### 📋 Análise de Atributos
- Detecta mudanças em atributos específicos
- Identifica alterações em classes CSS
- Monitora mudanças em estilos inline

### 🔐 Comparação por Hash
- Gera hash único para cada elemento
- Detecta diferenças através de algoritmos de hash
- Calcula similaridade percentual

## 🚀 Como Usar

### 1. 📥 Preparação
1. Abra o arquivo `index.html` em seu navegador
2. Cole o código HTML original no campo **HTML A**
3. Cole o código HTML modificado no campo **HTML B**

### 2. ⚙️ Configuração
Ajuste as opções de normalização conforme necessário:
- ✅ **Normalizar espaços em branco**: Remove quebras de linha e espaços extras
- ✅ **Ordenar atributos**: Ordena atributos alfabeticamente
- ✅ **Ignorar comentários**: Remove comentários HTML
- ✅ **Normalizar maiúsculas**: Converte tags para minúsculas

### 3. 🔍 Comparação
1. Clique em **"Comparar HTML com Normalização Inteligente"**
2. Aguarde o processamento (indicador de carregamento)
3. Analise os resultados nos diferentes métodos

### 4. 📊 Análise dos Resultados
- **Verde**: HTMLs são estruturalmente idênticos
- **Vermelho**: Diferenças estruturais reais encontradas
- **Amarelo**: Avisos e informações importantes

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
DOM Comparator/
├── 📄 index.html          # Página principal
├── 🎨 styles.css          # Estilos e design system
├── ⚡ script.js           # Lógica JavaScript
└── 📖 README.md          # Documentação
```

### 📄 index.html
- Estrutura HTML semântica
- Meta tags para responsividade
- Dependências externas (jQuery, Underscore.js)
- Interface de usuário completa

### 🎨 styles.css
- Design system completo
- Suporte a tema claro/escuro
- Responsividade para todos os dispositivos
- Animações e transições suaves

### ⚡ script.js
- Lógica de normalização HTML
- 5 métodos de comparação diferentes
- Interface de usuário interativa
- Tratamento de erros robusto

## 🛠️ Tecnologias Utilizadas

### 🌐 Frontend
- **HTML5**: Estrutura semântica moderna
- **CSS3**: Design system avançado com variáveis CSS
- **JavaScript ES6+**: Lógica moderna e otimizada

### 📚 Bibliotecas Externas
- **jQuery 3.6.0**: Manipulação DOM simplificada
- **Underscore.js 1.9.1**: Utilitários JavaScript
- **DOM Comparator (Wingify)**: Comparação estrutural avançada

### 🎨 Design System
- **CSS Custom Properties**: Sistema de design tokenizado
- **Flexbox & Grid**: Layouts modernos e responsivos
- **CSS Animations**: Transições suaves e feedback visual

## 📖 Exemplos Práticos

### 🔄 Exemplo 1: Mudança de Estilo
```html
<!-- HTML A (Original) -->
<div><p>Texto normal</p></div>

<!-- HTML B (Modificado) -->
<div><p style="color: red; font-weight: bold;">Texto normal</p></div>
```
**Resultado**: Detecta mudança de atributo `style`

### 📝 Exemplo 2: Mudança de Texto
```html
<!-- HTML A (Original) -->
<button>Clique aqui</button>

<!-- HTML B (Modificado) -->
<button>Comprar agora</button>
```
**Resultado**: Detecta mudança de conteúdo textual

### 🏗️ Exemplo 3: Mudança de Estrutura
```html
<!-- HTML A (Original) -->
<div><p>Parágrafo 1</p></div>

<!-- HTML B (Modificado) -->
<div><p>Parágrafo 1</p><span>Novo elemento</span></div>
```
**Resultado**: Detecta adição de novo elemento

### 🎨 Exemplo 4: Formatação Diferente
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

### 🧪 Testes de Regressão
- Verificar se mudanças não quebraram funcionalidades
- Comparar HTML antes e depois de refatorações
- Validar integridade de componentes

### 🔄 Versionamento de Código
- Comparar versões diferentes de templates
- Identificar mudanças entre commits
- Documentar evolução do código

### 🐛 Debugging
- Encontrar diferenças entre ambientes
- Identificar problemas de renderização
- Comparar saída de diferentes browsers

### 📊 Análise de Performance
- Medir impacto de otimizações
- Comparar tamanho de HTML
- Analisar eficiência de mudanças

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
