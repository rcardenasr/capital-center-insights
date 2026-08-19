const realClients = [
  {
    "id": "10000000",
    "nombre_cliente": "BACKUS ESTRATEGIA",
    "empresa": "",
    "rubro": "Servicios corporativos vinculados al grupo cervecero Backus / bebidas",
    "tipo_activo": "Oficina corporativa; eventualmente industrial/log\xedstico por v\xednculo con el grupo",
    "ubicacion": "Ate, Lima (domicilio asociado a Backus Estrategia); por confirmar ubicaci\xf3n contractual",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Backus Estrategia; Backus Corporativo; Backus Per\xfa; inversi\xf3n; nueva planta; ampliaci\xf3n; centro de distribuci\xf3n; almac\xe9n; terreno industrial; licencia; oficinas",
    "estado": "medio",
    "observaciones": "Contrato: 10000000 | El nombre aparece vinculado al grupo Backus. Hay referencias a una denominaci\xf3n posterior 'Backus Corporativo'; conviene confirmar la raz\xf3n social vigente y que el contrato corresponda a esa entidad. | Nivel de confianza: medio | Fuentes sugeridas: Diario Gesti\xf3n; El Comercio; El Peruano; Produce; municipalidades de Lima/Ate; SUNAT; SMV; portales de consumo masivo | URLs de verificacion: https://www.backus.pe/abilegal/politica-deproteccion-de-datos-personales | https://www.universidadperu.com/empresas/backus-estrategia.php"
  },
  {
    "id": "10000001",
    "nombre_cliente": "BAMBAS",
    "empresa": "",
    "rubro": "Miner\xeda de cobre",
    "tipo_activo": "Mina, planta de procesamiento, campamentos e infraestructura log\xedstica; oficina corporativa",
    "ubicacion": "Apur\xedmac: Cotabambas y Grau; oficina corporativa en Lima por confirmar",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Las Bambas; Minera Las Bambas; cobre; ampliaci\xf3n minera; inversi\xf3n minera; permisos; ITS; EIA; planta concentradora; corredor minero; terrenos; infraestructura; log\xedstica",
    "estado": "medio",
    "observaciones": "Contrato: 10000001 | Por el nombre, probablemente corresponde a Minera Las Bambas. Como el registro solo dice 'BAMBAS', conviene validar la raz\xf3n social del contrato. | Nivel de confianza: medio | Fuentes sugeridas: Minem; Senace; OEFA; INGEMMET; ProInversi\xf3n; Diario Gesti\xf3n; El Comercio; El Peruano; Rumbo Minero; Energiminas | URLs de verificacion: https://www.lasbambas.com/ | https://www.lasbambas.com/seccion-acerca-de-las-bambas-conociendo-a-las-bambas"
  },
  {
    "id": "10000002",
    "nombre_cliente": "PILL",
    "empresa": "",
    "rubro": "por confirmar",
    "tipo_activo": "por confirmar",
    "ubicacion": "por confirmar",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "PILL Per\xfa empresa; PILL SAC; PILL inversiones; PILL proyectos; PILL oficinas; PILL terreno; PILL licencia; PILL infraestructura",
    "estado": "bajo",
    "observaciones": "Contrato: 10000002 | Nombre demasiado corto/ambiguo. La b\xfasqueda no permiti\xf3 identificar de forma confiable una empresa peruana espec\xedfica. | Nivel de confianza: bajo | Fuentes sugeridas: SUNAT/RUC; El Peruano; Diario Gesti\xf3n; El Comercio; Produce; municipalidades; LinkedIn; directorios empresariales"
  },
  {
    "id": "10000003",
    "nombre_cliente": "NATURA COOK (QUINOA)",
    "empresa": "",
    "rubro": "Gastronom\xeda / cadena de restaurantes y cafeter\xeda saludable",
    "tipo_activo": "Locales retail/restaurante; cocina de producci\xf3n y almac\xe9n",
    "ubicacion": "Lima; presencia confirmada en San Isidro y Miraflores",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Natura Cook; Quinoa Caf\xe9; Quinoa Per\xfa; apertura local; nueva sede; expansi\xf3n; alquiler comercial; restaurante; licencia de funcionamiento; licencia ITSE; dark kitchen; centro de producci\xf3n",
    "estado": "alto",
    "observaciones": "Contrato: 10000003 | Natura Cook S.A.C. opera la marca Quinoa Caf\xe9. Para inteligencia inmobiliaria, vigilar nuevas aperturas, cierres, cambios de formato y locales comerciales. | Nivel de confianza: alto | Fuentes sugeridas: Diario Gesti\xf3n; El Comercio; Per\xfa Retail; Produce; municipalidades distritales; Indecopi; Rappi/PedidosYa; LinkedIn | URLs de verificacion: https://quinoa.com.pe/ | https://www.universidadperu.com/empresas/natura-cook.php"
  },
  {
    "id": "10000004",
    "nombre_cliente": "3M",
    "empresa": "",
    "rubro": "Tecnolog\xeda y manufactura diversificada; productos industriales, seguridad, salud y consumo",
    "tipo_activo": "Oficina corporativa; almac\xe9n/distribuci\xf3n; eventualmente planta o laboratorio",
    "ubicacion": "Lima, Per\xfa; sede exacta por confirmar",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "3M Per\xfa; inversi\xf3n; centro de distribuci\xf3n; almac\xe9n; planta; laboratorio; expansi\xf3n; importaciones; oficinas; terreno industrial; innovaci\xf3n; licencias",
    "estado": "alto",
    "observaciones": "Contrato: 10000004 | Rubro confirmado a nivel de marca/operaci\xf3n en Per\xfa. El tipo de activo concreto depende de la unidad de negocio contratante. | Nivel de confianza: alto | Fuentes sugeridas: Diario Gesti\xf3n; El Comercio; Produce; El Peruano; Aduanas/SUNAT; municipalidades; portales industriales; 3M Per\xfa | URLs de verificacion: https://www.3m.com.pe/3M/es_PE/inicio/ | https://www.3m.com.pe/3M/es_PE/p/"
  },
  {
    "id": "10000013",
    "nombre_cliente": "AGENCIA DE COOPERACION JICA",
    "empresa": "",
    "rubro": "Cooperaci\xf3n internacional y financiamiento/asistencia t\xe9cnica para desarrollo",
    "tipo_activo": "Oficina institucional; exposici\xf3n indirecta a proyectos de infraestructura p\xfablica",
    "ubicacion": "San Isidro, Lima",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "JICA Per\xfa; cooperaci\xf3n Jap\xf3n Per\xfa; pr\xe9stamo JICA; infraestructura; saneamiento; transporte; carreteras; proyectos p\xfablicos; inversi\xf3n; asistencia t\xe9cnica; APP",
    "estado": "alto",
    "observaciones": "Contrato: 10000013 | Adem\xe1s de noticias de la propia oficina, conviene monitorear proyectos peruanos financiados o asistidos por JICA porque pueden generar demanda de suelo, oficinas, log\xedstica o infraestructura. | Nivel de confianza: alto | Fuentes sugeridas: JICA Per\xfa; MEF; ProInversi\xf3n; MTC; MVCS; RREE; El Peruano; Diario Gesti\xf3n; municipalidades/gobiernos regionales | URLs de verificacion: https://www.jica.go.jp/spanish/overseas/peru/office/index.html | https://www.jica.go.jp/spanish/overseas/peru/"
  },
  {
    "id": "10000014",
    "nombre_cliente": "TELEPERFORMANCE",
    "empresa": "",
    "rubro": "BPO, contact center, back office y servicios tecnol\xf3gicos",
    "tipo_activo": "Oficinas de gran formato / contact center; espacios tecnol\xf3gicos",
    "ubicacion": "Lima; operaciones en Magdalena del Mar y otras sedes por confirmar",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Teleperformance Per\xfa; TP Per\xfa; BPO; contact center; nueva sede; oficinas; expansi\xf3n; contrataci\xf3n masiva; trabajo h\xedbrido; data center; licencia; arrendamiento",
    "estado": "alto",
    "observaciones": "Contrato: 10000014 | El negocio suele requerir superficies de oficina relevantes, alta conectividad y continuidad operativa; \xfatil monitorear aperturas de sedes y crecimiento de empleo. | Nivel de confianza: alto | Fuentes sugeridas: Diario Gesti\xf3n; El Comercio; Produce; municipalidades; LinkedIn; Great Place to Work; portales BPO/tecnolog\xeda; El Peruano | URLs de verificacion: https://www.tp.com/es-pe/ubicaciones/peru/codigos-y-politicas/ | https://www.tp.com/es-pe/ubicaciones/peru/convocatorias-en-espanol/"
  },
  {
    "id": "10000015",
    "nombre_cliente": "ANIXTER PERU SAC",
    "empresa": "",
    "rubro": "Distribuci\xf3n B2B de productos el\xe9ctricos, comunicaciones, redes y seguridad",
    "tipo_activo": "Almac\xe9n/log\xedstico y oficina comercial",
    "ubicacion": "Lima; referencias en Chorrillos y otras direcciones hist\xf3ricas, por confirmar sede vigente",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Anixter Per\xfa; WESCO Anixter Per\xfa; distribuci\xf3n el\xe9ctrica; cableado; data center; almac\xe9n; centro de distribuci\xf3n; importaciones; infraestructura digital; expansi\xf3n; oficinas",
    "estado": "alto",
    "observaciones": "Contrato: 10000015 | Existen referencias recientes a 'WESCO ANIXTER PERU S.A.C.'. Confirmar si hubo cambio de raz\xf3n social o si el contrato conserva la denominaci\xf3n anterior. | Nivel de confianza: alto | Fuentes sugeridas: Diario Gesti\xf3n; El Comercio; Produce; MTC; OSCE/SEACE; SUNAT/Aduanas; municipalidades; portales el\xe9ctricos y tecnol\xf3gicos | URLs de verificacion: https://apps.osce.gob.pe/perfilprov-ui/ficha/20545135184 | https://www.anixter.com/es_mx/about-us/news-and-events/news/anixter-peru-anixter-jorvex-certificados-operador-economico-autorizado-sunat.html"
  },
  {
    "id": "10000016",
    "nombre_cliente": "LIBERTY SEGUROS",
    "empresa": "",
    "rubro": "Seguros generales / servicios financieros",
    "tipo_activo": "Oficina corporativa",
    "ubicacion": "San Isidro, Lima",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Liberty Seguros Per\xfa; seguros corporativos; oficina; traslado de sede; arrendamiento; fusi\xf3n; adquisici\xf3n; SBS; expansi\xf3n; servicios financieros",
    "estado": "alto",
    "observaciones": "Contrato: 10000016 | Rubro y sede corporativa identificables. Conviene monitorear cambios societarios, fusiones y mudanzas de oficinas. | Nivel de confianza: alto | Fuentes sugeridas: SBS; Diario Gesti\xf3n; El Comercio; El Peruano; SMV; Apeseg; municipalidad de San Isidro; portales de seguros | URLs de verificacion: https://www.libertyseguros.com.pe/ | https://www.apeseg.org.pe/liberty-seguros/"
  },
  {
    "id": "10000017",
    "nombre_cliente": "CREAN INVESTMENTS (THE COFFEE)",
    "empresa": "",
    "rubro": "Gastronom\xeda / cadena de cafeter\xedas de especialidad",
    "tipo_activo": "Locales retail; almac\xe9n y soporte log\xedstico",
    "ubicacion": "Lima; presencia en Miraflores, San Isidro y otros distritos",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Crean Investments; The Coffee Per\xfa; cafeter\xeda; apertura; nueva tienda; expansi\xf3n; franquicia; local comercial; alquiler; licencia de funcionamiento; almac\xe9n",
    "estado": "alto",
    "observaciones": "Contrato: 10000017 | Crean Investments aparece como operador/m\xe1ster franquicia de The Coffee en Per\xfa. Foco inmobiliario: expansi\xf3n de red y aperturas. | Nivel de confianza: alto | Fuentes sugeridas: Diario Gesti\xf3n; Forbes Per\xfa; El Comercio; Per\xfa Retail; Produce; municipalidades; Rappi/PedidosYa; LinkedIn | URLs de verificacion: https://www.universidadperu.com/empresas/crean-investments.php | https://forbes.pe/negocios/2025-04-24/el-boom-de-cafeterias-de-especialidad-en-peru-no-para-asi-se-reajustan-y-planean-seguir-creciendo/"
  },
  {
    "id": "10000018",
    "nombre_cliente": "SCANIA",
    "empresa": "",
    "rubro": "Automotriz pesada: camiones, buses, repuestos y servicios",
    "tipo_activo": "Concesionario; taller; patio; almac\xe9n de repuestos; oficina",
    "ubicacion": "Lima y red nacional de atenci\xf3n; sede contractual por confirmar",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Scania Per\xfa; camiones; buses; nuevo concesionario; taller; centro de servicio; almac\xe9n; patio; expansi\xf3n; miner\xeda; transporte; inversi\xf3n",
    "estado": "alto",
    "observaciones": "Contrato: 10000018 | La demanda inmobiliaria puede estar asociada a talleres/patios de gran superficie adem\xe1s de oficinas y puntos comerciales. | Nivel de confianza: alto | Fuentes sugeridas: Diario Gesti\xf3n; El Comercio; MTC; Minem; Produce; municipalidades; Energiminas; portales automotrices y de transporte | URLs de verificacion: https://www.scania.com/pe/es/home.html"
  },
  {
    "id": "10000019",
    "nombre_cliente": "GRIFFIELD",
    "empresa": "",
    "rubro": "por confirmar",
    "tipo_activo": "por confirmar",
    "ubicacion": "por confirmar",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Griffield Per\xfa; Griffield SAC; Griffield empresa; Griffield inversiones; Griffield proyecto; Griffield oficinas; Griffield terreno; Griffield licencia",
    "estado": "bajo",
    "observaciones": "Contrato: 10000019 | No se encontr\xf3 una coincidencia empresarial peruana suficientemente confiable con el nombre exacto. Puede existir un error de escritura o una raz\xf3n social distinta. | Nivel de confianza: bajo | Fuentes sugeridas: SUNAT/RUC; El Peruano; Diario Gesti\xf3n; El Comercio; Produce; municipalidades; LinkedIn; directorios empresariales"
  },
  {
    "id": "10000020",
    "nombre_cliente": "CARBONELL",
    "empresa": "",
    "rubro": "Construcci\xf3n/ingenier\xeda (hip\xf3tesis; por confirmar)",
    "tipo_activo": "Oficina y obras/proyectos de construcci\xf3n, si corresponde a Carbonell Figueras",
    "ubicacion": "Per\xfa/Lima, por confirmar",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Carbonell Per\xfa; Carbonell Figueras Per\xfa; construcci\xf3n; obra; proyecto; licitaci\xf3n; terreno; licencia de edificaci\xf3n; infraestructura; oficinas; contrato",
    "estado": "bajo",
    "observaciones": "Contrato: 10000020 | El nombre es gen\xe9rico. Aparece una posible coincidencia con Carbonell Figueras Per\xfa (constructora), pero no debe asumirse sin validar raz\xf3n social/RUC. | Nivel de confianza: bajo | Fuentes sugeridas: OSCE/SEACE; El Peruano; Diario Gesti\xf3n; El Comercio; MVCS; ProInversi\xf3n; municipalidades; Capeco; LinkedIn"
  },
  {
    "id": "10000021",
    "nombre_cliente": "ILKO",
    "empresa": "",
    "rubro": "Manufactura y comercializaci\xf3n de art\xedculos de limpieza y menaje de hogar",
    "tipo_activo": "Planta industrial; almac\xe9n/log\xedstico; oficina comercial",
    "ubicacion": "Lima; planta/distrito exacto por confirmar",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "ILKO Per\xfa; Virutex Ilko Per\xfa; planta; ampliaci\xf3n; almac\xe9n; centro de distribuci\xf3n; importaciones; producci\xf3n; terreno industrial; licencia; inversi\xf3n",
    "estado": "alto",
    "observaciones": "Contrato: 10000021 | La marca ILKO opera en Per\xfa dentro de Virutex Ilko. Foco inmobiliario: producci\xf3n, almacenamiento y distribuci\xf3n. | Nivel de confianza: alto | Fuentes sugeridas: Diario Gesti\xf3n; El Comercio; Produce; El Peruano; SUNAT/Aduanas; municipalidades; Sociedad Nacional de Industrias; Virutex Ilko | URLs de verificacion: https://virutexilko.com/ | https://www.universidadperu.com/empresas/ilko-peru.php"
  },
  {
    "id": "10000022",
    "nombre_cliente": "NEGOINVERSIONES (SELECTOS)",
    "empresa": "",
    "rubro": "Gastronom\xeda / restaurantes y alimentos",
    "tipo_activo": "Restaurante/local comercial; cocina y almac\xe9n",
    "ubicacion": "Lima; presencia en Miraflores y San Isidro",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Negoinversiones Lorenzo; Selectos Ib\xe9ricos; Selectos; restaurante; nueva sede; apertura; local comercial; alquiler; licencia; expansi\xf3n; cocina; almac\xe9n",
    "estado": "alto",
    "observaciones": "Contrato: 10000022 | La coincidencia encontrada vincula Negoinversiones Lorenzo E.I.R.L. con Selectos Ib\xe9ricos. Confirmar que sea la misma raz\xf3n social del contrato. | Nivel de confianza: alto | Fuentes sugeridas: Diario Gesti\xf3n; El Comercio; Produce; municipalidades; Per\xfa Retail; Rappi/PedidosYa; Indecopi; LinkedIn | URLs de verificacion: https://www.rappi.com.pe/restaurantes/26104-selectos-ibericos"
  },
  {
    "id": "10000023",
    "nombre_cliente": "CONTRANS",
    "empresa": "",
    "rubro": "Log\xedstica, almacenamiento y operaciones de cadena de suministro",
    "tipo_activo": "Centro log\xedstico; almacenes; patios y zona primaria",
    "ubicacion": "Callao, eje N\xe9stor Gambetta",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Contrans Per\xfa; almac\xe9n; centro de distribuci\xf3n; Callao; N\xe9stor Gambetta; zona primaria; log\xedstica; ampliaci\xf3n; terreno industrial; puerto; infraestructura; inversi\xf3n",
    "estado": "alto",
    "observaciones": "Contrato: 10000023 | Alta relevancia para inteligencia inmobiliaria industrial/log\xedstica por su operaci\xf3n de almacenamiento y cercan\xeda a infraestructura portuaria. | Nivel de confianza: alto | Fuentes sugeridas: Diario Gesti\xf3n; El Comercio; MTC; APN; ProInversi\xf3n; PromPer\xfa Directorio Log\xedstico; municipalidad/provincia del Callao; El Peruano | URLs de verificacion: https://contrans.pe/ | https://directoriologistico.promperu.gob.pe/detalle/20392952455"
  },
  {
    "id": "10000024",
    "nombre_cliente": "CORP FUNG",
    "empresa": "",
    "rubro": "Industria naval: reparaci\xf3n, modificaci\xf3n y varado de embarcaciones",
    "tipo_activo": "Astillero/patio industrial; talleres; almacenes",
    "ubicacion": "Callao, por confirmar direcci\xf3n exacta",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Corp Fung; astillero; reparaci\xf3n naval; embarcaciones; industria pesquera; industria petrolera; ampliaci\xf3n; patio industrial; concesi\xf3n; puerto; licencia; infraestructura",
    "estado": "alto",
    "observaciones": "Contrato: 10000024 | Empresa orientada a servicios para embarcaciones de gran tonelaje. El tipo de activo m\xe1s probable es industrial-portuario. | Nivel de confianza: alto | Fuentes sugeridas: Diario Gesti\xf3n; El Comercio; Produce; APN; Marina/DICAPI; municipalidad del Callao; El Peruano; portales pesqueros y navales | URLs de verificacion: https://www.corpfung.com/ | https://www.corpfung.com/nosotros.html"
  },
  {
    "id": "10000025",
    "nombre_cliente": "LENOVO",
    "empresa": "",
    "rubro": "Tecnolog\xeda: hardware, dispositivos y soluciones empresariales",
    "tipo_activo": "Oficina corporativa/comercial; almac\xe9n o distribuci\xf3n tercerizada",
    "ubicacion": "Lima, por confirmar sede exacta",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Lenovo Per\xfa; tecnolog\xeda; oficinas; centro de distribuci\xf3n; almac\xe9n; data center; expansi\xf3n; canal empresarial; infraestructura TI; inversi\xf3n; arrendamiento",
    "estado": "alto",
    "observaciones": "Contrato: 10000025 | Rubro claro; el activo inmobiliario propio puede ser principalmente oficina comercial y soporte de distribuci\xf3n. | Nivel de confianza: alto | Fuentes sugeridas: Diario Gesti\xf3n; El Comercio; Produce; MTC; municipalidades; portales de tecnolog\xeda; Lenovo Per\xfa; Aduanas/SUNAT | URLs de verificacion: https://www.lenovo.com/pe/es/ | https://www.lenovo.com/pe/es/sobre-lenovo/"
  },
  {
    "id": "10000026",
    "nombre_cliente": "COLORBEL",
    "empresa": "",
    "rubro": "Belleza / estudio de u\xf1as y servicios est\xe9ticos (probable Colorbel Studio)",
    "tipo_activo": "Local comercial / sal\xf3n de belleza",
    "ubicacion": "Lima, por confirmar distrito y raz\xf3n social",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Colorbel Per\xfa; Colorbel Studio; sal\xf3n; manicure; nueva sede; apertura; local comercial; alquiler; licencia de funcionamiento; expansi\xf3n; belleza",
    "estado": "medio",
    "observaciones": "Contrato: 10000026 | Se encontr\xf3 una coincidencia con Colorbel Estudio E.I.R.L./Colorbel Studio. Confirmar RUC o nombre legal antes de usar la clasificaci\xf3n como hecho. | Nivel de confianza: medio | Fuentes sugeridas: Municipalidades distritales; Produce; Indecopi; Diario Gesti\xf3n; El Comercio; Instagram; Google Business; directorios empresariales | URLs de verificacion: https://www.universidadperu.com/empresas/colorbel-estudio.php"
  },
  {
    "id": "10000027",
    "nombre_cliente": "UNA BUSINESS",
    "empresa": "",
    "rubro": "Servicios corporativos/compartidos, probablemente vinculados al Grupo UNACEM",
    "tipo_activo": "Oficina corporativa",
    "ubicacion": "Lima, por confirmar sede exacta",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "UNA Business Services; Grupo UNACEM; servicios compartidos; oficinas; traslado; expansi\xf3n; arrendamiento; transformaci\xf3n digital; centro corporativo",
    "estado": "medio",
    "observaciones": "Contrato: 10000027 | Existe UNA Business Services S.A.C. dentro del per\xedmetro corporativo reportado por UNACEM. El nombre de la base parece abreviado; validar raz\xf3n social. | Nivel de confianza: medio | Fuentes sugeridas: SMV; Diario Gesti\xf3n; El Comercio; El Peruano; Grupo UNACEM; SUNAT; municipalidades | URLs de verificacion: https://www.datosperu.org/empresa-una-business-services-sac-20112799452.php | https://grupounacem.com/nosotros/"
  },
  {
    "id": "10000028",
    "nombre_cliente": "UNACEM",
    "empresa": "",
    "rubro": "Cemento y clinker / materiales de construcci\xf3n",
    "tipo_activo": "Plantas cementeras; canteras; almacenes; centros de distribuci\xf3n; oficinas",
    "ubicacion": "Lima (Atocongo/Villa Mar\xeda del Triunfo) y Jun\xedn (Condorcocha), entre otras operaciones",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "UNACEM Per\xfa; cemento; clinker; planta Atocongo; Condorcocha; cantera; ampliaci\xf3n; inversi\xf3n; terreno industrial; centro de distribuci\xf3n; permisos ambientales; construcci\xf3n",
    "estado": "alto",
    "observaciones": "Contrato: 10000028 | Empresa industrial con alta exposici\xf3n a infraestructura, construcci\xf3n y suelo industrial. Monitorear capex, ampliaciones de planta y demanda de distribuci\xf3n. | Nivel de confianza: alto | Fuentes sugeridas: Diario Gesti\xf3n; El Comercio; El Peruano; Produce; Minem; Senace; OEFA; MVCS; SMV; Grupo UNACEM | URLs de verificacion: https://unacem.pe/ | https://grupounacem.com/nosotros/"
  },
  {
    "id": "10000029",
    "nombre_cliente": "EMBAJADA DE AUSTRIA",
    "empresa": "",
    "rubro": "Diplom\xe1tico / gobierno extranjero",
    "tipo_activo": "Oficina institucional / embajada",
    "ubicacion": "Av. Rep\xfablica de Colombia 717, piso 13, San Isidro, Lima",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Embajada de Austria Lima; Austria Per\xfa; sede embajada; oficinas; arrendamiento; relaciones bilaterales; inversi\xf3n austriaca; empresas austriacas Per\xfa; cooperaci\xf3n",
    "estado": "alto",
    "observaciones": "Contrato: 10000029 | Ubicaci\xf3n institucional confirmable. Para inteligencia comercial, adem\xe1s de la sede conviene seguir inversiones y empresas austriacas promovidas por la representaci\xf3n diplom\xe1tica. | Nivel de confianza: alto | Fuentes sugeridas: BMEIA Austria; RREE Per\xfa; Diario Gesti\xf3n; El Comercio; El Peruano; ProInversi\xf3n; C\xe1mara de Comercio/entidades bilaterales | URLs de verificacion: https://www.bmeia.gv.at/es/ea-lima | https://www.bmeia.gv.at/es/ea-lima/relaciones-bilaterales/representaciones-de-austria"
  },
  {
    "id": "10000030",
    "nombre_cliente": "CADENA DE COMERCIO OXXO",
    "empresa": "",
    "rubro": "Retail / tiendas de conveniencia",
    "tipo_activo": "Locales comerciales de calle; tiendas en estaciones/centros de tr\xe1nsito; centros de distribuci\xf3n",
    "ubicacion": "Lima Metropolitana; expansi\xf3n a m\xfaltiples distritos",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "OXXO Per\xfa; nueva tienda; apertura; expansi\xf3n; local comercial; alquiler; esquina comercial; licencia de funcionamiento; tienda conveniencia; centro de distribuci\xf3n; Lima",
    "estado": "alto",
    "observaciones": "Contrato: 10000030 | Muy relevante para monitoreo de expansi\xf3n retail y b\xfasqueda de locales. Conviene capturar aperturas por distrito y formatos especiales. | Nivel de confianza: alto | Fuentes sugeridas: Diario Gesti\xf3n; El Comercio; Per\xfa Retail; municipalidades distritales; Produce; Indecopi; El Peruano; FEMSA/OXXO | URLs de verificacion: https://gestion.pe/ | https://elcomercio.pe/"
  },
  {
    "id": "10000032",
    "nombre_cliente": "UNICON PISO 13",
    "empresa": "",
    "rubro": "Concreto premezclado y soluciones para construcci\xf3n",
    "tipo_activo": "Oficina corporativa (el texto 'PISO 13' sugiere espacio de oficina); plantas de concreto como activos operativos",
    "ubicacion": "Lima; ubicaci\xf3n exacta del piso 13 por confirmar",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "UNICON Per\xfa; concreto premezclado; planta de concreto; nueva planta; construcci\xf3n; infraestructura; oficina; expansi\xf3n; terreno industrial; obras; inversi\xf3n",
    "estado": "alto",
    "observaciones": "Contrato: 10000032 | El rubro es claro. 'PISO 13' parece una anotaci\xf3n de ubicaci\xf3n interna/contractual y no debe confundirse con una raz\xf3n social. | Nivel de confianza: alto | Fuentes sugeridas: Diario Gesti\xf3n; El Comercio; MVCS; Capeco; ProInversi\xf3n; Produce; municipalidades; UNICON; El Peruano | URLs de verificacion: https://www.unicon.com.pe/ | https://www.unicon.com.pe/noticias/"
  },
  {
    "id": "10000037",
    "nombre_cliente": "POKEBOSS",
    "empresa": "",
    "rubro": "Gastronom\xeda / restaurantes fast-casual de poke",
    "tipo_activo": "Locales retail/restaurante; cocina de producci\xf3n",
    "ubicacion": "Lima; presencia en San Isidro, Miraflores y Surco",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Poke Boss Per\xfa; Pokeboss; nueva sede; apertura; restaurante; local comercial; alquiler; licencia de funcionamiento; expansi\xf3n; delivery; dark kitchen",
    "estado": "alto",
    "observaciones": "Contrato: 10000037 | Cadena gastron\xf3mica con varias ubicaciones en Lima. Foco inmobiliario principal: nuevas aperturas, cierres y relocalizaciones. | Nivel de confianza: alto | Fuentes sugeridas: Diario Gesti\xf3n; El Comercio; Produce; municipalidades; Per\xfa Retail; Rappi/PedidosYa; Instagram; Indecopi | URLs de verificacion: https://www.pokeboss.pe/ | https://www.rappi.com.pe/restaurantes/6238-poke-boss"
  },
  {
    "id": "10000040",
    "nombre_cliente": "SHENG LONG",
    "empresa": "",
    "rubro": "Siderurgia / acero (probable Acero Lima Sheng Long o Aceros Per\xfa Sheng Long)",
    "tipo_activo": "Planta sider\xfargica; patio industrial; almacenes y log\xedstica pesada",
    "ubicacion": "Chilca, Ca\xf1ete, Lima (probable); raz\xf3n social exacta por confirmar",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Sheng Long Per\xfa; Acero Lima Sheng Long; Aceros Per\xfa Sheng Long; planta sider\xfargica; Chilca; acero; inversi\xf3n; EIA; licencia; terreno industrial; puerto; energ\xeda",
    "estado": "medio",
    "observaciones": "Contrato: 10000040 | Hay m\xe1s de una raz\xf3n social con 'Sheng Long'. La coincidencia m\xe1s relevante para inteligencia inmobiliaria/industrial es el proyecto sider\xfargico en Chilca; validar RUC del cliente. | Nivel de confianza: medio | Fuentes sugeridas: Produce; Minem; Senace; OEFA; Municipalidad de Chilca; El Peruano; Diario Gesti\xf3n; El Comercio; SNI; portales industriales | URLs de verificacion: https://www.gob.pe/institucion/munichilca/normas-legales/7791083-014-2026-mdch | https://www.universidadperu.com/empresas/aceros-peru-sheng-long.php"
  },
  {
    "id": "10000041",
    "nombre_cliente": "DAILY",
    "empresa": "",
    "rubro": "por confirmar",
    "tipo_activo": "por confirmar",
    "ubicacion": "por confirmar",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Daily Per\xfa empresa; Daily SAC; Daily Technology; Daily restaurante; Daily inversiones; Daily oficinas; Daily local; Daily proyectos",
    "estado": "bajo",
    "observaciones": "Contrato: 10000041 | El nombre coincide con varias empresas/negocios distintos en Per\xfa (tecnolog\xeda, turismo, gastronom\xeda, etc.). Se requiere RUC o raz\xf3n social completa. | Nivel de confianza: bajo | Fuentes sugeridas: SUNAT/RUC; El Peruano; Diario Gesti\xf3n; El Comercio; Produce; municipalidades; LinkedIn; directorios empresariales"
  },
  {
    "id": "10000042",
    "nombre_cliente": "LUMNINA",
    "empresa": "",
    "rubro": "por confirmar",
    "tipo_activo": "por confirmar",
    "ubicacion": "por confirmar",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "LUMNINA Per\xfa; LUMNINA SAC; LUMINA Per\xfa; Lumina empresa; Lumina oficinas; Lumina proyecto; Lumina inversiones; Lumina terreno",
    "estado": "bajo",
    "observaciones": "Contrato: 10000042 | No se encontr\xf3 coincidencia confiable con la graf\xeda 'LUMNINA'. Podr\xeda tratarse de 'LUMINA', pero no debe asumirse sin validar el nombre legal/RUC. | Nivel de confianza: bajo | Fuentes sugeridas: SUNAT/RUC; El Peruano; Diario Gesti\xf3n; El Comercio; Produce; municipalidades; LinkedIn; directorios empresariales"
  },
  {
    "id": "REAL-029",
    "nombre_cliente": "ENTEL",
    "empresa": "",
    "rubro": "Telecomunicaciones y servicios digitales",
    "tipo_activo": "Oficinas; tiendas; infraestructura de telecomunicaciones; nodos/centros t\xe9cnicos",
    "ubicacion": "San Isidro, Lima (sede corporativa); operaci\xf3n nacional",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Entel Per\xfa; 5G; fibra \xf3ptica; antenas; data center; nueva sede; tiendas; infraestructura telecom; inversi\xf3n; espectro; permisos; expansi\xf3n",
    "estado": "alto",
    "observaciones": "Muy relevante para monitorear despliegue de infraestructura, oficinas, tiendas y permisos municipales asociados a telecomunicaciones. | Nivel de confianza: alto | Fuentes sugeridas: MTC; Osiptel; ProInversi\xf3n; Diario Gesti\xf3n; El Comercio; El Peruano; municipalidades; Entel Per\xfa | URLs de verificacion: https://www.entel.pe/contacto/informacion-corporativa | https://empresas.entel.pe/"
  },
  {
    "id": "REAL-030",
    "nombre_cliente": "BRICONS",
    "empresa": "",
    "rubro": "Construcci\xf3n e ingenier\xeda",
    "tipo_activo": "Oficina; obras y campamentos/instalaciones temporales de proyecto",
    "ubicacion": "Per\xfa/Lima; sedes de obra variables seg\xfan proyecto",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Bricons Per\xfa; construcci\xf3n; obra; licitaci\xf3n; infraestructura; proyecto; SEACE; terreno; licencia de edificaci\xf3n; campamento; oficinas; contrato",
    "estado": "alto",
    "observaciones": "Bricons cuenta con sucursal en Per\xfa y se presenta como constructora. Monitorear adjudicaciones, obras y proyectos nuevos. | Nivel de confianza: alto | Fuentes sugeridas: OSCE/SEACE; ProInversi\xf3n; MTC; MVCS; El Peruano; Diario Gesti\xf3n; El Comercio; municipalidades; Capeco | URLs de verificacion: https://www.bricons.com/la-empresa | https://www.universidadperu.com/empresas/bricons-saicfi-sucursal-del-peru.php"
  },
  {
    "id": "REAL-031",
    "nombre_cliente": "JINZHAO",
    "empresa": "",
    "rubro": "Miner\xeda de hierro y desarrollo de infraestructura portuaria",
    "tipo_activo": "Proyecto minero; planta/procesamiento; puerto; campamentos; oficinas",
    "ubicacion": "Arequipa (Pampa de Pongo), Ica (proyecto portuario) y oficina en Lima",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Jinzhao Mining Per\xfa; Pampa de Pongo; mineral de hierro; puerto; Ica; Arequipa; inversi\xf3n minera; concesi\xf3n; ProInversi\xf3n; EIA; permisos; infraestructura",
    "estado": "alto",
    "observaciones": "Alta relevancia para inteligencia de inversi\xf3n por su proyecto minero y portuario. Monitorear cronogramas, permisos, construcci\xf3n y contrataciones asociadas. | Nivel de confianza: alto | Fuentes sugeridas: Minem; Senace; OEFA; ProInversi\xf3n; MTC; APN; Diario Gesti\xf3n; El Comercio; El Peruano; Rumbo Minero | URLs de verificacion: https://www.jinzhaoperu.com/ | https://www.asociacionchina.net/jinzhao-mining-peru-sa/ | https://www.gob.pe/institucion/proinversion"
  },
  {
    "id": "REAL-032",
    "nombre_cliente": "EUROCAPITAL",
    "empresa": "",
    "rubro": "Servicios financieros no bancarios / factoring y confirming",
    "tipo_activo": "Oficina corporativa/comercial",
    "ubicacion": "San Isidro, Lima; red de sucursales en Per\xfa",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Eurocapital Per\xfa; factoring; confirming; financiamiento pymes; nueva oficina; sucursal; expansi\xf3n; SBS; emisiones; deuda; inversi\xf3n; arrendamiento",
    "estado": "alto",
    "observaciones": "Para inteligencia inmobiliaria, el principal indicador es expansi\xf3n/reubicaci\xf3n de oficinas o sucursales; para inteligencia comercial, crecimiento de cartera y financiamiento. | Nivel de confianza: alto | Fuentes sugeridas: SBS; SMV; Diario Gesti\xf3n; El Comercio; El Peruano; BCRP; Moody's Local; Eurocapital Per\xfa | URLs de verificacion: https://www.eurocapital.com.pe/ | https://www.sbs.gob.pe/supervisados-y-registros/registros/empresas-de-factoring-no-comprendidas-en-el-ambito-de-la-ley-general"
  },
  {
    "id": "REAL-033",
    "nombre_cliente": "CELEO",
    "empresa": "",
    "rubro": "Infraestructura energ\xe9tica: transmisi\xf3n el\xe9ctrica y energ\xedas renovables",
    "tipo_activo": "L\xedneas de transmisi\xf3n; subestaciones; instalaciones energ\xe9ticas; oficina",
    "ubicacion": "Per\xfa, m\xfaltiples regiones seg\xfan proyecto; ubicaci\xf3n contractual por confirmar",
    "distrito": "",
    "provincia": "",
    "departamento": "",
    "area": "",
    "palabras_clave": "Celeo Per\xfa; Celeo Redes; l\xednea de transmisi\xf3n; subestaci\xf3n; interconexi\xf3n Per\xfa Ecuador; ProInversi\xf3n; concesi\xf3n el\xe9ctrica; servidumbre; terrenos; energ\xeda renovable; permisos",
    "estado": "alto",
    "observaciones": "Empresa de infraestructura energ\xe9tica. Para real estate/land intelligence, monitorear nuevas concesiones, servidumbres, trazos de l\xedneas y subestaciones. | Nivel de confianza: alto | Fuentes sugeridas: Minem; Osinergmin; ProInversi\xf3n; COES; Senace; OEFA; El Peruano; Diario Gesti\xf3n; El Comercio; Energiminas | URLs de verificacion: https://www.celeogroup.com/ | https://www.gob.pe/institucion/proinversion/noticias/811120-proinversion-adjudica-interconexion-electrica-peru-ecuador-a-espanola-celeo-redes/"
  }
];

