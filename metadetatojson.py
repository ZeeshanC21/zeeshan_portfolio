import firebase_admin
from firebase_admin import credentials, firestore
import json

# Initialize Firebase Admin (replace with your actual file path)
cred = credentials.Certificate('myportfolioservicekey.json')
firebase_admin.initialize_app(cred)

# Get Firestore client
db = firestore.client()

def export_collection_to_json():
    try:
        # Get all documents from your collection
        docs = db.collection('lovedones').stream()
        
        data = {}
        count = 0
        
        print("Starting export...")
        
        for doc in docs:
            data[doc.id] = doc.to_dict()
            count += 1
            print(f"Processed document {count}: {doc.id}")
        
        # Save to JSON file
        with open('firestore_export.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False, default=str)
        
        print(f'\n✅ Successfully exported {count} documents!')
        print('📁 File saved as: firestore_export.json')
        
        # Show a preview
        if data:
            print("\n📋 Preview of first document:")
            first_key = next(iter(data))
            print(f"Document ID: {first_key}")
            print(json.dumps(data[first_key], indent=2, default=str)[:200] + "...")
        
    except Exception as error:
        print(f'❌ Error during export: {error}')
        print("\n🔧 Common fixes:")
        print("1. Make sure your service account key path is correct")
        print("2. Check if the collection name 'lovedones' is correct")
        print("3. Verify your Firebase project permissions")

if __name__ == "__main__":
    export_collection_to_json()