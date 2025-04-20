
import { supabase } from "@/integrations/supabase/client";

export const fetchDocumentsByCategory = async () => {
  const { data } = await supabase
    .from('documents')
    .select(`
      document_categories!inner(name)
    `);

  if (!data) return [];

  const categoryCount = data.reduce((acc: any, doc) => {
    const category = doc.document_categories.name;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const colors = {
    "Documents administratifs et réglementaires": "#4A9BDB",
    "Documents techniques et spécialisés": "#1A5B8F",
    "Documents financiers et comptables": "#F8B93B",
    "Documents de communication et de sensibilisation": "#5BCEFA",
    "Archives et documentation historique": "#6B7280",
  };

  return Object.entries(categoryCount).map(([name, value]) => ({
    name,
    value,
    color: colors[name as keyof typeof colors] || "#6B7280"
  }));
};

export const fetchDocumentsByYear = async () => {
  const { data } = await supabase
    .from('documents')
    .select(`
      document_date,
      document_categories!inner(name)
    `);

  if (!data) return [];

  const yearlyData: any = {};
  
  data.forEach(doc => {
    const year = new Date(doc.document_date).getFullYear().toString();
    const category = doc.document_categories.name;
    
    if (!yearlyData[year]) {
      yearlyData[year] = {
        name: year,
        "Documents administratifs": 0,
        "Documents techniques": 0,
        "Documents financiers": 0,
        "Documents de communication": 0,
        "Archives historiques": 0,
      };
    }
    
    const categoryMapping: any = {
      "Documents administratifs et réglementaires": "Documents administratifs",
      "Documents techniques et spécialisés": "Documents techniques",
      "Documents financiers et comptables": "Documents financiers",
      "Documents de communication et de sensibilisation": "Documents de communication",
      "Archives et documentation historique": "Archives historiques",
    };
    
    yearlyData[year][categoryMapping[category]]++;
  });

  return Object.values(yearlyData);
};
