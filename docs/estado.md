# Estado do projeto e o que falta

Atualizado em 11/11/2026. Faltam 19 dias para o prazo de submissão (30/11 às 23h59).

## O achado mais importante

O protótipo (`public/prototipo.html`) foi escrito sobre a camada de dados do ambiente em que foi criado. Ele chama:

```js
db = window.claude && window.claude.use ? await window.claude.use("db") : null;
user = db ? await window.claude.use("user") : null;
```

Fora desse ambiente, `window.claude` não existe. O código trata o caso sem quebrar, mas entra em modo somente leitura e sem dados:

> Banco de dados indisponível nesta visualização. O que você fizer aqui não será salvo.

**Consequência prática:** publicado como HTML estático, o protótipo abre, mas sem instituições, sem doações e sem salvar nada. Não serve como demo funcionando.

Isso não é defeito de quem escreveu. É o ambiente de origem. Mas precisa ser resolvido antes da submissão, porque o regulamento exige **link de demo funcionando**, que fique no ar durante toda a avaliação.

## A saída, já escrita

**Decidido em 11/11: Supabase.** A graça do produto é doador e instituição verem a mesma doação mudando de etapa, e isso só existe com banco compartilhado.

O código já isolava o acesso ao banco num objeto `store` com `set`, `update`, `del`, `live` e `ref`. Em vez de mexer no aplicativo, foi escrito um adaptador que entrega ao app a mesma API de documentos que ele esperava, agora sobre o Supabase:

- `public/ifomme-db.js` traduz coleção, documento e escuta em tempo real para tabelas, linhas e Realtime
- `supabase/migrations/0001_schema.sql` cria as tabelas, os gatilhos de `updated_at`, as políticas de RLS e a publicação de Realtime
- `supabase/seed.sql` popula seis instituições e quatro publicações de exemplo
- `public/config.js` guarda a URL e a chave publicável

O aplicativo mudou em duas linhas: carrega os dois scripts e pega a conexão do adaptador em vez de `window.claude`.

**Enquanto a configuração estiver vazia, nada quebra.** O adaptador devolve `null` e o app entra no mesmo modo somente leitura de antes. Falta só criar o projeto no Supabase e preencher `public/config.js`. Ver [supabase.md](supabase.md).

## Checklist de conformidade com o regulamento

| Item | Situação |
|---|---|
| Repositório público no GitHub, criado depois de 04/11 às 21h | Repo criado em 10/11. Falta publicar |
| Sem fork e sem histórico importado | Ok, repositório novo |
| Licença que permita ao júri ler, executar e testar | MIT |
| Link de demo funcionando, em HTTPS | **Pendente.** Depende da troca do banco |
| Página pública do projeto, com título | Pronta, falta publicar |
| Vídeo de até 3 minutos | **Pendente.** É do time |
| Demo sem dados pessoais reais | Ok. Tudo é dado de exemplo, inclusive o CNPJ |
| Sem tema proibido | Ok. Não há token, aposta nem captação de dinheiro. O app não processa pagamento |
| Uma trilha só | Logística e automação |
| Zero commits entre 30/11 e 12/12 | A respeitar |

## Correções já aplicadas ao protótipo

1. **Título.** O arquivo original tinha `<title>IFOMME (Copy)</title>` solto dentro do corpo. Agora o título está no `head` e descreve o produto, como o painel do evento exige.
2. **Base legal.** O texto citava a Lei 14.016/2020 junto com a Lei 15.224/2025. A 14.016 foi **revogada** pela 15.224. Ficou só a lei em vigor.

## Próximos passos, em ordem

1. Publicar o repositório e a página pública, e preencher o painel de créditos
2. Gravar o vídeo de apresentação com todo o time na câmera
3. Decidir entre a opção A e a B e trocar o adaptador de dados
4. Separar o protótipo em arquivos, em vez de um HTML de 780 linhas, porque arquitetura e qualidade de código são um dos quatro critérios de nota
5. Congelar funcionalidade em 26/11 e submeter em 29/11
