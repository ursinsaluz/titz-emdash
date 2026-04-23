import fs from 'fs';

const EMDASH_URL = process.env.EMDASH_URL || "https://emdash.titz.cooking";
const EMDASH_TOKEN = process.env.EMDASH_TOKEN || "ec_pat_sT1PsbCGQOc1qmQS6c2IMgU5uCZaBbCRzOGOsqf-StQ";

async function main() {
  const res = await fetch(`${EMDASH_URL}/_emdash/api/schema`, {
    headers: { "Authorization": `Bearer ${EMDASH_TOKEN}` }
  });
  const schema = await res.json();
  
  fs.mkdirSync('.emdash', { recursive: true });
  fs.writeFileSync('.emdash/schema.json', JSON.stringify(schema, null, 2));

  let types = `/// <reference types="emdash/locals" />

import type { PortableTextBlock } from "emdash";

`;

  const mapType = (type) => {
    switch (type) {
      case 'string': return 'string';
      case 'text': return 'string';
      case 'boolean': return 'boolean';
      case 'number': return 'number';
      case 'portableText': return 'PortableTextBlock[]';
      case 'image': return '{ id: string; src?: string; alt?: string; width?: number; height?: number; blurhash?: string }';
      default: return 'any';
    }
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const collections = [];

  for (const coll of schema.collections) {
    const interfaceName = coll.slug.charAt(0).toUpperCase() + coll.slug.slice(1);
    collections.push(`    ${coll.slug}: ${interfaceName};`);

    types += `export interface ${interfaceName} {
  id: string;
  slug: string | null;
  status: string;
`;
    for (const field of coll.fields) {
      const isOptional = !field.required ? '?' : '';
      types += `  ${field.slug}${isOptional}: ${mapType(field.type)};\n`;
    }
    types += `  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

`;
  }

  types += `declare module "emdash" {
  interface EmDashCollections {
${collections.join('\n')}
  }
}
`;

  fs.writeFileSync('emdash-env.d.ts', types);
  console.log("Types generated!");
}

main().catch(console.error);
