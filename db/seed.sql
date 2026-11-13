-- Dados de exemplo do IFOMME.
--
-- Todas as instituições são fictícias. Nenhum CNPJ, endereço, chave Pix ou
-- pessoa real aparece aqui, como o regulamento do evento exige.
--
-- As datas são relativas ao momento em que o arquivo roda, então o mural
-- nunca aparece com publicações de um ano atrás.
--
-- Aplicar com: npm run db:seed

insert into ongs (id, data) values
('casa-do-caminho', json_object(
  'nome','Casa do Caminho','causa','Fome','bairro','Brás','cidade','São Paulo',
  'km',1.2,'status','verificado','nota',96,'benef',320,'indic',14,
  'aceita', json_array('alimentos','higiene','roupas'),
  'needs', json_array(
    json_object('i','Arroz e feijão','c','alimentos','q',80,'m',1),
    json_object('i','Hortifruti para as marmitas','c','alimentos','q',40,'m',1),
    json_object('i','Kits de higiene','c','higiene','q',25,'m',0)),
  'desc','Cozinha comunitária que serve 320 refeições por dia para famílias do Brás e da Mooca. Recebe doações de segunda a sábado.',
  'horario','seg. a sáb., 8h às 17h',
  'coleta',json('true'),'exemplo',json('true'),'insp',json('{}'),
  'ts',(unixepoch()-26*86400)*1000)),

('rede-maos-dadas', json_object(
  'nome','Rede Mãos Dadas','causa','Crianças','bairro','Capão Redondo','cidade','São Paulo',
  'km',3.4,'status','verificado','nota',91,'benef',180,'indic',9,
  'aceita', json_array('alimentos','material','roupas','voluntariado'),
  'needs', json_array(
    json_object('i','Material escolar para o reforço','c','material','q',60,'m',1),
    json_object('i','Leite e achocolatado','c','alimentos','q',30,'m',0),
    json_object('i','Voluntário para aula de reforço','c','voluntariado','q',8,'m',1)),
  'desc','Reforço escolar e contraturno para 180 crianças de 6 a 14 anos. Precisa de material e de gente com paciência.',
  'horario','seg. a sex., 13h às 18h',
  'coleta',json('false'),'exemplo',json('true'),'insp',json('{}'),
  'ts',(unixepoch()-19*86400)*1000)),

('abrigo-sao-jose', json_object(
  'nome','Abrigo São José','causa','Pessoas em situação de rua','bairro','Santa Cecília','cidade','São Paulo',
  'km',2.1,'status','verificado','nota',98,'benef',95,'indic',21,
  'aceita', json_array('alimentos','roupas','higiene','dinheiro'),
  'needs', json_array(
    json_object('i','Cobertores e agasalhos','c','roupas','q',120,'m',1),
    json_object('i','Marmitas prontas para a noite','c','alimentos','q',95,'m',1),
    json_object('i','Fraldas geriátricas','c','higiene','q',40,'m',0)),
  'desc','Acolhimento noturno para 95 pessoas. No frio a demanda por cobertor dobra em uma semana.',
  'horario','todos os dias, 18h às 22h','pix','00.000.000/0001-00',
  'coleta',json('true'),'exemplo',json('true'),'insp',json('{}'),
  'ts',(unixepoch()-33*86400)*1000)),

('cozinha-da-vila', json_object(
  'nome','Cozinha da Vila','causa','Fome','bairro','Vila Mariana','cidade','São Paulo',
  'km',4.8,'status','inspecao','nota',0,'benef',60,'indic',3,
  'aceita', json_array('alimentos'),
  'needs', json_array(
    json_object('i','Excedente de padaria no fim do dia','c','alimentos','q',20,'m',1),
    json_object('i','Hortifruti','c','alimentos','q',35,'m',0)),
  'desc','Grupo de vizinhas que cozinha 60 marmitas às terças e quintas. Em processo de inspeção.',
  'horario','ter. e qui., 9h às 14h',
  'coleta',json('false'),'exemplo',json('true'),'insp',json('{}'),
  'ts',(unixepoch()-6*86400)*1000)),

('lar-das-avos', json_object(
  'nome','Lar das Avós','causa','Idosos','bairro','Penha','cidade','São Paulo',
  'km',7.3,'status','verificado','nota',88,'benef',48,'indic',6,
  'aceita', json_array('alimentos','higiene','voluntariado'),
  'needs', json_array(
    json_object('i','Alimentos de consistência pastosa','c','alimentos','q',25,'m',1),
    json_object('i','Voluntário para tarde de leitura','c','voluntariado','q',4,'m',0)),
  'desc','Casa de repouso sem fins lucrativos com 48 idosos. A cozinha precisa de alimentos de preparo fácil.',
  'horario','seg. a sex., 9h às 16h',
  'coleta',json('false'),'exemplo',json('true'),'insp',json('{}'),
  'ts',(unixepoch()-12*86400)*1000)),

('instituto-semear', json_object(
  'nome','Instituto Semear','causa','Mulheres','bairro','Itaquera','cidade','São Paulo',
  'km',11.5,'status','pendente','nota',0,'benef',0,'indic',1,
  'aceita', json_array('alimentos','roupas'),
  'needs', json_array(json_object('i','Necessidades a confirmar','c','alimentos','q',0,'m',1)),
  'desc','Cadastro recebido. Aguardando inspeção.',
  'coleta',json('false'),'exemplo',json('true'),'insp',json('{}'),
  'ts',(unixepoch()-2*86400)*1000))
on conflict (id) do update set data = excluded.data, updated_at = (unixepoch()*1000);

insert into posts (id, data) values
('post-cobertor', json_object(
  'ong','abrigo-sao-jose','tipo','urgente','ap',34,
  't','A frente fria chega quinta e já estamos sem cobertor de reserva. Precisamos de 120 peças até quarta. Buscamos na sua casa se for na região central.',
  'need','Cobertores e agasalhos','exemplo',json('true'),'ts',(unixepoch()-5*3600)*1000)),

('post-marmitas', json_object(
  'ong','casa-do-caminho','tipo','realizada','ap',112,
  't','Na semana passada recebemos 140 kg de hortifruti de três feiras do Brás. Viraram 620 marmitas. Obrigado a quem doou e a quem buscou.',
  'exemplo',json('true'),'ts',(unixepoch()-28*3600)*1000)),

('post-mutirao', json_object(
  'ong','rede-maos-dadas','tipo','evento','ap',47,
  't','Mutirão de volta às aulas no sábado, das 9h às 14h. Montamos kits escolares e precisamos de 10 voluntários.',
  'ev','Sábado, 9h às 14h','exemplo',json('true'),'ts',(unixepoch()-52*3600)*1000)),

('post-obrigado', json_object(
  'ong','lar-das-avos','tipo','agradecimento','ap',19,
  't','A padaria da esquina passou a mandar o excedente de pão três vezes por semana. Pequeno para quem doa, enorme para quem recebe.',
  'exemplo',json('true'),'ts',(unixepoch()-96*3600)*1000))
on conflict (id) do update set data = excluded.data, updated_at = (unixepoch()*1000);
