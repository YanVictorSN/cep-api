let cepInput = document.getElementById("cep");
let btnCep = document.getElementById('btn-cep');
let result = document.getElementById('result');
let btnMap = document.getElementById('btn-map');

cepInput.addEventListener ("input", removeNaNInputs);
cepInput.addEventListener ("input", insertHifen);
cepInput.addEventListener ("input", enableButton);
cepInput.addEventListener ("keydown", deleteHifen);

btnCep.addEventListener("click", zipRequest);
btnMap.addEventListener('click', mapRequest);

document.getElementById("btn-cep").disabled = true;
document.getElementById('btn-map').hidden = true;
document.querySelector('iframe').hidden = true;

function removeNaNInputs(event) {
    cepInputValidation = event.target.value;
    
    if (isNaN(event.data)) {
        const deleteInputs =   cepInputValidation.substring(0,  cepInputValidation.length - 1);
        cepInput.value = deleteInputs;
    }
}

function insertHifen() {
   const maxLeght = cepInputValidation.length;

    if (maxLeght == 5) {
        cepInput.value = cepInput.value + "-"
    }
}

function deleteHifen(event) {
    cepBackspace = event.target.value;
if (event.key === "Backspace" && cepBackspace.length == 6) {
    cepInput.value = cepBackspace.slice(0,5);
}
}

function enableButton() {
    if (cepInput.value !== '' && cepInput.value.length == 9 ) {
        document.getElementById("btn-cep").disabled = false;
    } else {
        document.getElementById("btn-cep").disabled = true; 
    }
}

function zipRequest() {
    document.getElementById("btn-cep").disabled = true;
    document.body.style.cursor = 'wait'
    cepInputFormated = cepInput.value.replace("-","");
    fetch(`https://cep.awesomeapi.com.br/json/${cepInputFormated}`, {method: 'GET'})
    .then((response) => {
        if (response.ok) {
        document.querySelector('iframe').hidden = true;
        document.getElementById('btn-map').hidden = true; 
        return response.json()
        } 
        result.innerHTML = 'Por favor, insira um CEP válido!'
        document.querySelector('iframe').hidden = true;
        document.getElementById('btn-map').hidden = true;
        document.body.style.cursor = 'default';
    })
    .then((data) => {
        result.innerHTML = `Endereço: ${data.address} |
        Bairro: ${data.district} | Cidade: ${data.city} | Estado: ${data.state} | Latitude: ${data.lat} | Longitude: ${data.lng} `
        document.getElementById('btn-map').hidden = false;
        document.body.style.cursor = 'default';
    })
    //Catch Tratar erros
}

function mapRequest() {
    document.body.style.cursor = 'wait'
    cepInputFormated = cepInput.value.replace("-","");
    fetch(`https://cep.awesomeapi.com.br/json/${cepInputFormated}`, {method: 'GET'})
    .then((response) => {
        if (response.ok) {
            return response.json();
        } 
        result.innerHTML = 'Não foi possível encontra o Mapa, tente novamente.'
        document.body.style.cursor = 'default';
    })
    .then((data) => {
        document.querySelector('iframe').setAttribute('src',`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15925.662962965489!2d${data.lng}!3d${data.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1657243691243!5m2!1spt-BR!2sbr`);
        document.querySelector('iframe').hidden = false;
        document.getElementById('btn-map').hidden = true;
        document.body.style.cursor = 'default';
    })
}