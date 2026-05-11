// Cliente Supabase — disponibilizado como global `sbClient` para uso nos demais scripts.
// Requer que o CDN do Supabase esteja carregado antes deste arquivo.
var sbClient = window.supabase.createClient(
  'https://gjcyajlggwbzlnmxanzx.supabase.co',
  'sb_publishable_PQJn6D4H5_lVMqXJthQEJg_GDE3viA0'
);
