var PROPERTIES = [
  {
    id: 1,
    nome: "Penthouse Jardins",
    local: "Jardins, São Paulo",
    preco: "R$ 4.800.000",
    area: "420 m²",
    status: "disponivel",
    statusLabel: "Disponível",
    imagens: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80",
      "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1400&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1400&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1400&q=80"
    ],
    quartos: 4,
    banheiros: 5,
    vagas: 3,
    descricao: "Exclusiva penthouse nos Jardins com vistas panorâmicas da cidade. Acabamentos de altíssimo padrão, combinando mármore carrara, madeiras nobres e metais dourados. Terraço privativo com piscina aquecida e área gourmet integrada à sala de estar. Um imóvel único para quem busca o ápice do luxo na capital paulista.",
    caracteristicas: ["Piscina privativa aquecida", "Terraço panorâmico", "Cozinha gourmet", "Adega climatizada", "Home theater", "Academia privativa", "Concierge 24h", "Segurança biométrica"]
  },
  {
    id: 2,
    nome: "Casa Alphaville",
    local: "Alphaville, Barueri",
    preco: "R$ 3.200.000",
    area: "680 m²",
    status: "vendido",
    statusLabel: "Vendido",
    imagens: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1400&q=80",
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=1400&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=80"
    ],
    quartos: 5,
    banheiros: 6,
    vagas: 4,
    descricao: "Residência de alto padrão em condomínio fechado em Alphaville. Amplo terreno ajardinado com piscina, quadra de tênis e casa de hóspedes independente. Arquitetura contemporânea com grandes aberturas de vidro que integram o interior à natureza exuberante do entorno.",
    caracteristicas: ["Piscina com deck", "Quadra de tênis", "Casa de hóspedes", "Jardim paisagístico", "Churrasqueira gourmet", "Sala de jogos", "Automação residencial", "Energia solar"]
  },
  {
    id: 3,
    nome: "Cobertura Itaim",
    local: "Itaim Bibi, São Paulo",
    preco: "R$ 6.500.000",
    area: "310 m²",
    status: "disponivel",
    statusLabel: "Disponível",
    imagens: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=80",
      "https://images.unsplash.com/photo-1613490493576-4ee9da58a0ef?w=1400&q=80",
      "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=1400&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=80",
      "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=1400&q=80"
    ],
    quartos: 3,
    banheiros: 4,
    vagas: 3,
    descricao: "Cobertura duplex exclusiva no coração do Itaim Bibi, um dos endereços mais valorizados de São Paulo. Design assinado por renomado escritório de arquitetura, com terraço de 120 m² e piscina de borda infinita com vista para a cidade. Exclusividade e sofisticação em cada detalhe.",
    caracteristicas: ["Piscina borda infinita", "Terraço 120 m²", "Design assinado", "Cozinha profissional", "Sala de jantar formal", "Closet master", "Spa privativo", "Heliponto no edifício"]
  },
  {
    id: 4,
    nome: "Villa Marinas",
    local: "Guarujá, SP",
    preco: "R$ 2.900.000",
    area: "550 m²",
    status: "reservado",
    statusLabel: "Reservado",
    imagens: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=80",
      "https://images.unsplash.com/photo-1592595896616-c37162298647?w=1400&q=80",
      "https://images.unsplash.com/photo-1553653924-39b70295f8da?w=1400&q=80",
      "https://images.unsplash.com/photo-1549294413-26f195200c16?w=1400&q=80"
    ],
    quartos: 5,
    banheiros: 5,
    vagas: 3,
    descricao: "Villa de luxo à beira-mar no Guarujá com acesso privativo à praia. Projeto arquitetônico integrado à paisagem litorânea, com materiais naturais e amplas varandas. Piscina de frente para o mar com deck de madeira e área de lazer completa para toda a família.",
    caracteristicas: ["Acesso privativo à praia", "Vista para o mar", "Piscina com deck", "Varandas amplas", "Churrasqueira coberta", "Suíte master com jacuzzi", "Espaço gourmet externo", "Garagem coberta"]
  },
  {
    id: 5,
    nome: "Flat Brooklin",
    local: "Brooklin, São Paulo",
    preco: "R$ 1.750.000",
    area: "145 m²",
    status: "disponivel",
    statusLabel: "Disponível",
    imagens: [
      "https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?w=1400&q=80",
      "https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=1400&q=80",
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=1400&q=80",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1400&q=80"
    ],
    quartos: 2,
    banheiros: 2,
    vagas: 2,
    descricao: "Flat moderno e sofisticado no Brooklin, bairro nobre com excelente infraestrutura. Planta aberta e funcional com acabamentos premium. Ideal para executivos que buscam conforto e localização privilegiada, a minutos dos principais centros empresariais de São Paulo.",
    caracteristicas: ["Planta aberta integrada", "Varanda com vista", "Cozinha americana", "Piso aquecido", "Armários planejados", "Serviços de concierge", "Academia no edifício", "Segurança 24h"]
  }
];
