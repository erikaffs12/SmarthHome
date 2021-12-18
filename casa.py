class Casa():
	def __init__(self):
		self.focos= []
		self.camaras= []
		self.timbre= 0
		self.cochera= None
	def nuevoFoco(self,foco):
		self.focos.append(foco)