import UAParser from "ua-parser-js";
import supabase from "./supabase";

export async function getAnalyticOfUrls(urlIds) {
  const { data, error } = await supabase
    .from("analytics")
    .select("*")
    .in("url_id", urlIds);
  if (error) {
    console.log(error.message);
    throw new Error("Unable to retrieve Analytics");
  }
  return data;
}

const UA_Parser = new UAParser();

export const storeAnalytics = async ({ id, originalUrl }) => {
  try {
    const res = UA_Parser.getResult();
    const device = res.type || "desktop";
    const geoLocation = await fetch("https://ipapi.co/json");
    const { city, country_name: country } = await geoLocation.json();

    await supabase.from("analytics").insert({
      url_id: id,
      city: city,
      country: country,
      device: device,
    });

    window.location.href = originalUrl;
  } catch (error) {
    console.log("Failed to fetch Analytics", error);
  }
};

export async function getAnalyticsOfUrl({ urlId }) {
  const { data, error } = await supabase
    .from("analytics")
    .select("*")
    .eq("url_id", urlId)
  if (error) {
    console.log(error.message);
    throw new Error("Short URL not found");
  }
  return data;
}
