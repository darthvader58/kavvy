import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

async function seedAll() {
  console.log('🌱 Starting complete database seeding...\n');
  
  try {
    console.log('1️⃣  Seeding publishers...');
    await execPromise('node scripts/seedPublishers.js');
    
    console.log('\n2️⃣  Seeding authors and manuscripts...');
    await execPromise('node scripts/seedAuthors.js');
    
    console.log('\n3️⃣  Seeding posts...');
    await execPromise('node scripts/seedPosts.js');
    
    console.log('\n✅ All data seeded successfully!');
    console.log('🎉 Your Kavvy database is ready to go!\n');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

seedAll();
