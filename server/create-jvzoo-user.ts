import { supabase } from './supabase.js';

async function createJVZooUser() {
  try {
    console.log('Creating JVZoo user...');

    if (!supabase) {
      console.error('Supabase client not configured');
      return;
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email: 'jvzoo@gmail.com',
      password: 'VideoRemix2025',
      user_metadata: {
        first_name: 'JVZoo',
        last_name: 'SuperAdmin',
        role: 'super_admin',
        app_context: 'smartcrm'
      }
    });

    if (error) {
      console.error('Error creating user:', error);
      return;
    }

    console.log('User created successfully:', data.user?.id);
    console.log('Email:', data.user?.email);
    console.log('Metadata:', data.user?.user_metadata);

  } catch (error) {
    console.error('Failed to create user:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createJVZooUser()
    .then(() => {
      console.log('Script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}