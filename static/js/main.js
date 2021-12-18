
var detectorBotones = document.getElementsByClassName('btn-warning')

for (var i=0; i < detectorBotones.length; i++){
    var button = detectorBotones[i]
    button.addEventListener('click', function(event) {
        var botonClikeado = event.target
        presionado = botonClikeado.innerText    //Obtener el nombre del botón
        console.log(presionado)
    })
}

function actualizaLucesEstado(num,estado)
{
    var imagen= document.getElementById('foco '+num);
    if(estado=="OFF")
    {
        imagen.src="../static/img/OFF.jpg";
    }
    else
    {
        imagen.src="../static/img/ON.jpg";
    }
}

function actualizaLucesIntensidad(id,porcentaje)
{
    var imagen= document.getElementById("foco"+id);
    if(porcentaje>=0 && porcentaje<4){imagen.src="../static/img/atenuacion/atenuacion30.jpg"} //30
    else if(porcentaje>=4 && porcentaje<8){imagen.src="../static/img/atenuacion/atenuacion29.jpg"} //29
    else if(porcentaje>=8 && porcentaje<12){imagen.src="../static/img/atenuacion/atenuacion28.jpg"} //28
    else if(porcentaje>=12 && porcentaje<16){imagen.src="../static/img/atenuacion/atenuacion27.jpg"}//27
    else if(porcentaje>=16 && porcentaje<20){imagen.src="../static/img/atenuacion/atenuacion26.jpg"}//26
    else if(porcentaje>=20 && porcentaje<25){imagen.src="../static/img/atenuacion/atenuacion25.jpg"}//25
    else if(porcentaje>=25 && porcentaje<29){imagen.src="../static/img/atenuacion/atenuacion24.jpg"}//24
    else if(porcentaje>=29 && porcentaje<33){imagen.src="../static/img/atenuacion/atenuacion23.jpg"}//23
    else if(porcentaje>=33 && porcentaje<35){imagen.src="../static/img/atenuacion/atenuacion22.jpg"}//22
    else if(porcentaje>=35 && porcentaje<37){imagen.src="../static/img/atenuacion/atenuacion21.jpg"}//21
    else if(porcentaje>=37 && porcentaje<39){imagen.src="../static/img/atenuacion/atenuacion20.jpg"}//20
    else if(porcentaje>=39 && porcentaje<41){imagen.src="../static/img/atenuacion/atenuacion19.jpg"}//19
    else if(porcentaje>=41 && porcentaje<44){imagen.src="../static/img/atenuacion/atenuacion18.jpg"}//18
    else if(porcentaje>=44 && porcentaje<46){imagen.src="../static/img/atenuacion/atenuacion17.jpg"}//17
    else if(porcentaje>=46 && porcentaje<49){imagen.src="../static/img/atenuacion/atenuacion16.jpg"}//16
    else if(porcentaje>=49 && porcentaje<51){imagen.src="../static/img/atenuacion/atenuacion15.jpg"}//15
    else if(porcentaje>=51 && porcentaje<54){imagen.src="../static/img/atenuacion/atenuacion14.jpg"}//14
    else if(porcentaje>=54 && porcentaje<57){imagen.src="../static/img/atenuacion/atenuacion13.jpg"}//13
    else if(porcentaje>=57 && porcentaje<60){imagen.src="../static/img/atenuacion/atenuacion12.jpg"}//12
    else if(porcentaje>=60 && porcentaje<63){imagen.src="../static/img/atenuacion/atenuacion11.jpg"}//11
    else if(porcentaje>=63 && porcentaje<66){imagen.src="../static/img/atenuacion/atenuacion10.jpg"}//10
    else if(porcentaje>=66 && porcentaje<69){imagen.src="../static/img/atenuacion/atenuacion9.jpg"}//9
    else if(porcentaje>=69 && porcentaje<72){imagen.src="../static/img/atenuacion/atenuacion8.jpg"}//8
    else if(porcentaje>=72 && porcentaje<75){imagen.src="../static/img/atenuacion/atenuacion7.jpg"}//7
    else if(porcentaje>=75 && porcentaje<78){imagen.src="../static/img/atenuacion/atenuacion6.jpg"}//6
    else if(porcentaje>=78 && porcentaje<81){imagen.src="../static/img/atenuacion/atenuacion5.jpg"}//5
    else if(porcentaje>=81 && porcentaje<84){imagen.src="../static/img/atenuacion/atenuacion4.jpg"}//4
    else if(porcentaje>=84 && porcentaje<88){imagen.src="../static/img/atenuacion/atenuacion3.jpg"}//3
    else if(porcentaje>=88 && porcentaje<92){imagen.src="../static/img/atenuacion/atenuacion2.jpg"}//2
    else if(porcentaje>=92 && porcentaje<96){imagen.src="../static/img/atenuacion/atenuacion1.jpg"}//1
    else if(porcentaje>=96 && porcentaje<101){imagen.src="../static/img/atenuacion/atenuacion0.jpg"}//0
}

function onoff(num,est)
{
    var dato= new XMLHttpRequest();
    dato.open("POST",'/',true);
    dato.setRequestHeader('Content-Type','application/json');
    dato.send(JSON.stringify({'num':num,'est':est}));
    actualizaLucesEstado(num,est);
}

function intensidad(num,porcentaje)
{
    var dato= new XMLHttpRequest();
    dato.open("POST",'/',true);
    dato.setRequestHeader('Content-Type','application/json');
    dato.send(JSON.stringify({'num':num,'porcentaje':porcentaje}));
    actualizaLucesIntensidad(num,porcentaje);
}

function intensidad2(num,porcentaje)
{
    var dato= new XMLHttpRequest();
    dato.open("POST",'/',true);
    dato.setRequestHeader('Content-Type','application/json');
    dato.send(JSON.stringify({'num':num,'porcentaje':porcentaje}));
}

function tocarTimbre()
{
    alert("Se ha tocado el timbre")
}

function mensajefocos(foco){
    var dato= new XMLHttpRequest();
    dato.open("POST",'/',true);
    horaencendido = document.getElementsByName("horaenc")[0].value;
    minutoencendido = document.getElementsByName("minutoenc")[0].value;
    horaapagado = document.getElementsByName("horaapag")[0].value;
    minutoapagado = document.getElementsByName("minutoapag")[0].value;
    if((horaencendido>=0 && horaencendido<24))
    {
        if((horaapagado>=0 && horaapagado<24))
        {
            if((minutoencendido>=0 && minutoencendido<60))
            {
                if((minutoapagado>=0 && minutoapagado<60))
                {   
                    alert("El foco "+foco+" se encenderá a las " +horaencendido+ " horas con " +minutoencendido+ " minutos y se apagará a las " +horaapagado+ " horas con " +minutoapagado+ " minutos");
                    dato.setRequestHeader('Content-Type','application/json')
                    dato.send(JSON.stringify({'foco':foco,"horai":horaencendido,"horaf":horaapagado,'mini':minutoencendido,'minf':minutoapagado}))
                }
                else
                {
                    alert("Introduzca una hora valida en formato de 24 horas.")
                }
            }
            else{
                alert("Introduzca una hora valida en formato de 24 horas.")
            }
        }
        else{
            alert("Introduzca una hora valida en formato de 24 horas.")
        }
    }
    else{
        alert("Introduzca una hora valida en formato de 24 horas.")
    }
    
}
