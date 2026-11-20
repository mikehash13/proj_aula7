
import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
} from '@nestjs/common';

import { TransacoesService } from './transacoes.service';
import { Transacao } from './schemas/transacao.schema';

@Controller('transacoes')
export class TransacoesController {
  constructor(private readonly transacoesService: TransacoesService) {}

  @Post()
  criar(@Body() dados: Transacao) {
    return this.transacoesService.criar(dados);
  }

  @Get()
  listar() {
    return this.transacoesService.listar();
  }

  @Patch(':id')
  atualizar(
    @Param('id') id: string,
    @Body() dados: Transacao,
  ) {
    return this.transacoesService.atualizar(id, dados);
  }
}
