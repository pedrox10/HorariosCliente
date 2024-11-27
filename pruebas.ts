/*this.terminalService.getMarcaciones(this.ip, this.puerto)
  .pipe(
    switchMap(sourceValue => {
      console.log(sourceValue);
      return this.terminalService.getUsuarios(this.ip, this.puerto)}
    )
  )
  .subscribe(
    (data: any) => {
      console.log(data)
      setTimeout(() => {
        document.getElementById("btn_sincronizar")?.classList.remove("is-loading")
      }, 1000);

    },
    (error: any) => {
      console.error('An error occurred:', error);
      document.getElementById("btn_sincronizar")?.classList.remove("is-loading")
    }
  );*/
