@app.post("/ask/", response_model=AnswerListResponse)
async def ask(payload: QuestionRequest):
    question = payload.question

    # 1️⃣ Get ayahs from Qdrant
    ayah_results = find_top_5_ayahs_qdrant(question)

    # 2️⃣ Generate reflection using Azure LLM
    messages = [
        {
            "role": "system",
            "content": (
                "You are a compassionate Islamic guide who offers short (≤3 lines) "
                "spiritual reflections. Speak with empathy, hope, and gentle wisdom. "
                "Do NOT quote or refer to Qur’an verses, as they are provided separately."
            ),
        },
        {"role": "user", "content": question},
    ]

    try:
        completion = client.chat.completions.create(
            model=deployment_name,
            messages=messages,
            max_tokens=120,
            temperature=0.8,
        )
        reflection_text = completion.choices[0].message.content
    except Exception as e:
        reflection_text = f"⚠️ Error generating reflection: {str(e)}"

    # 3️⃣ Return structured response
    return AnswerListResponse(
        reflection=ReflectionResponse(reflection=reflection_text),
        ayahs=ayah_results,
    )
