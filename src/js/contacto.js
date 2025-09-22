const toastEl = document.getElementById("messageContent");
const messageBody = document.getElementById("messageBody");
const toast = new bootstrap.Toast(toastEl);

//RESERVA
document.getElementById("reservaForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const nombreReserva = document.getElementById("nombreReserva");
    const fechaReserva = document.getElementById("fechaReserva");
    const horaReserva = document.getElementById("horaReserva");
    const personasReserva = document.getElementById("personasReserva");
    const fechaHoraVal = validarFechaHora(fechaReserva, horaReserva);

    if (nombreReserva.value.trim() === '') {
        mostrarToastError('Ingrese un nombre válido');
        return;
    }
    if (!fechaHoraVal.valido) {
        mostrarToastError(fechaHoraVal.mensaje);
        return;
    }

    toastEl.className = "toast align-items-center text-white bg-success border-0";
    messageBody.textContent = "✅ Éxito, se registró su reserva";
    toast.show();

    setTimeout(() => {
        nombreReserva.value = "";
        fechaReserva.value = "";
        horaReserva.value = "";
        personasReserva.value = "";
    }, 3000);
});

function mostrarToastError(mensaje) {
    toastEl.className = "toast align-items-center text-white bg-danger border-0";
    messageBody.textContent = "❌ " + mensaje;
    toast.show();
}

//Validaciones
function validarFechaHora(fechaReserva,horaReserva) {
    if (!fechaReserva.value || !horaReserva.value) {
        return { valido: false, mensaje: "Debe seleccionar fecha y hora" };
    }

    const [hora, minuto] = horaReserva.value.split(":").map(Number);

    const [anio, mes, dia] = fechaReserva.value.split("-").map(Number);

    const fechaHoraReserva = new Date(anio, mes - 1, dia, hora, minuto, 0, 0);

    const ahora = new Date();

    if (fechaHoraReserva.getTime() <= ahora.getTime()) {
        return { valido: false, mensaje: "La fecha y hora deben ser futuras" };
    }

    return { valido: true, mensaje: "" };
}


//CONTACTO
document.getElementById("contactForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const nombreContacto = document.getElementById("nombreContacto");
    const emailContacto = document.getElementById("emailContacto");
    const mensajeContacto = document.getElementById("mensajeContacto");

    if (!nombreContacto.value.trim()) {
        mostrarToastError("Debe ingresar su nombre");
        return;
    }
    if (!emailContacto.value.trim()) {
        mostrarToastError("Debe ingresar su correo");
        return;
    }
    if (!mensajeContacto.value.trim()) {
        mostrarToastError("Debe escribir un mensaje");
        return;
    }

    toastEl.className = "toast align-items-center text-white bg-success border-0";
    messageBody.textContent = "✅ Éxito, se envió su mensaje";
    toast.show();

    setTimeout(() => {
        nombreContacto.value = "";
        emailContacto.value = "";
        mensajeContacto.value = "";
    }, 3000);
});



