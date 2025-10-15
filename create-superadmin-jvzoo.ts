import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createSuperAdmin() {
  const email = 'jvzoo@gmail.com';
  const password = 'videoremix2025';

  console.log(`🔧 Creating superadmin account for ${email}...`);

  try {
    // Check if user already exists
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    const existingUser = users?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      console.log(`✅ User ${email} already exists with ID: ${existingUser.id}`);
      console.log(`   - Email Confirmed: ${existingUser.email_confirmed_at ? 'Yes' : 'No'}`);
      console.log(`   - Created: ${new Date(existingUser.created_at).toLocaleString()}`);

      // Update password if user exists
      console.log(`🔄 Updating password for existing user...`);
      const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
        password: password,
        user_metadata: {
          app_context: 'smartcrm',
          role: 'super_admin',
          first_name: 'JVZoo',
          last_name: 'Admin',
          role_updated_at: new Date().toISOString()
        }
      });

      if (updateError) {
        console.log(`❌ Failed to update password: ${updateError.message}`);
        return;
      }

      console.log(`✅ Password updated successfully!`);

      // Update profile role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: 'super_admin',
          first_name: 'JVZoo',
          last_name: 'Admin'
        })
        .eq('id', existingUser.id);

      if (profileError) {
        console.log(`⚠️ Warning: Failed to update profile: ${profileError.message}`);
      } else {
        console.log(`✅ Profile updated successfully!`);
      }

    } else {
      console.log(`📝 Creating new superadmin account...`);

      // Create the superadmin account
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Auto-confirm email for superadmin
        user_metadata: {
          app_context: 'smartcrm',
          role: 'super_admin',
          first_name: 'JVZoo',
          last_name: 'Admin'
        }
      });

      if (createError) {
        console.log(`❌ Failed to create account: ${createError.message}`);
        return;
      }

      console.log(`✅ Superadmin account created successfully!`);
      console.log(`   - User ID: ${newUser.user?.id}`);
      console.log(`   - Email: ${newUser.user?.email}`);
      console.log(`   - Role: super_admin`);
    }

    console.log(`\n🎯 Superadmin account setup completed!`);
    console.log(`\n📋 Account Details:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: super_admin`);
    console.log(`\n🔐 You can now log in with these credentials.`);

  } catch (error: any) {
    console.error(`❌ Error creating superadmin: ${error.message}`);
  }
}

// Run the function
createSuperAdmin().catch(console.error);