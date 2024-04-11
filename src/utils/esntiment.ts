import { kv } from "@vercel/kv";
import TodayStartTimestamp from "./time";

export interface Sentiment {
  fid: number;
  sentiment: "love" | "hate";
  reason: string;
  createdAt: number;
}

class SentimentConfigurator {
  private SENTIMENT_KEY: string = "new-york:sentiment";

  private async getSentimentsForToday(): Promise<Sentiment[]> {
    const sentimentDay = TodayStartTimestamp.getStartOfToday();

    const sentiments = await kv.hget<Sentiment[]>(this.SENTIMENT_KEY, sentimentDay.toString());

    return sentiments ?? [];
  }

  public async getSentimentForFid(fid: number): Promise<Sentiment | null> {
    const sentiments = await this.getSentimentsForToday();

    if (sentiments) {
      return sentiments.find((sentiment: Sentiment) => sentiment.fid === fid) ?? null;
    }

    return null;
  }

  public async getTodaysSentiment(): Promise<string> {
    const sentiments = await this.getSentimentsForToday();

    const loves = sentiments.filter((x) => x.sentiment === "love").length;
    const hates = sentiments.filter((x) => x.sentiment === "hate").length;

    if (loves > hates) {
      return "love";
    } else if (hates > loves) {
      return "hate";
    } else {
      return "are neutral about";
    }
  }

  public async saveSentiment(sentiment: Sentiment): Promise<boolean> {
    try {
      const today = TodayStartTimestamp.getStartOfToday();

      const sentiments = await this.getSentimentsForToday();

      if (sentiments.some((x) => x.fid === sentiment.fid)) {
        const updatedSentiments = sentiments.map((x) => {
          if (x.fid === sentiment.fid) {
            return sentiment;
          }

          return x;
        });

        await kv.hset(this.SENTIMENT_KEY, {
          [today]: updatedSentiments,
        });
      } else {
        await kv.hset(this.SENTIMENT_KEY, {
          [today]: [...sentiments, sentiment],
        });
      }

      return true;
    } catch (ex: any) {
      console.error(ex);
      return false;
    }
  }
}

const sentimentConfiguratorInstance = new SentimentConfigurator();

export default sentimentConfiguratorInstance;
