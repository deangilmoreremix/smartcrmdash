import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GeminiRequest {
  model?: string;
  prompt?: string;
  contents?: Array<{ role: string; parts: Array<{ text: string }> }>;
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured on server" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body: GeminiRequest = await req.json();
    const {
      model = "gemini-2.5-flash",
      prompt,
      contents,
      generationConfig = { temperature: 0.7, maxOutputTokens: 8192 }
    } = body;

    let geminiContents;
    if (contents) {
      geminiContents = contents;
    } else if (prompt) {
      geminiContents = [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ];
    } else {
      return new Response(
        JSON.stringify({ error: "Either 'contents' or 'prompt' is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const geminiPayload = {
      contents: geminiContents,
      generationConfig,
    };

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(geminiPayload),
      }
    );

    if (!geminiResponse.ok) {
      const error = await geminiResponse.text();
      return new Response(
        JSON.stringify({ error: `Gemini API error: ${error}` }),
        {
          status: geminiResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await geminiResponse.json();

    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
