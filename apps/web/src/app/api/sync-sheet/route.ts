import { NextResponse } from "next/server";

const GOOGLE_SHEET_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbxHOiNqRFOC_pMeS-6DHkDuilPGISk9cJfcG6Ts3lK9q3hOeRmWohyeDgam7PAIbdml5g/exec";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const leads = Array.isArray(body) ? body : body.leads || [body];

    if (!leads.length) {
      return NextResponse.json({ success: false, error: "No leads provided" }, { status: 400 });
    }

    // Forward to the Google Apps Script webhook
    const response = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leads),
    });

    const result = await response.json();
    return NextResponse.json({
      success: true,
      message: `Successfully synced ${leads.length} leads to Google Sheet`,
      result,
      sheetUrl: "https://docs.google.com/spreadsheets/d/1ic6sIvjHQq6pDEKIwfgqLJszWcboi_UNqDXK1cbo8P0/edit?gid=0#gid=0",
    });
  } catch (error: any) {
    console.error("Sheet sync error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to sync to Google Sheet",
      },
      { status: 500 }
    );
  }
}
