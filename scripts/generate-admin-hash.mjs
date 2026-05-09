import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/generate-admin-hash.mjs <your-password>');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
// The hash looks like $2b$12$abcdefghijklmnopqrstuvwx...
// We only want the part after $2b$12$ because of Vercel env var parsing.
const hashWithoutPrefix = hash.replace('$2b$12$', '');

console.log('\n--- Admin Password Hash Generator ---\n');
console.log(`Password: ${password}`);
console.log(`\nValue for ADMIN_PASSWORD_HASH_1:\n${hashWithoutPrefix}\n`);
console.log('Instructions:');
console.log('1. Go to your Vercel Dashboard -> Settings -> Environment Variables');
console.log('2. Add a new variable named ADMIN_PASSWORD_HASH_1');
console.log('3. Paste the value above.');
console.log('4. Redeploy your application.');
