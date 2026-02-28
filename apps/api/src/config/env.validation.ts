function get(config: Record<string, any>, key: string): string | undefined {
  const value = config[key];
  return value != null && String(value).trim() !== ''
    ? String(value).trim()
    : undefined;
}

export function validateEnv(config: Record<string, any>): Record<string, any> {
  const errors: string[] = [];

  if (!get(config, 'JWT_SECRET')) {
    errors.push('JWT_SECRET');
  }

  if (!get(config, 'DB_HOST')) errors.push('DB_HOST');
  if (!get(config, 'DB_USERNAME')) errors.push('DB_USERNAME');
  if (!get(config, 'DB_PASSWORD')) errors.push('DB_PASSWORD');
  if (!get(config, 'DB_DATABASE')) errors.push('DB_DATABASE');

  if (errors.length > 0) {
    throw new Error(
      `Configuração inválida. Variáveis obrigatórias ausentes ou vazias:\n${errors
        .map((e) => `  - ${e}`)
        .join('\n')}\nVerifique se o arquivo .env está na raiz do projeto.`,
    );
  }

  return config;
}
