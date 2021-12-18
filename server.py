import re
#from typing_extensions import Required
from flask import Flask, request, render_template, Response, jsonify, redirect, url_for
from werkzeug import datastructures
import iluminacion
import cv2
import threading
import json
import numpy as np
import casa
import time
from datetime import datetime, timedelta

import RPi.GPIO as GPIO
app = Flask(__name__)
fdata= {}
c=casa.Casa() #se crea un objeto casa
camara = cv2.VideoCapture(0)

prendio= False
GPIO.setmode(GPIO.BOARD)
GPIO.setup(3,GPIO.OUT,initial=GPIO.LOW) #foco 1
GPIO.setup(5,GPIO.OUT,initial=GPIO.LOW) #foco 2 led -> pwm
GPIO.setup(7,GPIO.OUT,initial=GPIO.LOW) #foco 3
GPIO.setup(11,GPIO.IN)
pwm=GPIO.PWM(32,100)
GPIO.setup(11,GPIO.IN)
def PWM(foco,duty):  #vamos a utilizar una frecuencia de 100 Hz
   try:
        while foco.intensidad!=0 and foco.intensidad!=100: #cuando la condicion no se cumple, termina
            GPIO.output(5,GPIO.HIGH)
            time.sleep(foco.intensidad/10000) 
            GPIO.output(5,GPIO.LOW)
            time.sleep((100-foco.intensidad)/10000)
   except KeyboardInterrupt:
        print("El servidor se detuvo.")

f1= iluminacion.Iluminacion("Cocina","INCANDESCENTE")
f2= iluminacion.Iluminacion("Sala","LED")
f3= iluminacion.Iluminacion("Entrada","INCANDESCENTE")
c.nuevoFoco(f1) #posicion en la lista+1= id
c.nuevoFoco(f2) 
c.nuevoFoco(f3) 
fourcc = cv2.VideoWriter_fourcc(*'XVID')
t=None
def frames():
    while True:
        aux, camaravigilancia = obtener_frames()
        if not aux:
            break
        else:
            yield b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + camaravigilancia + b"\r\n" #regresa la imagen en respyesta HTTP

def escucharTimbre():
    try:
        while True:
            if GPIO.input(11)==1:
                return render_template("timbre.html",msg="alert('se ha tocado el timbre')")
    except KeyboardInterrupt: # el hilo se termina
        print("El servidor se deshabilito")

def lucespr(foco,numf,tipo):
    try:
        now=datetime.now()
        initime=now+timedelta(hours=foco.horai,minutes=foco.mini)
        slptime=initime-now
        time.sleep(slptime.total_seconds())
        if numf==0:
            GPIO.output(3,GPIO.HIGH)
            now=datetime.now()
            fintime=now+timedelta(hours=foco.horaf,minutes=foco.minf)
            slptime=fintime-now
            time.sleep(slptime.total_seconds())
            GPIO.output(3,GPIO.LOW)
        elif numf==1:
            GPIO.output(5,GPIO.HIGH)
            now=datetime.now()
            fintime=now+timedelta(hours=foco.horaf,minutes=foco.minf)
            slptime=fintime-now
            time.sleep(slptime.total_seconds())
            GPIO.output(5,GPIO.LOW)
        elif numf==2:
            GPIO.output(7,GPIO.HIGH)
            now=datetime.now()
            fintime=now+timedelta(hours=foco.horaf,minutes=foco.minf)
            slptime=fintime-now
            time.sleep(slptime.total_seconds())
            GPIO.output(7,GPIO.LOW)
        foco.horai= None
        foco.horaf= None
        foco.mini= None
        foco.minf= None
    except KeyboardInterrupt:
        print("El servidor se deshabilitó")

def obtener_frames():
    aux, frame = camara.read()
    if not aux:
        return False, None
    _, bufer = cv2.imencode(".jpg", frame)
    camaravigilancia = bufer.tobytes() #codificar la imagen
    return True, camaravigilancia

@app.route("/streaming_camara")
def streaming_camara():
    return Response(frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/cameras', methods=["GET", "POST"])
def cameras():
    return render_template("camara.html")

@app.route('/onoff', methods=["GET", "POST"])
def onoffluces():
    luces=[c.focos[0],c.focos[1],c.focos[2]]
    if request.method=="POST":
        numf=request.json['num']-1
        c.focos[numf].estado=request.json['est'] #actualiza estado del foco n
        if c.focos[numf].estado=="ON":
            if numf==0:
                GPIO.output(3,GPIO.HIGH)
            elif numf==1:
                GPIO.output(5,GPIO.HIGH)
            elif numf==2:
                GPIO.output(7,GPIO.HIGH)
        else:
            if numf==0:
                GPIO.output(3,GPIO.LOW)
            elif numf==1:
                GPIO.output(5,GPIO.LOW)
            elif numf==2:
                GPIO.output(7,GPIO.LOW)
    return render_template("onOff.html",luces=luces)

@app.route("/atenuacion",methods=["POST","GET"])
def atenuacion():
    if request.method=="POST":
        led=c.focos[request.json['num']-1]
        if led.tipo!= "LED":
            return render_template("atenuado.html")
        led.intensidad=request.json['porcentaje']
        h=threading.Thread(target="PWM",args=(led,led.controlIntensidad()))
        h.start()
    return render_template("atenuado.html")

@app.route("/timbre",methods=["POST","GET"])
def puerta():
    return render_template("timbre.html")

@app.route("/progluc",methods=["POST","GET"])
def controlarLuces():
    if(request.method=="POST"):
        horai=request.json['horai']
        mini=request.json['mini']
        horaf=request.json['horaf']
        minf=request.json['minf']
        numf=request.json['foco']
        c.focos[numf-1].horai=horai
        c.focos[numf-1].mini=mini
        c.focos[numf-1].horaf=horaf
        c.focos[numf-1].minf=minf
        hel=threading.Thread(target=lucespr,args=(c.focos[numf-1],numf-1))
        hel.start()
        return redirect(url_for('controlarLuces'))
    else:
        return render_template('programacionLuces.html')

@app.route("/",methods=["POST","GET"])
def menu():
    return render_template("remoto.html")

if __name__ == '__main__':
    print("SE INICIÓ LA CASA")
    ht=threading.Thread(target=escucharTimbre) #se ejecuta siempre por que debe de escuchar al timbre siempre.
    ht.start()
    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(host='0.0.0.0',debug=True)
