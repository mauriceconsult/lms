import { Mux } from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export const storage = {
  async uploadFile(file: File) {
    if (!process.env.MUX_TOKEN_ID || !process.env.MUX_TOKEN_SECRET) {
      throw new Error(
        "Mux credentials are not configured in .env (use MUX_TOKEN_ID and MUX_TOKEN_SECRET)"
      );
    }

    // Create a new upload with Mux
    const upload = await mux.video.uploads.create({
      cors_origin: "*",
      new_asset_settings: { playback_policy: ["public"] },
    });

    // Prepare and send the file upload
    const formData = new FormData();
    formData.append("file", file);
    await fetch(upload.url, { method: "POST", body: formData });

    // Poll for asset details (simplified, adjust delay as needed)
    let asset;
    for (let i = 0; i < 10; i++) {
      const assets = await mux.video.assets.list();
      asset = assets.data.find((a) => a.id === upload.asset_id);
      if (asset) break;
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
    }
    if (!asset) {
      throw new Error("Failed to retrieve asset details after polling");
    }

    return {
      assetId: upload.asset_id,
      playbackId: asset.playback_ids?.[0]?.id || null,
      url: asset.mp4_support?.url || null,
    };
  },
};
