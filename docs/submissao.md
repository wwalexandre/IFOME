# Texto da submissão

Para o painel do Hack Brasil. Dá para editar e reenviar até 30/11 às 23h59.

## Nome do projeto

```
IFOMME
```

## Resumo (uma frase)

```
Liga quem tem o que doar a instituições próximas e verificadas, com segurança jurídica e cada etapa da doação confirmada.
```

## Descrição

```
O IFOMME liga quem tem o que doar a instituições próximas e verificadas.

O PROBLEMA
Comida boa vai para o lixo enquanto milhões de pessoas vivem em insegurança alimentar. A trava não é falta de vontade de doar, são três fricções: não saber para quem doar, o medo de responder por um problema sanitário, e a parte chata de combinar coleta, entrega e horário, que é onde a doação morre. Do outro lado, a instituição não tem como avisar que hoje precisa de fralda e não de arroz.

COMO FUNCIONA
Cada instituição publica o que precisa, em que quantidade, com que urgência e em que horário recebe. O doador busca por bairro e acha quem está perto, não uma lista nacional genérica. Na hora de doar, o app mostra o que pode e o que não pode ser doado, registra a declaração obrigatória do doador e explica a segurança jurídica: pela Lei 15.224/2025, doador e instituição só respondem por danos se houver dolo, e a doação não configura relação de consumo. A partir daí a doação tem quatro etapas confirmadas pela instituição, do aceite ao relato de impacto, e os dois lados conversam dentro do app.

ALÉM DO ALIMENTO
Roupas, material escolar, higiene, móveis, horas de voluntariado e doação direta para a chave Pix da instituição. O IFOMME não processa pagamentos: mostra a chave informada pela instituição e o doador paga pelo próprio banco.

CONFIANÇA
Instituições passam por inspeção antes de entrar na rede, e o resultado fica visível ao lado do nome. Quem indica uma instituição nova também aparece.

COMO FOI CONSTRUÍDO
Interface em HTML, CSS e JavaScript, sem framework e sem etapa de build. Hospedagem no Cloudflare Pages, API em Pages Functions e banco no Cloudflare D1. Quem decide o acesso é o servidor: a API lê um cookie que o JavaScript da página não alcança, resolve quem está pedindo e filtra os dados privados, em vez de confiar no cliente. Uma doação feita numa janela aparece na outra em até 3 segundos, sem recarregar. A camada de dados fica atrás de um adaptador com a interface de um banco de documentos, e foi isso que permitiu trocar o banco inteiro sem reescrever a aplicação.

DADOS
Tudo o que aparece na demo é fictício. Nenhuma instituição real, CNPJ real, pessoa real ou chave Pix real.

ROADMAP
Roteirização de coletas por voluntário, relatório de impacto para o doador empresarial e integração com emissão de nota fiscal da doação.
```

## Trilha

```
Logística & automação
```

O núcleo do produto é casar oferta com necessidade, organizar coleta e entrega e automatizar o acompanhamento. A trilha de meio ambiente foi descartada porque o IFOMME vai além do desperdício de alimentos, e porque aquela trilha concentra muito projeto de carbono e reciclagem, com só 5 vagas de finalista.

## Repositório público

```
https://github.com/wwalexandre/IFOME
```

## Demo

```
https://ifomme.pages.dev
```

## Vídeo

Pendente. Até 3 minutos, mostrando o produto funcionando, sem login.

Roteiro sugerido:

| Tempo | O quê |
|---|---|
| 0:00 a 0:20 | O problema, com o número na tela: comida no lixo e insegurança alimentar. A trava é não saber para quem, o medo e a logística |
| 0:20 a 1:40 | A demo. Instituição publica o que precisa, doador acha por bairro, escolhe o que doar, lê as regras, marca a declaração e confirma |
| 1:40 a 2:10 | As quatro etapas e a conversa entre doador e instituição. Meu impacto |
| 2:10 a 2:35 | Duas janelas lado a lado: doação feita em uma aparecendo na outra sem recarregar |
| 2:35 a 3:00 | Arquitetura em uma tela e o roadmap em uma frase |

Gravar com a tela real e narração por cima. Sem tela de login no vídeo.

**Atenção:** este vídeo é diferente do vídeo do painel de créditos por integrante, que exige cada pessoa do time aparecendo na câmera.
