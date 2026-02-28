import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

export function scalarSetup(
  app: INestApplication,
  configService: ConfigService,
): void {
  const title = configService.get<string>('swagger.title') ?? 'API Doe Vida';
  const description =
    configService.get<string>('swagger.description') ??
    'API para gerenciamento de doações de sangue e cadastro de doadores.'; // <--- Adicione aqui
  const basePath = configService.get<string>('swagger.path') ?? 'api/docs';
  const versions = ['1'];

  for (const version of versions) {
    const config = new DocumentBuilder()
      .setTitle(`${title} - v${version}`)
      .setDescription(description) // <--- O Scalar usa isso para a "Home"
      .setVersion(`v${version}`)
      .setContact(
        'Doe vida Suporte',
        'https://suporte.exemplo.com',
        'suporte@email.com',
      )
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    filterRoutesByVersion(document, version);

    app.use(
      `/${basePath}`,
      apiReference({
        spec: { content: document },
        configuration: {
          theme: 'purple',
          darkMode: true,
          showSidebar: true,
          layout: 'modern', // 'modern' foca no conteúdo, 'classic' é mais parecido com o Stoplight

          // --- O que mais dá para colocar ---

          // 1. Barra de Busca
          searchHotkeys: 'k',

          // 2. Favicon (Customização visual)
          // favicon: 'https://sua-url.com',

          // 3. Documentação Completa (Mostra modelos e endpoints de uma vez)
          forceShowOperations: true,
          showDeveloperTools: 'never',

          // 4. Customização de Texto
          metaData: {
            title: `${title} | API Docs`,
            description:
              'API para gerenciamento de doações de sangue e cadastro de doadores.',
          },

          // Correção do erro de digitação no seu snippet (custocustomCss -> customCss)
          customCss: `
            .dark-mode { --scalar-background-1: #1a1a1a; }
            .light-mode { --scalar-background-1: #ffffff; }
          `,
        },
      }),
    );
  }
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
