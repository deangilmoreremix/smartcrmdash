// Netlify HTML transform script to replace placeholders with runtime env variables
export default async function(content, options) {
  // Replace placeholders with environment variables
  let result = content;
  
  // Replace Supabase URL and anon key placeholders
  if (process.env.VITE_SUPABASE_URL) {
    result = result.replace(/%SUPABASE_URL%/g, process.env.VITE_SUPABASE_URL);
  } else {
    result = result.replace(/%SUPABASE_URL%/g, '');
  }
  
  if (process.env.VITE_SUPABASE_ANON_KEY) {
    result = result.replace(/%SUPABASE_ANON_KEY%/g, process.env.VITE_SUPABASE_ANON_KEY);
  } else {
    result = result.replace(/%SUPABASE_ANON_KEY%/g, '');
  }
  
  return result;
}