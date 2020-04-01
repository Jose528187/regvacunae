$(document).ready(function() {

const contractSource = `
payable contract RegVacunae =

    record vacunae =
      { creatorAddress : address,
        nombre         : string,
        nombrevacuna   : string,
        fechavacuna    : string,
        dosisvacuna      : int }

    record state =
      { vacunaes      : map(int, vacunae),
        vacunaeLength : int }

    entrypoint init() =
      { vacunaes = {},
        vacunaeLength = 0 }

    entrypoint getVacunae(index : int) : vacunae =
      switch(Map.lookup(index, state.vacunaes))
        None    => abort("There was no vaccine with this index registered.")
        Some(x) => x

    stateful entrypoint registerVacunae(nombre' : string, nombrevacuna' : string, fechavacuna' : string, dosisvacuna' : int) =
      let vacunae = { creatorAddress = Call.caller, nombre = nombre',nombrevacuna = nombrevacuna', fechavacuna = fechavacuna', dosisvacuna = dosisvacuna'}
      let index = getVacunaeLength() + 1
      put(state{ vacunaes[index] = vacunae, vacunaeLength = index })
      Chain.spend(vacunae.creatorAddress, Call.value)
      
    entrypoint getVacunaeLength() : int =
      state.vacunaeLength
`;

 

//Address of the regvacunae smart contract on the testnet of the aeternity blockchain
const contractAddress = 'ct_EbJAXfAwPbzvVfNZ6dsUPYuvHt7K5k57Rnesp5vG173QdTNCV';


//Create variable for client so it can be used in different functions
var client = null;
//Create a new global array for the vacunae
var vacunaeArray = [];
//Create a new variable to store the length of the meme globally
var vacunaeLength = 0;

function renderVacunas() {
  //Order the vacunae array so that the meme with the most votes is on top
  vacunaeArray = vacunaeArray.sort(function(a,b){return b.votes-a.votes})
  //Get the template we created in a block scoped variable
  let template = $('#template').html();
  //Use mustache parse function to speeds up on future uses
  Mustache.parse(template);
  //Create variable with result of render func form template and data
  let rendered = Mustache.render(template, {vacunaeArray});
  //Use jquery to add the result of the rendering to our html
  $('#vacunaeBody').html(rendered);
}

//Create a asynchronous read call for our smart contract
async function callStatic(func, args) {
  //Create a new contract instance that we can interact with
  const contract = await client.getContractInstance(contractSource, {contractAddress});
  //Make a call to get data of smart contract func, with specefied arguments
  const calledGet = await contract.call(func, args, {callStatic: true}).catch(e => console.error(e));
  //Make another call to decode the data received in first call
  const decodedGet = await calledGet.decode().catch(e => console.error(e));

  return decodedGet;
}

//Create a asynchronous write call for our smart contract
async function contractCall(func, args, value) {
  const contract = await client.getContractInstance(contractSource, {contractAddress});
  //Make a call to write smart contract func, with aeon value input
  const calledSet = await contract.call(func, args, {amount: value}).catch(e => console.error(e));

  return calledSet;
}

//Execute main function
window.addEventListener('load', async () => {
    
  //Initialize the Aepp object through aepp-sdk.browser.js, the base app needs to be running.
  client = await Ae.Aepp();

  //First make a call to get to know how may vacunae have been created and need to be displayed
  //Assign the value of meme length to the global variable
  vacunaeLength = await callStatic('getVacunaeLength', []);

  //Loop over every meme to get all their relevant information
  for (let i = 1; i <= vacunaeLength; i++) {

    //Make the call to the blockchain to get all relevant information on the meme
    const vacunae = await callStatic('getVacunae', [i]);

    //Create meme object with  info from the call and push into the array with all vacubae
    vacunaeArray.push({
      creatorName: vacunae.nombre,
      nombrevacuna: vacunae.nombrevacuna,
      fechavacuna: vacunae.fechavacuna,
      dosisvacuna: vacunae.dosisvacuna,
      index: i,
    })
 

  }

  
  //Display updated vacunae
  renderVacunas();

  //Hide loader animation
  //$("#loader").hide();
});



//If someone clicks to register a meme, get the input and execute the registerCall
$('#regvacuna').click(async function(){
  //$("#loader").show();
  //Create two new let variables which get the values from the input fields
  swal({   
    title: "¿Esta seguro que desea registrar la vacuna",   
    text: "",   
    type: "success",   
    showCancelButton: true,   
    confirmButtonColor: "#00a65a",  
    confirmButtonText: "Si",   
    cancelButtonText: "No",   
    closeOnConfirm: true,   
    closeOnCancel: false }, 

    function(isConfirm){   
      if (isConfirm) {     
            


                const nombrepersona = ($('#nombrepersona').val()),
                nombrevacuna = ($('#nombrevacuna').val()),
                fechavacuna = ($('#fechavacuna').val()),
                dosisvacuna = ($('#dosisvacuna').val()) ;

  
            if (nombrepersona=='' || nombrevacuna==''){
            

             setTimeout(function(){swal("Registrando Vacuna", "Debe colocar todos los datos", "error");}, 1000);

             return false;
            
            }  else {

              //Make the contract call to register the meme with the newly passed values
                await contractCall('registerVacunae', [nombrepersona,nombrevacuna,fechavacuna, dosisvacuna], 0);

                //Add the new created memeobject to our vacunaeArray
                  vacunaeArray.push({
                    creatorName: nombrepersona,
                    nombre: nombrepersona,
                    nombrevacuna: nombrevacuna,
                    fechavacuna: fechavacuna,
                    dosisvacuna: dosisvacuna,
                    index: vacunaeArray.length+1,
                  })


            swal("Registrando Vacuna", "Datos guardados", "success");

            renderVacunas();

          }


      } else {     
        swal("Registro Vacunas", 
          "Se cancelo el proceso", 
        "error");   
      } 
    });
 
});


     function includeHTML() {
                  var z, i, elmnt, file, xhttp;
                  /* Loop through a collection of all HTML elements: */
                  z = document.getElementsByTagName("*");
                  for (i = 0; i < z.length; i++) {
                    elmnt = z[i];
                    /*search for elements with a certain atrribute:*/
                    file = elmnt.getAttribute("w3-include-html");
                    if (file) {
                      /* Make an HTTP request using the attribute value as the file name: */
                      xhttp = new XMLHttpRequest();
                      xhttp.onreadystatechange = function() {
                        if (this.readyState == 4) {
                          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
                          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
                          /* Remove the attribute, and call this function once more: */
                          elmnt.removeAttribute("w3-include-html");
                          includeHTML();
                        }
                      }
                      xhttp.open("GET", file, true);
                      xhttp.send();
                      /* Exit the function: */
                      return;
                    }
                  }
                }

            includeHTML();


var mem = $('.input-group.date').datepicker({
                todayBtn: "linked",
                keyboardNavigation: false,
                forceParse: false,
                calendarWeeks: true,
                autoclose: true
            });


});