import { cuentas } from '../db/db.js';

// OBTENER EL NOMBRE LA PAGINA ACTIVA
function getNameURLWeb() {
    var sPath = window.location.pathname;
    var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
    return sPage;
}

// DESHABILITAR EL TECLADO
document.onkeydown = function(e) {
    return false;
}

// VARIABLES
let cuentaSeleccionada = '';
let nombrePagina = getNameURLWeb();
nombrePagina = nombrePagina.split('.')[0];




//ELEMENTOS
const concapturaDato = document.querySelector('#capturaDato');
const consaldoActual = document.querySelector('#saldoActual');

const btnNoMostrarSaldo = document.querySelector('#btnNoMostrarSaldo');

const h1UserSaldo = document.querySelector('#UserSaldo');
const h1SaldoAnterior = document.querySelector('#SaldoAnterior');
const h1Movto = document.querySelector('#Movto');
const h1Saldo = document.querySelector('#Saldo');




window.onload = () => {
    // console.log(cuentas);
    // console.log(nombrePagina);
    switch (nombrePagina) {
        case 'index', '':
            existeCuentaActiva() == "true" ? document.location.href = './pages/operaciones.html' : null;
            console.log('Estas en index')

            break;

        case 'cuentas':
            //console.log('Estas en cuentas')
            existeCuentaActiva() == "true" ? document.location.href = './operaciones.html' : loadCuentas();

            break;

        case 'login':
            existeCuentaActiva() == "true" ? document.location.href = './operaciones.html' : loadLogin();
            break;


        case 'operaciones':
            existeCuentaActiva() == "false" ? document.location.href = '../index.html' : loadOperaciones();
            break;

        case 'consulta':
            existeCuentaActiva() == "false" ? document.location.href = '../index.html' : loadConsulta();
            break;

        case 'retiro':
            existeCuentaActiva() == "false" ? document.location.href = '../index.html' : loadRetiro();
            break;

        case 'ingreso':
            existeCuentaActiva() == "false" ? document.location.href = '../index.html' : loadIngreso();
            break;

        default:
            break;
    }
}

// VALIDA SI LA CUENTA YA ESTA FIRMADA
const existeCuentaActiva = () => localStorage.getItem("Validado");



// *****************************
// INDEX PAGE - START
// *****************************
const btnCuentas = document.querySelector('#btnCuentas');

if (nombrePagina === '' || nombrePagina === 'index') {
    // Eventos
    btnCuentas.addEventListener('click', () => {

        console.log('hola');
        document.location.href = './pages/cuentas.html';

    });
}

// *****************************
// INDEX PAGE - FINISH
// *****************************


// *****************************
// CUENTAS PAGE - START
// *****************************
const contenedorCuentas = document.querySelector('#contenedorCuentas');

const loadCuentas = () => {
    let spanCuenta

    cuentas.forEach(cuenta => {
        // console.log(cuenta);
        spanCuenta = document.createElement('span');

        spanCuenta.innerHTML = `Cuenta ${ cuenta.nombre }`;
        spanCuenta.classList.add('btn');
        spanCuenta.classList.add('btn-primary');
        spanCuenta.classList.add('btncuenta');
        spanCuenta.classList.add('m-3');
        spanCuenta.classList.add('w-100');
        spanCuenta.addEventListener('click', clickCuenta);
        spanCuenta.setAttribute("id", cuenta.id);

        contenedorCuentas.append(spanCuenta);
    });
}

function clickCuenta(e) {
    // console.log(e.target.id);
    cuentaSeleccionada = cuentas.filter((cuenta) => cuenta.id == e.target.id);
    cuentaSeleccionada = cuentaSeleccionada[0];
    // console.log(cuentaSeleccionada);
    localStorage.setItem("CuentaActiva", JSON.stringify(cuentaSeleccionada));
    localStorage.setItem("Validado", false);
    document.location.href = './login.html';
}

// *****************************
// CUENTAS PAGE - FINISH
// *****************************


// *****************************
// TECLADO - START
// *****************************

const inputPass = document.querySelector('#pass');
const inputImporte = document.querySelector('#importe');
const btn1 = document.querySelector('#btn1');
const btn2 = document.querySelector('#btn2');
const btn3 = document.querySelector('#btn3');
const btn4 = document.querySelector('#btn4');
const btn5 = document.querySelector('#btn5');
const btn6 = document.querySelector('#btn6');
const btn7 = document.querySelector('#btn7');
const btn8 = document.querySelector('#btn8');
const btn9 = document.querySelector('#btn9');
const btn0 = document.querySelector('#btn0');
const btnB = document.querySelector('#btnB');
const btnE = document.querySelector('#btnE');

