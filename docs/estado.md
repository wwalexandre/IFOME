# Estado do projeto e conformidade

Atualizado em 13/11/2026. Faltam 17 dias para o prazo de submissão (30/11 às 23h59).

## O que mudou em 13/11

Quatro mudanças pedidas, todas feitas:

1. **O IFOMME passou a ser o site.** Antes era um arquivo HTML dentro de um projeto Next.js, e para chegar nele a pessoa abria uma página de apresentação e clicava num botão. Agora o aplicativo abre na raiz e a apresentação virou uma página secundária, em `/sobre`.
2. **O Next.js saiu inteiro.** Não existe mais etapa de build: o site é HTML, CSS e JavaScript, e a API são funções.
3. **O banco saiu do Supabase e foi para o Cloudflare D1**, com a API em Pages Functions.
4. **O endereço perdeu o nome de pessoa.** De `ifomme-wwalexandres-projects.vercel.app` para `ifomme.pages.dev`.

## O que mudou de verdade na segurança

No Supabase, quem decidia o acesso era uma política dentro do banco, e o navegador falava direto com ele usando uma chave pública.

Agora o navegador não alcança o banco. Ele fala com a API, que lê um cookie `HttpOnly`, que o JavaScript da página não consegue ler, e decide ali o que a pessoa vê. Os dados privados de cada visitante são filtrados no servidor, e o cliente nunca informa de quem é a linha que está pedindo.

É mais trabalho e é mais seguro.

## O que se perdeu, e o que se ganhou

| | Supabase | Cloudflare |
|---|---|---|
| Atualização sem recarregar | Empurrada pelo banco, instantânea | Perguntada a cada 3 s, aparece em até 3 s |
| Onde fica a regra de acesso | Política dentro do banco | Código da API, do lado do servidor |
| Endereço | tinha nome de pessoa | `ifomme.pages.dev` |
| Etapa de build | Next.js | nenhuma |

A perda real é a latência da atualização, de instantânea para até 3 segundos. Para a demonstração não muda nada, e está explicado em [cloudflare.md](cloudflare.md).

## Checklist do regulamento

| Item | Situação |
|---|---|
| Repositório público no GitHub, criado depois de 04/11 às 21h | Ok |
| Sem fork e sem histórico importado | Ok |
| Licença que permita ao júri ler, executar e testar | MIT |
| Link de demo funcionando, em HTTPS | Depende de publicar no Pages, ver [cloudflare.md](cloudflare.md) |
| Página pública do projeto, com título | `/sobre` |
| Vídeo de até 3 minutos | **Pendente.** É do time |
| Demo sem dados pessoais reais | Ok. Tudo é dado de exemplo, inclusive o CNPJ |
| Sem tema proibido | Ok. Não há token, aposta nem captação de dinheiro, e o app não processa pagamento |
| Uma trilha só | Logística e automação |
| Zero commits entre 30/11 e 12/12 | A respeitar |

## O que falta

1. **Publicar no Cloudflare Pages.** Um `npx wrangler login` e um `npm run deploy`
2. **Gravar o vídeo** com cada integrante na câmera
3. **Tirar o nome de pessoa também do repositório.** O endereço do GitHub carrega o nome de quem é dono. A saída é criar uma organização gratuita e transferir o repositório para ela
4. **Separar o `index.html`.** São 780 linhas num arquivo só, e arquitetura é um dos quatro critérios de nota. A API e o adaptador já estão separados; falta quebrar a interface

## Correções já aplicadas ao aplicativo

1. **Título.** O arquivo original tinha `<title>IFOMME (Copy)</title>` solto dentro do corpo. Agora está no `head` e descreve o produto.
2. **Base legal.** O texto citava a Lei 14.016/2020 junto com a 15.224/2025. A 14.016 foi **revogada** pela 15.224. Ficou só a lei em vigor.
3. **Dados de exemplo.** A nota de inspeção estava na escala errada, as datas do mural estavam um ano atrasadas e faltava o contador de apoios, que aparecia como `NaN`.
