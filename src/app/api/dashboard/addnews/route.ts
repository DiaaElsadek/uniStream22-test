// src/app/api/dashboard/addnews/route.ts
import { NextRequest, NextResponse } from "next/server";

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET() {
  try {
    const res = await fetch(`${SUPA_URL}/rest/v1/News?select=*`, {
      headers: {
        apikey: SUPA_SERVICE_KEY,
        Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
      },
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("Fetch News error:", txt);
      return NextResponse.json(
        { status: false, message: "Error fetching news" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ status: true, data });
  } catch (err) {
    console.error("Server GET error:", err);
    return NextResponse.json(
      { status: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title,
      content,
      subjectId = 0,
      groupId = 0,
      isGeneral = false,
      createdAt,
      week = 1,
      createdBy = "Admin",
    } = body;

    // validation
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { status: false, message: "Title and content are required" },
        { status: 400 }
      );
    }

    // ensure types are correct
    const newNews = {
      title: title.toString(),
      content: content.toString(),
      subjectId: Number(subjectId) || 0,
      groupId: Number(groupId) || 0,
      isGeneral: Boolean(isGeneral),
      createdAt: createdAt || new Date().toISOString(),
      week: Number(week) || 1,
      createdBy: createdBy.toString(),
    };

    const res = await fetch(`${SUPA_URL}/rest/v1/News`, {
      method: "POST",
      headers: {
        apikey: SUPA_SERVICE_KEY,
        Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(newNews),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("Add News error:", txt);
      return NextResponse.json(
        { status: false, message: "Error adding news" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ status: true, data });
  } catch (err) {
    console.error("Server POST error:", err);
    return NextResponse.json(
      { status: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();

    if (!id) {
      return NextResponse.json(
        { status: false, message: "Missing news ID" },
        { status: 400 }
      );
    }

    const res = await fetch(`${SUPA_URL}/rest/v1/News?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: SUPA_SERVICE_KEY,
        Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("Edit News error:", txt);
      return NextResponse.json(
        { status: false, message: "Error editing news" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ status: true, data });
  } catch (err) {
    console.error("Server PATCH error:", err);
    return NextResponse.json(
      { status: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { status: false, message: "Missing news ID" },
        { status: 400 }
      );
    }

    const res = await fetch(`${SUPA_URL}/rest/v1/News?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: SUPA_SERVICE_KEY,
        Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
      },
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("Delete News error:", txt);
      return NextResponse.json(
        { status: false, message: "Error deleting news" },
        { status: 500 }
      );
    }

    return NextResponse.json({ status: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("Server DELETE error:", err);
    return NextResponse.json(
      { status: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
