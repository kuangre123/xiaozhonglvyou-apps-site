// Apple storefront availability and language lists checked on 2026-09-01.
const productIds = { ai: 6768019606, translator: 6755734543, privacy: 6761301764, privacyLite: 6766485393, gif: 6783559364, ride: 6786365305 };

export const latinAmericanStores = Object.fromEntries(["br", "mx"].map((country) => [country,
  Object.fromEntries(Object.entries(productIds).map(([key, id]) => [key,
    `https://apps.apple.com/${country}/app/id${id}?${key.startsWith("privacy") ? "mt=12&" : ""}uo=4`
  ]))
]));

const brazil = {
  file: "pt-br.html", store: "br", lang: "pt-BR", ogLocale: "pt_BR", country: "Brasil", breadcrumb: "Brasil",
  title: "Apps para iPhone e Mac no Brasil | CrazyAIAgent",
  description: "Seis apps no Brasil para organizar fotos, traduzir em viagens, proteger a tela do Mac, criar GIFs e registrar pedaladas, com links para a App Store brasileira.",
  keywords: "limpar fotos iPhone, apagar fotos duplicadas, tradutor para viagem, privacidade na tela do Mac, criar GIF no iPhone, registrar pedalada automaticamente",
  ogTitle: "Apps para iPhone e Mac no Brasil", ogDescription: "Escolha um app por tarefa, confira os limites de idioma e abra a App Store brasileira.",
  skip: "Ir para o conteúdo", nav: ["Apps", "Guias", "Países"], eyebrow: "App Store do Brasil", h1: "Apps de fotos, tradução e privacidade para iPhone e Mac no Brasil.",
  lead: "Organize fotos antes de apagar, traduza conversas e placas durante uma viagem, proteja a tela do Mac, crie GIFs e registre seus deslocamentos. Compare seis apps em português e confirme a ficha brasileira antes de instalar.",
  primary: "Abrir o AI Cleaning na App Store do Brasil", secondary: "Ver os seis apps", checked: "Informações da App Store verificadas",
  appsKicker: "Seis ferramentas", appsTitle: "Comece pela tarefa que você precisa resolver.",
  appsIntro: "Esta página explica os seis produtos em português. Isso não significa que todos tenham interface em português. Na App Store do Brasil, confira compatibilidade, preço, compras internas, idiomas e privacidade antes do download.",
  detailsLabel: "Ver detalhes", storeLabel: "App Store do Brasil", newTab: "abre em uma nova aba", imageAlt: "Tela de classificação de fotos do AI Cleaning",
  products: {
    ai: ["AI Cleaning - organização de fotos", "Para iPhone com iOS 16 ou posterior. Classifica fotos por conteúdo e mostra duplicadas, semelhantes, capturas de tela, fotos borradas e arquivos grandes para você revisar antes de apagar. O acesso à fototeca é uma permissão importante: confira documentos, recibos e fotos de família e selecione manualmente o que será removido. Não é um limpador de arquivos do sistema ou de RAM."],
    translator: ["Translation Specialist", "Para iPhone com iOS 17.4 ou posterior. Reúne conversa por voz, leitura da tradução, reconhecimento de texto pela câmera e tradução contínua. Teste o par de idiomas antes da viagem e confira nomes, datas, valores e endereços com o texto original. A página brasileira não promete interface em português para este app."],
    privacy: ["Anti-spy screen - privacidade no Mac", "Para Mac com macOS 13 ou posterior. Ajuda a ocultar apps selecionados ou cobrir áreas da tela em reuniões, apresentações e espaços compartilhados. Defina o que precisa ser protegido, escolha a janela correta no app de reunião e faça um teste para confirmar o que aparece para outras pessoas."],
    privacyLite: ["Anti-spy screen Lite", "Para Mac com macOS 13 ou posterior. A versão mais leve oferece uma forma de experimentar ocultação de apps e áreas de privacidade durante apresentações. Faça o primeiro teste com conteúdo não sensível e verifique na loja as diferenças, recursos e eventuais compras da versão completa."],
    gif: ["GIFmaker - GIF Studio", "Para iPhone com iOS 17 ou posterior. Cria GIFs a partir de fotos, vídeos e Live Photos. Importe um trecho curto, ajuste a ordem dos quadros, a duração, o texto e a repetição, depois veja a prévia antes de exportar. Revise rostos, documentos e outros dados pessoais antes de compartilhar."],
    ride: ["HappyRide - registro automático de pedaladas", "Para iPhone com iOS 17 ou posterior. Detecta e registra atividades compatíveis de bicicleta, caminhada e corrida. Teste localização e movimento em um trajeto curto e seguro, manuseie o aparelho somente parado e confira os pontos de início e fim antes de compartilhar uma rota. A interface em português não está confirmada." ]
  },
  decisionKicker: "Guias por tarefa", decisionTitle: "Continue pelo guia que corresponde ao seu objetivo.", decisionIntro: "Os guias detalhados estão em inglês, mas a tabela deixa claro qual fluxo e qual risco você deve conferir antes de executar a tarefa.",
  table: ["Tarefa", "Guia", "O que conferir"],
  decisions: [
    ["Classificar fotos por conteúdo", "ai-photo-classification.html", "Classificação de fotos com IA", "Processamento no aparelho, grupos encontrados e revisão manual antes de apagar."],
    ["Encontrar duplicadas e fotos semelhantes", "duplicate-photo-cleaner-guide.html", "Revisão de duplicadas", "A diferença entre uma cópia exata e uma foto parecida."],
    ["Traduzir conversa, menu ou placa", "voice-camera-translator-guide.html", "Tradução por voz e câmera", "O par de idiomas, a leitura do texto e a confirmação do original."],
    ["Proteger a tela ao compartilhar", "screen-sharing-privacy-guide.html", "Privacidade no compartilhamento", "Notificações, janela escolhida e uma chamada de teste."],
    ["Criar um GIF a partir de vídeo", "make-gif-on-iphone-guide.html", "GIF no iPhone", "Duração, tamanho do arquivo, loop e dados pessoais."],
    ["Registrar uma pedalada automaticamente", "automatic-bike-ride-tracker-iphone.html", "Registro automático de atividade", "Permissões, condições de detecção e conferência após parar."]
  ],
  languageKicker: "Idiomas dos apps", languageTitle: "A explicação em português não garante uma interface em português.",
  languageIntro: "Na conferência dos dados públicos da Apple, português aparece para AI Cleaning, Anti-spy screen e Anti-spy screen Lite. Translation Specialist, GIFmaker e HappyRide não foram apresentados aqui como apps com interface em português.",
  languageItems: [
    ["AI Cleaning", "Português está listado para o AI Cleaning. Ainda assim, confirme a versão instalada e a lista de idiomas mostrada na ficha brasileira, porque a Apple pode atualizar esses dados."],
    ["Translation Specialist", "O idioma da interface e os idiomas que podem ser traduzidos são informações diferentes. Para uma viagem, teste português e o idioma de destino no modo de voz e no modo de câmera antes de depender do app."],
    ["GIFmaker e HappyRide", "Não prometa português para esses dois apps. Leia as capturas de tela, confira os idiomas da ficha brasileira e use conteúdo não sensível no primeiro teste."],
    ["Uso sem internet", "A tradução offline depende do modo e dos pacotes de idioma disponíveis. Baixe e teste o que for necessário antes de sair, sem assumir que todos os recursos funcionam sem conexão."]
  ],
  safetyKicker: "Antes de executar", safetyTitle: "Revise o resultado quando a ação puder ser difícil de desfazer.",
  safetyItems: [
    ["Antes de apagar fotos", "Verifique a sincronização do iCloud e abra documentos, recibos, comprovantes, fotos editadas e fotos de família. Os grupos sugeridos reduzem a procura, mas não decidem o que tem valor."],
    ["Antes de confiar em uma tradução", "Confira nomes, datas, valores e endereços no original. Mensagens médicas, jurídicas, de imigração ou segurança precisam de fonte oficial ou profissional qualificado."],
    ["Antes de compartilhar a tela", "Feche chats e e-mails particulares, silencie notificações desnecessárias e confirme se a reunião está compartilhando a janela ou o monitor correto."],
    ["Antes de publicar GIF ou rota", "Revise rostos, números de documentos, endereços e pontos de início e fim. Preserve o arquivo original e compartilhe apenas o necessário."],
    ["Faça um teste pequeno", "Use um álbum curto, um vídeo breve, uma conversa simples e uma rota conhecida antes de aplicar o fluxo à fototeca inteira, a uma viagem importante ou a um treino relevante."]
  ],
  faqKicker: "Perguntas frequentes", faqTitle: "O que conferir antes de baixar.",
  faqs: [
    ["Qual app ajuda a organizar fotos no iPhone?", "O AI Cleaning classifica fotos e mostra candidatos como duplicadas, imagens semelhantes, capturas de tela, fotos borradas e arquivos grandes. Você revisa os itens e escolhe manualmente o que será apagado."],
    ["O AI Cleaning apaga fotos automaticamente?", "Não. Ele organiza e apresenta grupos para revisão. A decisão de apagar continua sendo do usuário, que deve conferir documentos, fotos de família e imagens editadas."],
    ["Os seis apps têm interface em português?", "Não há essa garantia para os seis. Português aparece nos dados públicos da Apple para AI Cleaning e as duas versões do Anti-spy screen; para Translation Specialist, GIFmaker e HappyRide, consulte a ficha brasileira atual."],
    ["Posso usar tradução automática em uma situação médica ou jurídica?", "Não como única fonte. Compare o resultado com uma fonte oficial e procure um profissional qualificado quando nomes, instruções, direitos, segurança ou consequências importantes estiverem envolvidos."],
    ["O GIFmaker cria GIF com fotos e vídeos?", "Sim. A descrição do produto cobre fotos, vídeos e Live Photos, além de ajustes de quadros, duração e texto. Veja a prévia e remova informações pessoais antes de compartilhar."],
    ["Onde verifico preço e compatibilidade no Brasil?", "Os links desta página abrem a App Store brasileira. A ficha da Apple é a referência atual para preço, compras internas, sistema mínimo, idiomas, privacidade e disponibilidade."]
  ],
  marketsKicker: "Outros países e idiomas", marketsTitle: "Escolha o mercado mais próximo.", marketsIntro: "Use a página correspondente ao país da sua conta Apple ou ao idioma em que prefere ler.", footer: ["Apps", "Guias", "Países", "Suporte", "Privacidade"]
};

