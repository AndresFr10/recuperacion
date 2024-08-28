
class Animal:
    def __init__(self,nombre,zona_zoologico,alimentacion):
        self.nombre = nombre
        self.zona_zoologico = zona_zoologico
        self.alimentacion = alimentacion

    def getAnimal(self):
        return {
            "nombre":self.nombre,
            "zona_zoologico":self.zona_zoologico,
            "alimentacion":self.alimentacion
        }    