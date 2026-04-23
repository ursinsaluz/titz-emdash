import { execSync } from 'child_process';
import fs from 'fs';

const URL = process.env.EMDASH_URL;
const TOKEN = process.env.EMDASH_TOKEN;

if (!URL || !TOKEN) {
  console.error("Please provide EMDASH_URL and EMDASH_TOKEN in your environment (e.g., in a .env file)");
  process.exit(1);
}

const BASE_CMD = `npm exec -- emdash`;
const REMOTE_OPTS = `--url ${URL} --token ${TOKEN}`;

function run(cmd) {
  const fullCmd = `${BASE_CMD} ${cmd} ${REMOTE_OPTS}`;
  console.log(`Running: ${fullCmd}`);
  try {
    return execSync(fullCmd, { stdio: 'pipe', shell: true }).toString();
  } catch (err) {
    console.error(`Command failed: ${fullCmd}`);
    console.error(err.stdout?.toString());
    console.error(err.stderr?.toString());
  }
}

const collections = [
  {
    slug: 'pages',
    label: 'Pages',
    fields: [
      { slug: 'title', type: 'string', required: true },
      { slug: 'content', type: 'portableText' }
    ]
  },
  {
    slug: 'dishes',
    label: 'Signature Dishes',
    fields: [
      { slug: 'title', type: 'string', required: true },
      { slug: 'category', type: 'string' },
      { slug: 'description', type: 'text' },
      { slug: 'image', type: 'image' },
      { slug: 'tags', type: 'string' }
    ]
  },
  {
    slug: 'news',
    label: 'News & Press',
    fields: [
      { slug: 'title', type: 'string', required: true },
      { slug: 'publication', type: 'string' },
      { slug: 'date', type: 'string' },
      { slug: 'body', type: 'text' },
      { slug: 'tag', type: 'string' }
    ]
  },
  {
    slug: 'offers',
    label: 'Offers',
    fields: [
      { slug: 'title', type: 'string', required: true },
      { slug: 'lead', type: 'string' },
      { slug: 'body', type: 'text' },
      { slug: 'cta_text', type: 'string' },
      { slug: 'image', type: 'image' },
      { slug: 'featured', type: 'boolean' }
    ]
  },
  {
    slug: 'stations',
    label: 'CV Stations',
    fields: [
      { slug: 'title', type: 'string', required: true },
      { slug: 'year', type: 'string' },
      { slug: 'place', type: 'string' },
      { slug: 'role', type: 'string' },
      { slug: 'awards', type: 'string' },
      { slug: 'body', type: 'text' },
      { slug: 'image', type: 'image' },
      { slug: 'current', type: 'boolean' }
    ]
  },
  {
    slug: 'education',
    label: 'Education',
    fields: [
      { slug: 'title', type: 'string', required: true },
      { slug: 'year', type: 'string' },
      { slug: 'place', type: 'string' },
      { slug: 'note', type: 'text' }
    ]
  },
  {
    slug: 'qualifications',
    label: 'Qualifications',
    fields: [
      { slug: 'title', type: 'string', required: true },
      { slug: 'kind', type: 'string' },
      { slug: 'year', type: 'string' },
      { slug: 'note', type: 'text' }
    ]
  },
  {
    slug: 'hobbies',
    label: 'Hobbies',
    fields: [
      { slug: 'title', type: 'string', required: true },
      { slug: 'note', type: 'text' },
      { slug: 'image', type: 'image' },
      { slug: 'placeholder', type: 'string' }
    ]
  }
];

// 1. Create collections and fields
console.log("Creating schema...");
for (const coll of collections) {
  run(`schema create ${coll.slug} --label "${coll.label}"`);
  
  for (const field of coll.fields) {
    let reqFlag = field.required ? '--required' : '';
    run(`schema add-field ${coll.slug} ${field.slug} --type ${field.type} --label "${field.slug}" ${reqFlag}`);
  }
}

// 2. Fetch Media
console.log("Fetching media...");
const mediaRaw = execSync(`${BASE_CMD} media list --json --limit 100 ${REMOTE_OPTS}`).toString();
const mediaData = JSON.parse(mediaRaw);
const mediaMap = {};
for (const item of mediaData.items) {
  mediaMap[item.filename] = item.id;
}
console.log(`Loaded ${Object.keys(mediaMap).length} media items.`);

