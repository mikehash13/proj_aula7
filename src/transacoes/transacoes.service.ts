import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Transacao, TransacaoDocument } from './schemas/transacao.schema';

@Injectable()
export class TransacoesService {
  constructor(
    @InjectModel(Transacao.name)
    private readonly transacaoModel: Model<TransacaoDocument>,
  ) {}

  async criar(dados: Transacao) {
    const novaTransacao = new this.transacaoModel(dados);
    return novaTransacao.save();
  }

  async listar() {
    const historico = await this.transacaoModel.find().exec();

    const totalReceitas = historico
      .filter((transacao) => transacao.tipo === 'receita')
      .reduce((total, transacao) => total + transacao.valor, 0);

    const totalDespesas = historico
      .filter((transacao) => transacao.tipo === 'despesa')
      .reduce((total, transacao) => total + transacao.valor, 0);

    const totalGastoImpulso = historico
      .filter(
        (transacao) =>
          transacao.tipo === 'despesa' &&
          transacao.consumoConsciente === false,
      )
      .reduce((total, transacao) => total + transacao.valor, 0);

    return {
      historico,
      metricas: {
        saldoTotal: totalReceitas - totalDespesas,
        totalDespesas,
        totalGastoImpulso,
      },
    };
  }
}
