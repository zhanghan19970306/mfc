import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { commonInterceptor } from '@/shared/interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 设置全局路由前缀
  app.setGlobalPrefix('api').useGlobalInterceptors(commonInterceptor);

  // 监听端口
  await app.listen(3000);
}
bootstrap();
