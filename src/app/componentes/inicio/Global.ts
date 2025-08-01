import {env} from "../../../environments/environments";
import {toast, ToastType} from "bulma-toast";
import moment from "moment";

export function color(nombre: string) {
  let res = ""
  for (let item of env.colores) {
    if(item.color === nombre) {
      res = item.valor;
      break;
    }
  }
  return res;
}

export function mensaje(mensaje: string, tipo: ToastType) {
  let icon = "";
  switch (tipo) {
    case "is-success":
      icon = '<i style="color: white; font-size: 1.5em; padding-right: 10px" class="fas fa-check"></i>'
      break
    case "is-danger":
      icon = '<i style="color: white; font-size: 1.5em; padding-right: 10px" class="fas fa-times-circle"></i>'
      break
    case "is-warning":
      icon = '<i style="color: white; font-size: 1.5em; padding-right: 10px" class="fas fa-exclamation-triangle"></i>'
      break
    case "is-info":
      icon = '<i style="color: white; font-size: 1.5em; padding-right: 10px" class="fas fa-info"></i>'
      break
  }
  toast({
    message: '<span class="icon" style="min-width: 150px; width: auto; max-width: 250px;">' + icon + mensaje + '</span>',
    type: tipo,
    position: "bottom-center",
    pauseOnHover: true,
    duration: 3500,
    animate: {in: 'backInUp', out: 'backOutDown'},
    extraClasses: "bordes-redondeados"
  })
}

export function notificacion(mensaje: string) {
  toast({
    message: '<span class="icon" style="min-width: 215px; width: auto; max-width: 300px; height: 70px;"><i style="color: white; font-size: 1.5em; padding-right: 30px" class="fas fa-info"></i><p style="text-align: left;">' + mensaje + '</p></span>',
    type: "is-info",
    position: "bottom-center",
    duration: 8000,
    dismissible: true,
    closeOnClick: false,
    pauseOnHover: true,
    animate: {in: 'backInUp', out: 'backOutDown'},
    extraClasses: "bordes-redondeados"
  })
}

export function format(fecha: Date) {
  return moment(fecha).format("DD/MM/YYYY")
}

export function formatTime(fecha: Date) {
  return moment(fecha).format("DD/MM/YYYY HH:mm")
}

export function formatDateTime(fecha: Date) {
  return moment(fecha).format("DD/MM/YYYY HH:mm:ss")
}
