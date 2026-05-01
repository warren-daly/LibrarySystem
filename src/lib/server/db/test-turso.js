import 'dotenv/config';
import { db } from './index.js';
import * as schema from './schema.js';

async function test() {
  // Create a category
  await db.insert(schema.productCategory).values({ name: 'Test', description: 'Demo' });

  // Read categories
  const categories = await db.select().from(schema.productCategory);
  console.log(categories);
}

test();