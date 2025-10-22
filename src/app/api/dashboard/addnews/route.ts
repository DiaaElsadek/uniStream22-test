// src/app/api/dashboard/addnews/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** التحقق من أن المستخدم هو Admin عبر userToken في الكوكيز */
async function verifyAdminRole(): Promise<{ ok: boolean; message?: string }> {
  try {
    const cookieStore = await cookies();
    const userToken = cookieStore.get("userToken")?.value;

    if (!userToken) {
      return { ok: false, message: "Missing userToken in cookies" };
    }

    const res = await fetch(`${SUPA_URL}/rest/v1/AppUser?userToken=eq.${userToken}&select=Role`, {
      headers: {
        apikey: SUPA_SERVICE_KEY,
        Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
      },
    });

    if (!res.ok) {
      return { ok: false, message: "Error verifying user" };
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return { ok: false, message: "User not found" };
    }

    const role = data[0]?.Role?.toLowerCase?.() ?? "";
    if (role !== "admin") {
      return { ok: false, message: "Unauthorized: Admin role required" };
    }

    return { ok: true };
  } catch (err) {
    console.error("verifyAdminRole error:", err);
    return { ok: false, message: "Internal auth validation error" };
  }
}

/** جلب كل الأخبار */
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
        { status: 500 },
      );
    }

    const data = await res.json();
    return NextResponse.json({ status: true, data });
  } catch (err) {
    console.error("Server GET error:", err);
    return NextResponse.json(
      { status: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

/** إضافة خبر جديد */
export async function POST(req: NextRequest) {
  const auth = await verifyAdminRole();
  if (!auth.ok) {
    return NextResponse.json({ status: false, message: auth.message }, { status: 403 });
  }

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

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { status: false, message: "Title and content are required" },
        { status: 400 },
      );
    }

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
        { status: 500 },
      );
    }

    const data = await res.json();
    return NextResponse.json({ status: true, data });
  } catch (err) {
    console.error("Server POST error:", err);
    return NextResponse.json(
      { status: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

/** تعديل خبر */
export async function PATCH(req: NextRequest) {
  const auth = await verifyAdminRole();
  if (!auth.ok) {
    return NextResponse.json({ status: false, message: auth.message }, { status: 403 });
  }

  try {
    const { id, ...updates } = await req.json();

    if (!id) {
      return NextResponse.json(
        { status: false, message: "Missing news ID" },
        { status: 400 },
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
        { status: 500 },
      );
    }

    const data = await res.json();
    return NextResponse.json({ status: true, data });
  } catch (err) {
    console.error("Server PATCH error:", err);
    return NextResponse.json(
      { status: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

/** حذف خبر */
export async function DELETE(req: NextRequest) {
  const auth = await verifyAdminRole();
  if (!auth.ok) {
    return NextResponse.json({ status: false, message: auth.message }, { status: 403 });
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { status: false, message: "Missing news ID" },
        { status: 400 },
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
        { status: 500 },
      );
    }

    return NextResponse.json({ status: true, message: "Deleted successfully" });
  } catch (err) {
    console.error("Server DELETE error:", err);
    return NextResponse.json(
      { status: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
