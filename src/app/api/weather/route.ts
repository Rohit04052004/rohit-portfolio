import { NextResponse } from "next/server";

// Bangalore (Bengaluru) coordinates
const LATITUDE = 12.9716;
const LONGITUDE = 77.5946;

// WMO weather codes -> human-readable condition
// https://open-meteo.com/en/docs#weathervariables
function describeWeatherCode(code: number): string {
  if (code === 0) return "Clear";
  if (code === 1) return "Mostly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Cloudy";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain Showers";
  if (code >= 85 && code <= 86) return "Snow Showers";
  if (code >= 95) return "Thunderstorm";
  return "Unknown";
}

export async function GET() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FKolkata`;

    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch weather" }, { status: 502 });
    }

    const data = await res.json();

    return NextResponse.json({
      city: "Bengaluru",
      temp: Math.round(data.current.temperature_2m),
      condition: describeWeatherCode(data.current.weather_code),
      isDay: data.current.is_day === 1,
      high: Math.round(data.daily.temperature_2m_max[0]),
      low: Math.round(data.daily.temperature_2m_min[0]),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch weather" }, { status: 502 });
  }
}
