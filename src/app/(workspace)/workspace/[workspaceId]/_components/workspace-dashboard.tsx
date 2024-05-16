import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import React, { useState } from "react";
  import { Checkbox } from "@/components/ui/checkbox";
  import { Input } from "@/components/ui/input";
  import Link from "next/link";
  import { Button } from "@/components/ui/button";
  
  export const WorkspaceDashboard = () => {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center justify-center">
          <h1 className="text-lg font-semibold md:text-2xl">Workspace Dashboard</h1>
        </div>
        <div
          className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
          x-chunk="dashboard-02-chunk-1"
        >
          <div className="flex flex-col items-center gap-1 text-center">
            (Coming Soon!)
          </div>
        </div>
      </main>
    );
  };
  