function tecladoCalculadora(tecla = '', tipo = 'login') {

    // console.log(tipo);
    let cuentaActiva = {}
    let respuesta = {}

    tecla = tecla.substring(3, 4);

    if (tipo == 'login') {
        if (inputPass.textContent.length === 4 && tecla !== "E" && tecla !== "B") return;

    } else {
        if (inputImporte.textContent.length === 3 && tecla !== "E" && tecla !== "B") return;
    }
    // console.log(tecla);

    switch (tecla) {
        case 'E':

            if (tipo == 'login') {

                respuesta = validaPass(inputPass.textContent);

                // console.log(respuesta);

                if (respuesta.ok) {
                    localStorage.setItem("Validado", true);
                    document.location.href = './operaciones.html';
                    inputImporte.value = "";
                    inputImporte.textContent = "";
                } else {
                    mostrarMensaje(respuesta.mensaje);
                }

            } else {
                cuentaActiva = JSON.parse(localStorage.getItem("CuentaActiva"));
                // console.log(cuentaActiva);

                respuesta = validaImporte(Number(inputImporte.textContent), nombrePagina, cuentaActiva.saldo);
                if (respuesta.ok) {
                    if (tipo == 'ingreso') {

                        h1UserSaldo.innerHTML = `Saldo de ${ cuentaActiva.nombre }`
                        h1SaldoAnterior.innerHTML = `Saldo Anterior: ${ cuentaActiva.saldo }`
                        h1Movto.innerHTML = `Ingreso       : ${ Number(inputImporte.textContent) }`
                        cuentaActiva.saldo += Number(inputImporte.textContent)
                        h1Saldo.innerHTML = `Saldo Actual  : ${ cuentaActiva.saldo }`


                    } else {
                        h1UserSaldo.innerHTML = `Saldo de ${ cuentaActiva.nombre }`
                        h1SaldoAnterior.innerHTML = `Saldo Anterior: ${ cuentaActiva.saldo }`
                        h1Movto.innerHTML = `Retiro        : ${ Number(inputImporte.textContent) }`
                        cuentaActiva.saldo -= Number(inputImporte.textContent)
                        h1Saldo.innerHTML = `Saldo Actual  : ${ cuentaActiva.saldo }`
                    }

                    inputImporte.value = "";
                    inputImporte.textContent = "";

                    localStorage.setItem("CuentaActiva", JSON.stringify(cuentaActiva));

                    //MUESTRA LA OTRA INFO DE SALDOS
                    concapturaDato.classList.add("noMostrar");
                    consaldoActual.classList.remove("noMostrar");


                } else {
                    mostrarMensaje(respuesta.mensaje);
                }

            }
            return;
        case 'B':
            if (tipo == 'login') {

                if (inputPass.textContent.length > 0) {
                    inputPass.textContent = inputPass.textContent.substring(0, inputPass.textContent.length - 1)
                    inputPass.value = inputPass.textContent;
                    // console.log(inputPass.textContent);
                }
            } else {
                if (inputImporte.textContent.length > 0) {
                    inputImporte.textContent = inputImporte.textContent.substring(0, inputImporte.textContent.length - 1)
                    inputImporte.value = inputImporte.textContent;
                    // console.log(inputPass.textContent);
                }
            }
            return;

        default:
            break;
    }

    if (tipo == 'login') {
        inputPass.textContent += tecla;
        inputPass.value = inputPass.textContent;
    } else {
        inputImporte.textContent += tecla;
        inputImporte.value = inputImporte.textContent;
    }

    // console.log(inputPass.textContent);
}

const validaPass = (pass = "") => {

    if (pass.length < 4) return { ok: false, mensaje: 'La contraseña debe de ser de 4 digitos' }

    let cuentaActiva = JSON.parse(localStorage.getItem("CuentaActiva"));

    if (pass != cuentaActiva.password) return { ok: false, mensaje: 'la contraseña es incorrecta verifique' }

    return { ok: true, mensaje: '' }
}


const validaImporte = (importe = 0, tipo = 'retiro', saldo = 0) => {

    if (tipo == 'ingreso') {
        if ((importe + saldo) > 990) {
            return { ok: false, mensaje: 'No es posible tener un saldo mayor a 990' }
        }
    } else {
        if ((saldo - importe) < 10) {
            return { ok: false, mensaje: 'No es posible dejar un saldo menor a 10' }
        }
    }


    return { ok: true, mensaje: 'Todo correcto' }
}


const mostrarMensaje = (mensaje = "") => {
    //alert(mensaje);
    swal("Error", mensaje, "error");
}

