import { NextResponse } from "next/server";

const SD_API_URL =
  process.env.STABLE_DIFFUSION_API_URL || "http://127.0.0.1:7860";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Call Stable Diffusion API
    const response = await fetch(`${SD_API_URL}/sdapi/v1/txt2img`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        negative_prompt: "blurry, bad quality, distorted, deformed",
        steps: 20,
        width: 512,
        height: 512,
        cfg_scale: 7,
        batch_size: 4,
        batch_count: 2,
        sampler_name: "DPM++ 3M SDE",
        enable_hr: false,
        denoising_strength: 0.7,
        seed: -1,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate images");
    }

    const data = await response.json();

    // Convert base64 images to URLs and save them
    const images = await Promise.all(
      data.images.map(async (base64Image: string) => {
        // Save the base64 image to a file or cloud storage
        // For now, we'll return the base64 data URL
        return {
          url: `data:image/png;base64,${base64Image}`,
        };
      })
    );

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate images" },
      { status: 500 }
    );
  }
}
