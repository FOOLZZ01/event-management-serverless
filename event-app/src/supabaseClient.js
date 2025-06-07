// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://toeftdozhjdfleokxipe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZWZ0ZG96aGpkZmxlb2t4aXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyNDgzNzQsImV4cCI6MjA2NDgyNDM3NH0.usjzFQXksOCCi1asGVZvh2gfd6GC-vV00c4frdQ35II'; // celotni ključ

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
