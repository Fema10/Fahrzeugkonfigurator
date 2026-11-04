/* =========================================================================
   3D-Ansicht (360°)
   Zwei Quellen:
   1) GLB-Modell je Produkt (aus STEP konvertiert). Jeder Merkmalswert kann über
      sein Feld "teil" einen Knotennamen im Modell schalten: Knoten, die in
      irgendeinem "teil" vorkommen, sind nur sichtbar, wenn der Wert gewählt ist.
      Materialien mit "lack" im Namen bekommen die gewählte RAL-Farbe.
   2) Ohne GLB: ein aus Parametern erzeugtes Ersatzmodell (Demo).
   ========================================================================= */
(function () {
  const K = window.KONF;
  const T = () => window.THREE;
  const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || "#888";

  /* ---------- Ersatzmodell aus Parametern ---------- */
  function mats(hex) {
    const THREE = T();
    const m = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: .55, metalness: .25, ...o });
    return {
      lack: m(hex || "#0E4C92", { roughness: .38, metalness: .35 }),
      lackHell: m(new THREE.Color(hex || "#0E4C92").lerp(new THREE.Color("#ffffff"), .25), { roughness: .4 }),
      stahl: m("#2b3036", { metalness: .55, roughness: .45 }),
      holz: m("#7b5a3a", { roughness: .92, metalness: 0 }),
      reifen: m("#17181a", { roughness: .95, metalness: 0 }),
      felge: m("#c8ced4", { metalness: .7, roughness: .3 }),
      chrom: m("#dfe4e8", { metalness: .9, roughness: .15 }),
      rot: m("#d4201a", { emissive: "#5a0000" }), orange: m("#ff8c00", { emissive: "#5a2a00" }),
      alu: m("#a9b1b8", { metalness: .7, roughness: .35 })
    };
  }
  function box(g, w, h, d, mat, x, y, z, rz) {
    const THREE = T(); const me = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    me.position.set(x, y, z); if (rz) me.rotation.z = rz; me.castShadow = true; me.receiveShadow = true; g.add(me); return me;
  }
  function zyl(g, r, l, mat, x, y, z, achse) {
    const THREE = T(); const me = new THREE.Mesh(new THREE.CylinderGeometry(r, r, l, 28), mat);
    if (achse === "z") me.rotation.x = Math.PI / 2; else if (achse === "x") me.rotation.z = Math.PI / 2;
    me.position.set(x, y, z); me.castShadow = true; g.add(me); return me;
  }
  /* Schräges Verbindungsstück von (x1,y1) nach (x2,y2) */
  function rampe(g, x1, y1, x2, y2, dicke, breite, mat) {
    const dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy);
    return box(g, l, dicke, breite, mat, (x1 + x2) / 2, (y1 + y2) / 2, 0, Math.atan2(dy, dx));
  }

  function achsen(g, M, xVorn, n, r, W, superSingle, lift, pendel) {
    for (let i = 0; i < n; i++) {
      const x = xVorn - i * 1.36, hub = (lift && i === 0) ? .16 : 0, y = r + hub;
      zyl(g, .07, W - .5, M.stahl, x, y, 0, "z");
      const seiten = superSingle ? [[W / 2 - .24, .38]] : [[W / 2 - .15, .24], [W / 2 - .42, .24]];
      for (const s of [1, -1]) for (const [z, b] of seiten) {
        zyl(g, r, b, M.reifen, x, y, s * z, "z");
        zyl(g, r * .56, b + .01, M.felge, x, y, s * z, "z");
      }
      if (pendel) for (const s of [1, -1]) zyl(g, .06, .5, M.chrom, x + .25, y + r * .4, s * (W / 2 - .7));
    }
  }

  function bauen(mo, prod, sel) {
    const THREE = T(), g = new THREE.Group();
    const E = K.E, w = (mid) => E.wert(mo, mid, sel[mid]);
    const M = mats(w("farbe")?.hex);
    const typ = prod.visual?.typ || "semi";
    const n = w("achsen")?.menge || 3;
    const r = { r175: .38, r195: .43, r225: .52 }[sel.reifen] || .42;
    const ss = sel.reifen === "r225";
    const L = { l9000: 9, l11500: 11.5, tele: 9 }[sel.ladeflaeche] || 9;
    const W = sel.breite === "b2750" ? 2.75 : 2.55;
    const zub = new Set(sel.zubehoer || []);
    const lift = zub.has("achslift"), pendel = sel.federung === "hydro";

    const seitenteile = (x1, x2, top, h) => {
      const l = x1 - x2, xm = (x1 + x2) / 2;
      box(g, l, .08, W, M.holz, xm, top - .04, 0);
      for (const s of [1, -1]) box(g, l, h, .12, M.lack, xm, top - h / 2 - .02, s * (W / 2 - .06));
      for (const s of [1, -1]) box(g, l, h * 1.4, .18, M.lack, xm, top - h * .7 - .05, s * .55);
      for (let x = x1 - .6; x > x2 + .3; x -= 1.4) box(g, .08, h * .8, W - .2, M.lack, x, top - h * .5, 0);
      if (sel.breite === "b3300") for (let x = x1 - .8; x > x2 + .4; x -= 2) for (const s of [1, -1]) box(g, .14, .1, .5, M.lackHell, x, top - .1, s * (W / 2 + .2));
      if (zub.has("rungtaschen")) for (let x = x1 - .5; x > x2 + .2; x -= 1.5) for (const s of [1, -1]) box(g, .08, 1, .08, M.stahl, x, top + .5, s * (W / 2 - .08));
      if (zub.has("led")) for (let x = x1 - 1; x > x2 + .5; x -= 2) for (const s of [1, -1]) box(g, .1, .05, .03, M.orange, x, top - h * .5, s * (W / 2 + .01));
      if (sel.ladeflaeche === "tele") { box(g, .12, .02, W - .1, M.stahl, (x1 + x2) / 2, top + .005, 0); box(g, l * .45, .22, .5, M.alu, xm - l * .2, top - h - .2, 0); }
    };
    const heck = (x, top) => {
      for (const s of [1, -1]) { box(g, .06, .12, .3, zub.has("led") ? M.rot : M.stahl, x - .03, top - .25, s * (W / 2 - .3)); }
      box(g, .1, .25, W, M.stahl, x - .05, top - .45, 0);
      if (sel.rampen && sel.rampen !== "keine") {
        const winkel = 1.15;
        for (const s of [1, -1]) {
          const piv = new THREE.Group(); piv.position.set(x, top, s * (W / 2 - .55)); piv.rotation.z = winkel;
          box(piv, 2.2, .07, .7, M.lack, 1.1, .04, 0);
          for (let i = 0; i < 6; i++) box(piv, .04, .03, .66, M.stahl, .25 + i * .35, .09, 0);
          g.add(piv);
          if (sel.rampen !== "mech") { const c = rampe(g, x + 1.4, top + .02, x + .45, top + .85, .07, .07, M.chrom); c.position.z = s * (W / 2 - .95); }
        }
        if (sel.rampen === "hydrv") box(g, .12, .12, W - .2, M.chrom, x - .02, top + .02, 0);
      }
    };
    const front = (x, top, h) => {
      box(g, .1, h, W, M.lack, x + .05, top - h / 2, 0);
      if (zub.has("winde")) box(g, .7, .55, .9, M.stahl, x - .7, top + .28, 0);
      if (zub.has("stuetz")) for (const s of [1, -1]) { zyl(g, .08, top - .25, M.chrom, x - .9, (top - .1) / 2, s * .8); box(g, .35, .05, .35, M.stahl, x - .9, .03, s * .8); }
      if (zub.has("kiste")) box(g, .6, .45, .4, M.stahl, x - 2.2, top - .55, -(W / 2 - .25));
    };

    if (typ === "nachlaeufer") {
      const lBogie = 1.2 + (n - 1) * 1.36 + 1.2, top = 1.25;
      zyl(g, .09, 5.5, M.lack, -2.75, .95, 0, "x");
      zyl(g, .07, 1.6, M.alu, -.6, .95, 0, "x");
      zyl(g, .1, .05, M.stahl, .05, .95, 0, "z");
      box(g, lBogie, .35, 1.0, M.lack, -5.5 - lBogie / 2, top - .2, 0);
      achsen(g, M, -5.5 - 1.2, n, r, W, ss, lift, false);
      const paare = { rp2: 2, rp3: 3, rp4: 4 }[sel.rungen] || 2;
      for (let i = 0; i < paare; i++) {
        const x = -5.5 - .5 - i * ((lBogie - 1) / Math.max(1, paare - 1));
        box(g, .25, .22, W, M.lack, x, top + .1, 0);
        for (const s of [1, -1]) box(g, .12, 1.8, .12, M.lack, x, top + 1.1, s * (W / 2 - .1));
      }
      if (zub.has("led")) for (const s of [1, -1]) box(g, .06, .12, .3, M.rot, -5.5 - lBogie - .03, top - .2, s * .4);
      if (zub.has("kiste")) box(g, .6, .4, .4, M.stahl, -5.5 - lBogie / 2, top - .6, .7);
    } else if (typ === "plattform") {
      const top = 1.45, h = .45, x2 = -L - 1;
      seitenteile(0, x2, top, h); front(0, top, h); heck(x2, top);
      zyl(g, .05, .2, M.stahl, -1.1, top - h - .45, 0);
      achsen(g, M, x2 + 1.3 + (n - 1) * 1.36, n, r, W, ss, lift, false);
    } else if (typ === "tiefbett") {
      const neckTop = 1.6, wellTop = .55, bogieTop = 1.3, lw = L * .72;
      const xN = -3.2, xW1 = xN - .7, xW2 = xW1 - lw, xB1 = xW2 - .7, lB = 1.4 + (n - 1) * 1.36 + 1.2, xB2 = xB1 - lB;
      seitenteile(0, xN, neckTop, .4); front(0, neckTop, .4);
      rampe(g, xN, neckTop - .2, xW1, wellTop - .1, .45, W, M.lack);
      seitenteile(xW1, xW2, wellTop, .35);
      rampe(g, xW2, wellTop - .1, xB1, bogieTop - .2, .45, W, M.lack);
      seitenteile(xB1, xB2, bogieTop, .4); heck(xB2, bogieTop);
      if (sel.hals === "abnehmbar") { box(g, .05, .5, W + .02, M.stahl, xN - .05, neckTop - .2, 0); for (const s of [1, -1]) rampe(g, -1.2, neckTop + .05, xN + .2, neckTop + .35, .1, .1, M.chrom).position.z = s * .7; }
      zyl(g, .05, .2, M.stahl, -1.1, neckTop - .65, 0);
      achsen(g, M, xB1 - 1.4, n, r, W, ss, lift, pendel);
    } else { // semi
      const neckTop = 1.55, deckTop = 1.15, xN = -3.0, xD1 = xN - .6, xD2 = xD1 - L;
      seitenteile(0, xN, neckTop, .35); front(0, neckTop, .35);
      rampe(g, xN, neckTop - .18, xD1, deckTop - .2, .4, W, M.lack);
      seitenteile(xD1, xD2, deckTop, .38); heck(xD2, deckTop);
      zyl(g, .05, .2, M.stahl, -1.0, neckTop - .55, 0);
      achsen(g, M, xD2 + 1.3 + (n - 1) * 1.36, n, r, W, ss, lift, pendel);
    }
    return g;
  }

  /* ---------- GLB ---------- */
  const glbCache = {};
  function ladeGlb(asset) {
    if (glbCache[asset]) return glbCache[asset];
    // "asset" ist entweder eine URL zur .glb-Datei (APplus/Webserver) oder eine Ablage-ID des Prototyps.
    // Im Prototyp liegt die Datei als JSON-Hülle { name, glb: Base64 }, weil GLB dort kein zugelassener Dateityp ist.
    const istUrl = /^(https?:)?\/\/|^\/(?!_blob)|\.glb(\?|$)/i.test(asset);
    return glbCache[asset] = K.lib("gltfloader").then(() => istUrl
      ? fetch(asset, { credentials: "same-origin" }).then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return r.arrayBuffer(); })
      : fetch("/_blob/" + asset).then(r => r.json()).then(j => { const bin = atob(j.glb), buf = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i); return buf.buffer; })
    ).then(buf => new Promise((ok, nein) => new (T().GLTFLoader)().parse(buf, "", gl => ok(gl.scene), nein)))
     .catch(e => { delete glbCache[asset]; throw e; });
  }
  function glbAnwenden(szene, mo, sel) {
    const alle = new Set(), an = new Set();
    for (const m of mo.merkmale) for (const w of m.werte) if (w.teil) {
      for (const t of String(w.teil).split(",").map(s => s.trim()).filter(Boolean)) {
        alle.add(t);
        if (K.E.aktiv(sel, m, w)) an.add(t);
      }
    }
    const hex = K.E.wert(mo, "farbe", sel.farbe)?.hex;
    szene.traverse(o => {
      if (alle.has(o.name)) o.visible = an.has(o.name);
      if (o.isMesh) { o.castShadow = true; const ms = [].concat(o.material); for (const m of ms) if (hex && /lack/i.test(m.name || "")) m.color.set(hex); }
    });
  }
  K.glbKnoten = async asset => { const s = await ladeGlb(asset); const l = []; s.traverse(o => { if (o.name && o !== s) l.push(o.name); }); return l; };

  /* ---------- Viewer ---------- */
  class Viewer {
    constructor() {
      this.el = document.createElement("div"); this.el.className = "v3d"; this.ok = false;
      const THREE = T();
      if (!THREE) { this.el.innerHTML = `<div class="v3d-leer">Die 3D-Ansicht konnte nicht geladen werden.</div>`; return; }
      try { this.r = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); }
      catch (e) { this.el.innerHTML = `<div class="v3d-leer">Dieses Gerät unterstützt keine 3D-Darstellung.</div>`; return; }
      this.ok = true;
      const r = this.r; r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.outputEncoding = THREE.sRGBEncoding; r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
      this.el.appendChild(r.domElement);
      const sc = this.scene = new THREE.Scene();
      this.cam = new THREE.PerspectiveCamera(30, 1.6, .1, 300);
      sc.add(new THREE.HemisphereLight(0xffffff, 0x3a4048, .8));
      const d = new THREE.DirectionalLight(0xffffff, .95); d.position.set(9, 16, 11); d.castShadow = true;
      Object.assign(d.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 60 }); d.shadow.camera.updateProjectionMatrix(); d.shadow.mapSize.set(2048, 2048); sc.add(d);
      const d2 = new THREE.DirectionalLight(0xffffff, .3); d2.position.set(-10, 6, -8); sc.add(d2);
      const boden = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.ShadowMaterial({ opacity: .22 })); boden.rotation.x = -Math.PI / 2; boden.receiveShadow = true; sc.add(boden);
      this.gitter();
      this.rotY = -.8; this.rotX = .3; this.dist = 24; this.ziel = new THREE.Vector3(0, 1, 0); this.auto = false; this.need = true;
      this.el.insertAdjacentHTML("beforeend", `<div class="v3d-knoepfe">
        <button type="button" data-v="auto" aria-pressed="false" title="Automatisch drehen">360°</button>
        <button type="button" data-v="seite">Seite</button><button type="button" data-v="heck">Heck</button><button type="button" data-v="schraeg">3/4</button>
        <button type="button" data-v="rein" aria-label="Näher">+</button><button type="button" data-v="raus" aria-label="Weiter weg">−</button></div>
        <div class="v3d-tipp">Ziehen zum Drehen</div><div class="v3d-status" hidden></div>`);
      this.el.querySelector(".v3d-knoepfe").addEventListener("click", e => {
        const b = e.target.closest("[data-v]"); if (!b) return; const v = b.dataset.v;
        if (v === "auto") { this.auto = !this.auto; b.setAttribute("aria-pressed", this.auto); }
        if (v === "seite") { this.rotY = -Math.PI / 2 + .001; this.rotX = .12; }
        if (v === "heck") { this.rotY = -Math.PI + .001; this.rotX = .2; }
        if (v === "schraeg") { this.rotY = -.8; this.rotX = .3; }
        if (v === "rein") this.dist = Math.max(6, this.dist * .85);
        if (v === "raus") this.dist = Math.min(70, this.dist * 1.18);
        this.need = true;
      });
      const c = r.domElement, zeiger = new Map(); let pinch = 0;
      c.addEventListener("pointerdown", e => { c.setPointerCapture(e.pointerId); zeiger.set(e.pointerId, [e.clientX, e.clientY]); this.drag = true; this.el.classList.add("benutzt"); });
      c.addEventListener("pointermove", e => {
        if (!zeiger.has(e.pointerId)) return; const [x0, y0] = zeiger.get(e.pointerId); zeiger.set(e.pointerId, [e.clientX, e.clientY]);
        if (zeiger.size === 2) { const [a, b] = [...zeiger.values()]; const dd = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch) this.dist = Math.min(70, Math.max(6, this.dist * pinch / dd)); pinch = dd; }
        else { this.rotY -= (e.clientX - x0) * .008; this.rotX = Math.min(1.25, Math.max(.04, this.rotX + (e.clientY - y0) * .006)); }
        this.need = true;
      });
      const ende = e => { zeiger.delete(e.pointerId); pinch = 0; if (!zeiger.size) this.drag = false; };
      c.addEventListener("pointerup", ende); c.addEventListener("pointercancel", ende);
      c.addEventListener("wheel", e => { e.preventDefault(); this.dist = Math.min(70, Math.max(6, this.dist * (1 + e.deltaY * .001))); this.need = true; }, { passive: false });
      new ResizeObserver(() => this.groesse()).observe(this.el);
      const loop = () => {
        requestAnimationFrame(loop);
        if (!this.el.isConnected) return;
        if (this.auto && !this.drag) { this.rotY += .005; this.need = true; }
        if (this.need) { this.need = false; this.kamera(); r.render(sc, this.cam); }
      };
      requestAnimationFrame(loop);
    }
    groesse() {
      if (!this.ok) return; const b = this.el.clientWidth, h = this.el.clientHeight; if (!b || !h) return;
      this.r.setSize(b, h, false); this.cam.aspect = b / h; this.cam.updateProjectionMatrix(); this.need = true;
    }
    kamera() {
      const c = this.cam, z = this.ziel, d = this.dist;
      c.position.set(z.x + d * Math.cos(this.rotX) * Math.sin(this.rotY), z.y + d * Math.sin(this.rotX), z.z + d * Math.cos(this.rotX) * Math.cos(this.rotY));
      c.lookAt(z);
    }
    _setze(g) {
      const THREE = T();
      if (this.gruppe) { this.scene.remove(this.gruppe); this.gruppe.traverse(o => { if (o.geometry && !o.userData.glb) o.geometry.dispose(); }); }
      const b = new THREE.Box3().setFromObject(g), c = b.getCenter(new THREE.Vector3()), s = b.getSize(new THREE.Vector3());
      g.position.x -= c.x; g.position.z -= c.z; g.position.y -= b.min.y;
      this.gruppe = g; this.scene.add(g);
      this.ziel.set(0, s.y * .45, 0); this.dist = Math.max(14, Math.max(s.x, s.z) * 1.55);
      this.gitter();
      this.need = true;
    }
    gitter() {
      // Bodenraster in der Linienfarbe des aktuellen Themas
      const THREE = T(), gc = cssVar("--line");
      if (this.grid && this.gridFarbe === gc) return;
      if (this.grid) { this.scene.remove(this.grid); this.grid.geometry.dispose(); }
      this.grid = new THREE.GridHelper(40, 40, gc, gc); this.grid.material.transparent = true; this.grid.material.opacity = .5;
      this.gridFarbe = gc; this.scene.add(this.grid);
    }
    status(t) { const el = this.el.querySelector(".v3d-status"); if (!el) return; el.hidden = !t; el.textContent = t || ""; }
    async zeige(mo, prod, sel) {
      if (!this.ok || !prod) return;
      const key = prod.id + "|" + (prod.visual?.asset || "") + "|" + JSON.stringify(sel);
      if (key === this.key) return; this.key = key;
      const asset = prod.visual?.asset;
      if (asset) {
        this.status("3D-Modell wird geladen …");
        try {
          const s = (await ladeGlb(asset)).clone(true); s.traverse(o => o.userData.glb = true);
          if (this.key !== key) return;
          glbAnwenden(s, mo, sel); const g = new (T().Group)(); g.add(s); this._setze(g); this.status("");
          return;
        } catch (e) { this.status("GLB nicht ladbar, Ersatzmodell wird gezeigt"); }
      }
      try { this._setze(bauen(mo, prod, sel)); }
      catch (e) { console.error(e); this.status("3D-Modell konnte nicht erzeugt werden"); }
    }
    /** Standbild für PDF (PNG data URL) */
    async bild(mo, prod, sel, w = 1400, h = 760) {
      if (!this.ok) return null;
      await this.zeige(mo, prod, sel);
      const alt = { rotY: this.rotY, rotX: this.rotX }; this.rotY = -.8; this.rotX = .28;
      this.r.setSize(w, h, false); this.cam.aspect = w / h; this.cam.updateProjectionMatrix(); this.kamera();
      this.r.render(this.scene, this.cam);
      const url = this.r.domElement.toDataURL("image/png");
      Object.assign(this, alt); this.groesse();
      return url;
    }
  }

  K._bauen = bauen; // für Tests

  /** Aktuelle 3D-Szene als GLB, verpackt in ZIP (GLB ist als Download-Typ nicht zugelassen) */
  K.export3d = async name => {
    try { await K.lib("gltfexporter", "jszip"); } catch (e) { return null; }
    const THREE = T(), v = haupt;
    if (!THREE || !THREE.GLTFExporter || !window.JSZip || !v || !v.gruppe) return null;
    const glb = await new Promise((ok, nein) => new THREE.GLTFExporter().parse(v.gruppe, ok, { binary: true }));
    const zip = new window.JSZip(); zip.file(name + ".glb", glb);
    zip.file("LIESMICH.txt", "3D-Szene aus dem Fahrzeugkonfigurator im GLB-Format (glTF 2.0).\nÖffnen z. B. mit Windows 3D-Viewer, Blender oder https://gltf-viewer.donmccurdy.com\n");
    return zip.generateAsync({ type: "blob" });
  };
  let haupt = null;
  K.viewer = () => (haupt && (haupt.ok || !T())) ? haupt : (haupt = new Viewer());
  K.viewerBereit = async () => { try { await K.lib("three"); } catch (e) {} return K.viewer(); };
  /** Viewer in einen Platzhalter <div data-viewer> einhängen; three.js wird bei Bedarf nachgeladen */
  K.viewerEinhaengen = (platz, mo, prod, sel) => {
    if (!T()) {
      platz.innerHTML = `<div class="v3d-leer">3D-Ansicht wird geladen …</div>`;
      K.lib("three").then(() => { if (platz.isConnected) { platz.innerHTML = ""; K.viewerEinhaengen(platz, mo, prod, sel); } })
        .catch(() => { if (!platz.isConnected) return; platz.innerHTML = `<div class="v3d-leer v3d-ersatz">${K.silhouette ? K.silhouette(prod?.visual?.typ, "var(--muted)") : ""}<span class="klein">Keine 3D-Ansicht verfügbar</span></div>`; platz.closest(".ansicht")?.classList.add("ohne3d"); });
      return null;
    }
    const v = K.viewer(); platz.appendChild(v.el); v.groesse(); v.zeige(mo, prod, sel); return v;
  };
})();
