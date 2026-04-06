import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://aveefawxzolakppznzjz.supabase.co'
// Usa la "Publishable key" de tu captura
const supabaseKey = 'sb_publishable_-4RtxL17kzNo2tV_pmqxvQ_4Cho2Xdt' 

export const supabase = createClient(supabaseUrl, supabaseKey)