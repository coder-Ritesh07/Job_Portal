import supabaseClient, { supabaseUrl } from "@/Utils/Supabase";

export async function getCompanies(token) {
  let supabase = await supabaseClient(token);

  let { data, error } = await supabase.from("Companies").select("*");
  //   console.log(data)

  return { data, error };
}
export async function addANewCompany(token, companyData) {
  let supabase = await supabaseClient(token);

  let random = Math.floor(Math.random() * 90000);
  let fileName = `logo-${random}-${companyData.name}`;

  let { error: storageError } = await supabase.storage
    .from("company_logo")
    .upload(fileName, companyData.logo_url);

  if (storageError) {
    return { data: null, error: storageError };
  }

  let logo_url = `${supabaseUrl}/storage/v1/object/public/company_logo/${fileName}`;

  let { data, error } = await supabase
    .from("Companies")
    .insert([{ name: companyData.name, logo_url }])
    .select();
  //   console.log(data)

  return { data, error };
}
