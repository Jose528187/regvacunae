
$(document).ready(function() {
var vacunaeArray = [
    {"creatorname": "Boris Guevara","nombrevacuna": "AntiPolio","fechavacuna": "20-01-2019","dosisvacuna":1, "index":1 },
    {"creatorname": "Boris Guevara","nombrevacuna": "Hepatitis A","fechavacuna": "20-01-2019","dosisvacuna":1, "index":1 },
    {"creatorname": "Boris Guevara","nombrevacuna": "Varicela","fechavacuna": "20-01-2019","dosisvacuna":1, "index":1 },
  ];
//https://pbs.twimg.com/media/Dsdt6gOXcAAksLu.jpg

console.log(vacunaeArray);


function renderVacunas() {
  console.log('paso 1');
  vacunaeArray = vacunaeArray.sort(function(a,b){return b.creatorname})
  var template = $('#template').html();
  Mustache.parse(template);
  console.log('paso 2');
  console.log(vacunaeArray);
  var rendered = Mustache.render(template, {vacunaeArray});


  console.log('paso 3');
  console.log(rendered);

  $('#vacunaeBody').html(rendered);
}

window.addEventListener('load', async () => {
  console.log('paso 0');
  renderVacunas();
});






$('#regvacuna').click(async function(){



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
            var nombrepersona = ($('#nombrepersona').val()),
                nombrevacuna = ($('#nombrevacuna').val()),
                fechavacuna = ($('#fechavacuna').val()),
                dosisvacuna = ($('#dosisvacuna').val()) ;



            if (nombrepersona=='' || nombrevacuna==''){



             

             setTimeout(function(){swal("Registrando Vacuna", "Debe colocar todos los datos", "error");}, 1000);

             return false;
            
            }  else {




            vacunaeArray.push({
              creatorname: nombrepersona,
              nombrevacuna: nombrevacuna,
              fechavacuna: fechavacuna,
              dosisvacuna: dosisvacuna,
              index: vacunaeArray.length+1
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