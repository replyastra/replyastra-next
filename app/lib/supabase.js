import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://stfyhqzmsgkgiwsejxra.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0ZnlocXptc2drZ2l3c2VqeHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MDM0MjYsImV4cCI6MjA4NDA3OTQyNn0.zQw_l9P_bn7Nmnm8ZNMq0ZwcRYRuw6ZL2yXAanYo4eM"
);