(function loadRealClientData() {
  const version = "real-clientes-enriquecidos-20260819-v1";
  function applyRealData(showToast = false) {
    state.clients = realClients;
    state.signals = [];
    state.settings = { ...state.settings, realDataVersion: version, dataMode: "real" };
    filters = {};
    clientId = null;
    if (state.session) view = "clients";
    save();
    render();
    if (showToast && state.session) toast("Base real cargada", `${realClients.length} clientes reales y alertas demo removidas.`);
  }

  function stripDemoControls(html) {
    return html
      .replace('<button class="btn" data-action="simulate">Simular alerta</button>', "")
      .replace('<button class="btn wine" data-action="simulate">Simular alerta</button>', "")
      .replace(/<button class="btn wine" data-action="simulate" data-id="[^"]*">Simular alerta<\/button>/g, "")
      .replace("Restaurar demo", "Recargar base real");
  }

  if (typeof routes !== "undefined") {
    for (const routeName of ["dashboard", "alerts", "detail", "settings"]) {
      const previousRoute = routes[routeName];
      if (previousRoute) routes[routeName] = function () { return stripDemoControls(previousRoute()); };
    }
  }

  const previousAction = action;
  action = function (a, id) {
    if (a === "reset") {
      applyRealData(true);
      return;
    }
    return previousAction(a, id);
  };

  if (state.settings?.realDataVersion !== version) applyRealData(true);
})();
