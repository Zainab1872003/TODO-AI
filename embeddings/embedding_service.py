from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import chromadb

# --- Initialize Flask App ---
app = Flask(__name__)

# --- Load Models and Clients (once on startup) ---
print("Loading sentence-transformer model...")
# We use the same model as before for consistency
embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
print("Model loaded.")

print("Initializing ChromaDB client...")
# Initialize a persistent client. This will save data to disk in a 'chroma_db' folder.
# This means your vector data will not be lost when the server restarts.
client = chromadb.PersistentClient(path="chroma_db")

# Get or create a "collection". This is like a table in a regular database.
# If the collection already exists, it will just load it.
collection = client.get_or_create_collection(name="tasks")
print("ChromaDB client initialized and collection is ready.")


# --- API Endpoints ---

@app.route('/add-task', methods=['POST'])
def add_task():
    """
    Receives task data, creates an embedding, and stores it in ChromaDB.
    """
    try:
        data = request.get_json()
        task_id = data.get('task_id')
        text = data.get('text')
        user_id = data.get('user_id')

        if not all([task_id, text, user_id]):
            return jsonify({"error": "Missing task_id, text, or user_id"}), 400

        # 1. Create the embedding
        embedding = embedding_model.encode(text).tolist()

        # 2. Store in ChromaDB
        # ChromaDB stores documents (text), metadata, and their IDs.
        # The ID must be a string.
        collection.add(
            embeddings=[embedding],
            documents=[text],
            metadatas=[{"user_id": user_id}],
            ids=[str(task_id)]
        )

        return jsonify({"message": f"Task {task_id} added successfully."}), 201

    except Exception as e:
        print(f"Error in /add-task: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/find-similar', methods=['POST'])
def find_similar():
    """
    Receives a query text and finds the most similar tasks for a specific user.
    """
    try:
        data = request.get_json()
        query_text = data.get('query_text')
        user_id = data.get('user_id')
        n_results = data.get('n_results', 5) # Default to 5 results

        if not all([query_text, user_id]):
            return jsonify({"error": "Missing query_text or user_id"}), 400

        # 1. Create an embedding for the user's query
        query_embedding = embedding_model.encode(query_text).tolist()

        # 2. Query ChromaDB
        # We use a 'where' filter to only search tasks for the specific user.
        results = collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where={"user_id": user_id}
        )

        return jsonify(results), 200

    except Exception as e:
        print(f"Error in /find-similar: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)