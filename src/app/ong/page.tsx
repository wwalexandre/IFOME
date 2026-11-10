import { Pendencias, Tela } from "@/components/Tela";

export const metadata = { title: "ONG · Resgata" };

export default function OngPage() {
  return (
    <Tela
      titulo="ONG"
      resumo="Recebe a oferta certa, perto e no horário, e confirma o recebimento."
    >
      <Pendencias
        itens={[
          "Perfil de necessidade: categorias aceitas, capacidade, cadeia de frio, horários",
          "Ofertas recebidas com prazo curto de aceite",
          "Aceite do lote e reserva",
          "Confirmação de recebimento com peso verificado e condição",
          "Histórico de recebimentos",
        ]}
      />
    </Tela>
  );
}
