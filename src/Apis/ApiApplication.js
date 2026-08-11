import supabaseClient, { supabaseUrl } from "@/Utils/Supabase";

export async function applyToJobs(token,jobData) {
  let supabase= await supabaseClient(token)

  let random=Math.floor(Math.random()*90000)
  let fileName=`resume-${random}-${jobData.candidate_id}`

  let {error:storageError}=await supabase.storage.from("resume").upload(fileName,jobData.resume)

  if (storageError) {
  return { data: null, error: storageError };
}

  let resume=`${supabaseUrl}/storage/v1/object/public/resume/${fileName}`

  let {data,error}=await supabase.from("Applications").insert([{
    ...jobData,resume
  }]).select()
//   console.log(data)

  return {data,error}
}


export async function updateApplication(token,{job_id},status) {
  let supabase= await supabaseClient(token)

  let {data,error}=await supabase.from("Applications").update({status}).eq("job_id",job_id).select()
//   console.log(data)

  return {data,error}
}

export async function getCreatedApplications(token,{user_id}) {
  let supabase= await supabaseClient(token)

  let {data,error}=await supabase.from("Applications").select("*, job:Jobs(title, company:Companies(name))").eq("candidate_id",user_id)
//   console.log(data)

  return {data,error}
}