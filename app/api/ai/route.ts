import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const body = await req.json();

  const prompt = `
  Client Fitness Data:
  - Weight: ${body.poids} kg
  - Height: ${body.taille} cm
  - BMI: ${body.bmi}

  Give:
  1. Diet plan
  2. Workout plan
  3. Advice
  `;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a professional fitness coach." },
        { role: "user", content: prompt }
      ]
    })
  });

  const data = await response.json();

  return NextResponse.json({
    text: data.choices[0].message.content
  });
}
