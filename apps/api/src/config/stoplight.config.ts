import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function stoplightSetup(
  app: INestApplication,
  configService: ConfigService,
): void {
  const title =
    configService.get<string>('swagger.title') ?? 'API Integração WinThor';

  const description =
    configService.get<string>('swagger.description') ?? 'Integração ERP';

  const basePath = configService.get<string>('swagger.path') ?? 'api/docs';

  const bearerAuth = {
    type: 'http' as const,
    scheme: 'bearer',
    bearerFormat: 'JWT',
    description: 'Informe apenas o token JWT (sem o prefixo "Bearer ")',
  };

  const versions = ['1'];

  const documents: Record<string, any> = {};

  for (const version of versions) {
    const config = new DocumentBuilder()
      .setTitle(`${title} - v${version}`)
      //       .setDescription(
      //         `
      // # 🏢 API Integração WinThor

      // ## ✨ Bem-vindo!

      // Esta é a documentação completa da **API de Integração ERP**.

      // ### 🔐 Autenticação
      // - **Bearer Token JWT**
      // - Envie apenas o token (sem "Bearer ")

      // ### 📋 Endpoints disponíveis no menu lateral →
      // `,
      //       )
      .setDescription(description)
      .setVersion(`v${version}`)
      .addBearerAuth(bearerAuth, 'JWT')
      .build();

    const document = SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
    });

    filterRoutesByVersion(document, version);

    documents[version] = document;

    /**
     * Endpoint JSON OpenAPI
     */
    app.getHttpAdapter().get(`/${basePath}/v${version}-json`, (req, res) => {
      res.json(document);
    });
  }

  /**
   * Página de documentação com Stoplight
   */
  app.getHttpAdapter().get(`/${basePath}`, (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <title>${title}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
    <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
    <style>
      /* RESET TOTAL - Remove qualquer interferência */
      * { box-sizing: border-box; }
      html, body { 
        margin: 0 !important; 
        padding: 0 !important; 
        height: 100vh !important; 
        width: 100vw !important;
        overflow: hidden !important;
        position: relative !important;
      }
      
      /* BOTÃO MÁGICO - SEMPRE VISÍVEL */
      .theme-switcher {
        all: initial !important;
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        z-index: 2147483647 !important; /* MAXIMO POSSÍVEL */
        width: 50px !important;
        height: 50px !important;
        border-radius: 50% !important;
        border: 3px solid #fff !important;
        // background: linear-gradient(45deg, #667eea 0%, #764ba2 100%) !important;
        color: white !important;
        font-size: 18px !important;
        font-weight: bold !important;
        cursor: pointer !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        transition: all 0.3s ease !important;
        font-family: -apple-system, sans-serif !important;
      }
      
      .theme-switcher:hover {
        transform: scale(1.1) !important;
        box-shadow: 0 12px 40px rgba(0,0,0,0.4) !important;
      }
      
      /* Elements ocupa TUDO */
      elements-api {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        z-index: 1 !important;
      }
    </style>
  </head>
  <body>
    <!-- BOTÃO PRIMEIRO (layer correto) -->
    <button 
      class="theme-switcher" 
      onclick="toggleTheme()" 
      title="🌙 Dark / ☀️ Light"
      id="themeBtn"
    >
      🌙
    </button>

    <elements-api
      id="stoplight"
      apiDescriptionUrl="/${basePath}/v${versions[0]}-json"
      router="hash"
      layout="sidebar"
      appearance="light"
    />

    <script>
  let currentTheme = localStorage.getItem('theme') || 'light';
  
  const el = document.getElementById('stoplight');
  const btn = document.getElementById('themeBtn');
  
  // Força tema inicial
  el.setAttribute('appearance', currentTheme);
  btn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  
  // 🔑 MUTAÇÃO DIRETA no Shadow DOM (ignora setAttribute)
  function forceTheme(theme) {
    const root = el.shadowRoot || el;
    const style = root.querySelector('style') || document.createElement('style');
    
    if (theme === 'dark') {
      style.textContent += 'html { color-scheme: dark !important; }';
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      style.textContent += 'html { color-scheme: light !important; }';
      document.documentElement.removeAttribute('data-theme');
    }
    
    if (root !== el) root.appendChild(style);
    localStorage.setItem('theme', theme);
    currentTheme = theme;
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
  
  // Toggle que REALMENTE funciona
  window.toggleTheme = function() {
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    forceTheme(nextTheme);
  };
  
  // Executa após o Elements carregar completamente
  const observer = new MutationObserver(() => {
    el.setAttribute('appearance', currentTheme);
    observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
</script>
  </body>
</html>
  `);
  });
}

function filterRoutesByVersion(document: any, version: string): void {
  const versionSegment = `v${version}`;

  Object.keys(document.paths).forEach((path) => {
    if (
      !path.includes(`/${versionSegment}/`) &&
      !path.endsWith(`/${versionSegment}`)
    ) {
      delete document.paths[path];
    }
  });
}
