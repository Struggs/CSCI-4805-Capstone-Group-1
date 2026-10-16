// import supabase
import { createClient } from '@supabase/supabase-js'

// get url from env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

// get key from env file
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// create supabase connection
export const supabase = createClient(
    supabaseUrl,
    supabaseKey
)

console.log('supabase connected', supabase)

// test database connection
const { data, error } = await supabase
    .from('profiles')
    .select('*')

console.log('database data', data)
console.log('database error', error)