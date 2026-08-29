/**
 * 灵镜电子吧唧 · 后端 AI 占卜解析接口
 *
 * 运行于 Cloudflare Pages Functions（前后端分离的后端部分）。
 * 由 Gemini 迁移为 DeepSeek：API Key 仅存在服务端环境变量 DEEPSEEK_API_KEY 中，
 * 绝不暴露到前端、也绝不写入仓库。
 */

interface Env {
  DEEPSEEK_API_KEY?: string;
  DEEPSEEK_MODEL?: string;
}

const DEFAULT_MODEL = "deepseek-v4-flash";
const DEEPSEEK_ENDPOINT = "https://api.deepseek.com/v1/chat/completions";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

// 处理浏览器预检请求（跨域场景）
export async function onRequestOptions(): Promise<Response> {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;

  const apiKey = env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return json(
      { error: "服务端未配置 DEEPSEEK_API_KEY，请在 Cloudflare 面板中设置 Secret。" },
      500,
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: "请求体不是合法的 JSON。" }, 400);
  }

  const { appMode, question, spreadName, cards, liuYaoLines } = body;

  // 组装提示词（沿用原 Gemini 版本的中文提示词）
  let prompt = "";

  if (appMode === "LIUYAO") {
    if (!liuYaoLines || !Array.isArray(liuYaoLines) || liuYaoLines.length !== 6) {
      return json({ error: "Invalid Liu Yao hexagram provided" }, 400);
    }

    const linesMap = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];
    const valToStr = (val: number) => {
      if (val === 6) return "老阴(变阳，X)";
      if (val === 7) return "少阳";
      if (val === 8) return "少阴";
      if (val === 9) return "老阳(变阴，O)";
      return "未知";
    };

    const lineDetails = liuYaoLines
      .map((l: number, i: number) => `- ${linesMap[i]}: 值 ${l} -> ${valToStr(l)}`)
      .join("\n");

    prompt = `
你是一位专业的周易与六爻预测大师。
用户正在进行一次传统的"文王六爻掷钱起卦"占卜，设备是一台 ESP32 便携电子吧唧式算卦仪。

【占卜问题】：
"${question || "无具体问题，求测当下运势。"}"

【六次摇币排出的爻象（由下至上起卦）】：
${lineDetails}

请严格遵照六爻与周易理论，推演出本卦和变卦（若有动爻），并结合用户的占卜问题进行精准、客观、具有智慧启发性的解卦。
你的解卦需要包含：
1. **本卦与变卦简述**：点明摇出的是什么卦（本卦），动爻是什么，变成了什么卦（变卦），并简述卦辞大意与总象（100字以内）。
2. **六爻及五行生克解析**：结合问题，分析用神、体用关系或重点爻位（世应、动爻）的吉凶暗示。
3. **推演结论与应对之道**：基于周易哲理给出中肯、可落实的建议（趋吉避凶）。

请使用专业、古韵与现代人能听懂相结合的语言作答，保持内容层次清晰，适合小屏幕或终端阅读。
    `;
  } else {
    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return json({ error: "No cards provided for reading" }, 400);
    }

    const cardsDetails = cards
      .map(
        (c: any, idx: number) =>
          `- Card ${idx + 1} at position "${c.positionLabel || c.position}": ${c.name} (${c.orientation === "reversed" ? "逆位" : "正位"})
          Description: ${c.description || ""}
          Upright meaning: ${c.upright || ""}
          Reversed meaning: ${c.reversed || ""}`,
      )
      .join("\n");

    prompt = `
你是一位专业的神秘学塔罗牌解牌大师。
我们正在进行一次塔罗牌占卜，用户在一款 1.75 英寸圆形屏幕的 ESP32 便携电子吧唧式卡牌阅读器上进行了牌阵抽取。

【占卜问题】：
"${question || "未明确具体问题，请求今日运势与灵性启示。"}"

【所选牌阵】：
"${spreadName}" (共有 ${cards.length} 张卡牌)

【抽出的卡牌及牌阵位置】：
${cardsDetails}

请针对以上卡牌及其对应的**牌阵位置**，并结合用户的**占卜问题**进行精准且具有疗愈启发性的占卜解析。
你的解牌需要包含：
1. **总体能量流向**：分析整个牌阵传递的整合磁场和情绪共鸣（100字以内）。
2. **单牌位置解析**：逐一根据牌阵特定位置详解每张牌的具体指涉、象征与启示。
3. **灵性建议与行动指南**：基于结果，给予中肯、可落地的建议。

请使用优美、神秘、体贴、富含哲学智慧的语言（中文）作答。语言要精炼而信息丰富，分段清晰，适合在小屏幕或配套终端上顺畅阅读。
    `;
  }

  const model = env.DEEPSEEK_MODEL || DEFAULT_MODEL;

  try {
    const text = await requestReading(apiKey, model, prompt);
    return json({ text });
  } catch (err: any) {
    console.error("[DeepSeek] 解析异常:", err?.message || err);
    const message = err?.message || "AI Interpretation failed";
    const status =
      message.includes("未能生成") || message.includes("调用失败") ? 502 : 500;
    return json({ error: message }, status);
  }
}

/**
 * 调用 DeepSeek 生成解读文本。
 *
 * deepseek-v4-flash 是推理型模型：开启思考(thinking)时，max_tokens 的预算会被
 * 「思考(reasoning)」吃掉大部分甚至全部，导致最终答案(content)为空或被截断——
 * 这正是此前六爻「解析失败 / 解析一半」的根因；且开启思考时单次生成常超 70 秒，
 * 会撞上 Cloudflare Pages Functions 的超时限制。
 *
 * 因此这里显式关闭思考模式（thinking.type=disabled），让模型直接输出最终答案：
 * 速度快（约 10 秒）、不超时、内容完整。若遇极端超长内容被截断，再放大预算重试一次。
 */
async function requestReading(
  apiKey: string,
  model: string,
  prompt: string,
): Promise<string> {
  const budgets = [8192, 16384];

  for (const max_tokens of budgets) {
    const isLast = max_tokens === budgets[budgets.length - 1];

    const upstream = await fetch(DEEPSEEK_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens,
        thinking: { type: "disabled" },
        stream: false,
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error(`[DeepSeek] 调用失败 (${upstream.status}):`, errText);
      throw new Error(`AI 服务调用失败 (${upstream.status})，请稍后重试。`);
    }

    const data: any = await upstream.json();
    const choice = data?.choices?.[0];
    const text: string = choice?.message?.content ?? "";
    const finishReason: string = choice?.finish_reason ?? "";

    // 正常结束且拿到最终答案
    if (text && finishReason !== "length") {
      return text;
    }

    // 因长度被截断：推理预算吃光，若有更大预算则重试，否则用已有内容兜底
    if (finishReason === "length") {
      if (!isLast) {
        console.warn(
          `[DeepSeek] max_tokens=${max_tokens} 被截断(finish_reason=length)，放大预算重试。`,
        );
        continue;
      }
      if (text) return text;
      throw new Error("AI 未能生成有效的解析结果，请重试。");
    }

    // 未截断但 content 为空（模型罕见地未产出最终答案）
    if (!isLast) continue;
    throw new Error("AI 未能生成有效的解析结果，请重试。");
  }

  throw new Error("AI 未能生成有效的解析结果，请重试。");
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
    },
  });
}
