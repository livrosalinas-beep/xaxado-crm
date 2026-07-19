const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mtryhxpifvzxitxucwgz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10cnloeHBpZnZ6eGl0eHVjd2d6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0Nzc3NTQsImV4cCI6MjEwMDA1Mzc1NH0.IDKP0JSoruaux5w_w5zZfcoSfPXBEVRhHfQlsx6Ze-4';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  const { data, error } = await supabase.from('contatos').select('*').limit(1);
  if (error) {
    console.error('Error fetching contatos:', error.message);
  } else {
    console.log('Contatos:', data);
  }

  const { data: d2, error: e2 } = await supabase.from('clientes').select('*').limit(1);
  if (e2) {
    console.error('Error fetching clientes:', e2.message);
  } else {
    console.log('Clientes:', d2);
  }
}
testConnection();
