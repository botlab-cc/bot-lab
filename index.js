// Obtener el modal
var modal = document.getElementById('myModal');

// Obtener el botón que abre el modal
var btn = document.getElementById('toggleButton');

// Obtener el elemento <span> que cierra el modal
var span = document.getElementsByClassName('close')[0];

// Cuando el usuario hace clic en el botón, abre el modal
btn.onclick = function() {
    modal.style.display = "block";
}

// Cuando el usuario hace clic en <span> (x), cierra el modal
span.onclick = function() {
    modal.style.display = "none";
}

// Cuando el usuario hace clic fuera del modal, también lo cierra
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Manejo del envío del formulario
document.getElementById("callbackForm").onsubmit = function(event) {
    event.preventDefault(); // Evita el envío del formulario
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const surname = document.getElementById("surname").value;
    const email = document.getElementById("email").value;

    createContact(name, surname, phone, email); // Llama a la función para crear el contacto
};

// Función para crear un contacto en Genesys Cloud
async function createContact(name, surname, phone, email) {
    const accessToken = getAccessTokenFromUrl(); // Obtiene el token de la URL

    if (!accessToken) {
        alert("No se pudo obtener el token de acceso.");
        return;
    }

    const apiUrl = "https://api.mypurecloud.ie/api/v2/outbound/contactlists/74832173-7c59-4e01-8844-b4ab999fe103/contacts"; // URL de tu lista de contactos en Genesys

    const contactData = [
        {
            data: {
                NOMBRE: name,
                APELLIDO1: surname,  // Enviado vacío
                TELEFONO: phone,
                MAIL: email // Enviado vacío
            },
            callable: true
        }
    ];

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contactData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            alert(`Error al crear el contacto: ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        //alert("Contacto creado exitosamente: " + JSON.stringify(data));
    } catch (error) {
        console.error("Error en createContact:", error);
        alert("Ocurrió un error al crear el contacto.");
    }
}

// Función para obtener el token de acceso desde la URL
function getAccessTokenFromUrl() {
    const params = new URLSearchParams(window.location.hash.substring(1));
    return params.get('access_token');
}
