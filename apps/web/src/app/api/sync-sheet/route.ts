import { NextResponse } from "next/server";

const GOOGLE_SHEET_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbxHOiNqRFOC_pMeS-6DHkDuilPGISk9cJfcG6Ts3lK9q3hOeRmWohyeDgam7PAIbdml5g/exec";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // If body has an action (register_user, login_user, log_usage, sync_leads)
    const payload = body.action ? body : { action: "sync_leads", leads: Array.isArray(body) ? body : body.leads || [body] };

    const response = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("Sheet API sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to sync to database",
      },
      { status: 500 }
    );
  }
}