// E V E N T O S
if (!!btn1) btn1.addEventListener('click', function(e) { tecladoCalculadora(e.target.id, nombrePagina) });
if (!!btn1) btn3.addEventListener('click', function(e) { tecladoCalculadora(e.target.id, nombrePagina) });
if (!!btn1) btn2.addEventListener('click', function(e) { tecladoCalculadora(e.target.id, nombrePagina) });
if (!!btn1) btn4.addEventListener('click', function(e) { tecladoCalculadora(e.target.id, nombrePagina) });
if (!!btn1) btn5.addEventListener('click', function(e) { tecladoCalculadora(e.target.id, nombrePagina) });
if (!!btn1) btn6.addEventListener('click', function(e) { tecladoCalculadora(e.target.id, nombrePagina) });
if (!!btn1) btn7.addEventListener('click', function(e) { tecladoCalculadora(e.target.id, nombrePagina) });
if (!!btn1) btn8.addEventListener('click', function(e) { tecladoCalculadora(e.target.id, nombrePagina) });
if (!!btn1) btn9.addEventListener('click', function(e) { tecladoCalculadora(e.target.id, nombrePagina) });
if (!!btn1) btn0.addEventListener('click', function(e) { tecladoCalculadora(e.target.id, nombrePagina) });
if (!!btn1) btnB.addEventListener('click', function(e) { tecladoCalculadora(e.target.id, nombrePagina) });
if (!!btn1) btnE.addEventListener('click', function(e) { tecladoCalculadora(e.target.id, nombrePagina) });


// *****************************
// TECLADO - FIN
// *****************************




// *****************************
// LOGIN PAGE - START
// *****************************
const h1UserLogin = document.querySelector('#userLogin');


const loadLogin = () => {
    let cuentaActiva = JSON.parse(localStorage.getItem("CuentaActiva"));
    h1UserLogin.innerHTML = `Bienvenid@ ${ cuentaActiva.nombre }`;
    // console.log('si funciona');
}

// *****************************
// OPERACIONES PAGE - START
// *****************************
const btnCerrarSesion = document.querySelector('#btnCerrarSesion');
const h1User = document.querySelector('#User');
const btnConsulta = document.querySelector('#btnConsulta');
const btnIngreso = document.querySelector('#btnIngreso');
const btnRetiro = document.querySelector('#btnRetiro');

if (!!btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', () => {

        // console.log('hola');
        localStorage.removeItem('CuentaActiva');
        localStorage.removeItem('Validado');
        document.location.href = '../index.html';

    });
}

if (nombrePagina === 'operaciones') {
    // Eventos
    btnConsulta.addEventListener('click', () => {
        document.location.href = './consulta.html';
    });

    btnIngreso.addEventListener('click', () => {
        document.location.href = './ingreso.html';
    });

    btnRetiro.addEventListener('click', () => {
        document.location.href = './retiro.html';
    });
}

const loadOperaciones = () => {

    let cuentaActiva = JSON.parse(localStorage.getItem("CuentaActiva"));
    h1User.innerHTML = `Bienvenid@ ${ cuentaActiva.nombre }`;

}

// *****************************
// CONSULTA PAGE - START
// *****************************

const btnRegresar = document.querySelector('#btnRegresar');
const h1ImporteConsulta = document.querySelector('#importeConsulta');

if (!!btnRegresar) {
    btnRegresar.addEventListener('click', () => {
        document.location.href = './operaciones.html';
    });
}


const loadConsulta = () => {

    let cuentaActiva = JSON.parse(localStorage.getItem("CuentaActiva"));
    h1User.innerHTML = `Bienvenid@ ${ cuentaActiva.nombre }`;
    h1ImporteConsulta.innerHTML = `${ Number(cuentaActiva.saldo).toFixed(2) }`;

}


// *****************************
// INGRESO PAGE - START
// *****************************


if (!!btnNoMostrarSaldo) {
    btnNoMostrarSaldo.addEventListener('click', () => {
        concapturaDato.classList.remove("noMostrar");
        consaldoActual.classList.add("noMostrar");
    });
}


const loadIngreso = () => {

    let cuentaActiva = JSON.parse(localStorage.getItem("CuentaActiva"));
    h1User.innerHTML = `Bienvenid@ ${ cuentaActiva.nombre }`;
}

// *****************************
// RETIRO PAGE - START
// *****************************

const loadRetiro = () => {

    let cuentaActiva = JSON.parse(localStorage.getItem("CuentaActiva"));
    h1User.innerHTML = `Bienvenid@ ${ cuentaActiva.nombre }`;

}