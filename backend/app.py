
from flask import Flask,request,jsonify
import database as dbase
from zoologico import Animal
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
db = dbase.getconexion()

@app.route("/consultar_animales")
def consultar_animales():
    animales = db['animales']
    nosql = animales.find()
    animales_array = []
    for animal in nosql:
        datosanimal = {
            "nombre":animal.get("nombre"),
            "zona_zoologico":animal.get("zona_zoologico"),
            "alimentacion":animal.get("alimentacion")
        }
        animales_array.append(datosanimal)
    return jsonify(animales_array)       

@app.route("/crear_animal",methods=["POST"])
def crear_animal():
    animales = db['animales']
    datos = request.json
    nombre = datos.get("nombre")
    zona_zoologico = datos.get("zona_zoologico")
    alimentacion =datos.get("alimentacion")
    if nombre.strip() == "" or zona_zoologico.strip()== "" or alimentacion.strip()=="":
        return jsonify({"estado":False,"msg":"datos vacios"})
    animal = Animal(nombre,zona_zoologico,alimentacion)
    animales.insert_one(animal.getAnimal())
    return jsonify({"estado":True,"msg":"registro exitoso"})

@app.route("/eliminar_animal/<nombre>",methods=["DELETE"])
def eliminar_animal(nombre):
    animales = db['animales']
    if nombre.strip() == "" :
        return jsonify({"estado":False,"msg":"datos vacios"})
    animales.delete_one({"nombre":nombre})
    return jsonify({"estado":True,"msg":"eliminacion exitosa"})


@app.route("/dato_animal/<nombre_animal>", methods=["GET"])
def dato_animal(nombre_animal):
    animales = db['animales']
    animal = animales.find_one({"nombre": nombre_animal})

    if animal:
        datosanimal = {
            "nombre": animal.get("nombre"),
            "zona_zoologico": animal.get("zona_zoologico"),
            "alimentacion": animal.get("alimentacion")
        }
        return jsonify(datosanimal)
    else:
        return jsonify({"estado": False, "msg": "Animal no encontrado"})
@app.route("/editar_animal/<nombre_animal>",methods=["PUT"])
def editar_animal(nombre_animal):
    animales = db['animales']
    datos = request.json
    nombre = datos.get("nombre")
    zona_zoologico = datos.get("zona_zoologico")
    alimentacion =datos.get("alimentacion")
    if nombre.strip() == "" or zona_zoologico.strip()== "" or alimentacion.strip()=="":
        return jsonify({"estado":False,"msg":"datos vacios"})
    animales.update_one({"nombre":nombre_animal},{'$set':{"nombre":nombre,"zona_zoologico":zona_zoologico,"alimentacion":alimentacion}})  
    return jsonify({"msg":f'El animal {nombre} se actualizo correctamente'})