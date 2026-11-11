# IFOMME

**Doe o que sobra para quem precisa, perto de você.**

Projeto do [Hack Brasil 2026](https://hackbrasil.com), trilha de logística e automação.

- **Demo:** https://ifomme-wwalexandres-projects.vercel.app
- **Protótipo:** https://ifomme-wwalexandres-projects.vercel.app/prototipo.html

## O problema

Comida boa vai para o lixo enquanto milhões de pessoas vivem em insegurança alimentar. O problema não é falta de vontade de doar, são três travas:

1. **Não saber para quem.** Quem quer doar não conhece a instituição do lado nem sabe do que ela precisa hoje.
2. **Medo de responder por um problema.** Supermercado, padaria e restaurante temem responsabilidade sanitária e jurídica, mesmo com a lei a favor.
3. **A parte chata.** Combinar coleta, entrega e horário é onde a doação morre.

Do outro lado, a instituição não tem como avisar que hoje precisa de fralda e não de arroz.

## A solução

O IFOMME é um aplicativo que liga quem tem o que doar a instituições próximas e verificadas.

- **Necessidades declaradas.** Cada instituição publica o que precisa, em que quantidade, com que urgência, e em que horário recebe.
- **Busca por bairro.** O doador acha quem está perto, não uma lista nacional genérica.
- **Regras na hora da doação.** O que pode e o que não pode doar, com a declaração obrigatória do doador registrada junto com a doação.
- **Segurança jurídica explicada.** Pela Lei 15.224/2025, doador e instituição só respondem por danos se houver dolo, e a doação não configura relação de consumo.
- **Acompanhamento em quatro etapas.** Confirmar, combinar coleta ou entrega, marcar como recebida, relatar impacto.
- **Além do alimento.** Roupas, material escolar, higiene, horas de voluntariado e doação direta para a chave Pix da instituição.

**O IFOMME não processa pagamentos.** Quando a doação é em dinheiro, o app apenas mostra a chave Pix informada pela instituição, e o doador paga pelo próprio banco.

## O que já está pronto

- Protótipo navegável com as telas de doador, instituição, mural de ações, conversas, inspeção de instituições e Meu impacto: [`public/prototipo.html`](public/prototipo.html)
- Página pública do projeto, em Next.js, explicando o que é e para quem

## O que falta

Ligar o banco: criar o projeto no Supabase e preencher `public/config.js`. O passo a passo está em [docs/supabase.md](docs/supabase.md), e o estado geral do projeto em [docs/estado.md](docs/estado.md).

## Como executar

```bash
npm install
npm run dev
```

Abre em http://localhost:3000. O protótipo fica em http://localhost:3000/prototipo.html

Não precisa de variável de ambiente para rodar a página pública.

## Stack

| Camada | Escolha |
|---|---|
| Página pública | Next.js 16, React 19, Tailwind 4, TypeScript |
| Protótipo | HTML, CSS e JavaScript em um arquivo, sem framework |
| Banco | Supabase: Postgres, RLS, conta anônima e Realtime |
| Deploy | Vercel |

## Dados

Todos os dados mostrados são de exemplo. Nenhuma instituição real, pessoa real, CNPJ real ou chave Pix real aparece no projeto.

## Licença

MIT. Ver [LICENSE](LICENSE).
