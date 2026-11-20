import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { TransacoesController } from './transacoes.controller';
import { TransacoesService } from './transacoes.service';
import { Transacao, TransacaoSchema } from './schemas/transacao.schema';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'src', 'transacoes', 'public'),
      serveRoot: '/',
      exclude: ['/transacoes*'],
    }),
    MongooseModule.forFeature([
      { name: Transacao.name, schema: TransacaoSchema },
    ]),
  ],
  controllers: [TransacoesController],
  providers: [TransacoesService],
})
export class TransacoesModule {}
