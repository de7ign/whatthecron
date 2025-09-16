import { NextRequest, NextResponse } from "next/server";

export function createSocialRoute(source: string) {
  return async function GET(req: NextRequest) {
    return NextResponse.redirect(
      new URL(
        `/?utm_source=${source}&utm_medium=bio`,
        req.url
      ),
      308
    );
  };
}