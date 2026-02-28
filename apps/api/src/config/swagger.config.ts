import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export function setupSwagger(
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

  /**
   * Aqui você controla quais versões existem
   */
  const versions = ['1']; // depois: ['1','2','3']

  const documents: Record<string, any> = {};

  for (const version of versions) {
    const config = new DocumentBuilder()
      .setTitle(`${title} - v${version}`)
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
     * Endpoint JSON da versão
     */
    app.getHttpAdapter().get(`/${basePath}/v${version}-json`, (req, res) => {
      res.json(document);
    });
  }

  /**
   * Monta automaticamente o dropdown
   */
  const urls = versions.map((version) => ({
    url: `/${basePath}/v${version}-json`,
    name: `v${version}`,
  }));

  SwaggerModule.setup(basePath, app, documents[versions[0]], {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      urls,
    },
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
