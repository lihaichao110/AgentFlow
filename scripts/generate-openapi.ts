import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import {
  createOpenApiConfig,
  OPENAPI_OUTPUT_DIR,
  OPENAPI_OUTPUT_FILE,
} from '../src/config/openapi.config';

function readPackageVersion() {
  const packageJsonPath = join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8')) as {
    version?: string;
  };

  return packageJson.version || '0.1.0';
}

async function generateOpenApi() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const configService = app.get(ConfigService);

  const prefix = configService.get<string>('app.prefix') || 'api';
  app.setGlobalPrefix(prefix);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const document = SwaggerModule.createDocument(
    app,
    createOpenApiConfig(readPackageVersion()),
    {
      operationIdFactory: (controllerKey, methodKey) =>
        `${controllerKey}_${methodKey}`,
    },
  );

  const outputDir = join(process.cwd(), OPENAPI_OUTPUT_DIR);
  const outputPath = join(outputDir, OPENAPI_OUTPUT_FILE);
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`, 'utf-8');

  await app.close();
  console.log(`OpenAPI JSON generated: ${outputPath}`);
}

generateOpenApi().catch((error) => {
  console.error(error);
  process.exit(1);
});

