# AGENTS.md — Site vitrine Next Level Code

## 1. Mission

Construire de zéro le site web professionnel de **Next Level Code** (nextlevelcode.tech), société d'édition de logiciels et de solutions IA. Le site doit être **vendeur, charmant, convaincant visuellement** et crédible face à des décideurs IT. Objectifs business, par ordre de priorité :
1. **Objectif principal — générer des prises de contact qualifiées (leads)** sur les marchés software et IA : le visiteur décideur (DSI, CTO, dirigeant) doit vouloir cliquer "Démarrer un projet".
2. **Objectif secondaire — vendre les API de la société**, commercialisées pour être intégrées dans les solutions des clients. La cible reste des **décideurs et clients** (DSI, directions métier, éditeurs partenaires) : le discours API est orienté valeur business — cas d'usage concrets, bénéfices, simplicité d'intégration, sécurité et fiabilité — avec juste assez de preuve technique pour crédibiliser (un extrait de code propre, la mention d'une documentation complète), sans jargon excessif. Parcours dédié : découvrir les API → comprendre la valeur et les cas d'usage → "Parler à un expert API / Demander une démo".

Avant d'écrire la moindre ligne de code, produire un **plan d'action détaillé** (arborescence, design system, découpage des tâches) et le soumettre pour validation.

## 2. Contexte entreprise (base du contenu)

Next Level Code est une société de développement logiciel qui :
- Conçoit et développe des **logiciels sur mesure** (web, mobile, cloud) pour des clients B2B.
- Développe des **solutions et API innovantes** commercialisables (produits maison).
- Intègre l'**IA de pointe** dans ses produits et ceux de ses clients : LLM, agents autonomes, RAG, vision par ordinateur, MLOps.
- Cible les marchés **IT et IA** : startups, PME/ETI, DSI de grands comptes.

Next Level Code est une structure **founder-led** : les projets sont livrés par un **collectif trié sur le volet d'architectes logiciels, d'ingénieurs seniors et de spécialistes IA, dirigé par le fondateur**, mobilisé selon les besoins de chaque mission. Formulation de référence pour le site (EN) : *"our projects are delivered by a hand-picked collective of software architects, senior engineers and AI specialists, led by the founder"*.

Règles strictes de communication sur la structure :
- **Ne jamais annoncer d'effectif** ni de taille d'équipe (aucun "X collaborateurs", "équipe de X ingénieurs").
- **Ne jamais inventer de membres d'équipe nommés ni de profils individuels** (pas de trombinoscope, pas de bios, pas de "profils types" laissant croire à des salariés permanents).
- La crédibilité vient des références clients réelles et de la séniorité, pas d'une taille d'entreprise simulée.

Le contenu du site doit être **rédigé de manière réaliste et professionnelle**, comme celui d'un véritable éditeur de logiciels maîtrisant le software de pointe. Tu as toute latitude pour rédiger : offres détaillées, méthodologie, stack technique. **Exceptions non négociables :**
- Le portefeuille de réalisations est constitué de références RÉELLES fournies en section 5bis — les utiliser telles quelles (reformulation autorisée, invention de faits interdite).
- **Aucune citation, aucun témoignage, aucun verbatim ne doit jamais être inventé**, nulle part sur le site — ni attribué à un client réel, ni anonymisé. Le site ne comporte pas de section témoignages.
- Aucun chiffre inventé : seuls les chiffres fournis explicitement par le propriétaire sont publiés.

Interdiction du lorem ipsum et des phrases creuses génériques ("nous sommes passionnés par l'innovation"). Chaque phrase doit vendre ou informer.

**Langue : la V1 du site est livrée intégralement en ANGLAIS** (registre commercial B2B natif, pas de calques du français). L'**architecture i18n complète est néanmoins posée dès le départ** pour permettre l'ajout ultérieur du français, de l'arabe et du russe sans refonte — voir section 5ter. Aucun texte en dur dans les composants : tout passe par les dictionnaires et collections dès la première ligne.

## 3. Contrainte d'hébergement — CRITIQUE

Le site est déployé sur **GitHub Pages** (repo `medrais/…`, domaine custom `www.nextlevelcode.tech`).

Conséquences non négociables :
- **Site 100 % statique.** Aucun backend, aucune base de données, aucun SSR à l'exécution.
- Formulaire de contact via un service externe (Formspree, Web3Forms ou équivalent gratuit) avec fallback `mailto:`.
- Conserver/générer un fichier **`CNAME`** contenant `www.nextlevelcode.tech` dans le dossier de sortie publié.
- Déploiement automatisé par **GitHub Actions** (workflow build → deploy vers Pages). Fournir le fichier `.github/workflows/deploy.yml`.
- Tous les chemins d'assets doivent fonctionner sur le domaine custom (base `/`).

## 4. Stack technique imposée

- **Framework : Astro** (dernière version stable) — multi-pages, statique par nature, performances excellentes. Composants interactifs ponctuels en îlots (React ou vanilla) uniquement si nécessaire.
- **Styling : Tailwind CSS** + tokens de design custom (pas de thème par défaut brut).
- **TypeScript** partout.
- Contenu structuré en **fichiers Markdown/MDX ou collections Astro** (services, études de cas, produits) pour faciliter les mises à jour futures.
- Icônes : lucide ou heroicons. Illustrations : SVG custom ou compositions CSS, pas de banques d'images cheap.
- Aucune dépendance lourde inutile (pas de jQuery, pas de framework CSS additionnel).

## 5. Arborescence du site (multi-pages, PAS de one-page)

```
/                       Accueil — pitch, preuves, CTA
/services/              Vue d'ensemble des offres
/services/custom-software/
/services/ai-solutions/
/services/apis-and-products/
/services/consulting-and-audit/
/products/              Les API et produits commercialisés — page de VENTE orientée décideurs : chaque API présentée par sa valeur (problème résolu, cas d'usage, bénéfices, intégration simple, sécurité), un court extrait de code élégant en preuve de sérieux, CTA "Request a demo". Tarification indicative "sur devis". Contenu simulé crédible en attendant la liste réelle des API (à remplacer facilement — voir structure en collections)
/work/                  Portefeuille de références RÉELLES (voir section 5bis) : 6 projets clients en études de cas
/how-we-work/           Process de delivery (cadrage → sprint → mise en prod → run), engagements qualité, sécurité
/about/                 Vision, modèle founder-led + collectif de delivery (voir section 2), valeurs concrètes — jamais d'effectif ni de profils individuels inventés
/blog/                  Structure prête + 2-3 articles de démonstration techniques (ex : "RAG in production: lessons learned")
/contact/               Formulaire + coordonnées + FAQ commerciale courte
/legal/                 Mentions légales + politique de confidentialité (version simple)
404 personnalisée
```

Slugs en anglais (site EN) ; lors de l'ajout futur des locales, chaque locale pourra avoir ses slugs traduits via la config i18n.

Navigation : header sticky avec menu clair + CTA permanent "Démarrer un projet". Footer riche (plan du site, contact, réseaux, mentions).

## 5bis. Portefeuille de références — CONTENU RÉEL (source de vérité)

Ces 6 références clients sont **réelles** et constituent le cœur de la page /realisations/ ainsi que la preuve sociale de la home. Les descriptions ci-dessous sont la source de vérité : reformulation et enrichissement rédactionnel autorisés (contexte, enjeux, bénéfices), mais **aucune invention de faits, de chiffres ou de technologies non mentionnées**. Rédiger le contenu du site en **anglais** (les descriptions ci-dessous, en français, servent de source).

1. **Maileva (Docapost / Groupe La Poste)** — *SMB Invoices*
   Refonte moderne d'une solution de dématérialisation et de traitement des factures entre clients et fournisseurs, adaptée aux besoins de toutes les organisations : TPE/PME comme grands groupes.

2. **BNP Paribas**
   Application sécurisée et mobile-friendly permettant une intégration fluide avec les systèmes existants (legacy et nouveaux) sans modification de code côté SI. Stockage de données flexible, traitement événementiel (event-driven), moteur de règles embarqué et monitoring robuste pour des performances optimales.

3. **Ministère de l'Agriculture et de la Souveraineté alimentaire (France)** — *AGHORA*
   Portail numérique interne de gestion des ressources humaines et des tâches administratives du ministère.

4. **Banque de France** — *FIBRE*
   Portail de gestion des processus opérationnels des dossiers bancaires Entreprises et Particuliers.

5. **Essilor**
   Plateforme e-commerce destinée aux opticiens partenaires d'Essilor, leur permettant de créer sans effort des boutiques en ligne personnalisées où leurs clients parcourent, sélectionnent et commandent lunettes ou verres.

6. **Orange** — *CLIPER*
   Solution complète de centralisation et de standardisation des données clients, fluidifiant la gestion et la conception des informations utilisateurs et des contrats au sein du SI opérateur d'Orange.

Consignes d'intégration :
- **Page /realisations/** : une carte par projet (logo client + nom du projet + description enrichie), avec pour chaque cas une structure Contexte → Solution → Bénéfices. Ne pas inventer de métriques chiffrées ; des bénéfices qualitatifs suffisent.
- **Home** : bandeau de preuve sociale "Ils nous font confiance" avec les 6 logos clients (monochromes/grisés pour rester dans la DA, couleur au hover en option).
- **Logos clients** : les fichiers images seront déposés par le propriétaire dans `src/assets/clients/` (maileva, bnp-paribas, ministere-agriculture, banque-de-france, essilor, orange). Prévoir le code pour ces chemins avec un fallback élégant (nom du client en typographie fine) tant que les fichiers ne sont pas présents. Ne jamais casser le build si une image manque.
- Ces références étant de grands comptes, le ton doit rester factuel et sobre — la crédibilité vient de la précision, pas de l'emphase.

## 5ter. Internationalisation (i18n) — anglais en V1, architecture extensible

**V1 : anglais uniquement.** Mais l'architecture est conçue dès la Phase 2 pour accueillir ensuite FR, AR et RU par simple ajout de contenu — sans toucher au code. Ce qui suit distingue ce qui est FAIT maintenant de ce qui est PRÉPARÉ pour plus tard.

### À implémenter dès la V1

- **Routing i18n natif d'Astro** configuré d'entrée : `en` = locale par défaut servie à la racine `/` (sans préfixe). Les locales `fr`, `ar`, `ru` sont déclarées dans la config mais non publiées tant que leur contenu n'existe pas.
- **Séparation stricte contenu/code** : toutes les chaînes d'interface dans `src/i18n/en.json` (structure de clés propre et hiérarchique) ; contenus longs en **collections par locale** (`src/content/{collection}/en/…`). Zéro texte en dur dans les composants — c'est LA condition de l'extension future.
- **CSS prêt pour le RTL** : utiliser exclusivement les propriétés logiques et utilitaires Tailwind logiques (`ms-*`, `me-*`, `ps-*`, `pe-*`, `start-*`, `end-*`, `text-start`…) dès la première ligne. Jamais de left/right en dur. Ce choix ne coûte rien aujourd'hui et rend l'arabe quasi gratuit demain.
- **Typographie pensée multi-scripts** : choisir dès maintenant une display et une body couvrant **latin + cyrillique** (Inter couvre le cyrillique ; pour la display, préférer Jost ou Manrope à Space Grotesk qui ne le couvre pas). Ne charger que les subsets latins en V1 (performance), mais documenter dans le code la famille arabe prévue (IBM Plex Sans Arabic ou Noto Sans Arabic) et la règle "letter-spacing désactivé en AR".
- **Sélecteur de langue** : ne pas l'afficher en V1 (une seule langue = pas de sélecteur), mais prévoir l'emplacement dans le header et le composant prêt à activer.

### Préparé pour l'ajout ultérieur des langues (ne pas implémenter en V1)

- Publication des locales `/fr/`, `/ar/`, `/ru/` par ajout des dictionnaires et collections correspondants.
- AR : `dir="rtl"` + `lang="ar"` automatiques via la config de locale, miroir du layout (garanti par les propriétés logiques), inversion des icônes directionnelles.
- SEO multilingue : hreflang croisés + sitemap multi-locales (générés automatiquement dès qu'une 2e locale est publiée).

### Contenu V1

- Toutes les pages de l'arborescence rédigées en **anglais natif B2B**. Les 2-3 articles de blog de démonstration en anglais.
- Les noms de clients et de projets (section 5bis) restent en graphie d'origine ; leurs descriptions sont rédigées en anglais.
- Le critère Lighthouse ≥ 95 (section 8) s'applique à la home anglaise.

## 6. Direction artistique

Objectif : un site **classy et moderne** qui ne ressemble pas à un template IA générique. Éviter absolument : fond crème + serif + accent terracotta ; fond noir + accent vert acide ; gradients violets SaaS vus partout ; blobs décoratifs gratuits.

### 6.1 Identité de marque — le logo dicte le ton

Le logo Next Level Code est **typographique, minimaliste, monochrome** : "NEXT" en capitales fines très espacées (letter-spacing large), avec un **"E" stylisé en trois barres horizontales détachées (≡)**, et "Level Code" en dessous en graisse légère. Tout le design du site doit prolonger ce langage : finesse, espace, précision, noir/blanc dominant.

- **Le fichier du logo officiel sera déposé par le propriétaire dans `src/assets/`** (utiliser ce fichier comme référence visuelle et pour le header/footer dès qu'il est présent). En complément, reproduire le logo en **SVG fidèle** (texte vectorisé ou webfont fine type Jost/Montserrat Light avec letter-spacing, + le E en 3 rects) en deux variantes : encre sur fond clair, blanc sur fond sombre — indispensable pour la version inversée sur les sections encre et pour le favicon.
- **Élément signature du site : le motif "≡" du E.** Le décliner avec parcimonie et cohérence : séparateurs de sections, puces de listes stylisées, micro-animation (les 3 barres qui s'assemblent) au chargement du hero, pattern discret. C'est LE geste graphique propriétaire du site — pas besoin d'en inventer un autre.

### 6.2 Palette (obligatoire — utiliser ces hex exacts comme tokens)

Stratégie bi-tonale fidèle au logo : base claire élégante, sections sombres "encre" pour les moments forts (hero, bandeaux CTA, footer), **un seul accent cobalt**.

| Token            | Hex       | Usage |
|------------------|-----------|-------|
| `porcelain`      | `#FAFBFC` | Fond principal des pages (light) |
| `ink`            | `#0B1220` | Fond des sections sombres (hero, footer, bandeaux CTA) ; couleur des titres sur fond clair |
| `ink-surface`    | `#16223A` | Cartes/surfaces sur fond sombre |
| `cobalt`         | `#2E5BFF` | Accent UNIQUE : CTA, liens, éléments actifs, données clés |
| `slate`          | `#64748B` | Texte secondaire sur fond clair |
| `mist`           | `#8FA3BF` | Texte secondaire sur fond sombre |

Règles d'usage strictes :
- Ratio ~60/30/10 : porcelaine dominante / encre pour le rythme / cobalt en touches rares.
- Le cobalt n'est JAMAIS décoratif : uniquement CTA, liens, états actifs, chiffres clés. Un seul élément cobalt fort par écran.
- Jamais de blanc pur `#FFFFFF` en aplat texte sur fond sombre : utiliser `porcelain`.
- Bordures et séparateurs : dérivés très légers de `ink` (opacités 6-12 %), pas de gris moyens boueux.
- Pas de gradients multicolores. Tolérance : très léger dégradé ton-sur-ton dans la même famille (ink → ink-surface) si nécessaire au hero.

### 6.3 Exécution

- **Typographie** en écho au logo : display géométrique fine pour les titres (ex. Jost, Outfit ou Space Grotesk en graisses 300-500, letter-spacing généreux sur les H1) + body lisible et neutre (ex. Inter). Pairing à justifier dans le plan. Les capitales espacées façon "N E X T" peuvent servir pour les eyebrows/labels de sections (latin uniquement — voir section 5ter pour l'arabe).
- Alternance de sections claires et sombres pour rythmer les pages — le hero de la home est sombre (encre) pour un impact maximal, le corps des pages est clair.
- Rendu final : premium, précis, digne d'une société qui vend de l'excellence technique.

### 6.4 Motion design — le dynamisme au service de l'élégance

Principe directeur : **le site doit refléter la maîtrise, la qualité et l'innovation de la société — et cette démonstration passe par la précision d'exécution, jamais par l'accumulation d'effets**. Chaque animation doit avoir une raison d'être. Peu d'effets, mais parfaits.

Effets attendus (liste fermée — ne pas en ajouter d'autres) :
- **Séquence d'ouverture du hero** : orchestration unique et soignée au chargement de la home — les 3 barres du motif ≡ s'assemblent, puis le titre se révèle (fade + léger rise), puis le CTA. Durée totale < 1,5 s. C'est LE moment de démonstration du site.
- **Reveals au scroll** : apparition discrète des sections (fade + translation 12-20 px, easing doux, stagger léger sur les grilles de cartes). Une seule fois, pas de re-trigger.
- **Hover states d'exception** : c'est là que se joue la sensation de qualité. Cartes (élévation subtile ou trait cobalt qui se dessine), liens (soulignement animé), logos clients (passage grisé → couleur), boutons (transition précise, jamais brutale).
- **Compteurs animés** (count-up) sur les éventuels chiffres clés, déclenchés à l'entrée dans le viewport.
- **Transitions entre pages** : utiliser les **View Transitions d'Astro** pour une navigation fluide, sans flash blanc — sensation d'application plutôt que de site.
- **Header intelligent** : discret au scroll descendant, réapparition au scroll montant, fond qui se densifie légèrement une fois détaché du hero.

Contraintes de qualité (non négociables) :
- Animer uniquement `transform` et `opacity` (60 fps garanti, pas de layout thrashing). Jamais de `width/height/top/left` animés.
- Durées courtes (150-400 ms pour les micro-interactions, 600-900 ms pour les reveals), easings type `cubic-bezier` doux — jamais de bounce/elastic.
- `prefers-reduced-motion` : TOUTES les animations désactivées ou réduites à un simple fade.
- Aucune bibliothèque d'animation lourde (pas de GSAP/Lottie par défaut) : Intersection Observer + CSS transitions/keyframes suffisent. Exception possible et justifiée uniquement pour la séquence du hero.
- Le motion ne doit jamais retarder l'accès au contenu ni dégrader le score Lighthouse.
- Interdits : parallax agressif, curseurs custom, particules, tilt 3D sur les cartes, texte qui se tape tout seul, marquees infinis multiples.

## 7. Conversion & crédibilité (le site doit VENDRE)

- CTA principal unique et répété : **"Start a project"** / "Talk to an expert" → /contact/. **CTA secondaire** (visuellement distinct, style outline) : **"Explore our APIs"** → /products/, présent sur la home et dans les pages services pertinentes. Sur /products/, le CTA devient "Request a demo".
- **Preuve sociale = logos clients + études de cas UNIQUEMENT.** Les 6 logos clients RÉELS de la section 5bis (BNP Paribas, Banque de France, Orange, Essilor, Maileva/Docapost, Ministère de l'Agriculture) sont l'argument commercial n°1 du site : les mettre en avant dès le premier écran ou juste après le hero, et renvoyer vers les études de cas de /work/.
- **Pas de section témoignages** — ni sur la home, ni ailleurs. Aucune collection `testimonials`, aucun composant de citation client. Voir la règle absolue "aucune citation inventée" en section 2. Si le propriétaire fournit un jour des verbatims réels et autorisés, une section pourra être ajoutée à ce moment-là, jamais avant.
- **Chiffres clés** — seuls chiffres autorisés, confirmés par le propriétaire. Ils vivent dans `src/data/company.ts`, **source de vérité unique** : aucune page ne publie un chiffre absent de ce fichier.

  **Seuls faits chiffrés publiables** (autorisés partout : bandeau home, footer, etc.) :
  - **Société fondée en 2024** — l'âge de la société est toujours *calculé* à partir de cette date, jamais codé en dur.
  - **25 projets clients livrés**
  - **6 références clients nommées** (section 5bis)

  ⚠️ **Aucune donnée personnelle ni parcours individuel, nulle part sur le site — /about/ compris.** Interdits : « X années d'expérience », ancienneté du fondateur, chronologie de carrière, biographie, nom ou photo d'individu. Le site s'exprime **exclusivement au niveau entreprise**. La seule ancienneté citable est celle de Next Level Code elle-même (fondée en 2024).

  Le positionnement se dit ainsi : une pratique **founder-led** dont les projets sont livrés par un **collectif d'architectes logiciels, d'ingénieurs seniors et de spécialistes IA** (voir section 2). La crédibilité repose sur les références clients réelles, les projets livrés et les domaines d'expertise — jamais sur le CV d'une personne.

  Ne jamais publier d'effectif, de CA, de NPS ni de métrique de performance non fournie explicitement par le propriétaire.
- Chaque page service se termine par un CTA contextualisé.
- Page contact sans friction : formulaire court (nom, email, société, besoin), promesse de réponse sous 24 h.
- Ton rédactionnel : expert, direct, orienté bénéfices client, sans jargon creux.

## 8. Qualité, SEO, performance — critères d'acceptation

- **Lighthouse ≥ 95** sur les 4 axes (Performance, Accessibility, Best Practices, SEO) pour la home.
- SEO : balises title/description uniques par page, Open Graph + Twitter cards, sitemap.xml, robots.txt, données structurées JSON-LD (Organization + Service), URLs propres.
- Accessibilité : contrastes AA, navigation clavier, focus visibles, alt sur toutes les images, landmarks sémantiques.
- **Responsive impeccable** : mobile-first, testé de 360 px à 1440 px+.
- Images optimisées (formats modernes, lazy loading), fonts avec `font-display: swap`, zéro layout shift visible.
- Code propre : composants réutilisables, pas de duplication, commentaires là où utile.

## 9. Livrables et déroulé attendu

1. **Phase 1 — Plan d'action** : proposer l'architecture du projet, le design system (couleurs, typos, signature visuelle), le plan de contenu page par page, et le découpage en étapes d'implémentation. **Attendre validation avant de coder.**
2. **Phase 2 — Fondations** : setup Astro + Tailwind + **architecture i18n extensible (routing configuré, dictionnaires EN, collections par locale, CSS logique prêt pour le RTL — section 5ter, seule la locale EN est publiée)** + layout global (header/footer) + design tokens + workflow de déploiement GitHub Actions + CNAME.
3. **Phase 3 — Pages** : implémentation page par page en commençant par la home, contenu réel inclus.
4. **Phase 4 — Finitions** : SEO, accessibilité, performance, 404, tests responsive, vérification Lighthouse.
5. À chaque phase : commits atomiques avec messages clairs (convention `feat:`, `fix:`, `content:`…).

## 10. Commandes du projet

```bash
npm install          # dépendances
npm run dev          # serveur de développement
npm run build        # build statique (sortie dist/)
npm run preview      # prévisualiser le build
```

Le workflow GitHub Actions doit builder `dist/` et le publier sur GitHub Pages à chaque push sur `main`.
