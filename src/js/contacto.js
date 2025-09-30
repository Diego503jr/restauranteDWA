const toastEl = document.getElementById("messageContent");
const messageBody = document.getElementById("messageBody");
const toast = new bootstrap.Toast(toastEl);


let notis = JSON.parse(localStorage.getItem('notis')) || [];

let mensajes = JSON.parse(localStorage.getItem('mensajes')) || [];

notis = notis.map(noti => ({
    ...noti,
    fechaReserva: new Date(noti.fechaReserva),
    horaReserva: new Date(noti.horaReserva)
}));

document.addEventListener('DOMContentLoaded', function () {

    /*===============================*/
    /*           RESERVA             */
    /*===============================*/

    let contador = Number(localStorage.getItem('contador')) || 0;

    //PICKERS (FECHA Y HORA)
    const fechaPicker = flatpickr("#fechaReserva", {
        dateFormat: "d-m-y",
        minDate: "today",
        wrap: false
    });

    const horaPicker = flatpickr("#horaReserva", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        altInput: true,
        time_24hr: true,
        minuteIncrement: 5,
        minTime: "11:00",
        maxTime: "22:00",
        allowInput: false
    });


    //Variables reserva
    let nombreReserva;
    let fechaReserva;
    let horaReserva;
    let personasReserva;

    document.getElementById("reservaForm").addEventListener("submit", function (e) {
        e.preventDefault();


        nombreReserva = document.getElementById("nombreReserva");
        fechaReserva = fechaPicker.selectedDates[0];
        horaReserva = horaPicker.selectedDates[0];
        personasReserva = document.getElementById("personasReserva");

        const fechaHoraVal = validarFechaHora();

        if (nombreReserva.value.trim() === '') {
            mostrarToastError('Ingrese un nombre válido');
            return;
        }
        if (!fechaHoraVal.valido) {
            mostrarToastError(fechaHoraVal.mensaje);
            return;
        }

        notis.push({ nombreReserva: nombreReserva.value, fechaReserva, horaReserva, personasReserva: personasReserva.value });
        contador = contador + 1;
        localStorage.setItem('contador', contador);
        localStorage.setItem('notis', JSON.stringify(notis));
        updateNumber();

        toastEl.className = "toast align-items-center text-white bg-success border-0";
        messageBody.textContent = "✅ Éxito, se registró su reserva";
        toast.show();

        setTimeout(() => {
            nombreReserva.value = "";
            fechaPicker.clear();
            horaPicker.clear();
            personasReserva.value = "";
        }, 3000);
    });

    function mostrarToastError(mensaje) {
        toastEl.className = "toast align-items-center text-white bg-danger border-0";
        messageBody.textContent = "❌ " + mensaje;
        toast.show();
    }

    //Validaciones
    function validarFechaHora() {
        if (!fechaReserva || !horaReserva) {
            return { valido: false, mensaje: "Debe seleccionar fecha y hora" };
        }

        const fechaHoraReserva = new Date(
            fechaReserva.getFullYear(),
            fechaReserva.getMonth(),
            fechaReserva.getDate(),
            horaReserva.getHours(),
            horaReserva.getMinutes()
        );

        if (fechaHoraReserva <= new Date()) {
            return { valido: false, mensaje: "La fecha y hora deben ser futuras" };
        }

        return { valido: true, mensaje: "" };
    }

    /*===============================*/
    /* MODAL DE MENSAJES DE RESERVAS */
    /*===============================*/

    //ACTUALIZAR MODAL
    function updateModal() {
        const reservasItems = document.getElementById('reservasItems');

        reservasItems.innerHTML = '';

        if (notis.length === 0) {
            reservasItems.innerHTML = `<p>No hay reservas.</p>`;
            return;
        }

        const table = document.createElement('table');
        table.classList.add('table', 'table-striped');

        table.innerHTML = `
        <thead>
            <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Personas</th>
                <th>Estado</th>
                <th>Eliminar</th>
            </tr>
        </thead>
        <tbody></tbody>`;

        const tbody = table.querySelector('tbody');

        notis.forEach((noti, index) => {
            const row = document.createElement('tr');
            const fechaReservaFinDia = new Date(
                noti.fechaReserva.getFullYear(),
                noti.fechaReserva.getMonth(),
                noti.fechaReserva.getDate(),
                noti.horaReserva.getHours(),
                noti.horaReserva.getMinutes()
            );

            //const fechaPrueba = new Date(2025, 8, 28, 23, 59, 59); 
            //const estadoIcon = fechaReservaFinDia < fechaPrueba

            // Comparar con fecha actual
            const estadoIcon = fechaReservaFinDia < new Date()
                ? '<i class="bi bi-check-circle-fill text-success" id="finalizado"></i>'
                : '<i class="bi bi-x-square-fill text-danger" id="programado"></i>';

            row.innerHTML = `
            <td>${index + 1}</td>
            <td>${noti.nombreReserva}</td>
            <td>${noti.fechaReserva.toLocaleDateString()}</td>
            <td>${noti.horaReserva.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
            <td>${noti.personasReserva}</td>
            <td>${estadoIcon}</td>
            <td><i class="bi bi-trash trash-icon remove-item" data-index="${index}" style="cursor:pointer"></i></td>`;
            tbody.appendChild(row);
        });

        reservasItems.appendChild(table);

        // Evento para eliminar reservas
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function () {
                const index = this.dataset.index;
                notis.splice(index, 1);
                localStorage.setItem('notis', JSON.stringify(notis));
                updateModal();
            });
        });
    }

    //ACTUALIZAR NÚMERO DE NOTIFICACIONES
    function updateNumber() {
        const numberContent = document.getElementById('numberContent');
        numberContent.textContent = contador;
        numberContent.style.display = contador > 0 ? 'block' : 'none';
    }

    document.getElementById('verReservas').addEventListener('click', function () {
        contador = 0;
        localStorage.setItem('contador', contador);
        updateModal();
        updateNumber();
    });

    //ACTUALIZAR NOTIFICACIONES CUANDO SE REINICIA
    updateNumber();

    const reservasModal = document.getElementById('verReservasModal');
    reservasModal.addEventListener('show.bs.modal', function () {
        updateModal();

        const numberContent = document.getElementById('numberContent');
        numberContent.textContent = 0;
        numberContent.style.display = 'none';
    });



    /*===============================*/
    /*           CONTACTO            */
    /*===============================*/

    let contadorMensajes = Number(localStorage.getItem('contadorMensajes')) || 0;

    //Variables contacto
    let nombreContacto;
    let emailContacto;
    let mensajeContacto;

    document.getElementById("contactForm").addEventListener("submit", function (e) {
        e.preventDefault();

        nombreContacto = document.getElementById("nombreContacto");
        emailContacto = document.getElementById("emailContacto");
        mensajeContacto = document.getElementById("mensajeContacto");

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

        mensajes.push({ nombreContacto: nombreContacto.value, emailContacto: emailContacto.value, mensajeContacto: mensajeContacto.value });
        contadorMensajes = contadorMensajes + 1;
        localStorage.setItem('contadorMensajes', contadorMensajes);
        localStorage.setItem('mensajes', JSON.stringify(mensajes));
        updateNumbermessages();

        toastEl.className = "toast align-items-center text-white bg-success border-0";
        messageBody.textContent = "✅ Éxito, se registró su mensaje";
        toast.show();

        setTimeout(() => {
            nombreContacto.value = "";
            emailContacto.value = "";
            mensajeContacto.value = "";
        }, 3000);
    });

    /*===============================*/
    /* MODAL DE MENSAJES DE CONTACTO */
    /*===============================*/

    //ACTUALIZAR MODAL
    function updateModalMessage() {
        const mensajesItems = document.getElementById('mensajesItems');

        mensajesItems.innerHTML = '';

        if (mensajes.length === 0) {
            mensajesItems.innerHTML = `<p>No hay mensajes.</p>`;
            return;
        }

        const tableMesagge = document.createElement('table');
        tableMesagge.classList.add('table', 'table-striped');

        tableMesagge.innerHTML = `
        <thead>
            <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Mensaje</th>
                <th>Responder</th>
                <th>Eliminar</th>
            </tr>
        </thead>
        <tbody></tbody>`;

        const tbodyMessage = tableMesagge.querySelector('tbody');

        mensajes.forEach((mensaje, index) => {
            const rowMesagge = document.createElement('tr');
            rowMesagge.innerHTML = `
            <td class="text-center align-middle">${index + 1}</td>
            <td class="text-center align-middle">${mensaje.nombreContacto}</td>
            <td class="text-center align-middle">${mensaje.emailContacto}</td>
            <td>${mensaje.mensajeContacto}</td>
            <td class="text-center align-middle"><a href="mailto:${mensaje.emailContacto}"><i class="bi bi-reply"></i></a></td>
            <td class="text-center align-middle"><i class="bi bi-trash trash-icon remove-message" data-index="${index}" style="cursor:pointer"></i></td>`;


            tbodyMessage.appendChild(rowMesagge);
        });

        mensajesItems.appendChild(tableMesagge);

        // Evento para eliminar mensajes
        document.querySelectorAll('.remove-message').forEach(button => {
            button.addEventListener('click', function () {
                const index = this.dataset.index;
                mensajes.splice(index, 1);
                localStorage.setItem('mensajes', JSON.stringify(mensajes));
                updateModalMessage();
            });
        });

    }

    //ACTUALIZAR NÚMERO DE NOTIFICACIONES
    function updateNumbermessages() {
        const numberContentMessage = document.getElementById('numberContentMessage');
        numberContentMessage.textContent = contadorMensajes;
        numberContentMessage.style.display = contadorMensajes > 0 ? 'block' : 'none';
    }

    document.getElementById('verMensajes').addEventListener('click', function () {
        contadorMensajes = 0;
        localStorage.setItem('contadorMensajes', contadorMensajes);
        updateModalMessage();
        updateNumbermessages();
    });

    //ACTUALIZAR NOTIFICACIONES CUANDO SE REINICIA
    updateNumbermessages();

    const mensajesModal = document.getElementById('verMensajesModal');
    mensajesModal.addEventListener('show.bs.modal', function () {
        updateModalMessage();

        const numberContent = document.getElementById('numberContent');
        numberContent.textContent = 0;
        numberContent.style.display = 'none';
    });


});


