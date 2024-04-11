/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import sentimentConfiguratorInstance from "~/utils/esntiment";
import { frames } from "./frames";

const handleRequest = frames(async (ctx) => {
  if (ctx.searchParams.sentiment && ctx.message?.requesterFid) {
    await sentimentConfiguratorInstance.saveSentiment({
      createdAt: Date.now(),
      reason: "no reason",
      sentiment: ctx.searchParams.sentiment as "love" | "hate",
      fid: ctx.message?.requesterFid,
    });
  }

  const currentSentiment = await sentimentConfiguratorInstance.getTodaysSentiment();

  return {
    image: (
      <div tw="flex flex-col h-full w-full items-center justify-center">
        <p tw="text-8xl">People {currentSentiment} New York today</p>
      </div>
    ),
    buttons: [
      <Button action="post" target={{ query: { sentiment: "love" } }}>
        Love
      </Button>,

      <Button action="post" target={{ query: { sentiment: "hate" } }}>
        Hate
      </Button>,
    ],
    imageOptions: {
      height: 2140,
      width: 2140,
      aspectRatio: "1:1",
    },
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
