from pymongo import  MongoClient
import certifi

MONGO_URI = "mongodb+srv://andres:12345@cluster0.lcis0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
ca = certifi.where()

def getconexion():
    try:
        client = MongoClient(MONGO_URI,tlsCAFile=ca)
        db = client["zoologico"]
    except ConnectionError as e:
        print("Error en la conexion:"+str(e))  
    return db      