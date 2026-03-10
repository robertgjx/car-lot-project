import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = Redis.fromEnv();

// POST /api/track-view — increment a vehicle's view count
export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await redis.zincrby("vehicle_views", 1, id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("track-view POST error", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET /api/track-view — return top 3 most viewed vehicle IDs
export async function GET() {
  try {
    const top = await redis.zrange("vehicle_views", 0, 2, { rev: true });
    return NextResponse.json({ top });
  } catch (e) {
    console.error("track-view GET error", e);
    return NextResponse.json({ top: [] });
  }
}