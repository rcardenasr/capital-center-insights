if (typeof aliases !== "undefined") {
  aliases.rubro = ["rubro", "rubroprobable", "sector", "industria", "actividad", "giro"];
  aliases.tipo_activo = ["tipoactivo", "tipoactivoprobable", "activo", "tipoinmueble", "tipopredio"];
  aliases.ubicacion = ["ubicacion", "ubicacionprobable", "direccion", "zona", "localidad"];
  aliases.palabras_clave = ["palabrasclave", "palabrasclaveparamonitoreo", "keywords", "tags", "intereses"];
  aliases.estado = ["estado", "nivelconfianza", "confianza", "situacion", "status"];
}

if (typeof doImport !== "undefined") {
  doImport = function () {
    const contractHeader = headers.find((x) => ["ncontrato", "contrato", "codigocontrato", "numerocontrato"].includes(key(x)));
    const sourceHeader = headers.find((x) => ["fuentessugeridasparabuscarnoticias", "fuentes", "fuentessugeridas"].includes(key(x)));
    const urlHeader = headers.find((x) => ["fuentesverificacionurls", "urls", "url"].includes(key(x)));
    const confidenceHeader = headers.find((x) => ["nivelconfianza", "confianza"].includes(key(x)));
    let created = 0, updated = 0;

    rows.forEach((r, i) => {
      const contract = contractHeader ? String(r[contractHeader] || "").trim() : "";
      const c = { id: contract || `IMP-${Date.now()}-${i}` };
      fields.forEach((f) => c[f] = mapping[f] ? r[mapping[f]] || "" : "");
      c.nombre_cliente ||= c.empresa || `Cliente importado ${i + 1}`;

      const notes = [];
      if (contract) notes.push(`Contrato: ${contract}`);
      if (c.observaciones) notes.push(c.observaciones);
      if (confidenceHeader && r[confidenceHeader]) notes.push(`Nivel de confianza: ${r[confidenceHeader]}`);
      if (sourceHeader && r[sourceHeader]) notes.push(`Fuentes sugeridas: ${r[sourceHeader]}`);
      if (urlHeader && r[urlHeader]) notes.push(`URLs de verificacion: ${r[urlHeader]}`);
      c.observaciones = notes.filter(Boolean).join(" | ");

      const existingIndex = state.clients.findIndex((x) =>
        (contract && String(x.id || "").trim() === contract) ||
        (c.nombre_cliente && key(x.nombre_cliente) === key(c.nombre_cliente))
      );
      if (existingIndex >= 0) {
        const current = state.clients[existingIndex];
        state.clients[existingIndex] = Object.fromEntries(
          ["id", ...fields].map((f) => [f, c[f] || current[f] || ""])
        );
        updated++;
      } else {
        state.clients.unshift(c);
        created++;
      }
    });

    save();
    closeModal();
    view = "clients";
    toast("Enriquecimiento completado", `${updated} actualizados, ${created} nuevos.`);
    render();
  };
}
