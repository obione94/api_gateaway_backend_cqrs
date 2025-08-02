import { Level } from 'level';
import path from 'path';


const dbPath = path.resolve(__dirname, '../../../../../db'); // Exemple simple, à ajuster selon ta structure

const db = new Level<string, any>(dbPath, { valueEncoding: 'json' });

export async function getDB(): Promise<Level<string, any>> {
  await db.open();
  return db;
}