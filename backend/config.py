import firebase_admin
from firebase_admin import credentials, storage

cred = credentials.Certificate('path/to/serviceAccountKey.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': "gs://mini-project-cbe23.appspot.com",
})