//Cómo llegar - API navigator.geolocation
document.addEventListener("DOMContentLoaded", () => {
    const btnRuta = document.getElementById("btnRuta");

    if (btnRuta) {
        btnRuta.addEventListener("click", () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;

                        //Prueba Ubicación actual: Metrocentro SS
                        // const lat = 13.7063597;
                        // const lng = -89.2130952;

                        // Destino Multiplaza 
                        const destinoLat = 13.6789008;
                        const destinoLon = -89.2496607;

                        // Abrir Google Maps con la ruta
                        const url = `https://www.google.com/maps/dir/${lat},${lng}/${destinoLat},${destinoLon}`;
                        window.open(url, "_blank");
                    },
                    (error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "No se pudo obtener tu ubicación",
                            confirmButtonText: "Aceptar"
                        });
                    }
                );
            } else {
                Swal.fire({
                    icon: "warning",
                    title: "Geolocalización no soportada",
                    text: "Tu navegador no soporta geolocalización.",
                    confirmButtonText: "Aceptar"
                });
            }
        });
    }
});

//CHATBOT
document.addEventListener("DOMContentLoaded", () => {
    const chatbotBtn = document.getElementById("chatbotBtn");
    const chatbotWindow = document.getElementById("chatbotWindow");
    const closeChatbot = document.getElementById("closeChatbot");
    const chatbotMessages = document.getElementById("chatbotMessages");
    const chatbotInput = document.getElementById("chatbotInput");
    const sendMessage = document.getElementById("sendMessage");

    const respuestas = {
        "hola": "¡Hola! Soy DeliBot. ¿Cómo puedo ayudarte?.",
        "horario": "Nuestro horario es de lunes a domingo, de 11:00 AM a 10:00 PM.",
        "dirección": "Estamos en el segundo nivel de Las Terrazas, Multiplaza. Antiguo Cuscatlán , El Salvador.",
        "direccion": "Estamos en el segundo nivel de Las Terrazas, Multiplaza. Antiguo Cuscatlán , El Salvador.",
        "ubicación": "Estamos en el segundo nivel de Las Terrazas, Multiplaza. Antiguo Cuscatlán , El Salvador.",
        "ubicacion": "Estamos en el segundo nivel de Las Terrazas, Multiplaza. Antiguo Cuscatlán , El Salvador.",
        "promoción": "Tenemos 2x1 en bebidas todos los viernes de 6:00 a 8:00 PM.",
        "promocion": "Tenemos 2x1 en bebidas todos los viernes de 6:00 a 8:00 PM.",
        "reserva": "Puedes hacer una reservación en el formulario de reserva o llamando al +503 2252-3474.",
        "gracias": "¡Con gusto! Ten un excelente día"
    };

    // Mostrar / ocultar ventana del chatbot
    chatbotBtn.addEventListener("click", () => {
        chatbotWindow.classList.toggle("d-none");
    });

    closeChatbot.addEventListener("click", () => {
        chatbotWindow.classList.add("d-none");
    });

    // Enviar mensaje
    function enviarMensaje() {
        const texto = chatbotInput.value.trim();
        if (texto === "") return;

        // Mostrar mensaje del usuario
        chatbotMessages.innerHTML += `
      <div class="text-end mb-2">
        <span class="badge bg-primary user-message">${texto}</span>
      </div>`;

        chatbotInput.value = "";

        // Respuesta del bot
        const lowerText = texto.toLowerCase();
        let respuesta = "Lo siento, no entendí tu pregunta. Intenta con: horario, dirección, promoción, reservar.";

        for (let clave in respuestas) {
            if (lowerText.includes(clave)) {
                respuesta = respuestas[clave];
                break;
            }
        }

        setTimeout(() => {
            chatbotMessages.innerHTML += `
        <div class="text-start mb-2">
          <span class="badge bg-secondary bot-message">${respuesta}</span>
        </div>`;
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 500);
    }

    sendMessage.addEventListener("click", enviarMensaje);
    chatbotInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") enviarMensaje();
    });
});





