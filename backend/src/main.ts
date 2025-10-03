import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "http://localhost:5173", // FE url
    credentials: true,              // cho phép gửi cookie/token kèm theo
    allowedHeaders: ["content-type", "authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
