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

/*data.forEach((user: any) => {
          let usuario: Usuario = new Usuario(user.user_id, user.name);
          this.usuarios.push(usuario);
          this.usuariosFiltrados.push(usuario);
        });*/

//let aux = [{"uid":1,"role":0,"password":"","name":"PEDRO DINO","cardno":0,"user_id":"9420724"},{"uid":12,"role":0,"password":"111","name":"testing","cardno":0,"user_id":"9"},{"uid":4,"role":0,"password":"0895","name":"","cardno":0,"user_id":"5297992"},{"uid":7,"role":0,"password":"","name":"RUTH  PEREZ CUBA","cardno":0,"user_id":"7948392"},{"uid":8,"role":14,"password":"","name":"","cardno":0,"user_id":"7912911"},{"uid":10,"role":0,"password":"","name":"CARMELO VALENCIA CARBALL","cardno":0,"user_id":"5317614"},{"uid":13,"role":0,"password":"","name":"LOURDES MAITA VELIZ ","cardno":0,"user_id":"14850113"},{"uid":18,"role":0,"password":"","name":"NELIA  LOPEZ AREVALO","cardno":0,"user_id":"13658745"},{"uid":19,"role":0,"password":"","name":"ANDREA  SERRUDO VILLCA","cardno":0,"user_id":"12556096"},{"uid":20,"role":14,"password":"","name":"LUIS","cardno":0,"user_id":"9413936"},{"uid":21,"role":0,"password":"","name":"DENIS FLORES  ARGOTE","cardno":0,"user_id":"6493074"},{"uid":22,"role":14,"password":"","name":"DENILSON","cardno":0,"user_id":"1"}]

/* try {
            const jsonString = fs.readFileSync("./src/registros.json");
            await JSON.parse(jsonString.toString()).forEach((value: any) => {
                nuevaMarcacion(terminal, value)
            });
        } catch (err) {
            console.log(err);
            return;
        }*/

/* let ip = req.params.ip;
  let puerto = req.params.puerto;
  const getMarcacionesPy = async () => {
      try {
          const pyFile = 'src/scriptpy/marcaciones.py';
          const args = [ip, puerto];
          args.unshift(pyFile);
          const pyprog = await spawn(envPython, args);
          res.send(pyprog.toString())
      } catch (e: any) {
          console.log(e.stderr.toString())
      }
  }
  getMarcacionesPy()*/
