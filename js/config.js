// ============================================================
// CONFIGURATION SUPABASE — TANA CITY
// ============================================================

const SUPABASE_URL = "https://uutzzjoglrqyyjzswvaa.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_mesDjeBFra4xvu1v2itOlA_TglBS4ct";

// true = cloud (tout le monde voit les mêmes données)
function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith("http"));
}
