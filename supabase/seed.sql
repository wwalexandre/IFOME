-- Dados de exemplo do IFOMME.
--
-- Todas as instituições abaixo são fictícias. Nenhum CNPJ, endereço, chave
-- Pix ou pessoa real aparece aqui, como o regulamento do evento exige.
--
-- Rodar depois de 0001_schema.sql. Pode rodar de novo: usa upsert.

insert into public.ongs (id, data) values
('casa-do-caminho', jsonb_build_object(
  'nome','Casa do Caminho',
  'causa','Fome',
  'bairro','Brás','cidade','São Paulo',
  'km',1.2,'status','verificado','nota',4.8,'benef',320,'indic',14,
  'aceita', jsonb_build_array('alimentos','higiene','roupas'),
  'needs', jsonb_build_array(
    jsonb_build_object('i','Arroz e feijão','c','alimentos','q',80,'m',1),
    jsonb_build_object('i','Hortifruti para as marmitas','c','alimentos','q',40,'m',1),
    jsonb_build_object('i','Kits de higiene','c','higiene','q',25,'m',0)),
  'desc','Cozinha comunitária que serve 320 refeições por dia para famílias do Brás e da Mooca. Recebe doações de segunda a sábado.',
  'horario','seg. a sáb., 8h às 17h',
  'coleta', true, 'exemplo', true, 'insp', '{}'::jsonb, 'ts', 1762800000000)),

('rede-maos-dadas', jsonb_build_object(
  'nome','Rede Mãos Dadas',
  'causa','Crianças',
  'bairro','Capão Redondo','cidade','São Paulo',
  'km',3.4,'status','verificado','nota',4.6,'benef',180,'indic',9,
  'aceita', jsonb_build_array('alimentos','material','roupas','voluntariado'),
  'needs', jsonb_build_array(
    jsonb_build_object('i','Material escolar para o reforço','c','material','q',60,'m',1),
    jsonb_build_object('i','Leite e achocolatado','c','alimentos','q',30,'m',0),
    jsonb_build_object('i','Voluntário para aula de reforço','c','voluntariado','q',8,'m',1)),
  'desc','Reforço escolar e contraturno para 180 crianças de 6 a 14 anos. Precisa de material e de gente com paciência.',
  'horario','seg. a sex., 13h às 18h',
  'coleta', false, 'exemplo', true, 'insp', '{}'::jsonb, 'ts', 1762810000000)),

('abrigo-sao-jose', jsonb_build_object(
  'nome','Abrigo São José',
  'causa','Pessoas em situação de rua',
  'bairro','Santa Cecília','cidade','São Paulo',
  'km',2.1,'status','verificado','nota',4.9,'benef',95,'indic',21,
  'aceita', jsonb_build_array('alimentos','roupas','higiene','dinheiro'),
  'needs', jsonb_build_array(
    jsonb_build_object('i','Cobertores e agasalhos','c','roupas','q',120,'m',1),
    jsonb_build_object('i','Marmitas prontas para a noite','c','alimentos','q',95,'m',1),
    jsonb_build_object('i','Fraldas geriátricas','c','higiene','q',40,'m',0)),
  'desc','Acolhimento noturno para 95 pessoas. No frio a demanda por cobertor dobra em uma semana.',
  'horario','todos os dias, 18h às 22h',
  'pix','00.000.000/0001-00',
  'coleta', true, 'exemplo', true, 'insp', '{}'::jsonb, 'ts', 1762820000000)),

('cozinha-da-vila', jsonb_build_object(
  'nome','Cozinha da Vila',
  'causa','Fome',
  'bairro','Vila Mariana','cidade','São Paulo',
  'km',4.8,'status','inspecao','nota',0,'benef',60,'indic',3,
  'aceita', jsonb_build_array('alimentos'),
  'needs', jsonb_build_array(
    jsonb_build_object('i','Excedente de padaria no fim do dia','c','alimentos','q',20,'m',1),
    jsonb_build_object('i','Hortifruti','c','alimentos','q',35,'m',0)),
  'desc','Grupo de vizinhas que cozinha 60 marmitas às terças e quintas. Em processo de inspeção.',
  'horario','ter. e qui., 9h às 14h',
  'coleta', false, 'exemplo', true, 'insp', '{}'::jsonb, 'ts', 1762830000000)),

('lar-das-avos', jsonb_build_object(
  'nome','Lar das Avós',
  'causa','Idosos',
  'bairro','Penha','cidade','São Paulo',
  'km',7.3,'status','verificado','nota',4.4,'benef',48,'indic',6,
  'aceita', jsonb_build_array('alimentos','higiene','voluntariado'),
  'needs', jsonb_build_array(
    jsonb_build_object('i','Alimentos de consistência pastosa','c','alimentos','q',25,'m',1),
    jsonb_build_object('i','Voluntário para tarde de leitura','c','voluntariado','q',4,'m',0)),
  'desc','Casa de repouso sem fins lucrativos com 48 idosos. A cozinha precisa de alimentos de preparo fácil.',
  'horario','seg. a sex., 9h às 16h',
  'coleta', false, 'exemplo', true, 'insp', '{}'::jsonb, 'ts', 1762840000000)),

('instituto-semear', jsonb_build_object(
  'nome','Instituto Semear',
  'causa','Mulheres',
  'bairro','Itaquera','cidade','São Paulo',
  'km',11.5,'status','pendente','nota',0,'benef',0,'indic',1,
  'aceita', jsonb_build_array('alimentos','roupas'),
  'needs', jsonb_build_array(
    jsonb_build_object('i','Necessidades a confirmar','c','alimentos','q',0,'m',1)),
  'desc','Cadastro recebido. Aguardando inspeção.',
  'coleta', false, 'exemplo', true, 'insp', '{}'::jsonb, 'ts', 1762850000000))
on conflict (id) do update set data = excluded.data;

insert into public.posts (id, data) values
('post-cobertor', jsonb_build_object(
  'ong','abrigo-sao-jose','tipo','urgente',
  't','A frente fria chega quinta e já estamos sem cobertor de reserva. Precisamos de 120 peças até quarta. Buscamos na sua casa se for na região central.',
  'need','Cobertores e agasalhos','exemplo', true,'ts', 1762900000000)),

('post-marmitas', jsonb_build_object(
  'ong','casa-do-caminho','tipo','realizada',
  't','Na semana passada recebemos 140 kg de hortifruti de três feiras do Brás. Viraram 620 marmitas. Obrigado a quem doou e a quem buscou.',
  'exemplo', true,'ts', 1762910000000)),

('post-mutirao', jsonb_build_object(
  'ong','rede-maos-dadas','tipo','evento',
  't','Mutirão de volta às aulas no sábado, das 9h às 14h. Montamos kits escolares e precisamos de 10 voluntários.',
  'ev','Sábado, 9h às 14h','exemplo', true,'ts', 1762920000000)),

('post-obrigado', jsonb_build_object(
  'ong','lar-das-avos','tipo','agradecimento',
  't','A padaria da esquina passou a mandar o excedente de pão três vezes por semana. Pequeno para quem doa, enorme para quem recebe.',
  'exemplo', true,'ts', 1762930000000))
on conflict (id) do update set data = excluded.data;
