import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransacaoDocument = Transacao & Document;

@Schema()
export class Transacao {
  @Prop({ required: true, type: String })
  descricao: string;

  @Prop({ required: true, type: Number })
  valor: number;

  @Prop({
    required: true,
    type: String,
    enum: ['receita', 'despesa'],
  })
  tipo: string;

  @Prop({ required: true, type: String })
  categoria: string;

  @Prop({ required: true, type: Boolean })
  consumoConsciente: boolean;
}

export const TransacaoSchema = SchemaFactory.createForClass(Transacao);
