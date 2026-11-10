import { Pendencias, Tela } from "@/components/Tela";

export const metadata = { title: "Doador · Resgata" };

export default function DoadorPage() {
  return (
    <Tela
      titulo="Doador"
      resumo="Mercado, padaria ou restaurante publica o lote em 30 segundos."
    >
      <Pendencias
        itens={[
          "Formulário de oferta: foto, categoria, peso estimado, validade, janela de retirada",
          "Leitura do rótulo por IA preenchendo validade e categoria, com revisão humana",
          "Lista de lotes com status: aberto, casado, em trânsito, entregue",
          "Confirmação de saída do lote na retirada, com QR",
          "Relatório de impacto em PDF",
        ]}
      />
    </Tela>
  );
}
