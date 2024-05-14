"use server";

import { db } from "@/server/db";

export async function getGroupInfo(groupId: string) {
  const groupInfo = await fetch(`https://groups.roblox.com/v2/groups?groupIds=${groupId}`).then(
    (res) => res.json(),
  );

  if (!groupInfo.data) {
    return null;
  }

  return groupInfo.data[0];
}

export async function getGroupLogo(groupId: string) {
  const groupEmblem = await fetch(
    `https://thumbnails.roblox.com/v1/groups/icons?groupIds=${groupId}&size=150x150&format=Png&isCircular=true`,
  ).then((res) => res.json());

  if (!groupEmblem.data || !groupEmblem.data[0] || !groupEmblem.data[0].imageUrl) {
    return null;
  }

  return groupEmblem.data[0].imageUrl;
}