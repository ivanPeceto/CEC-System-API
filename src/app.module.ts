import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { InsumosModule } from './modules/insumos/insumos.module';
import { MetodosPagoModule } from './modules/metodos_pago/metodos_pago.module';
import { RecetasModule } from './modules/recetas/recetas.module';
import { RecetaInsumoModule } from './modules/receta-insumo/receta-insumo.module';
import { ProductosModule } from './modules/productos/productos.module';
import { RecetaSubrecetaModule } from './modules/receta-subreceta/receta-subreceta.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local', '.env.development'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: false,
        retryAttempts: 20,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ClientesModule,
    CategoriasModule,
    InsumosModule,
    MetodosPagoModule,
    RecetasModule,
    RecetaInsumoModule,
    ProductosModule,
    RecetaSubrecetaModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigModule],
})
export class AppModule {}