const mexico = {
  file: "es-mx.html", store: "mx", lang: "es-MX", ogLocale: "es_MX", country: "México", breadcrumb: "México",
  title: "Apps para iPhone y Mac en México | CrazyAIAgent",
  description: "Seis apps en México para organizar fotos, traducir en viajes, proteger la pantalla del Mac, crear GIF y registrar recorridos, con enlace a App Store mexicana.",
  keywords: "limpiar fotos iPhone, borrar fotos duplicadas, traductor para viajes, privacidad pantalla Mac, crear GIF en iPhone, registrar bicicleta automáticamente",
  ogTitle: "Apps para iPhone y Mac en México", ogDescription: "Elige una app por tarea, revisa los idiomas reales y abre la App Store de México.",
  skip: "Ir al contenido", nav: ["Apps", "Guías", "Países"], eyebrow: "App Store de México", h1: "Apps de fotos, traducción y privacidad para iPhone y Mac en México.",
  lead: "Organiza fotos antes de borrarlas, traduce conversaciones y letreros durante un viaje, protege la pantalla del Mac, crea GIF y registra tus recorridos. Compara seis apps en español y confirma la ficha mexicana antes de instalar.",
  primary: "Abrir AI Cleaning en la App Store de México", secondary: "Ver las seis apps", checked: "Información de la App Store comprobada",
  appsKicker: "Seis herramientas", appsTitle: "Empieza por la tarea que quieres resolver.",
  appsIntro: "Esta página explica los seis productos en español. Eso no significa que todos tengan interfaz en español. En la App Store de México revisa compatibilidad, precio, compras dentro de la app, idiomas y privacidad antes de descargar.",
  detailsLabel: "Ver detalles", storeLabel: "App Store de México", newTab: "abre en una pestaña nueva", imageAlt: "Pantalla de clasificación de fotos de AI Cleaning",
  products: {
    ai: ["AI Cleaning - organización de fotos", "Para iPhone con iOS 16 o posterior. Clasifica las fotos por contenido y muestra duplicados, imágenes parecidas, capturas de pantalla, fotos borrosas y archivos grandes para revisarlos antes de borrar. Autoriza el acceso a la fototeca solo cuando lo necesites, revisa documentos y fotos familiares y selecciona manualmente cada elemento. No es un limpiador de archivos del sistema ni de RAM."],
    translator: ["Translation Specialist - traducción para viajes", "Para iPhone con iOS 17.4 o posterior. Incluye conversación por voz, lectura de la traducción, reconocimiento de texto con la cámara y traducción continua. Prueba el par de idiomas antes de viajar y compara nombres, fechas, cantidades y direcciones con el original. La interfaz en español debe confirmarse en la ficha actual."],
    privacy: ["Anti-spy screen - privacidad en el Mac", "Para Mac con macOS 13 o posterior. Ayuda a ocultar apps seleccionadas o cubrir zonas de la pantalla durante reuniones, presentaciones y trabajo en espacios compartidos. Define qué quieres proteger, elige la ventana correcta en la aplicación de reunión y haz una prueba para saber qué verá la otra persona."],
    privacyLite: ["Anti-spy screen Lite", "Para Mac con macOS 13 o posterior. La versión ligera permite probar la ocultación de apps y zonas de privacidad durante una presentación. Empieza con información no sensible y consulta en la tienda las diferencias, funciones y compras de la versión completa."],
    gif: ["GIFmaker - GIF Studio", "Para iPhone con iOS 17 o posterior. Crea GIF a partir de fotos, vídeos y Live Photos. Importa un fragmento corto, ajusta el orden de los cuadros, la duración, el texto y la repetición, y revisa la vista previa antes de exportar. Comprueba rostros, documentos y datos personales antes de compartir."],
    ride: ["HappyRide - registro automático de recorridos", "Para iPhone con iOS 17 o posterior. Detecta y registra actividades compatibles de bicicleta, caminata y carrera. Prueba los permisos de ubicación y movimiento en un recorrido corto y seguro, usa el teléfono solo cuando estés detenido y revisa los puntos de inicio y llegada antes de compartir una ruta. La interfaz en español no está confirmada." ]
  },
  decisionKicker: "Guías por tarea", decisionTitle: "Continúa con la guía que corresponde a tu objetivo.", decisionIntro: "Las guías detalladas están en inglés, pero la tabla indica qué flujo seguir y qué límite revisar antes de realizar la tarea.",
  table: ["Tarea", "Guía", "Qué comprobar"],
  decisions: [
    ["Clasificar fotos por contenido", "ai-photo-classification.html", "Clasificación de fotos con IA", "Procesamiento en el dispositivo, grupos encontrados y revisión manual antes de borrar."],
    ["Encontrar duplicados e imágenes parecidas", "duplicate-photo-cleaner-guide.html", "Revisión de duplicados", "La diferencia entre una copia exacta y una foto parecida."],
    ["Traducir una conversación, menú o letrero", "voice-camera-translator-guide.html", "Traducción por voz y cámara", "El par de idiomas, la lectura del texto y la comparación con el original."],
    ["Proteger la pantalla al compartirla", "screen-sharing-privacy-guide.html", "Privacidad al compartir pantalla", "Notificaciones, ventana seleccionada y una llamada de prueba."],
    ["Crear un GIF desde un vídeo", "make-gif-on-iphone-guide.html", "GIF en el iPhone", "Duración, tamaño del archivo, repetición y datos personales."],
    ["Registrar una ruta en bicicleta automáticamente", "automatic-bike-ride-tracker-iphone.html", "Registro automático de actividad", "Permisos, condiciones de detección y revisión al terminar."]
  ],
  languageKicker: "Idiomas de los apps", languageTitle: "Una explicación en español no garantiza una interfaz en español.",
  languageIntro: "En la revisión de los datos públicos de Apple, español aparece para AI Cleaning, Translation Specialist, Anti-spy screen y Anti-spy screen Lite. GIFmaker y HappyRide no se presentan aquí como apps con interfaz en español.",
  languageItems: [
    ["AI Cleaning y Translation Specialist", "El español figura en los datos públicos revisados para estas apps. Confirma la ficha mexicana y la versión instalada, porque los idiomas y la compatibilidad pueden cambiar."],
    ["Anti-spy screen", "Las dos versiones incluyen español en la lista pública revisada. Aun así, prueba la protección con una ventana no sensible y verifica qué aplicación de reunión está compartiendo."],
    ["GIFmaker y HappyRide", "No prometas una interfaz en español para estos dos productos. Revisa las capturas de pantalla y la lista de idiomas en la App Store de México antes de decidir."],
    ["Idiomas de traducción", "El idioma de la interfaz no es la misma información que los idiomas que el traductor puede procesar. Prueba voz, cámara y el modo sin conexión que realmente vayas a usar."]
  ],
  safetyKicker: "Antes de realizar cambios", safetyTitle: "Comprueba por tu cuenta los resultados importantes.",
  safetyItems: [
    ["Antes de borrar fotos", "Comprueba la sincronización de iCloud y revisa documentos, recibos, identificaciones, fotos editadas y recuerdos familiares. Las agrupaciones ayudan a revisar, pero no deciden qué debes conservar."],
    ["Antes de confiar en una traducción", "Compara nombres, fechas, cantidades y direcciones con el original. La información médica, legal, migratoria o de seguridad necesita una fuente oficial o un profesional cualificado."],
    ["Antes de compartir la pantalla", "Cierra chats y correos privados, silencia notificaciones innecesarias y confirma que la reunión comparte la ventana o el monitor correcto."],
    ["Antes de publicar un GIF o una ruta", "Revisa rostros, números de documentos, domicilios y puntos de salida y llegada. Conserva el original y comparte solo la información necesaria."],
    ["Haz una prueba pequeña", "Usa un álbum corto, un vídeo breve, una conversación sencilla y una ruta conocida antes de aplicar el proceso a toda tu fototeca, a un viaje importante o a un entrenamiento relevante."]
  ],
  faqKicker: "Preguntas frecuentes", faqTitle: "Qué revisar antes de descargar.",
  faqs: [
    ["¿Qué app ayuda a organizar fotos en el iPhone?", "AI Cleaning clasifica las fotos y muestra candidatos como duplicados, imágenes parecidas, capturas de pantalla, fotos borrosas y archivos grandes. Tú revisas los elementos y eliges manualmente cuáles borrar."],
    ["¿AI Cleaning borra fotos automáticamente?", "No. Organiza y muestra grupos para que los revises. La decisión de borrar sigue siendo del usuario, que debe comprobar documentos, fotos familiares e imágenes editadas."],
    ["¿Los seis apps tienen interfaz en español?", "No hay una garantía para los seis. En los datos públicos revisados, el español aparece para AI Cleaning, Translation Specialist y las dos versiones de Anti-spy screen; para GIFmaker y HappyRide revisa la ficha mexicana actual."],
    ["¿Puedo usar traducción automática en una situación médica o legal?", "No como única fuente. Compara el resultado con información oficial y busca ayuda profesional cuando haya instrucciones, derechos, seguridad o consecuencias importantes."],
    ["¿GIFmaker crea GIF con fotos y vídeos?", "Sí. La descripción del producto incluye fotos, vídeos y Live Photos, además de ajustes de cuadros, duración y texto. Revisa la vista previa y elimina datos personales antes de compartir."],
    ["¿Dónde compruebo el precio y los requisitos en México?", "Los enlaces de esta página abren la App Store mexicana. La ficha de Apple es la referencia actual para precio, compras internas, sistema mínimo, idiomas, privacidad y disponibilidad."]
  ],
  marketsKicker: "Otros países e idiomas", marketsTitle: "Elige el mercado más cercano.", marketsIntro: "Usa la página correspondiente al país de tu cuenta de Apple o al idioma en el que prefieres leer.", footer: ["Apps", "Guías", "Países", "Soporte", "Privacidad"]
};

export const latinAmericanMarkets = [brazil, mexico];
