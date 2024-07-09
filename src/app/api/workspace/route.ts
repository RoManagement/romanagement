import { headers } from "next/headers";
import { db } from "@/server/db";

export async function GET(request: Request) {
    const headersList = headers();
    const Authorization = headersList.get("Authorization");
  
    if (!Authorization) {
      return new Response(JSON.stringify({ status: "401", message: "Unauthorized" }, null, 4), {
        status: 401,
      });
    }
  
    const workspace = await db.query.workspaces.findFirst({
      where: (table, { eq }) => eq(table.apiKey, Authorization),
    });
  
    if (!workspace) {
      return new Response(JSON.stringify({ status: "401", message: "Unauthorized" }, null, 4), {
        status: 401,
      });
    }
  
    if (workspace.apiKey !== Authorization) {
      return new Response(JSON.stringify({ status: "401", message: "Unauthorized" }, null, 4), {
        status: 401,
      });
    }
  
    const filteredWorkspace = JSON.parse(JSON.stringify(workspace, (key, value) => {
      if (key === "robloxCookie" || key === "apiKey") {
        return undefined;
      }
      return value;
    }));
  
    return new Response(
      JSON.stringify({ status: "200", message: "OK", data: filteredWorkspace }, null, 4),
    );
  }