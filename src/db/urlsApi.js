import supabase, { supabaseUrl } from "./supabase";

export async function createUrl({ title, longUrl, customUrl, userId }, qrcode) {
  const shortUrl = Math.random().toString(36).substring(2, 8);
  const fileName = `qr-${shortUrl}`;
  const { error: storageError } = await supabase.storage
    .from("qrs")
    .upload(fileName, qrcode);
  if (storageError) throw new Error(storageError.message);
  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

  const { data, error } = await supabase
    .from("urls")
    .insert([
      {
        user_id: userId,
        qr: qr,
        title,
        original_url: longUrl,
        short_url: shortUrl,
        custom_url: customUrl || null,
      },
    ])
    .select();
  if (error) {
    console.log(error.message);
    throw new Error("Unable to create short URL");
  }
  return data;
}

export async function getUrls(user_id) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);
  if (error) {
    console.log(error.message);
    throw new Error("Unable to retrieve URLs");
  }
  return data;
}

export async function deleteUrl(url_id) {
  const { data, error } = await supabase.from("urls").delete().eq("id", url_id);
  if (error) {
    console.log(error.message);
    throw new Error("Unable to delete URL");
  }
  return data;
}

export async function getLongUrlToRedirect(id) {
  const { data, error } = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${id}, custom_url.eq.${id}`)
    .single();
  if (error) {
    console.log(error.message);
    throw new Error("Unable to Fetch Short URL");
  }
  return data;
}

export async function getUrlInfo({ id, user_id }) {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();
  if (error) {
    console.log(error.message);
    throw new Error("Error, fetching Short URL");
  }
  return data;
}
