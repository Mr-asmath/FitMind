import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import os

class ExerciseRecommender:
    def __init__(self, dataset_path='model/dataset.csv'):
        self.dataset_path = dataset_path
        self.model_path = 'exercise_recommender.joblib'
        self.vectorizer_path = 'tfidf_vectorizer.joblib'
        self.model = None
        self.vectorizer = None
        self.df = None
        
        self.load_or_train_model()

    def load_dataset(self):
        self.df = pd.read_csv(self.dataset_path)
        # Combine relevant features for recommendation
        self.df['features'] = self.df['maintype'] + ' ' + self.df['type'] + ' ' + self.df['level'].astype(str)

    def train_model(self):
        self.vectorizer = TfidfVectorizer()
        tfidf_matrix = self.vectorizer.fit_transform(self.df['features'])
        
        # Save the trained model and vectorizer
        joblib.dump(tfidf_matrix, self.model_path)
        joblib.dump(self.vectorizer, self.vectorizer_path)
        
        return tfidf_matrix

    def load_or_train_model(self):
        if os.path.exists(self.model_path) and os.path.exists(self.vectorizer_path):
            self.model = joblib.load(self.model_path)
            self.vectorizer = joblib.load(self.vectorizer_path)
            self.load_dataset()
        else:
            self.load_dataset()
            self.model = self.train_model()

    def recommend_exercises(self, activity_type, focus_area, level=0):
        query = f"{activity_type} {focus_area} {level}"
        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.model).flatten()
        
        # Get top 5 most similar exercises
        similar_indices = similarities.argsort()[::-1][:5]
        recommendations = self.df.iloc[similar_indices]
        
        # Extract exercises from the recommendations
        exercises = []
        for _, row in recommendations.iterrows():
            exercises.extend([
                row['exercise1'],
                row['exercise2'],
                row['exercise3'],
                row['exercise4'],
                row['exercise5']
            ])
        
        # Remove duplicates and return
        return list(dict.fromkeys(exercises))[:5]  # Return top 5 unique exercises