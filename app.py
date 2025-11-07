from flask import Flask, request, jsonify
import google.generativeai as genai
import tempfile, os
from pydub import AudioSegment
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # <- Add this
genai.configure(api_key="AIzaSyDKOaMHPWU39MpZYxh0ZLBCcSqGiseOPBs")

@app.route("/api/summarize", methods=["POST"])
def summarize_file():
    
    file = request.files["file"]
    type_of_content = request.form.get("content_type", "Class") # Default to 'Meeting' if not provided
    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        file.save(tmp.name)
        temp_path = tmp.name

    # Convert to mp3 if video
    if file.filename.endswith((".mp4", ".mkv", ".mov")):
        audio = AudioSegment.from_file(temp_path)
        audio_path = temp_path + ".mp3"
        audio.export(audio_path, format="mp3")
    else:
        audio_path = temp_path
    # 1. Define your detailed prompt as a variable
    detailed_prompt = f"""
    You are an expert summarization assistant. Your task is to analyze the provided [TYPE_OF_CONTENT] audio transcription 
    and output a clean, concise summary and a set of tasks. 

    Rules:
    1. Do NOT include any bold or markdown headers in your response.
    2. Format the output exactly as:
       Summary:-
       <summary paragraph>

       Tasks to be done - by mindmeet
       <task 1>
       <task 2> and so on
    3. If content_type is 'Meeting', include Minutes of Meeting. Otherwise skip.
    4. If there are no explicit tasks mentioned in the audio, generate up to 2 tasks relevant to the content. 
       For example, if the audio is about a class topic like Arrays, generate related exercises. 
       If the audio is casual like birthday wishes, generate creative or relevant small tasks.

    [TYPE_OF_CONTENT]: {type_of_content}
    """
    final_prompt = detailed_prompt.replace("[TYPE_OF_CONTENT]", type_of_content) # Or "Class"

    model = genai.GenerativeModel("gemini-2.5-flash")
    result = model.generate_content(
        [final_prompt, {"mime_type": "audio/mp3", "data": open(audio_path, "rb").read()}]
    )

    os.remove(temp_path)
    if os.path.exists(audio_path):
        os.remove(audio_path)

    return jsonify({"summary": result.text})

@app.route("/generate_quiz", methods=["POST"])
def generate_quiz():
    import re, json
    data = request.get_json()
    summary = data.get("summary", "")

    if not summary:
        return jsonify({"error": "Summary not provided"}), 400

    prompt = f"""
    You are a smart quiz generator.

    Read the following summary and decide if it contains enough factual or conceptual material (like a class, lecture, or educational topic).

    If it does, create **10 multiple-choice questions (MCQs)** based on it.

    Each question should follow this format exactly:

    Q1. <question text>
    A) <option A>
    B) <option B>
    C) <option C>
    D) <option D>
    ✅ Correct Answer: <Correct Option Letter> - <Correct Option Text>

    Make sure the questions are relevant, concise, and varied (mix of concept-based and factual if possible).

    If there is not enough meaningful content in the summary to form 10 quiz questions, respond only with:
    ⚠️ Not enough information to create a quiz.

    Summary:
    {summary}
    """

    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content(prompt)
    quiz_text = response.text.strip()
    if "⚠️" in quiz_text:
        return jsonify({"quiz": []})

    # ✅ Parse quiz text into structured JSON
    quiz_pattern = re.compile(
        r"Q\d+\.\s*(.*?)\s*A\)\s*(.*?)\s*B\)\s*(.*?)\s*C\)\s*(.*?)\s*D\)\s*(.*?)\s*✅\s*Correct Answer:\s*([A-D])\s*-\s*(.*)",
        re.DOTALL
    )

    quiz = []
    for match in quiz_pattern.findall(quiz_text):
        question, a, b, c, d, correct_letter, correct_text = match
        options = [a.strip(), b.strip(), c.strip(), d.strip()]
        quiz.append({
            "question": question.strip(),
            "options": options,
            "answer": correct_text.strip()
        })

    return jsonify({"quiz": quiz})

if __name__ == "__main__":
    app.run(debug=True)