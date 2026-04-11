import os
import cv2
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from fastdtw import fastdtw
from scipy.spatial.distance import euclidean
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

app = Flask(__name__)
CORS(app)

# --- CONFIGURARE MEDIAPIPE VISION ---
model_path = 'pose_landmarker_heavy.task' # Asigură-te că fișierul e aici!

base_options = python.BaseOptions(model_asset_path=model_path)
options = vision.PoseLandmarkerOptions(
    base_options=base_options,
    output_segmentation_masks=False
)
detector = vision.PoseLandmarker.create_from_options(options)

def get_angles_from_landmarks(landmarks):
    """Calculează unghiurile folosind obiectele de tip landmark de la Tasks Vision."""
    def calc_angle(a, b, c):
        ba = np.array([a.x - b.x, a.y - b.y])
        bc = np.array([c.x - b.x, c.y - b.y])
        cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
        return np.degrees(np.arccos(np.clip(cosine_angle, -1.0, 1.0)))

    # Landmark-urile în noul API sunt accesate prin index (0-32)
    # 12, 14, 16 = Cot Drept | 11, 13, 15 = Cot Stâng
    # 24, 26, 28 = Genunchi Drept | 23, 25, 27 = Genunchi Stâng
    try:
        cot_r = calc_angle(landmarks[12], landmarks[14], landmarks[16])
        cot_l = calc_angle(landmarks[11], landmarks[13], landmarks[15])
        gen_r = calc_angle(landmarks[24], landmarks[26], landmarks[28])
        gen_l = calc_angle(landmarks[23], landmarks[25], landmarks[27])
        return [cot_r, cot_l, gen_r, gen_l]
    except:
        return [180, 180, 180, 180] # Fallback dacă nu vede corpul bine

def process_video_tasks(video_path):
    """Procesează video folosind noul API Mediapipe Vision."""
    cap = cv2.VideoCapture(video_path)
    signature = []
    
    while cap.isOpened():
        success, frame = cap.read()
        if not success: break
        
        # Convertire frame în obiect MediaPipe Image
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        
        # Detectare
        detection_result = detector.detect(mp_image)
        
        if detection_result.pose_landmarks:
            # Luăm primul set de landmarks detectat (primul om din cadru)
            angles = get_angles_from_landmarks(detection_result.pose_landmarks[0])
            signature.append(angles)
            
    cap.release()
    return np.array(signature)

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'video_student' not in request.files or 'video_prof' not in request.files:
        return jsonify({"error": "Te rugăm să încarci ambele videoclipuri"}), 400
    
    file_student = request.files['video_student']
    file_prof = request.files['video_prof']

    path_s = "temp_student.mp4"
    path_p = "temp_prof.mp4"
    
    file_student.save(path_s)
    file_prof.save(path_p)

    try:
        sig_student = process_video_tasks(path_s)
        sig_prof = process_video_tasks(path_p)

        if len(sig_student) < 5 or len(sig_prof) < 5:
            return jsonify({"error": "Video prea scurt sau corpul nu a fost detectat"}), 400

        # Aliniere DTW
        distance, path = fastdtw(sig_prof, sig_student, dist=euclidean)

        # Feedback
        diffs = np.abs(sig_prof[[p[0] for p in path]] - sig_student[[p[1] for p in path]])
        avg_diffs = np.mean(diffs, axis=0)
        
        # Scorul: ajustăm normalizarea (50 este o eroare mare medie per unghi)
        score = max(0, 100 - (distance / (5 * len(sig_prof))))
        
        labels = ['Cot Drept', 'Cot Stâng', 'Genunchi Drept', 'Genunchi Stâng']
        details = []
        for i, label in enumerate(labels):
            details.append({
                "zone": label,
                "error_magnitude": round(float(avg_diffs[i]), 2),
                "status": "Pass" if avg_diffs[i] < 20 else "Review"
            })

        return jsonify({"score": round(float(score), 2), "details": details})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(path_s): os.remove(path_s)
        if os.path.exists(path_p): os.remove(path_p)

if __name__ == '__main__':
    app.run(port=5000, debug=True)