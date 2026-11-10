import { Pendencias, Tela } from "@/components/Tela";

export const metadata = { title: "Voluntário · Resgata" };

export default function VoluntarioPage() {
  return (
    <Tela
      titulo="Voluntário"
      resumo="Pega uma missão curta de coleta e leva o lote até a ONG."
    >
      <Pendencias
        itens={[
          "Missões próximas, ordenadas por distância e por tempo restante de validade",
          "Aceite da missão e rota no mapa",
          "Leitura do QR do lote na retirada",
          "Confirmação de coleta com foto da pesagem",
          "Entrega na ONG e histórico de missões",
        ]}
      />
    </Tela>
  );
}
