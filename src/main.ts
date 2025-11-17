import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for React frontend
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Serve static files from public directory
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Serve React build in production
  if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = join(__dirname, '..', 'client', 'dist');
    app.useStaticAssets(clientBuildPath);
    
    // Serve index.html for all non-API routes
    const express = app.getHttpAdapter().getInstance();
    express.get('*', (req: any, res: any, next: any) => {
      if (req.url && req.url.startsWith('/api')) {
        return next();
      }
      res.sendFile(join(clientBuildPath, 'index.html'));
    });
  }

  const PORT = process.env.PORT || 5000;
  await app.listen(PORT);
  console.log(`Server started on port ${PORT}`);
}
bootstrap();

