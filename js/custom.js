$(function () {

  // MENU
  $('.navbar-collapse a').on('click', function () {
    $(".navbar-collapse").collapse('hide');
  });

  // AOS ANIMATION
  AOS.init({
    disable: 'mobile',
    duration: 800,
    anchorPlacement: 'center-bottom'
  });


});

$(document).ready(function () {
  $(".boton-cerrar").on('click', function () {
    $('#informacion').toggle('slide', { direction: 'right' }, 1000);
  });

  $('#maincarousel').carousel({
    interval: false
  });
  $('.carousel').carousel('pause')

  $('#btnmapa').on('click', function () {
    $('#maincarousel').carousel(0);
  });
  $('#btnhorarios').on('click', function () {
    $('#maincarousel').carousel(1);
  });

  $.ajax({
    url: 'http://localhost:9000/api/horarios',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      console.log(data);
    }
  });

  const $buttons = $('button.btnPiso');

  // Agrega un evento de clic a cada botón
  $buttons.on('click', function () {
    // Cambia el color de fondo del botón presionado al valor hexadecimal especificado
    $(this).addClass('naranja');

    // Elimina la clase 'naranja' de los demás botones
    $buttons.not(this).removeClass('naranja');
  });

  $('#changeFloorButton1').on('click', function () {
    obtenerSalones(1)
    $('#canvas-container').css('transform', 'translateY(0%)');
  });
  $('#changeFloorButton2').on('click', function () {
    obtenerSalones(2)
    $('#canvas-container').css('transform', 'translateY(0%)');
  });
  $('#changeFloorButton3').on('click', function () {
    obtenerSalones(3)
    $('#canvas-container').css('transform', 'translateY(0%)');
  });
  $('#changeFloorButton4').on('click', function () {
    if ($('#listaAulas').is(':visible')) {
      $('#listaAulas').hide('slide', { direction: 'left' }, 1000)
    }
    $('#canvas-container').css('transform', 'translateY(10%)');
  });

});

function obtenerSalones(piso) {
  if ($('#listaAulas').is(':visible')) {
    $('#listaAulas').hide('slide', { direction: 'left' }, 1000)
  }

  $.ajax({
    url: 'http://localhost:9000/api/salones',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      let listaAulas = data.filter(salon => salon.piso === piso);
      //Si el valor de aulta.tipo == "aula magna" que imprima aulapabellon y aula.tipo

      let listaAulasHTML = listaAulas.map(aula => aula.numero === undefined ? `<a class="list-group-item bg-transparent text-white">${aula.pabellon} - ${aula.tipo} </a>` : `<a class="list-group-item bg-transparent text-white">${aula.pabellon} - ${aula.tipo} ${aula.numero}</a>`);
      $('#lista').html(listaAulasHTML);

      let intervalo;

      const lista = $('#lista');

      if (lista[0].scrollHeight < lista[0].clientHeight) {
        $('#arriba').hide();
        $('#abajo').hide();
      }

      $('#arriba').on('mousedown', function () {
        intervalo = setInterval(function () {
          lista.scrollTop(lista.scrollTop() - 10);
        }, 25);
      });

      $('#arriba').on('mouseup mouseleave', function () {
        clearInterval(intervalo);
      });

      $('#abajo').on('mousedown', function () {
        intervalo = setInterval(function () {
          lista.scrollTop(lista.scrollTop() + 10);
        }, 25);
      });

      $('#abajo').on('mouseup mouseleave', function () {
        clearInterval(intervalo);
      });

      $('#listaAulas').toggle('slide', { direction: 'left' }, 1000);
    }
  });
}