// Helper to convert plain text to PortableText blocks
function toPt(text) {
  return [
    {
      _type: "block",
      style: "normal",
      children: [{ _type: "span", text: text }]
    }
  ];
}

// 3. Define content
const contentData = {
  pages: [
    { slug: 'impressum', data: { title: 'Impressum', content: toPt('Impressum content here') } },
    { slug: 'datenschutz', data: { title: 'Datenschutz', content: toPt('Datenschutz content here') } },
  ],
  dishes: [
    { slug: 'dish-1', data: { category: 'signature', title: 'Milcheis mit Spekulatius', description: 'Winterliche Aromen treffen auf Finesse. Geflämmte Meringue, Apfel, Spekulatius.', tags: 'Dessert · Winter', image: { id: mediaMap['dish-1.jpg'] } } },
    { slug: 'dish-2', data: { category: 'signature', title: 'Heusuppe', description: 'Hommage an Stefan Wiesner. Getrocknetes Heu in einer samtigen Suppe. Natur pur.', tags: 'Suppe · Ganzjährig', image: { id: mediaMap['moor-1.jpg'] } } },
    { slug: 'dish-3', data: { category: 'starter', title: 'Angus Beef Tartare', description: 'Hommage an die Erde. Das Rohe des Rindes trifft auf die Textur des Selleries.', tags: 'Vorspeise', image: { id: mediaMap['dish-3.jpg'] } } },
    { slug: 'dish-4', data: { category: 'signature', title: 'Kalb mit schwarzem Trüffel', description: 'Heimat trifft Luxus. Zartes Kalb, Tiefe des Trüffels, Serviettenknödel.', tags: 'Hauptgang · Winter', image: { id: mediaMap['dish-4.jpg'] } } },
  ],
  news: [
    { slug: 'news-1', data: { date: '02.01.2026', publication: 'Falstaff', title: 'Restaurants & Beizen Guide 2026', body: 'Das Restaurant Pinot wurde von Falstaff Schweiz ausgezeichnet — für regionale Küche und die kreative Handschrift von Sebastian.', tag: 'Auszeichnung' } },
    { slug: 'news-2', data: { date: '21.10.2025', publication: 'Podcast · Was kochst du?!', title: 'Im Gespräch mit Andy Piesche & Felix Jarzina', body: 'Drei Chefs über Küche, Handwerk und den Mut zum Weglassen.', tag: 'Interview' } },
    { slug: 'news-3', data: { date: '20.08.2025', publication: 'Porträt', title: 'Mit Leidenschaft kochen', body: 'Ein Rückblick auf 20 Jahre Erfahrung in der Gourmetgastronomie und die Liebe zum Handwerk.', tag: 'Porträt' } },
    { slug: 'news-4', data: { date: '15.10.2024', publication: 'Guide Michelin', title: 'Bib Gourmand für das Restaurant Pinot', body: '„Simply brilliant." — ausgezeichnet für exzellentes Preis-Leistungs-Verhältnis.', tag: 'Auszeichnung' } },
    { slug: 'news-5', data: { date: '01.10.2024', publication: 'GaultMillau', title: '16 Punkte im Guide 2024', body: 'Wir freuen uns über 16 Punkte im neuen Guide GaultMillau und die Bestätigung unserer Arbeit.', tag: 'Auszeichnung' } },
  ],
  offers: [
    { slug: 'offer-1', data: { title: 'Beratung', lead: 'Kulinarische Konzepte für Health- & Lifestyle-Resorts.', body: 'Zwanzig Jahre Gourmetgastronomie, übersetzt in tragfähige Konzepte — vom Menü-Engineering bis zur Teamführung.', cta_text: 'Beratung anfragen', image: { id: mediaMap['pinot-18.jpg'] }, featured: false } },
    { slug: 'offer-2', data: { title: 'Catering', lead: 'Nachhaltige Sternenküche für Ihren Event.', body: 'Wir bringen exzellenten Genuss zu Ihnen — vom privaten Dinner bis zum Firmen-Anlass, stets mit regionalem Fokus.', cta_text: 'Weitere Informationen', image: { id: mediaMap['pinot-17.jpg'] }, featured: false } },
    { slug: 'offer-3', data: { title: 'Restaurant Pinot', lead: 'Rückkehr zur Intimität.', body: 'Schnörkellose Gerichte mit Wow-Effekt in der Bündner Herrschaft. Täglich 09:00 – 18:00, Do abends.', cta_text: 'Kontakt aufnehmen', image: { id: mediaMap['terrasse.jpg'] }, featured: true } },
  ],
  stations: [
    { slug: 'stat-1', data: { year: 'seit 2025', title: 'Klinik Gut & Restaurant Pinot', place: 'Fläsch, Graubünden', role: 'Küchenchef', awards: 'aktuell', body: 'Rückkehr zur Intimität. Schnörkellose Gerichte mit Wow-Effekt in der Bündner Herrschaft. Zwischen Reben, Rheintal und Alpstein.', image: { id: mediaMap['pinot-11.jpg'] }, current: true } },
    { slug: 'stat-2', data: { year: '2019 – 2025', title: 'Restaurant Verve by Sven', place: 'Grand Resort Bad Ragaz', role: 'Küchenchef · Executive Sous Chef', awards: '1★ Michelin, 15 GaultMillau, Manager of the Quarter 2022', body: 'Verantwortung für 15 GaultMillau-Punkte und einen Michelin-Stern. Konzeption und Umsetzung des Lifestyle- und Health-Konzepts. Führung von 16 Mitarbeitenden, Ausbildung von Lernenden.', image: { id: mediaMap['pinot-15.jpg'] }, current: false } },
    { slug: 'stat-3', data: { year: '2015 – 2018', title: 'Hotel Villa Honegg', place: 'Ennetbürgen', role: 'Küchenchef', awards: '14 GaultMillau', body: 'Verantwortung für 14 GaultMillau-Punkte. Führung von 12 Mitarbeitenden und Ausbildung von zwei Lernenden. Bühne mit Panorama auf den Vierwaldstättersee.', image: { id: mediaMap['pinot-10.jpg'] }, current: false } },
    { slug: 'stat-4', data: { year: '2008 – 2015', title: 'Gasthof Rössli', place: 'Escholzmatt, Entlebuch', role: 'Küchenchef bei Stefan Wiesner', awards: '1★ Michelin, 17 GaultMillau, Lehrmeister-Nomination 2013', body: 'Sieben Jahre mit dem „Hexer aus dem Entlebuch". Heusuppe, Moor, Natur pur. Führung von 6 Mitarbeitenden und drei Lernenden. Nomination „Zukunftsträger — Lehrmeister des Jahres" 2013.', image: { id: mediaMap['wiesner-1.jpg'] }, current: false } },
    { slug: 'stat-5', data: { year: '2007 – 2008', title: 'Hotel Restaurant Jörg Müller', place: 'Westerland, Sylt', role: 'Chef de Partie · Garde Manger', awards: '1★ Michelin, 18 GaultMillau', body: 'Prägende Inselzeit. Nordische Klarheit, französisches Handwerk, Meer — auf höchstem Niveau.', image: { id: mediaMap['dish-3.jpg'] }, current: false } },
    { slug: 'stat-6', data: { year: '2006 – 2007', title: 'Tschuggen Grand Hotel', place: 'Arosa', role: 'Chef de Partie Entremetier · Pasta', awards: '14 GaultMillau', body: 'Grand Restaurant & La Vetta. Alpine Grande-Hotellerie, Disziplin, Tempo.', image: { id: mediaMap['dish-2.jpg'] }, current: false } },
    { slug: 'stat-7', data: { year: '2006', title: 'Le Club by Armin Amrein', place: 'Bürgenstock Resorts', role: 'Demi-Chef Saucier', awards: '17 GaultMillau', body: 'Saucenwerkstatt in einer der präzisesten Küchen der Schweiz.', image: { id: mediaMap['dish-1.jpg'] }, current: false } },
    { slug: 'stat-8', data: { year: '2005 – 2006', title: 'Tschuggen Grand Hotel', place: 'Arosa', role: 'Commis Tournant · Garde Manger / La Vetta', awards: '', body: 'Rückkehr auf vertrautes Parkett — diesmal als Commis auf Wanderschaft durch alle Posten.', image: { id: mediaMap['roessli-1.jpg'] }, current: false } },
    { slug: 'stat-9', data: { year: '2002 – 2005', title: 'Frühe Stationen', place: 'Zermatt · Davos · Küssnacht', role: 'Chef de Partie', awards: '', body: 'Seiler Hotels Schweizerhof (Zermatt), Sheraton Derby (Davos), Hirschen (Küssnacht). Die Jahre, in denen man lernt, dass Disziplin das Fundament jeder Kreativität ist.', image: { id: mediaMap['roessli-3.jpg'] }, current: false } },
  ],
  education: [
    { slug: 'edu-1', data: { year: '2014 – 2016', title: 'HFP — Eidg. Dipl. Küchenchef', place: 'Hotel & Gastro Formation Weggis', note: 'Höchster Bildungsabschluss im Schweizer Gastgewerbe.' } },
    { slug: 'edu-2', data: { year: '2011 – 2012', title: 'Chefkoch mit Eidg. Fachausweis', place: 'Weggis', note: 'Weiterbildung zum Chefkoch.' } },
    { slug: 'edu-3', data: { year: '2003 – 2004', title: 'Militärischer Küchenchef · Unteroffizier', place: 'Schweizer Armee', note: 'Dienstpflicht erfüllt.' } },
    { slug: 'edu-4', data: { year: '1999 – 2002', title: 'Koch EFZ', place: 'Restaurant Schneggen, Buchs SG', note: 'Grundbildung — 14 GaultMillau.' } },
  ],
  qualifications: [
    { slug: 'qual-1', data: { kind: 'Publikation', year: '2011', title: '„Avantgardistische Naturküche"', note: 'Mitautor von Stefan Wiesner. Rezeptentwicklung und Dokumentation.' } },
    { slug: 'qual-2', data: { kind: 'Weiterbildung', year: '—', title: 'Gewaltfreie Kommunikation', note: 'Kommunikationstraining für Kaderkräfte.' } },
    { slug: 'qual-3', data: { kind: 'Qualifikation', year: '—', title: 'IT & Sprachen', note: 'Branchensoftware (Mirus, Eurotime, Kochtopf) · DE, EN, FR.' } },
  ],
  hobbies: [
    { slug: 'hob-1', data: { title: 'Trailrunning', note: 'Auf den Bündner Bergen. Der ideale Ausgleich zum Küchenalltag — und Quelle neuer Inspiration.', image: { id: mediaMap['dish-1.jpg'] }, placeholder: '' } },
    { slug: 'hob-2', data: { title: 'Skitouren', note: 'Die Berge abseits der Pisten erkunden.', image: { id: mediaMap['dish-4.jpg'] }, placeholder: '' } },
    { slug: 'hob-3', data: { title: 'Mountainbiken', note: 'In der freien Natur, am liebsten auf alpinem Terrain.', image: { id: mediaMap['terroir-1.jpg'] }, placeholder: '' } },
    { slug: 'hob-4', data: { title: 'Sauerteig & Backen', note: 'Langsame Fermentation, perfekte Kruste, einzigartiger Geschmack — handwerkliche Prozesse als pure Magie.', image: null, placeholder: 'Platzhalter — Sauerteigbrot' } },
    { slug: 'hob-5', data: { title: 'Garten', note: 'Pflege und Anbau im eigenen Garten. Bezug zur Natur bewahren — und zur Saison.', image: null, placeholder: 'Platzhalter — Garten' } },
    { slug: 'hob-6', data: { title: 'Yoga', note: 'Zum Ausgleich, zur Konzentration.', image: null, placeholder: 'Platzhalter — Yoga' } },
    { slug: 'hob-7', data: { title: 'Pfadfinder & Lagerkoch', note: 'Früh entdeckt: das Arbeiten im Team und die Liebe zum Kochen über offenem Feuer. Diese Wurzeln prägen den Führungsstil bis heute.', image: { id: mediaMap['dish-2.jpg'] }, placeholder: '' } },
  ],
};

console.log("Importing content...");
for (const [collection, items] of Object.entries(contentData)) {
  for (const item of items) {
    const dataFile = `_temp_${item.slug}.json`;
    fs.writeFileSync(dataFile, JSON.stringify(item.data));
    console.log(`Creating ${collection}/${item.slug}...`);
    run(`content create ${collection} --slug ${item.slug} --stdin < ${dataFile}`);
    fs.unlinkSync(dataFile);
  }
}
console.log("Import complete!");
