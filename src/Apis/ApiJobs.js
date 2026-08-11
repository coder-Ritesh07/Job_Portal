import supabaseClient from "@/Utils/Supabase";

export async function getJobs(token, { location, company_id, searchQuery }) {
  const supabase = await supabaseClient(token);

  //   const auth = await supabase.auth.getUser();

  //   console.log("AUTH RESULT:", auth);

  let query = supabase.from("Jobs").select(`
    *,
    company:Companies (
      name,
      logo_url
    ),saved:saved_jobs(id)
  `);

  if (location) {
    query = query.ilike("location", `%${location}%`);
  }

  if (company_id) {
    query = query.eq("company_id", Number(company_id));
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query;

  // console.log(query);

 
  // console.log("DATA:", data);
  // console.log("ERROR:", error);
  return {data,error};
}

export async function savedJobs(token, { alreadySaved }, savedData) {
  const supabase = await supabaseClient(token);

  //   const auth = await supabase.auth.getUser();

  //   console.log("AUTH RESULT:", auth);

  if (alreadySaved) {
    const { data, error } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", savedData.job_id)
      .select();
    // if (deleteError) {
    //   console.error("Error Deleting Saved Jobs", deleteError);
    //   return data;
    // }
    return { data, error };
  } else {
    const { data, error } = await supabase
      .from("saved_jobs")
      .insert([savedData])
      .select();
    // if (insertError) {
    //   console.error("Error Deleting Saved Jobs", insertError);
    //   return data;
    // }
    return { data, error };
  }
}

export async function getSingleJob(token, { job_id }) {
  let supabase = await supabaseClient(token);

  let { data, error } = await supabase
    .from("Jobs")
    .select(
      `
    *,
    company:Companies (
      name,
      logo_url
    ), application:Applications(*)
  `,
    )
    .eq("id", job_id)
    .single();
  //   console.log(data)

  return { data, error };
}

export async function updateHiringStatus(token, { job_id }, isopen) {
  let supabase = await supabaseClient(token);

  let { data, error } = await supabase
    .from("Jobs")
    .update({ isopen })
    .eq("id", job_id)
    .select();

  //   console.log(data)

  return { data, error };
}
export async function addNewJobs(token, jobData) {
  let supabase = await supabaseClient(token);

  let { data, error } = await supabase.from("Jobs").insert([jobData]).select();
  //   console.log(data)

  return { data, error };
}

export async function getSavedJobs(token) {
  let supabase = await supabaseClient(token);

  let { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job:Jobs(*, company:Companies(name,logo_url))");
    // console.log(data)

  return { data, error };
}
export async function getMyJobs(token,{recruiter_id}) {
  let supabase = await supabaseClient(token);

  let { data, error } = await supabase
    .from("Jobs")
    .select("*, company:Companies(name,logo_url)").eq("recruiter_id",recruiter_id);
    // console.log(data)

  return { data, error };
}
export async function deleteMyJob(token,{job_id}) {
  let supabase = await supabaseClient(token);

  let { data, error } = await supabase
    .from("Jobs")
    .delete().eq("id",job_id).select()
    // console.log(data)

  return { data, error };
}
