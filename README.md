# IFOMME

**Doe o que sobra para quem precisa, perto de você.**

Projeto do [Hack Brasil 2026](https://hackbrasil.com), trilha de logística e automação.

- **Aplicativo:** https://ifomme.pages.dev
- **Sobre o projeto:** https://ifomme.pages.dev/sobre

O aplicativo abre direto na raiz. Não existe página intermediária.

## O problema

Comida boa vai para o lixo enquanto milhões de pessoas vivem em insegurança alimentar. O gargalo não é falta de vontade de doar, são três fricções:

1. **Não saber para quem.** Quem quer doar não conhece a instituição do lado nem sabe do que ela precisa hoje.
2. **Medo de responder por um problema.** Mercado, padaria e restaurante temem responsabilidade sanitária e jurídica, mesmo com a lei a favor.
3. **A parte chata.** Combinar coleta, entrega e horário é onde a doação morre.

Do outro lado, a instituição não tem como avisar que hoje precisa de fralda e não de arroz.

## A solução

- **Necessidades declaradas.** Cada instituição publica o que precisa, quanto, com que urgência e em que horário recebe.
- **Busca por bairro.** O doador acha quem está perto, não uma lista nacional genérica.
- **Regras na hora da doação**, com a declaração obrigatória do doador registrada junto.
- **Segurança jurídica explicada.** Pela Lei 15.224/2025, doador e instituição só respondem por danos se houver dolo, e a doação não configura relação de consumo.
- **Quatro etapas confirmadas**, do aceite ao relato de impacto.
- **Além do alimento:** roupas, material escolar, higiene, móveis, voluntariado e Pix.

**O IFOMME não processa pagamentos.** Mostra a chave Pix informada pela instituição e o doador paga pelo próprio banco.

## Arquitetura

| Camada | Escolha |
|---|---|
| Interface | HTML, CSS e JavaScript, sem framework |
| Hospedagem | Cloudflare Pages |
| API | Cloudflare Pages Functions |
| Banco | Cloudflare D1 |

```
public/index.html        o aplicativo, na raiz do site
public/sobre.html        a página que explica o projeto
public/ifomme-db.js      adaptador: coleção, documento e escuta sobre a API
functions/api/           a API, única parte que fala com o banco
db/schema.sql            tabelas
db/seed.sql              dados de exemplo
```

A camada de dados fica atrás de um adaptador com a interface de um banco de documentos. Foi isso que permitiu trocar o banco inteiro sem reescrever o aplicativo.

**Quem decide o acesso é o servidor.** A função lê um cookie que o navegador não consegue ler, resolve quem está pedindo e filtra os dados privados. O cliente nunca informa de quem é a linha que está lendo.

## Como executar

```bash
npm install
npm run db:schema
npm run db:seed
npm run dev
```

Abre em http://localhost:3000. Os comandos de banco usam o D1 local; para aplicar no banco de produção, acrescente `--remote`.

## Dados

Todos os dados mostrados são de exemplo. Nenhuma instituição real, pessoa real, CNPJ real ou chave Pix real.

## Documentação

- [docs/cloudflare.md](docs/cloudflare.md) — publicar e administrar
- [docs/estado.md](docs/estado.md) — estado do projeto e conformidade com o regulamento
- [docs/submissao.md](docs/submissao.md) — texto da submissão e roteiro do vídeo

## Licença

MIT. Ver [LICENSE](LICENSE).
