export class Terminal {
    _id?:number;
    nombre: string;
    ip: string;
    puerto: number;

    constructor(nombre: string, ip:string, puerto: number) {
        this.nombre = nombre;
        this.ip = ip;
        this.puerto = puerto;
    }
}
