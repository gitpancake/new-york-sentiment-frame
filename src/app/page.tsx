import { fetchMetadata } from "frames.js/next";

export async function generateMetadata() {
  return {
    title: "My Page",
    // ...
    other: {
      // ...
      ...(await fetchMetadata(
        // provide a full URL to your /frames endpoint
        new URL("/frames", process.env.APP_URL)
      )),
    },
  };
}

export default function Page() {
  return <span>My existing page</span>;
}
